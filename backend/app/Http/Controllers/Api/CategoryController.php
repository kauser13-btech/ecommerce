<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::with('parent');

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('show_on_home')) {
            $query->where('show_on_home', $request->boolean('show_on_home'));
        }

        $categories = $query->orderBy('sort_order', 'asc')->get();

        return response()->json($categories);
    }

    public function show($idOrSlug)
    {
        $category = Category::with(['products' => function($query) {
                // If it's a public request, maybe we filter? 
                // For simplified admin/public usage, we might return all products or filter based on a query param?
                // For now keeping it simple.
                // $query->where('is_active', true)->latest();
            }]);

        if (is_numeric($idOrSlug)) {
            $category = $category->find($idOrSlug);
        } else {
            $category = $category->where('slug', $idOrSlug)->first();
        }

        if (!$category) {
            abort(404, 'Category not found');
        }

        return response()->json($category);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'image' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:categories,slug,' . $id,
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'image' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $category->update($data);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Promote subcategories to top-level
        Category::where('parent_id', $id)->update(['parent_id' => null]);
        
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:categories,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->orders as $order) {
            Category::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json(['message' => 'Categories reordered successfully']);
    }
}
