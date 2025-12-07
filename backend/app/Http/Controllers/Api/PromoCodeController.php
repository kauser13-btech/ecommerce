<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    public function index()
    {
        return response()->json(PromoCode::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promo_codes,code',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        $promoCode = PromoCode::create($validated);
        return response()->json($promoCode, 201);
    }

    public function show($id)
    {
        return response()->json(PromoCode::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $promoCode = PromoCode::findOrFail($id);
        
        $validated = $request->validate([
            'code' => 'string|unique:promo_codes,code,' . $id,
            'type' => 'in:fixed,percent',
            'value' => 'numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        $promoCode->update($validated);
        return response()->json($promoCode);
    }

    public function destroy($id)
    {
        PromoCode::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'cart_total' => 'required|numeric'
        ]);

        $code = PromoCode::where('code', $request->code)->first();

        if (!$code) {
            return response()->json(['message' => 'Invalid promo code'], 404);
        }

        if (!$code->is_active) {
            return response()->json(['message' => 'Promo code is inactive'], 400);
        }

        if ($code->expires_at && $code->expires_at->isPast()) {
            return response()->json(['message' => 'Promo code has expired'], 400);
        }

        if ($code->min_order_amount && $request->cart_total < $code->min_order_amount) {
            return response()->json([
                'message' => "Minimum order amount of ৳{$code->min_order_amount} required"
            ], 400);
        }

        $discount = 0;
        if ($code->type === 'fixed') {
            $discount = $code->value;
        } else {
            $discount = ($request->cart_total * $code->value) / 100;
        }

        return response()->json([
            'success' => true,
            'code' => $code->code,
            'type' => $code->type,
            'value' => $code->value,
            'discount_amount' => min($discount, $request->cart_total),
            'message' => 'Promo code applied successfully'
        ]);
    }
}
