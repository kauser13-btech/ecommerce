<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            BrandSeeder::class,
            ProductSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Pink Mia',
            'email' => 'icesiv@gmail.com',
            'password' => 'EggMan-2020',
            'role' => 'client',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@appleians.com',
            'password' => 'password',
            'role' => 'admin',
        ]);
    }
}
