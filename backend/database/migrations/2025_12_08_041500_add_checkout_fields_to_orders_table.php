<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('division')->after('customer_phone')->nullable();
            $table->string('district')->after('division')->nullable();
            $table->string('upazila')->after('district')->nullable();
            $table->string('post_code')->after('upazila')->nullable();
            $table->string('delivery_method')->after('payment_status')->default('courier'); // courier, pickup
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['division', 'district', 'upazila', 'post_code', 'delivery_method']);
        });
    }
};
