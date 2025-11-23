<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json($brands);
    }

    public function show($slug)
    {
        $brand = Brand::where('slug', $slug)
            ->where('is_active', true)
            ->with(['products' => function($query) {
                $query->where('is_active', true)->latest();
            }])
            ->firstOrFail();

        return response()->json($brand);
    }
}
