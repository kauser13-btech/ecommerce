<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand'])->where('is_active', true);

        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('brand')) {
            $query->whereHas('brand', function($q) use ($request) {
                $q->where('slug', $request->brand);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('filter') && $request->filter === 'new') {
            $query->where('is_new', true);
        }

        if ($request->has('filter') && $request->filter === 'featured') {
            $query->where('is_featured', true);
        }

        $products = $query->latest()->paginate(20);

        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'brand'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($product);
    }

    public function featured()
    {
        $products = Product::with(['category', 'brand'])
            ->where('is_featured', true)
            ->where('is_active', true)
            ->latest()
            ->limit(8)
            ->get();

        return response()->json($products);
    }

    public function newArrivals()
    {
        $products = Product::with(['category', 'brand'])
            ->where('is_new', true)
            ->where('is_active', true)
            ->latest()
            ->limit(8)
            ->get();

        return response()->json($products);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');

        $products = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhereHas('brand', function($b) use ($query) {
                      $b->where('name', 'like', "%{$query}%");
                  });
            })
            ->latest()
            ->limit(10)
            ->get();

        // Suggest products if not found
        if ($products->isEmpty()) {
            $suggestions = Product::with(['category', 'brand'])
                ->where('is_active', true)
                ->inRandomOrder()
                ->limit(5)
                ->get();
            
            return response()->json([
                'data' => [],
                'suggestions' => $suggestions,
                'message' => 'No products found. You might like these instead.'
            ]);
        }

        return response()->json(['data' => $products]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric',
            'original_price' => 'nullable|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'image' => 'nullable|string',
            'images' => 'nullable|array',
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'specifications' => 'nullable|json',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'slug' => 'string|unique:products,slug,' . $id,
            'sku' => 'string|unique:products,sku,' . $id,
            'price' => 'numeric',
            'original_price' => 'nullable|numeric',
            'stock' => 'integer',
            'category_id' => 'exists:categories,id',
            'brand_id' => 'exists:brands,id',
            'image' => 'nullable|string',
            'images' => 'nullable|array',
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'specifications' => 'nullable|json',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function adminShow($id)
    {
        $product = Product::with(['category', 'brand'])
            ->findOrFail($id);

        return response()->json($product);
    }
}
