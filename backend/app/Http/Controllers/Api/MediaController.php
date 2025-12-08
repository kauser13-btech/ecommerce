<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index()
    {
        // Get all files from the 'products' directory in public disk
        // valid extensions
        $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        
        $files = Storage::disk('public')->allFiles('products');
        
        $images = collect($files)
            ->filter(function ($file) use ($extensions) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                return in_array($ext, $extensions);
            })
            ->map(function ($file) {
                return [
                    'path' => $file,
                    'url' => asset('storage/' . $file),
                    'name' => basename($file),
                    'size' => Storage::disk('public')->size($file),
                    'last_modified' => Storage::disk('public')->lastModified($file),
                ];
            })
            ->values()
            ->sortByDesc('last_modified')
            ->values();

        return response()->json($images);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // 2MB Max
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Store in 'products' folder (public disk) to match existing logic
            // or 'uploads' if we want to separate. 
            // Existing logic reads from 'products', so let's stick to that for now to ensuring they show up in the library.
            // Using a unique name
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('products', $filename, 'public');

            return response()->json([
                'message' => 'Image uploaded successfully',
                'path' => $path,
                'url' => asset('storage/' . $path),
            ], 201);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $path = $request->input('path');

        // Security check: ensure path is within 'products' directory 
        // Although allFiles('products') only returns files there, validation is good
        if (!str_starts_with($path, 'products/')) {
             return response()->json(['message' => 'Invalid file path'], 403);
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['message' => 'File deleted successfully']);
        }

        return response()->json(['message' => 'File not found'], 404);
    }
}
