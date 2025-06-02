<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Duration;

class DurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $durations = [
            ['name' => '30分钟', 'seconds' => 1800],
            ['name' => '1小时', 'seconds' => 3600],
            ['name' => '1小时30分钟', 'seconds' => 5400],
            ['name' => '2小时', 'seconds' => 7200],
        ];

        foreach ($durations as $item) {
            Duration::firstOrCreate(['name' => $item['name']], ['seconds' => $item['seconds']]);
        }
    }
}
