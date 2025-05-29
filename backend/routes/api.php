<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

// Auth 认证路由
// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Restaurant 餐厅路由
Route::get('/products', [ProductController::class, 'show'])->name('products.show');

// Restaurant {id} 是餐厅的 ID
// Route::get('/restaurants/{id}', [ProductController::class, 'show'])->name('restaurants.show');

// Restaurant {id} 是餐厅的 ID
// Route::get('/menu/{id}', [MenuController::class, 'show'])->name('menu.show');

// Menu 菜单路由
// Route::get('/menus', [MenuController::class, 'index']);

// 其他 API 路由...

