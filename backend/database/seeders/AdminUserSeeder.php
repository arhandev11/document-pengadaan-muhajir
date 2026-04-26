<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('12341234'),
                'email_verified_at' => now(),
            ],
        );

        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        $editor = User::updateOrCreate(
            ['email' => 'admin1@test.com'],
            [
                'name' => 'Editor Demo',
                'password' => Hash::make('12341234'),
                'email_verified_at' => now(),
            ],
        );

        if (! $editor->hasRole('editor')) {
            $editor->assignRole('editor');
        }

        $viewer = User::updateOrCreate(
            ['email' => 'admin2@test.com'],
            [
                'name' => 'Viewer Demo',
                'password' => Hash::make('12341234'),
                'email_verified_at' => now(),
            ],
        );

        if (! $viewer->hasRole('viewer')) {
            $viewer->assignRole('viewer');
        }
    }
}
