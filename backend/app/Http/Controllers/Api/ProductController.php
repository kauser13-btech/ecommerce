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
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->latest()
            ->limit(10)
            ->get();

        return response()->json($products);
    }
}
