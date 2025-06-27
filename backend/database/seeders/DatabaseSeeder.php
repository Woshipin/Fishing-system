<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            DurationSeeder::class,
            GallerySeeder::class,
            TableNumberSeeder::class,
            FishingCmsSeeder::class,
            AboutPageContentSeeder::class,
            TeamMemberSeeder::class,
            MilestoneSeeder::class,
        ]);
    }
}
