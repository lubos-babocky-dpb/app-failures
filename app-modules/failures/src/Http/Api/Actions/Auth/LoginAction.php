<?php 
namespace Dpb\Failures\Http\Api\Actions\Auth;

use Dpb\Failures\Models\User;
use Illuminate\Auth\RequestGuard;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Guard;

class LoginAction {

    public function __invoke(
        Request $request
    ): JsonResponse {
        $credentials = $request->validate([
            'personal_number' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        /** @var RequestGuard|Guard */
        $guard = Auth::guard(config('failures.auth_guard'));

        // Locate the user record using the detached provider abstraction layers
        /** @var User */
        $user = $guard->getProvider()->retrieveByCredentials(['personal_number' => $credentials['personal_number']]);

        // Validate the incoming password against the secure cryptographic hash contract
        if (! $user || ! $guard->getProvider()->validateCredentials($user, $credentials)) {
            throw ValidationException::withMessages([
                'personal_number' => [__('auth.failed')],
            ]);
        }

        // Issue a fully stateless Sanctum Bearer token for the PWA client environment
        $tokenName = config('failures.token_name');
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'uuid' => $user->getUuid(),
                'personal_number' => $user->getPersonalNumber(),
                'name' => $user->getName(),
            ],
        ]);
    }
}