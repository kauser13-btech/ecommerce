<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->integer('price')->change();
            $table->integer('original_price')->nullable()->change();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->integer('price')->nullable()->change();
            $table->integer('original_price')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->change();
            $table->decimal('original_price', 10, 2)->nullable()->change();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->nullable()->change();
            $table->decimal('original_price', 10, 2)->nullable()->change();
        });
    }
};
