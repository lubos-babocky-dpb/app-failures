<?php
declare(strict_types=1);

namespace Dpb\UserManager\Repositories;

use App\Models\User;
use Dpb\UserManager\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Override;

class UserRepository implements UserRepositoryInterface
{
    public function findAll(): Collection
    {
        return User::query()
            ->with(['permissions', 'roles', 'roles.permissions'])
            ->get();
    }

    public function findByUuid(
        string $uuid
    ): User {
        return User::query()
            ->where(column: 'uuid', operator: '=', value: $uuid)
            ->firstOrFail();
    }

    #[Override]
    public function create(
        array $userData
    ): User {
        return User::create($userData);
    }

    public function update(
        User $user
    ): void {
        $user->save();
    }

    public function delete(
        User $user
    ): void {
        $user->delete();
    }
}