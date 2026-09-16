<?php

declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\Actions\User;

use App\Models\User;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class CreateAction
{
    public function __construct(
        private readonly ResponseFactory $responseFactory,
        private readonly Hasher $hasher
    ) {}

    public function __invoke(
        Request $request
    ): JsonResponse {
        $userData = $request->validate([
            'user.uuid' => ['required', 'uuid'],
            'user.name' => ['required', 'string'],
            'user.email' => ['required', 'email', 'unique:users,email'],
            'user.personal_id' => ['required', 'string'],
        ])['user'];

        $user = User::create([
            'uuid' => $userData['uuid'],
            'name' => $userData['name'],
            'email' => $userData['email'],
            'personal_id' => $userData['personal_id'],
            'password' => $this->hasher->make('0000'),
        ]);

        return $this->responseFactory
            ->json(data: ['user' => $user->toArray()], status: 201);
    }
}