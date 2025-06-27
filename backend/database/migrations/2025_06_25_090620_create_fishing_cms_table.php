<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fishing_cms', function (Blueprint $table) {
            $table->id();
            $table->string('home_title')->nullable();
            $table->text('home_description')->nullable(); // 使用 text 以便存储更长的描述
            $table->string('about_us_title')->nullable();
            $table->text('about_us_description')->nullable();

            // 联系信息
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();

            // 营业时间 (根据讨论优化的结构)
            $table->string('opening_days_text')->nullable()->comment('用于显示 "Monday - Friday" 这样的营业日文本');
            $table->string('closing_day_text')->nullable()->comment('用于显示 "Sunday" 这样的休息日文本');

            // 使用标准 TIME 类型存储时间 (24小时制)，在展示时再格式化为 AM/PM
            $table->time('open_time')->nullable()->comment('营业开始时间, e.g., 09:00:00');
            $table->time('close_time')->nullable()->comment('营业结束时间, e.g., 18:00:00');

            $table->string('special_holidays_text')->nullable()->comment('用于显示 "Varies" 或具体节假日安排');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fishing_cms');
    }
};
