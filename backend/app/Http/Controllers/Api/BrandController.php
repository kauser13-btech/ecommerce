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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:brands',
            'logo' => 'nullable', // Allow file or string
            'is_active' => 'boolean',
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
}
