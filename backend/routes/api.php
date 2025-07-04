<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DurationController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TableNumberController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDurationController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AboutPageController;
use App\Http\Controllers\FishingCMSController;
use Illuminate\Support\Facades\Route;

// Auth 认证路由
// Route::post('/register', [UserController::class, 'register'])->name('register');
// Route::post('/login', [UserController::class, 'login'])->name('login');
// Route::post('/logout', [UserController::class, 'logout'])->name('logout');

// 公开路由（不需要认证）
Route::post('/register', [UserController::class, 'register'])->name('register');
Route::post('/login', [UserController::class, 'login'])->name('login');

// 需要认证的路由
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
    Route::get('/user', [UserController::class, 'user'])->name('user');
});

Route::put('/user', [UserController::class, 'update'])->name('user.update');

// Products routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

// Products {id} 是产品 ID
// Products popular route
Route::get('/products/popular', [ProductController::class, 'products_popular']);

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

// 获取用户订单
Route::get('/get-orders', [OrderController::class, 'getOrdersByUserId']);

// 删除购物车项目
Route::put('/cancel-order/{id}', [OrderController::class, 'cancelOrder']);

// 获取用户Duration信息
Route::get('/user-durations', [UserDurationController::class, 'index']);
Route::get('/user-selected-durations/active', [UserDurationController::class, 'getActiveSessions']);
Route::get('/user-selected-durations/completed', [UserDurationController::class, 'getCompletedSessions']);
Route::put('/user-selected-durations/{id}/status', [UserDurationController::class, 'updateSessionStatus']);

Route::get('/comments', [CommentController::class, 'index']);
Route::post('/add-comments', [CommentController::class, 'store']);
Route::post('/comments/{comment}/like', [CommentController::class, 'like']);

// 回复相关路由
Route::post('/comments/{comment}/replies', [CommentController::class, 'storeReply']);
Route::post('/comments/{comment}/replies/{reply}/like', [CommentController::class, 'likeReply']);

Route::post('/add-contact', [ContactController::class, 'store']);

Route::post('/products/{product}/reviews', [ReviewController::class, 'ProductReview']);

Route::post('/packages/{package}/reviews', [ReviewController::class, 'PackageReview']);

Route::get('/about-page-cms', [AboutPageController::class, 'getAboutPageData']);

Route::get('/fishing-cms', [FishingCMSController::class, 'getCMSData']);

// 更新购物车项目数量
// Route::put('/cart/{id}', [CartController::class, 'updateCartItem']);

// 清空购物车
// Route::delete('/cart', [CartController::class, 'clearCart']);
