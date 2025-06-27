<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Milestone;

class MilestoneSeeder extends Seeder
{
    public function run(): void
    {
        Milestone::firstOrCreate(
            ['year' => 2015, 'title' => 'Company Founded'],
            [
                'description' => 'Fishing Paradise was founded in a small village with big dreams.',
                'order' => 1
            ]
        );

        Milestone::firstOrCreate(
            ['year' => 2018, 'title' => '1000+ Happy Visitors'],
            [
                'description' => 'We celebrated our 1000th guest with a community event.',
                'order' => 2
            ]
        );

        Milestone::firstOrCreate(
            ['year' => 2022, 'title' => 'New Location Launched'],
            [
                'description' => 'Opened our second branch by the riverside for more space and comfort.',
                'order' => 3
            ]
        );
    }
}
