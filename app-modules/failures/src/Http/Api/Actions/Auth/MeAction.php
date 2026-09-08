<?php
namespace Dpb\Failures\Http\Api\Actions\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Laravel\Sanctum\PersonalAccessToken;

class MeAction {
    public function __invoke(
        Request $request
    ): JsonResponse {
        dd($request);
        /** @var PersonalAccessToken */
        $token = $request->user()->currentAccessToken();
        $token->delete();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}