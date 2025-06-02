<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $galleries = [
            ['title' => 'Restaurant Interior', 'image_path' => 'gallery/interior.jpg'],
            ['title' => 'Popular Dish', 'image_path' => 'gallery/popular-dish.jpg'],
            ['title' => 'Event Night', 'image_path' => 'gallery/event.jpg'],
        ];

        foreach ($galleries as $item) {
            Gallery::firstOrCreate(['title' => $item['title']], ['image_path' => $item['image_path']]);
        }
    }
}
