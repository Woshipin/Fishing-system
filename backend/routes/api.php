<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\DurationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\TableNumberController;
use App\Http\Controllers\OrderController;

// Auth 认证路由
Route::post('/register', [UserController::class, 'register'])->name('register');
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// Restaurant 餐厅路由
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

// Restaurant {id} 是餐厅的 ID
Route::get('/products/{id}', [ProductController::class, 'detail'])->name('products.detail');

// Package routes
Route::get('/packages', [PackageController::class, 'index']);

// Package {id} 是包的 ID
Route::get('/packages/{id}', [PackageController::class, 'detail']);

// Table Number routes
Route::get('/table-numbers', [TableNumberController::class, 'index']);

// Gallery route
Route::get('/galleries', [GalleryController::class, 'index']);

// Duration route
Route::get('/durations', [DurationController::class, 'index']);

// 添加产品到购物车
Route::post('/cart/product', [CartController::class, 'addProductToCart']);

// 添加包到购物车
Route::post('/cart/package', [CartController::class, 'addPackageToCart']);

// 获取购物车项目列表
Route::get('/cart/items', [CartController::class, 'getCartItems']);

// 删除购物车项目
Route::delete('/cart/{id}', [CartController::class, 'removeCartItem']);

// 添加包到购物车
Route::post('/orders', [OrderController::class, 'store']);

// 更新购物车项目数量
// Route::put('/cart/{id}', [CartController::class, 'updateCartItem']);

// 清空购物车
// Route::delete('/cart', [CartController::class, 'clearCart']);



