<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        // Public API: Return hierarchical tree
        $menu = MenuItem::whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->orderBy('order');
            }])
            ->orderBy('order')
            ->get();
            
        return response()->json($menu);
    }

    public function adminIndex()
    {
        // Admin API: Return all items, flat structure but maybe with parent info
        // For drag-and-drop UI, often a tree structure is also preferred, 
        // but let's stick to the tree structure as it's easier to verify.
        return $this->index();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menu_items,id',
            'order' => 'integer'
        ]);

        // Default order to be last
        if (!isset($validated['order'])) {
            $lastOrder = MenuItem::where('parent_id', $validated['parent_id'] ?? null)->max('order');
            $validated['order'] = ($lastOrder ?? -1) + 1;
        }

        $menuItem = MenuItem::create($validated);

        return response()->json($menuItem, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menu_items,id',
            'order' => 'integer'
        ]);

        $menuItem = MenuItem::findOrFail($id);
        $menuItem->update($validated);

        return response()->json($menuItem);
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->delete();
        return response()->json(['message' => 'Menu item deleted']);
    }

    public function reorder(Request $request)
    {
        // Expects an array of items with id, order, parent_id
        $items = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:menu_items,id',
            'items.*.order' => 'required|integer',
            'items.*.parent_id' => 'nullable|exists:menu_items,id'
        ]);

        foreach ($items['items'] as $item) {
            MenuItem::where('id', $item['id'])->update([
                'order' => $item['order'],
                'parent_id' => $item['parent_id']
            ]);
        }

        return response()->json(['message' => 'Menu reordered successfully']);
    }
}
