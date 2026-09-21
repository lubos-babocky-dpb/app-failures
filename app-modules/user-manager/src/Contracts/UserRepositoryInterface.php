<?php
declare(strict_types=1);
namespace Dpb\UserManager\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function findAll(): Collection;
    public function findByUuid(string $uuid): User;
    public function create(array $userData): User;
    public function update(User $user): void;
    public function delete(User $user): void;
}