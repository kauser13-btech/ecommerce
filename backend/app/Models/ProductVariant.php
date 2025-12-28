<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'attributes',
        'price',
        'stock',
        'sku',
        'image',
        'original_price',
        'is_active'
    ];

    protected $casts = [
        'attributes' => 'array',
        'price' => 'integer',
        'original_price' => 'integer',
        'is_active' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
