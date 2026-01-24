<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'title',
        'image',
        'product_id',
        'url',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'product_id' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
