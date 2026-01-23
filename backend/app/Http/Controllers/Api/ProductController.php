<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'tags'])->withCount('variants');
        
        if (!$request->boolean('include_inactive')) {
             $query->where('is_active', true);
        }

        if ($request->has('category')) {
            $categorySlug = $request->category;
            $category = Category::where('slug', $categorySlug)->first();

            if ($category) {
                // Get ID of category and all its children
                $ids = collect([$category->id]);
                // For now, let's just get immediate children. 
                // If we need deep recursion we can loop or use a recursive relationship method.
                // Assuming 1-level nesting for now based on request "Apple -> iPhone".
                $ids = $ids->merge($category->children()->pluck('id'));
                
                $query->whereIn('category_id', $ids);
            } else {
                // If category not found by slug, maybe just force empty or ignore?
                // Let's keep original behavior: if slug invalid, returns empty.
                $query->where('id', -1); 
            }
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

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'featured':
                    $query->orderBy('is_featured', 'desc');
                    break;
                case 'best-selling':
                     // Placeholder: we don't have sales_count yet. 
                     // Maybe sort by stock (sold out items last)? Or just random/popular?
                     // Let's us created_at for now or if we had a 'views' column.
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'title-asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'title-desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'price-asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'date-asc':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'date-desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    $query->latest();
                    break;
            }
        } else {
             $query->latest();
        }

        $products = $query->paginate(24); // Increased from 20 to 24 for better grid alignment (divisible by 2, 3, 4)

        return response()->json($products);
    }

    public function show($slug)
    {

        $product = Product::with(['category', 'brand', 'variants', 'tags'])
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
            ->orderBy('featured_order', 'asc') // Added order
            ->limit(8)
            ->get();

        return response()->json($products);
    }

    public function newArrivals()
    {
        $products = Product::with(['category', 'brand'])
            ->where('is_new', true)
            ->where('is_active', true)
            ->orderBy('new_arrival_order', 'asc') // Added order
            ->limit(8)
            ->get();

        return response()->json($products);
    }
    
    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.order' => 'required|integer',
            'type' => 'required|in:featured,new'
        ]);

        $column = $request->type === 'featured' ? 'featured_order' : 'new_arrival_order';

        foreach ($request->items as $item) {
            Product::where('id', $item['id'])->update([$column => $item['order']]);
        }

        return response()->json(['message' => 'Order updated successfully']);
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

    // Helper to generate unique SKU
    private function generateUniqueSku()
    {
        // Find the highest existing SKU starting with APP-
        // Check both Products and Variants
        $maxProductSku = \App\Models\Product::where('sku', 'like', 'APP-%')->max('sku');
        $maxVariantSku = \App\Models\ProductVariant::where('sku', 'like', 'APP-%')->max('sku');

        $maxSku = $maxProductSku > $maxVariantSku ? $maxProductSku : $maxVariantSku;

        if ($maxSku) {
            // Extract number
            $number = intval(substr($maxSku, 4));
            $nextNumber = $number + 1;
        } else {
            $nextNumber = 1;
        }

        // Ensure uniqueness in race condition (simple loop check)
        do {
            $sku = 'APP-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
            $exists = \App\Models\Product::where('sku', $sku)->exists() 
                   || \App\Models\ProductVariant::where('sku', $sku)->exists();
            if ($exists) {
                $nextNumber++;
            }
        } while ($exists);

        return $sku;
    }

    public function store(Request $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                try {
                    // Remove 'sku' from required validation as it's auto-generated
                    $validated = $request->validate([
                        'name' => 'required|string|max:255',
                        'slug' => 'required|string|unique:products,slug',
                        // 'sku' => 'required|string|unique:products,sku', // Auto-generated now
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
                        'tags' => 'nullable|array',
                        'tags.*' => 'exists:tags,id',
                    ]);

                } catch (\Illuminate\Validation\ValidationException $e) {
                    throw $e;
                }

                $data = $validated;
                
                // Auto-generate SKU for Product
                $data['sku'] = $this->generateUniqueSku();

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

                if ($request->has('tags')) {
                    $product->tags()->attach($request->tags);
                }

                // Handle Variants with Automatic SKU
                if ($request->has('variants')) {
                    $variants = json_decode($request->variants, true); 
                    if (is_array($variants)) {
                       
                       foreach ($variants as $index => $variantData) {
                            // Generate Variant SKU
                            $variantData['sku'] = $this->generateUniqueSku();

                            if ($request->hasFile("variant_images.$index")) {
                                $path = $request->file("variant_images.$index")->store('products', 'public');
                                $variantData['image'] = asset('storage/' . $path);
                            }
                            // Ensure product_id is set (laravel relationship does it, but good to be safe if manual)
                            // $variantData['product_id'] = $product->id; 
                            
                            $product->variants()->create($variantData);
                       }
                    }
                }

                return response()->json([
                    'message' => 'Product created successfully',
                    'data' => $product
                ], 201);
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            \Log::error('Product Create Failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create product.',
                'errors' => [
                    'server' => ['An unexpected error occurred: ' . $e->getMessage()]
                ]
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            return DB::transaction(function () use ($request, $product, $id) {
                try {
                    $validated = $request->validate([
                        'name' => 'string|max:255',
                        'slug' => 'string|unique:products,slug,' . $id,
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
                        'tags' => 'nullable|array',
                        'tags.*' => 'exists:tags,id', 
                    ]);

                } catch (\Illuminate\Validation\ValidationException $e) {
                    throw $e;
                }

                $data = $validated;
                
                // SKU is not updatable via this API to keep it stable, or use existing logic if sent? 
                // Request says "Replace current... with fixed 6-digit". 
                // If user wants to re-generate SKU for existing product, that's a separate migration task.
                // For UPDATE, we keep existing SKU.

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
                
                if ($request->has('tags')) {
                    $product->tags()->sync($request->tags);
                }

                $product->update($data);

                // Variants with Automatic SKU for NEW variants
                if ($request->has('variants')) {
                     $variantsInput = json_decode($request->variants, true);
                     if (is_array($variantsInput)) {
                         
                         $existingIds = [];
                         foreach ($variantsInput as $index => $variantData) {
                             
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
                             if (!isset($variantData['id']) && !$variant) {
                                 // Trying to find by SKU? No, SKU is auto-generated now.
                                 // Logic: If it has ID, it's existing. If not, it's new.
                                 // What if frontend sends SKU? We ignore/overwrite it if it's new?
                                 // Request says "Ensure system generates...".
                                 // So for NEW variants, we MUST generate.
                             }

                             if ($variant) {
                                 // Update existing
                                 // Don't update SKU of existing variant to maintain integrity
                                 unset($variantData['sku']); 
                                 $variant->update($variantData);
                                 $existingIds[] = $variant->id;
                             } else {
                                 // Create new
                                 $variantData['sku'] = $this->generateUniqueSku();
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
             return response()->json([
                'message' => 'Product not found.',
            ], 404);
        } catch (\Throwable $e) {
            \Log::error('Product Update Failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update product.',
                'errors' => [
                    'server' => ['An unexpected error occurred: ' . $e->getMessage()]
                ]
            ], 500);
        }
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
        $product = Product::with(['category', 'brand', 'variants', 'tags'])
            ->findOrFail($id);

        return response()->json($product);
    }
}
