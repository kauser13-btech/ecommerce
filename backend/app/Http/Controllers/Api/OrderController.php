<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['orderItems.product', 'user']);
        
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        
        return response()->json($query->latest()->get());
    }

    public function show($id)
    {
        return response()->json(Order::with(['orderItems.product', 'user'])->findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'division' => 'required|string',
            'district' => 'required|string',
            'upazila' => 'required|string',
            'post_code' => 'nullable|string',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:cod,online',
            'delivery_method' => 'required|in:courier,pickup',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'promo_code' => 'nullable|string|exists:promo_codes,code'
        ]);

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $itemsToCreate = [];

            // Calculate Subtotal and check stock
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);
                
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                $price = $product->price; 
                // If we had product variations via 'selectedColor'/'selectedStorage', we might adjust price here logic if needed
                // For now assuming base price

                $lineTotal = $price * $item['quantity'];
                $subtotal += $lineTotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                    'total' => $lineTotal,
                    'variation' => json_encode([
                        'color' => $item['selectedColor'] ?? null,
                        'storage' => $item['selectedStorage'] ?? null
                    ]),
                ];

                // Decrement stock
                $product->decrement('stock', $item['quantity']);
            }

            // Calculate Totals
            $shippingCost = $request->delivery_method === 'pickup' ? 0 : 100;
            $tax = $subtotal * 0.05;
            $discount = 0;

            if ($request->promo_code) {
                $promo = PromoCode::where('code', $request->promo_code)->first();
                if ($promo && $promo->isValid()) {
                     if ($promo->type === 'fixed') {
                        $discount = $promo->value;
                    } else {
                        $discount = ($subtotal * $promo->value) / 100;
                    }
                    // Add cap logic if needed, currently reusing logic from cart
                    if ($promo->min_order_amount && $subtotal < $promo->min_order_amount) {
                         $discount = 0; // Invalid min order
                    }
                }
            }
            
            // Adjust discount not to exceed total
            $totalBeforeDiscount = $subtotal + $shippingCost + $tax;
            $discount = min($discount, $totalBeforeDiscount);
            $total = $totalBeforeDiscount - $discount;

            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => $request->user()->id ?? null, // If authenticated
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'division' => $request->division,
                'district' => $request->district,
                'upazila' => $request->upazila,
                'post_code' => $request->post_code,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->shipping_address, // Assuming same for now
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'delivery_method' => $request->delivery_method,
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'notes' => null,
            ]);

            foreach ($itemsToCreate as $itemData) {
                $order->orderItems()->create($itemData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order placement failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
