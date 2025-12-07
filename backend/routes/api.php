<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\OrderController;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PromoCodeController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin Routes
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Welcome to Admin Dashboard']);
        });
    });
});

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/new-arrivals', [ProductController::class, 'newArrivals']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{id}/admin', [ProductController::class, 'adminShow']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::apiResource('promocodes', PromoCodeController::class);
Route::post('/promocodes/apply', [PromoCodeController::class, 'apply']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Brands
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{slug}', [BrandController::class, 'show']);

// Orders (protected routes would use auth:sanctum middleware)
Route::apiResource('orders', OrderController::class);
