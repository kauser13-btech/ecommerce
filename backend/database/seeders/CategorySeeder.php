<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Mobile Phones',
                'slug' => 'mobile-phones',
                'description' => 'Latest smartphones from top brands',
                'icon' => '📱',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Laptops',
                'slug' => 'laptops',
                'description' => 'High-performance laptops for work and gaming',
                'icon' => '💻',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Tablets',
                'slug' => 'tablets',
                'description' => 'Versatile tablets for entertainment and productivity',
                'icon' => '📱',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Smartwatches',
                'slug' => 'smartwatches',
                'description' => 'Smart wearables for fitness and connectivity',
                'icon' => '⌚',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Earbuds & Headphones',
                'slug' => 'earbuds',
                'description' => 'Premium audio devices',
                'icon' => '🎧',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Essential accessories for your devices',
                'icon' => '🔌',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
