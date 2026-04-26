<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $docTypes = ['project', 'surat', 'berita', 'perjanjian', 'nda'];
        $docActions = ['view', 'create', 'update', 'delete'];

        $permissions = [];

        foreach ($docTypes as $type) {
            foreach ($docActions as $action) {
                $permissions[] = "{$type}.{$action}";
            }
        }

        $permissions = array_merge($permissions, [
            'snapshot.create',
            'snapshot.restore',
            'snapshot.delete',
            'activity.view',
            'activity.delete',
            'export.pdf',
            'export.html',
            'export.json',
            'user.manage',
            'logo.manage',
        ]);

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions(Permission::all());

        $editor = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        $editor->syncPermissions([
            ...$this->allDocPermissions($docTypes),
            'snapshot.create',
            'snapshot.restore',
            'activity.view',
            'export.pdf',
            'export.html',
            'export.json',
        ]);

        $viewer = Role::firstOrCreate(['name' => 'viewer', 'guard_name' => 'web']);
        $viewer->syncPermissions([
            ...$this->viewOnlyDocPermissions($docTypes),
            'activity.view',
            'export.pdf',
            'export.html',
            'export.json',
        ]);
    }

    private function allDocPermissions(array $types): array
    {
        $actions = ['view', 'create', 'update', 'delete'];
        $out = [];

        foreach ($types as $type) {
            foreach ($actions as $action) {
                $out[] = "{$type}.{$action}";
            }
        }

        return $out;
    }

    private function viewOnlyDocPermissions(array $types): array
    {
        return array_map(fn ($type) => "{$type}.view", $types);
    }
}
