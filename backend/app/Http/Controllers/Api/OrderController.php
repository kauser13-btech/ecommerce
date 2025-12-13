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
            $query->where(function($q) use ($request) {
                $q->where('user_id', $request->user_id);
                // Also search by email if user exists
                $user = \App\Models\User::find($request->user_id);
                if ($user) {
                    $q->orWhere('customer_email', $user->email);
                }
            });
        }
        // Fallback for security: if no filter and not admin (dummy check), maybe limit? 
        // For now, we assume frontend sends strict filters or is admin.
        
        return response()->json($query->latest()->get());
    }

    public function show($id)
    {
        return response()->json(Order::with(['orderItems.product', 'user'])->findOrFail($id));
    }

    public function store(Request $request)
    {
        // ... validation ...
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'required|string',
            'division' => 'nullable|string',
            'district' => 'nullable|string',
            'upazila' => 'nullable|string',
            'post_code' => 'nullable|string',
            'shipping_address' => 'required|string',
            'apartment_suite' => 'nullable|string',
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
                
                $lineTotal = $price * $item['quantity'];
                $subtotal += $lineTotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $lineTotal,
                    'variation' => isset($item['selectedOptions']) ? json_encode($item['selectedOptions']) : null,
                ];

                // Decrement stock
                $product->decrement('stock', $item['quantity']);
            }

            // Calculate Totals
            $shippingCost = $request->delivery_method === 'pickup' ? 0 : 400;
            $tax = 0; 
            $discount = 0;

            if ($request->promo_code) {
                $promo = PromoCode::where('code', $request->promo_code)->first();
                if ($promo && $promo->isValid()) {
                     if ($promo->type === 'fixed') {
                        $discount = $promo->value;
                    } else {
                        $discount = ($subtotal * $promo->value) / 100;
                    }
                    if ($promo->min_order_amount && $subtotal < $promo->min_order_amount) {
                         $discount = 0;
                    }
                }
            }
            
            $totalBeforeDiscount = $subtotal + $shippingCost + $tax;
            $discount = min($discount, $totalBeforeDiscount);
            $total = $totalBeforeDiscount - $discount;

            // Combine address with apartment suite if present
            $fullShippingAddress = $request->shipping_address;
            if ($request->filled('apartment_suite')) {
                $fullShippingAddress .= ', ' . $request->apartment_suite;
            }

            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => auth('sanctum')->id() ?? null,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'division' => $request->division,
                'district' => $request->district,
                'upazila' => $request->upazila,
                'post_code' => $request->post_code,
                'shipping_address' => $fullShippingAddress,
                'billing_address' => $fullShippingAddress,
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
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $order = Order::findOrFail($id);
        $oldStatus = $order->order_status;
        $newStatus = $validated['status'];

        if ($oldStatus !== $newStatus) {
            $order->update(['order_status' => $newStatus]);

            // Create log
            $order->logs()->create([
                'user_id' => $request->user()->id ?? null, // Assuming admin is authenticated
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ]);
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    public function getLogs($id)
    {
        $order = Order::findOrFail($id);
        return response()->json($order->logs()->with('user')->latest()->get());
    }
}
