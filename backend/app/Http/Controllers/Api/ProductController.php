<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
// ... (previous code)

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    // ... (index method same)

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            try {
                $validated = $request->validate([
                    'name' => 'required|string|max:255',
                    'slug' => 'required|string|unique:products,slug',
                    'sku' => 'required|string|unique:products,sku',
                    'price' => 'required|integer',
                    'original_price' => 'nullable|integer',
                    'stock' => 'required|integer',
                    'category_id' => 'required|exists:categories,id',
                    'brand_id' => 'required|exists:brands,id',
                    'image' => 'nullable|string',
                    'images' => 'nullable', 
                    'description' => 'nullable|string',
                    'features' => 'nullable|string',
                    'specifications' => 'nullable|json',
                    'is_active' => 'boolean',
                    'is_featured' => 'boolean',
                    'is_new' => 'boolean',
                    'is_preorder' => 'boolean',
                    'options' => 'nullable|json',
                    'variants' => 'nullable|json',
                    'product_colors' => 'nullable',
                ]);

            } catch (\Illuminate\Validation\ValidationException $e) {
                \Log::error('Product Create Validation Error: ' . json_encode($e->errors()));
                throw $e;
            }

            $data = $validated;
            
            if (isset($data['options']) && is_string($data['options'])) {
                $data['options'] = json_decode($data['options'], true);
            }
            
            // Image handling (same as before)
            $finalImages = [];
            if ($request->has('existing_images')) {
                $existingInputs = $request->input('existing_images');
                if (is_array($existingInputs)) {
                    $finalImages = $existingInputs;
                }
            }
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $finalImages[] = asset('storage/' . $path);
                }
            }
            if (count($finalImages) > 0) {
                $data['images'] = $finalImages;
                if (empty($data['image'])) {
                    $data['image'] = $finalImages[0];
                }
            }

            // Product Colors (same as before)
            $finalColors = [];
            if ($request->has('product_colors')) {
                $colorsInput = json_decode($request->product_colors, true);
                if (is_array($colorsInput)) {
                    foreach ($colorsInput as $index => $colorData) {
                        if ($request->hasFile("color_images.$index")) {
                            $path = $request->file("color_images.$index")->store('products/colors', 'public');
                            $colorData['image'] = asset('storage/' . $path);
                        }
                        $finalColors[] = [
                            'name' => $colorData['name'],
                            'image' => $colorData['image'] ?? null,
                            'code' => $colorData['code'] ?? null
                        ];
                    }
                }
            }
            $data['product_colors'] = $finalColors;

            $product = Product::create($data);

            // Handle Variants with STRICT Validation
            if ($request->has('variants')) {
                $variants = json_decode($request->variants, true); 
                if (is_array($variants)) {
                   
                   // 1. Check for Duplicate SKUs within the request
                   $skus = array_filter(array_column($variants, 'sku'));
                   if (count($skus) !== count(array_unique($skus))) {
                        throw ValidationException::withMessages(['variants' => 'Duplicate SKUs found in variants list.']);
                   }

                   foreach ($variants as $index => $variantData) {
                        // 2. Check for Existing SKU in DB (excluding this product logic since it's create, but globally unique check)
                        if (!empty($variantData['sku'])) {
                            // Ideally, we'd do a batch check or unique rule, but loop check is ok for now validation.
                            // Better: use validation rule above? Variants is json string so hard to validate via standard rules.
                             if (\App\Models\ProductVariant::where('sku', $variantData['sku'])->exists() || \App\Models\Product::where('sku', $variantData['sku'])->exists()) {
                                  throw ValidationException::withMessages(["variants.$index.sku" => "SKU '{$variantData['sku']}' is already taken."]);
                             }
                        }

                        if ($request->hasFile("variant_images.$index")) {
                            $path = $request->file("variant_images.$index")->store('products', 'public');
                            $variantData['image'] = asset('storage/' . $path);
                        }
                        $product->variants()->create($variantData);
                   }
                }
            }

            return response()->json([
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        return DB::transaction(function () use ($request, $product, $id) {
            try {
                $validated = $request->validate([
                    'name' => 'string|max:255',
                    'slug' => 'string|unique:products,slug,' . $id,
                    'sku' => 'string|unique:products,sku,' . $id,
                    'price' => 'integer',
                    'original_price' => 'nullable|integer',
                    'stock' => 'integer',
                    'category_id' => 'exists:categories,id',
                    'brand_id' => 'exists:brands,id',
                    'image' => 'nullable|string',
                    'images' => 'nullable',
                    'existing_images' => 'nullable|array', 
                    'description' => 'nullable|string',
                    'features' => 'nullable|string',
                    'specifications' => 'nullable|json',
                    'is_active' => 'boolean',
                    'is_featured' => 'boolean',
                    'is_new' => 'boolean',
                    'is_preorder' => 'boolean',
                    'options' => 'nullable|json',
                    'variants' => 'nullable|json',
                    'product_colors' => 'nullable', 
                ]);

            } catch (\Illuminate\Validation\ValidationException $e) {
                \Log::error('Product Update Validation Error: ' . json_encode($e->errors()));
                throw $e;
            }

            $data = $validated;

            if (isset($data['options']) && is_string($data['options'])) {
                $data['options'] = json_decode($data['options'], true);
            }

            // Images (same logic)
            $finalImages = [];
            if ($request->has('existing_images')) {
                $finalImages = $request->input('existing_images');
                if (!is_array($finalImages)) $finalImages = [];
            }
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $finalImages[] = asset('storage/' . $path);
                }
            }
            if ($request->has('existing_images') || $request->hasFile('images')) {
                 $data['images'] = $finalImages;
                if (count($finalImages) > 0) {
                    if (empty($data['image']) || !in_array($data['image'], $finalImages)) {
                         $data['image'] = $finalImages[0];
                    }
                } else {
                    $data['image'] = null;
                }
            }

            // Colors (same logic)
            if ($request->has('product_colors')) {
                 $colorsInput = json_decode($request->product_colors, true);
                 $finalColors = [];
                 if (is_array($colorsInput)) {
                     foreach ($colorsInput as $index => $colorData) {
                         if ($request->hasFile("color_images.$index")) {
                             $path = $request->file("color_images.$index")->store('products/colors', 'public');
                             $colorData['image'] = asset('storage/' . $path);
                         }
                         if (empty($colorData['image'])) $colorData['image'] = null;

                         $finalColors[] = [
                             'name' => $colorData['name'],
                             'image' => $colorData['image'],
                             'code' => $colorData['code'] ?? null
                         ];
                     }
                 }
                 $data['product_colors'] = $finalColors;
            }

            $product->update($data);

            // Variants with Validation
            if ($request->has('variants')) {
                 $variantsInput = json_decode($request->variants, true);
                 if (is_array($variantsInput)) {
                     
                     // 1. Check for Duplicate SKUs within request
                     $skus = array_filter(array_column($variantsInput, 'sku'));
                     if (count($skus) !== count(array_unique($skus))) {
                          throw ValidationException::withMessages(['variants' => 'Duplicate SKUs found in variants list.']);
                     }

                     $existingIds = [];
                     foreach ($variantsInput as $index => $variantData) {
                         
                         // 2. Check DB Uniqueness (Exclude current variant ID if updating)
                         if (!empty($variantData['sku'])) {
                             $exists = \App\Models\ProductVariant::where('sku', $variantData['sku']);
                             if (isset($variantData['id'])) {
                                 $exists->where('id', '!=', $variantData['id']);
                             }
                             if ($exists->exists()) {
                                  throw ValidationException::withMessages(["variants.$index.sku" => "SKU '{$variantData['sku']}' is already taken."]);
                             }
                             // Global check? optional details
                         }

                         $variant = null;
                         if ($request->hasFile("variant_images.$index")) {
                            $path = $request->file("variant_images.$index")->store('products', 'public');
                            $variantData['image'] = asset('storage/' . $path);
                         } elseif (isset($variantData['image']) && $variantData['image'] === null) {
                             $variantData['image'] = null;
                         }

                         if (isset($variantData['id'])) {
                             $variant = $product->variants()->find($variantData['id']);
                         }
                         if (!$variant && isset($variantData['sku'])) {
                             $variant = $product->variants()->where('sku', $variantData['sku'])->first();
                         }

                         if ($variant) {
                             $variant->update($variantData);
                             $existingIds[] = $variant->id;
                         } else {
                             $newVariant = $product->variants()->create($variantData);
                             $existingIds[] = $newVariant->id;
                         }
                     }
                     $product->variants()->whereNotIn('id', $existingIds)->delete();
                 }
            }

            return response()->json([
                'message' => 'Product updated successfully',
                'data' => $product
            ]);
        });
    }

    // ... (rest of methods)


    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }


    public function adminShow($id)
    {
        $product = Product::with(['category', 'brand', 'variants'])
            ->findOrFail($id);

        return response()->json($product);
    }
}
