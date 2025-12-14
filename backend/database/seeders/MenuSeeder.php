<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\MenuItem;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. HOME
        MenuItem::create([
            'title' => 'HOME',
            'url' => '/',
            'order' => 1
        ]);

        // 2. APPLE PRODUCTS
        $apple = MenuItem::create([
            'title' => 'APPLE PRODUCTS',
            'url' => '/products?category=apple',
            'order' => 2
        ]);

        // Submenu for Apple
        $appleItems = [
            ['title' => 'Apple MacBook', 'url' => '/products?category=macbook'],
            ['title' => 'Apple iPad', 'url' => '/products?category=ipad'],
            ['title' => 'Apple iPhone', 'url' => '/products?category=iphone'],
            ['title' => 'Apple Watch', 'url' => '/products?category=watch'],
            ['title' => 'Apple Mac Mini', 'url' => '/products?category=mac-mini'],
            ['title' => 'Apple iMac', 'url' => '/products?category=imac'],
            ['title' => 'Apple Mac Studio', 'url' => '/products?category=mac-studio'],
            ['title' => 'Apple Accessories', 'url' => '/products?category=apple-accessories'],
        ];

        foreach ($appleItems as $index => $item) {
            MenuItem::create([
                'title' => $item['title'],
                'url' => $item['url'],
                'parent_id' => $apple->id,
                'order' => $index + 1
            ]);
        }

        // 3. MOBILE AND TABLETS
        MenuItem::create([
            'title' => 'MOBILE AND TABLETS',
            'url' => '/products?category=mobile-tablets',
            'order' => 3
        ]);

        // 4. ACCESSORIES
        MenuItem::create([
            'title' => 'ACCESSORIES',
            'url' => '/products?category=accessories',
            'order' => 4
        ]);

        // 5. CONTACT US
        MenuItem::create([
            'title' => 'CONTACT US',
            'url' => '/contact-us',
            'order' => 5
        ]);
    }
}
