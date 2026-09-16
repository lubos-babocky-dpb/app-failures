<?php
declare(strict_types=1);
namespace Dpb\UserManager\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findByUuid(string $uuid): User;
    public function delete(User $user): void;
}