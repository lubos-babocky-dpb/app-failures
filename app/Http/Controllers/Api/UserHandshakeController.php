<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserHandshakeController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid',
        ]);

        // Find existing user or create a temporary device skeleton record
        $user = User::firstOrCreate(
            ['uuid' => $validated['uuid']],
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
    }
}