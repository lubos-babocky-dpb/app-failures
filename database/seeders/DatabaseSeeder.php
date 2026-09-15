<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            'users',
            'model_has_permissions',
            'model_has_roles',
            'role_has_permissions',
            'permissions',
            'roles',
        ];

        Schema::disableForeignKeyConstraints();

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->truncate();
            }
        }

        Schema::enableForeignKeyConstraints();

        $user = User::create([
            'uuid' => Str::uuid(),
            'name' => 'Admin',
            'email' => 'admin@dpb.sk',
            'personal_id' => '99999',
            'password' => Hash::make('0000'),
        ]);

        $roles = [];

        foreach ([
            'super-admin',
            'admin',
            'driver',
        ] as $roleName) {
            $roles[$roleName] = Role::create([
                'name' => $roleName,
                'guard_name' => 'sanctuary_api',
            ]);
        }

        $permissions = [];

        foreach ([
            'page-access.user-management',
            'page-access.failures',
            'page-access.failure-reports',
            'model.user.create',
            'model.user.read',
            'model.user.update',
            'model.user.delete',
        ] as $permissionName) {
            $permissions[$permissionName] = Permission::create([
                'name' => $permissionName,
                'guard_name' => 'sanctuary_api',
            ]);
        }

        $allPermissions = array_values($permissions);

        $roles['super-admin']->syncPermissions($allPermissions);
        $roles['admin']->syncPermissions($allPermissions);

        $user->assignRole($roles['admin']);
    }
}