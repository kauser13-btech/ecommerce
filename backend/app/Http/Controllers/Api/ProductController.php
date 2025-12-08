<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand'])->where('is_active', true);

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
        try {
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
            'image' => 'nullable|string',
            'images' => 'nullable', // Allow array or null, manual handling for files
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'specifications' => 'nullable|json',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'options' => 'nullable|json',
        ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Product Create Validation Error: ' . json_encode($e->errors()));
            throw $e;
        }

        $data = $validated;
        
        // Handle Images
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                // Store in public/products folder
                $path = $image->store('products', 'public');
                // Create full URL
                $imagePaths[] = asset('storage/' . $path);
            }
            $data['images'] = $imagePaths;
            
            // Set first image as main image if not provided
            if (empty($data['image']) && count($imagePaths) > 0) {
                $data['image'] = $imagePaths[0];
            }
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        try {
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
            'images' => 'nullable',
            'existing_images' => 'nullable|array', // Array of URL strings
            'description' => 'nullable|string',
            'features' => 'nullable|string',
            'specifications' => 'nullable|json',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'options' => 'nullable|json',
        ]);


        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Product Update Validation Error: ' . json_encode($e->errors()));
            throw $e;
        }

        $data = $validated;

        // Handle Images
        $finalImages = [];

        // 1. Process Existing Images (sent from frontend as strings)
        if ($request->has('existing_images')) {
            $finalImages = $request->input('existing_images');
            if (!is_array($finalImages)) {
                 $finalImages = [];
            }
        }

        // 2. Process New Uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $finalImages[] = asset('storage/' . $path);
            }
        }
        
        // If no existing images and no new images were sent, but there were images before... 
        // The frontend SHOULD send 'existing_images' as an empty array if all were removed.
        // However, if the field is missing entirely, it might mean "don't touch images".
        // But for a form submission, usually "missing field" = "empty" if we are being strict, OR we check if we should update images at all.
        // To allow removing all images, the frontend must send `existing_images` as empty array if intended.
        // To allow "partial update" (API style) where missing key = no change, we'd check $request->has().
        // Since we are building a full edit form, let's assume we construct the final list from scratch if we see either field, 
        // OR if we want to be safe: default to explicit inputs.
        // Let's rely on the fact that if we are uploading/editing images, we will send 'existing_images' (even if empty).
        
        // Let's only update the 'images' column if we actually processed some image logic 
        // OR if the user explicitly sent 'existing_images' (meaning they interacted with the image list).
        if ($request->has('existing_images') || $request->hasFile('images')) {
             $data['images'] = $finalImages;

             // Logic to ensure main image is set
            if (count($finalImages) > 0) {
                // If main image is not set or not in the final list, pick the first one
                // Use strict check? simplified for now.
                if (empty($data['image']) || !in_array($data['image'], $finalImages)) {
                     $data['image'] = $finalImages[0];
                }
            } else {
                $data['image'] = null;
            }
        }

        $product->update($data);

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
