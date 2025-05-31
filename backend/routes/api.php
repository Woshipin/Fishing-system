<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\DurationController;

// Auth 认证路由
// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Restaurant 餐厅路由
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

// Restaurant {id} 是餐厅的 ID
Route::get('/products/{id}', [ProductController::class, 'detail'])->name('products.detail');


// Gallery route
Route::get('/galleries', [GalleryController::class, 'index']);

// Duration route
Route::get('/durations', [DurationController::class, 'index']);

// Restaurant {id} 是餐厅的 ID
// Route::get('/menu/{id}', [MenuController::class, 'show'])->name('menu.show');

// Menu 菜单路由
// Route::get('/menus', [MenuController::class, 'index']);

// 其他 API 路由...

