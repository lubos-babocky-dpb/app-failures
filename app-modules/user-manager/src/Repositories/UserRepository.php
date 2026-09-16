<?php
declare(strict_types=1);

namespace Dpb\UserManager\Repositories;

use App\Models\User;
use Dpb\UserManager\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
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