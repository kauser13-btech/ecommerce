<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Offer;
use App\Models\Product;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have products to link to
        $productIds = Product::pluck('id')->toArray();

        for ($i = 1; $i <= 10; $i++) {
            Offer::create([
                'title' => 'Special Offer ' . $i,
                // Using a placeholder service that generates images
                'image' => 'https://picsum.photos/seed/offer' . $i . '/800/400', 
                'product_id' => !empty($productIds) ? $productIds[array_rand($productIds)] : null,
                'is_active' => true,
                'sort_order' => $i,
            ]);
        }
    }
}
