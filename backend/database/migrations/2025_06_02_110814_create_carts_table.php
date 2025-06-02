<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('package_id')->nullable();
            $table->string('name');
            $table->string('slug')->nullable();
            $table->string('image')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->json('features')->nullable(); // ✅ 应为 JSON 类型
            $table->timestamps();

            // 外键约束（可选，推荐）
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->foreign('package_id')->references('id')->on('packages')->onDelete('set null');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
