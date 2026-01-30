<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attribute;

class AttributeController extends Controller
{
    public function index()
    {
        return response()->json(Attribute::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'unique:attributes,name',
                function ($attribute, $value, $fail) {
                    if (in_array(strtolower(trim($value)), ['color', 'colors', 'colour', 'colours'])) {
                        $fail('The attribute name cannot be "Color" or "Colors".');
                    }
                },
            ]
        ]);

        $attribute = Attribute::create([
            'name' => $request->name
        ]);

        return response()->json($attribute, 201);
    }

    public function destroy($id)
    {
        Attribute::destroy($id);
        return response()->json(['message' => 'Attribute deleted']);
    }
    public function update(Request $request, $id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json(['message' => 'Attribute not found'], 404);
        }

        $request->validate([
            'name' => [
                'required',
                'string',
                'unique:attributes,name,' . $id,
                function ($attribute, $value, $fail) {
                    if (in_array(strtolower(trim($value)), ['color', 'colors', 'colour', 'colours'])) {
                        $fail('The attribute name cannot be "Color" or "Colors".');
                    }
                },
            ]
        ]);

        $attribute->update([
            'name' => $request->name
        ]);

        return response()->json($attribute);
    }
}
