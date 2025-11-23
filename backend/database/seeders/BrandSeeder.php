<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Apple',
                'slug' => 'apple',
                'description' => 'Premium technology products designed in California',
                'is_active' => true,
            ],
            [
                'name' => 'Samsung',
                'slug' => 'samsung',
                'description' => 'Leading electronics and technology company',
                'is_active' => true,
            ],
            [
                'name' => 'Xiaomi',
                'slug' => 'xiaomi',
                'description' => 'Innovation for everyone',
                'is_active' => true,
            ],
            [
                'name' => 'OnePlus',
                'slug' => 'oneplus',
                'description' => 'Never Settle',
                'is_active' => true,
            ],
            [
                'name' => 'Google',
                'slug' => 'google',
                'description' => 'Technology that helps you every day',
                'is_active' => true,
            ],
            [
                'name' => 'Sony',
                'slug' => 'sony',
                'description' => 'Be moved by quality',
                'is_active' => true,
            ],
            [
                'name' => 'Dell',
                'slug' => 'dell',
                'description' => 'Technology solutions for modern work',
                'is_active' => true,
            ],
            [
                'name' => 'HP',
                'slug' => 'hp',
                'description' => 'Keep reinventing',
                'is_active' => true,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
