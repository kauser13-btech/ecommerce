<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreOrder extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_phone',
        'customer_address',
        'product_id',
        'variant_id',
        'quantity',
        'status',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
