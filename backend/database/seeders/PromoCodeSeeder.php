<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PromoCode;
use Carbon\Carbon;

class PromoCodeSeeder extends Seeder
{
    public function run()
    {
        $codes = [
            [
                'code' => 'WELCOME10',
                'type' => 'percent',
                'value' => 10,
                'min_order_amount' => 0,
                'expires_at' => Carbon::now()->addMonths(1),
                'is_active' => true,
            ],
            [
                'code' => 'SAVE50',
                'type' => 'fixed',
                'value' => 50,
                'min_order_amount' => 500,
                'expires_at' => Carbon::now()->addMonths(2),
                'is_active' => true,
            ],
            [
                'code' => 'SUMMER20',
                'type' => 'percent',
                'value' => 20,
                'min_order_amount' => 1000,
                'expires_at' => Carbon::now()->addWeeks(2),
                'is_active' => true,
            ],
            [
                'code' => 'FLASH100',
                'type' => 'fixed',
                'value' => 100,
                'min_order_amount' => 2000,
                'expires_at' => Carbon::now()->addDays(3),
                'is_active' => true,
            ],
            [
                'code' => 'WINTER30',
                'type' => 'percent',
                'value' => 30,
                'min_order_amount' => 5000,
                'expires_at' => Carbon::now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'FREESHIP', // Simulating free shipping using fixed amount roughly equal to shipping
                'type' => 'fixed',
                'value' => 100, 
                'min_order_amount' => 1500,
                'expires_at' => Carbon::now()->addYear(),
                'is_active' => true,
            ],
            [
                'code' => 'EXPIRED50',
                'type' => 'percent',
                'value' => 50,
                'min_order_amount' => 0,
                'expires_at' => Carbon::now()->subDay(), // Already expired
                'is_active' => true,
            ],
            [
                'code' => 'INACTIVE25',
                'type' => 'percent',
                'value' => 25,
                'min_order_amount' => 0,
                'expires_at' => Carbon::now()->addMonth(),
                'is_active' => false,
            ],
            [
                'code' => 'BIGSPENDER',
                'type' => 'fixed',
                'value' => 500,
                'min_order_amount' => 10000,
                'expires_at' => Carbon::now()->addMonths(6),
                'is_active' => true,
            ],
            [
                'code' => 'NEWYEAR2026',
                'type' => 'percent',
                'value' => 15,
                'min_order_amount' => 1000,
                'expires_at' => Carbon::parse('2026-01-31'),
                'is_active' => true,
            ],
        ];

        foreach ($codes as $code) {
            PromoCode::create($code);
        }
    }
}
