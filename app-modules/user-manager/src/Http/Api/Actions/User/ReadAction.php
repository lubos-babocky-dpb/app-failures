<?php
declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\Actions\User;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class ReadAction
{
    public function __invoke(): JsonResponse
    {
        $users = User::query()
            ->with([
                'permissions:id,name',
                'roles:id,name',
                'roles.permissions:id,name',
            ])
            ->get()
            ->map(fn (User $user) => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'personal_id' => $user->personal_id,

                'permissions' => $user
                    ->getAllPermissions()
                    ->pluck('name')
                    ->values()
                    ->all(),
            ]);

        return new JsonResponse($users);
    }
}