<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\PreOrder;

class PreOrderController extends Controller
{
    public function index()
    {
        $preOrders = PreOrder::with(['product', 'variant'])->orderBy('created_at', 'desc')->get();
        return response()->json($preOrders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:1000',
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $preOrder = PreOrder::create($validated);

        return response()->json([
            'message' => 'Pre-order submitted successfully.',
            'data' => $preOrder,
        ], 201);
    }
}
