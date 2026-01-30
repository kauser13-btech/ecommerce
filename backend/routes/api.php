<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\OrderController;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PromoCodeController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Public Blog Routes
Route::get('/blogs', [\App\Http\Controllers\Api\BlogController::class, 'indexPublic']);
Route::get('/blogs/featured', [\App\Http\Controllers\Api\BlogController::class, 'featured']);
Route::get('/blogs/{slug}', [\App\Http\Controllers\Api\BlogController::class, 'showPublic']);

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
        
        // Manage Admin Users
        Route::apiResource('users', \App\Http\Controllers\Api\AdminUserController::class);
        Route::post('/users/{id}/verify', [\App\Http\Controllers\Api\AdminUserController::class, 'verify']);
        Route::post('/users/{id}/send-otp', [\App\Http\Controllers\Api\AdminUserController::class, 'sendUserOtp']);
        Route::post('/users/{id}/verify-otp', [\App\Http\Controllers\Api\AdminUserController::class, 'verifyUserOtp']);
        Route::post('/users/{id}/reset-password', [\App\Http\Controllers\Api\AdminUserController::class, 'resetPassword']);
        Route::post('/email/send-otp', [\App\Http\Controllers\Api\AdminUserController::class, 'sendOtp']);
        Route::post('/email/verify-otp', [\App\Http\Controllers\Api\AdminUserController::class, 'verifyOtp']);

        // Admin Blog Management
        Route::get('/blogs', [\App\Http\Controllers\Api\BlogController::class, 'indexAdmin']);
        Route::post('/blogs', [\App\Http\Controllers\Api\BlogController::class, 'store']);
        Route::put('/blogs/{id}', [\App\Http\Controllers\Api\BlogController::class, 'update']);
        Route::delete('/blogs/{id}', [\App\Http\Controllers\Api\BlogController::class, 'destroy']);
    
        // Admin Pre-Orders
        Route::get('/pre-orders', [\App\Http\Controllers\PreOrderController::class, 'index']);
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
Route::post('/products/reorder', [ProductController::class, 'reorder']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::apiResource('promocodes', PromoCodeController::class);
Route::post('/promocodes/apply', [PromoCodeController::class, 'apply']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']); // Changed to ID or check if slug handling logic is robust
Route::post('/categories', [CategoryController::class, 'store']);
Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Brands
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{slug}', [BrandController::class, 'show']);
Route::post('/brands', [BrandController::class, 'store']);
Route::post('/brands/reorder', [BrandController::class, 'reorder']);
Route::put('/brands/{id}', [BrandController::class, 'update']);
Route::delete('/brands/{id}', [BrandController::class, 'destroy']);

// Tags
Route::apiResource('tags', TagController::class);

// Attributes
Route::apiResource('attributes', \App\Http\Controllers\AttributeController::class);

// Media
Route::get('/media', [App\Http\Controllers\Api\MediaController::class, 'index']);
Route::post('/media', [App\Http\Controllers\Api\MediaController::class, 'store']);
Route::delete('/media', [App\Http\Controllers\Api\MediaController::class, 'destroy']);

// Offers
Route::apiResource('offers', App\Http\Controllers\Api\OfferController::class);
Route::post('offers/reorder', [App\Http\Controllers\Api\OfferController::class, 'reorder']);

// Orders (protected routes would use auth:sanctum middleware)
Route::apiResource('orders', OrderController::class);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::get('/orders/{id}/logs', [OrderController::class, 'getLogs']);

// Menu
Route::get('/menu', [App\Http\Controllers\Api\MenuController::class, 'index']);

// Admin Menu Management (should be protected, adding here for now to match other patterns or inside admin group)
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->prefix('admin')->group(function () {
        Route::get('/menu', [App\Http\Controllers\Api\MenuController::class, 'adminIndex']);
        Route::post('/menu', [App\Http\Controllers\Api\MenuController::class, 'store']);
        Route::put('/menu/{id}', [App\Http\Controllers\Api\MenuController::class, 'update']);
        Route::delete('/menu/{id}', [App\Http\Controllers\Api\MenuController::class, 'destroy']);
        Route::post('/menu/reorder', [App\Http\Controllers\Api\MenuController::class, 'reorder']);
        Route::post('/menu/reorder', [App\Http\Controllers\Api\MenuController::class, 'reorder']);
    });
});

// Pre-Orders
Route::post('/pre-orders', [\App\Http\Controllers\PreOrderController::class, 'store']);
