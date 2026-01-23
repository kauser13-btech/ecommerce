<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(Request $request)
    {
        $tags = Tag::all();
        return response()->json($tags);
    }

    public function show($idOrSlug)
    {
        if (is_numeric($idOrSlug)) {
            $tag = Tag::findOrFail($idOrSlug);
        } else {
            $tag = Tag::where('slug', $idOrSlug)->firstOrFail();
        }

        return response()->json($tag);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:tags,slug',
        ]);

        $tag = Tag::create($data);

        return response()->json($tag, 201);
    }

    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:tags,slug,' . $id,
        ]);

        $tag->update($data);

        return response()->json($tag);
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return response()->json(['message' => 'Tag deleted successfully']);
    }
}
