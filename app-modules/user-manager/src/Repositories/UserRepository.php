<?php
declare(strict_types=1);

namespace Dpb\UserManager\Repositories;

use App\Models\User;
use Dpb\UserManager\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function findAll(): Collection
    {
        return User::query()
            ->with(['permissions:uuid', 'roles:uuid', 'roles.permissions:uuid'])
            ->get();
    }

    public function findByUuid(
        string $uuid
    ): User {
        return User::query()
            ->where(column: 'uuid', operator: '=', value: $uuid)
            ->firstOrFail();
    }

    public function delete(
        User $user
    ): void {
        $user->delete();
    }
}