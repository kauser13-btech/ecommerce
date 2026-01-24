<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::where('is_active', true);

        if ($request->has('show_on_home')) {
            $query->where('show_on_home', $request->boolean('show_on_home'));
        }

        if ($request->has('category')) {
            $categorySlug = $request->category;
            $category = \App\Models\Category::where('slug', $categorySlug)->first();

            if ($category) {
                // Get ID of category and all its children to match ProductController filtering logic
                // Assuming 1-level nesting or using same logic as ProductController
                $ids = collect([$category->id])->merge($category->children()->pluck('id'));
                
                $query->whereHas('products', function($q) use ($ids) {
                    $q->whereIn('category_id', $ids)
                      ->where('is_active', true);
                });
            } else {
               // Logic choice: if category invalid, return empty or all? 
               // Consistent with ProductController: return empty/nothing found context
               $query->where('id', -1); 
            }
        }

        $brands = $query->orderBy('sort_order', 'asc')->orderBy('name', 'asc')->get();

        return response()->json($brands);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:brands',
            'logo' => 'nullable', // Allow file or string
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('brands', 'public');
            $validated['logo'] = asset('storage/' . $path);
        }

        $brand = Brand::create($validated);

        return response()->json($brand, 201);
    }

    public function show($slug)
    {
        // If numeric, assume ID (for Admin)
        if (is_numeric($slug)) {
            $brand = Brand::find($slug);
             if (!$brand) {
                return response()->json(['message' => 'Brand not found'], 404);
            }
            return response()->json($brand);
        }

        $brand = Brand::where('slug', $slug)
            ->where('is_active', true)
            ->with(['products' => function($query) {
                $query->where('is_active', true)->latest();
            }])
            ->firstOrFail();

        return response()->json($brand);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', \Illuminate\Validation\Rule::unique('brands')->ignore($brand->id)],
            'logo' => 'nullable', // Allow string or file
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if (isset($validated['name']) && empty($validated['slug']) && $brand->slug === \Illuminate\Support\Str::slug($brand->name)) {
             // ...
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('brands', 'public');
            $validated['logo'] = asset('storage/' . $path);
        }

        $brand->update($validated);

        return response()->json($brand);
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        // Optional: Check if products exist?
        $brand->delete();

        return response()->json(['message' => 'Brand deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:brands,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->orders as $order) {
            Brand::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json(['message' => 'Brands reordered successfully']);
    }
}
