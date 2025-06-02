<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TableNumber;

class TableNumberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $numbers = ['A1', 'A2', 'B1', 'B2'];

        foreach ($numbers as $number) {
            TableNumber::firstOrCreate(['number' => $number]);
        }
    }
}
