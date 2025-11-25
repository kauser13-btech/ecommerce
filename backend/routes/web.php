<?php



use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// API Explorer route
Route::get('/api-tester', [App\Http\Controllers\ApiTesterController::class, 'index'])->name('api.tester');