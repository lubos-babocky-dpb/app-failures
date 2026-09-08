<?php
namespace Dpb\Failures\Http\Api\Actions\Auth;

use Dpb\Failures\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HandshakeAction {
    public function __invoke(
        Request $request
    ): JsonResponse {
        try {
            $validated = $request->validate([
                'device_uuid' => 'required|uuid',
            ]);

            $user = User::firstOrCreate(
                ['uuid' => $validated['device_uuid']],
                [
                    'name' => 'Nepriradený vodič',
                    'personal_number' => null,
                    'department_code' => null,
                    'department_name' => null,
                ]
            );

            return response()->json([
                'uuid' => $user->uuid,
                'fullName' => $user->name,
                'personalNumber' => $user->personal_number,
                'department' => [
                    'code' => $user->department_code,
                    'name' => $user->department_name,
                ]
            ]);
        } catch(Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}