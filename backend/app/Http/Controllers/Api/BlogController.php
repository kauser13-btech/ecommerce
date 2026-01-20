<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    // Public Endpoints

    public function indexPublic(Request $request)
    {
        $query = Blog::where('status', 'published')->latest();

        if ($request->has('tag')) {
            // JSON Search (MySQL 5.7+ / MariaDB)
            // 'tags' is a JSON column ["tag1", "tag2"]
            // whereJsonContains is arguably cleaner
            $query->whereJsonContains('tags', $request->tag);
        }

        return response()->json($query->paginate(10));
    }

    public function featured()
    {
        $blogs = Blog::where('status', 'published')
            ->where('is_pinned', true)
            ->latest()
            ->take(2)
            ->get();
        
        return response()->json($blogs);
    }

    public function showPublic($slug)
    {
        $blog = Blog::where('slug', $slug)
            ->where('status', 'published')
            ->with('author:id,name,avatar')
            ->firstOrFail();

        return response()->json($blog);
    }

    // Admin Endpoints

    public function indexAdmin()
    {
        return response()->json(Blog::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:blogs,slug', // Auto-gen if null
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'cover_image' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'is_pinned' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
            // Verify uniqueness again
            if (Blog::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] .= '-' . time();
            }
        }

        // Pinning Logic
        if (!empty($validated['is_pinned']) && $validated['is_pinned']) {
             $this->handlePinningConstraint();
        }

        $validated['author_id'] = auth()->id();

        $blog = Blog::create($validated);

        return response()->json($blog, 201);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|unique:blogs,slug,' . $id,
            'content' => 'sometimes|required|string',
            'excerpt' => 'nullable|string|max:500',
            'cover_image' => 'nullable|string',
            'status' => 'sometimes|required|in:draft,published',
            'is_pinned' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);

        if (isset($validated['slug']) && empty($validated['slug'])) {
             $validated['slug'] = Str::slug($validated['title'] ?? $blog->title);
        }

        // Pinning Logic
        if (isset($validated['is_pinned']) && $validated['is_pinned'] && !$blog->is_pinned) {
             $this->handlePinningConstraint();
        }

        $blog->update($validated);

        return response()->json($blog);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();
        return response()->json(['message' => 'Blog deleted successfully']);
    }

    private function handlePinningConstraint()
    {
        // Max 2 pinned blogs allowed.
        // Rule: If we are adding one, and there are already 2 (or more),
        // unpin the OLDEST one (created_at asc).
        
        $pinnedCount = Blog::where('is_pinned', true)->count();

        if ($pinnedCount >= 2) {
            $oldestPinned = Blog::where('is_pinned', true)
                ->orderBy('created_at', 'asc')
                ->first();
            
            if ($oldestPinned) {
                $oldestPinned->update(['is_pinned' => false]);
            }
        }
    }
}
