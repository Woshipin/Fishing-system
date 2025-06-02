<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Fried Chicken',
                'slug' => 'fried-chicken',
                'category_name' => 'Food',
                'description' => 'Delicious crispy chicken.',
                'price' => 12.90,
                'stock' => 50,
            ],
            [
                'name' => 'Iced Lemon Tea',
                'slug' => 'iced-lemon-tea',
                'category_name' => 'Drinks',
                'description' => 'Refreshing drink.',
                'price' => 3.50,
                'stock' => 100,
            ],
            [
                'name' => 'Ice Cream Sundae',
                'slug' => 'ice-cream-sundae',
                'category_name' => 'Desserts',
                'description' => 'Sweet dessert.',
                'price' => 6.00,
                'stock' => 30,
            ],
        ];

        foreach ($products as $item) {
            $category = Category::where('name', $item['category_name'])->first();
            if ($category) {
                Product::firstOrCreate(
                    ['slug' => $item['slug']],
                    [
                        'name' => $item['name'],
                        'category_id' => $category->id,
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'stock' => $item['stock'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
