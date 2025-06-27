<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fishing_cms;

class FishingCmsSeeder extends Seeder
{
    public function run(): void
    {
        Fishing_cms::firstOrCreate(
            ['home_title' => 'Welcome to Fishing Paradise'], // 查找条件：通常唯一值
            [ // 更新或创建的数据字段
                'home_description' => 'Discover the best fishing experience with us at our scenic location, offering all-day relaxation and adventure.',
                'about_us_title' => 'About Fishing Paradise',
                'about_us_description' => 'Fishing Paradise is your go-to spot for family-friendly fishing fun, premium gear, and expert guidance.',

                'phone_number' => '012-3456789',
                'email' => 'contact@fishingparadise.com',
                'address' => '123 Fishing Lane, Kampung Nelayan, Selangor, Malaysia',

                'opening_days_text' => 'Monday - Friday',
                'closing_day_text' => 'Sunday',
                'open_time' => '09:00:00',
                'close_time' => '18:00:00',

                'special_holidays_text' => 'Closed on Public Holidays',
            ]
        );
    }
}
