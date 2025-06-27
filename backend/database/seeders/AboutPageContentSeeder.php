<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutPageContent;

class AboutPageContentSeeder extends Seeder
{
    public function run(): void
    {
        AboutPageContent::firstOrCreate(
            ['id' => 1], // 只保留一条内容
            [
                'story_description' => 'Our story began with a passion for fishing and a dream to build a community around it. Today, we are proud to be a leading destination for fishing enthusiasts.'
            ]
        );
    }
}
