<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

final class AuthController
{
    public function __construct(
        private readonly ResponseFactory $response,
    ) {
    }

    public function login(
        Request $request
    ): JsonResponse {
        $credentials = $request->validate([
            'personal_id' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()
            ->where('personal_id', $credentials['personal_id'])
            ->first();

        if (
            $user === null
            || !Hash::check($credentials['password'], $user->password)
        ) {
            return $this->response->json([
                'message' => 'Nesprávne prihlasovacie údaje.',
            ], 422);
        }

        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            return $this->response->json([
                'message' => 'Nemáte oprávnenie na prístup do administrácie.',
            ], 403);
        }

        $token = $user->createToken(
            'admin',
            ['admin'],
        )->plainTextToken;

        return $this->response->json([
            'success' => true,
            'token' => $token,
        ]);
    }

    public function me(
        Request $request
    ): JsonResponse {
        $user = $request->user('admin_api');
        return $this->response->json([
            'user' => $user,
            'roles' => $user->getRoleNames(),
        ]);
    }

    public function logout(
        Request $request
    ): JsonResponse {
        $token = $request->user('admin_api')?->currentAccessToken();

        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        return $this->response->json([
            'success' => true,
        ]);
    }
}