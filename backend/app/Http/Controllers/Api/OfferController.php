<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Offer;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $query = Offer::orderBy('sort_order');
        
        if ($request->has('active_only')) {
            $query->where('is_active', true);
        }
        
        $offers = $query->with('product')->get();
        return response()->json($offers);
    }

    public function show($id)
    {
        $offer = Offer::findOrFail($id);
        return response()->json($offer);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|string',
            'product_id' => 'nullable|exists:products,id',
            'is_active' => 'boolean',
        ]);

        $maxOrder = Offer::max('sort_order') ?? 0;
        $validated['sort_order'] = $maxOrder + 1;

        $offer = Offer::create($validated);

        return response()->json($offer, 201);
    }

    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'image' => 'sometimes|string',
            'product_id' => 'nullable|exists:products,id',
            'is_active' => 'boolean',
        ]);

        $offer->update($validated);

        return response()->json($offer);
    }

    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();

        return response()->json(['message' => 'Offer deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'offers' => 'required|array',
            'offers.*.id' => 'required|integer',
            'offers.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['offers'] as $item) {
            Offer::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Offers reordered successfully']);
    }
}
