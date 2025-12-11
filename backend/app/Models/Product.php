<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'features',
        'specifications',
        'price',
        'original_price',
        'sku',
        'stock',
        'image',
        'images',
        'category_id',
        'brand_id',
        'is_featured',
        'is_new',
        'featured_order',
        'new_arrival_order',
        'is_active',
        'options',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'specifications' => 'array',
        'images' => 'array',
        'options' => 'array',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
