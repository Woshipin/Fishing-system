<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TeamMember;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        TeamMember::firstOrCreate(
            ['name' => 'John Doe'],
            [
                'image' => 'team-members/john.jpg',
                'position' => 'Founder & CEO',
                'description' => 'John has over 20 years of experience in recreational fishing and hospitality.',
                'order' => 1
            ]
        );

        TeamMember::firstOrCreate(
            ['name' => 'Jane Smith'],
            [
                'image' => 'team-members/jane.jpg',
                'position' => 'Operations Manager',
                'description' => 'Jane ensures everything runs smoothly and guests have the best experience.',
                'order' => 2
            ]
        );
    }
}
