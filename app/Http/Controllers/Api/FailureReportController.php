<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleFailure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FailureReportController extends Controller
{
    /**
     * Endpoint for receiving offline reports submitted by drivers.
     */
    public function store(
        Request $request
    ): JsonResponse {
        // REMOVED: unique rule from uuid validation to support idempotent retries
        $validated = $request->validate([
            'uuid' => 'required|uuid',
            'vehicle_id' => 'required|integer',
            'user_uuid' => 'required|uuid',
            'category_id' => 'required|string',
            'note' => 'nullable|string',
            'photo_path' => 'nullable|string',
            'client_created_at' => 'required|date'
        ]);

        // Check if this failure record was already saved during a previous network attempt
        $existingFailure = VehicleFailure::query()
            ->where(
                column: 'uuid',
                operator: '=',
                value: $validated['uuid']
            )
            ->first();

        if ($existingFailure) {
            return response()->json([
                'status' => 'success',
                'message' => 'Failure report already synchronized previously.',
                'uuid' => $existingFailure->uuid
            ], 200); // Return 200 OK instead of 422 validation failure
        }

        $photoPath = null;

        // Handle base64 photo upload if present
        if (!empty($validated['photo_path']) && Str::startsWith($validated['photo_path'], 'data:image')) {
            try {
                $imageStream = explode(',', $validated['photo_path']);
                $decodedImage = base64_decode($imageStream[1]);
                
                $extension = 'jpg';
                if (Str::contains($imageStream[0], 'png')) {
                    $extension = 'png';
                }

                $fileName = 'failures/' . Str::uuid() . '.' . $extension;
                Storage::disk('public')->put($fileName, $decodedImage);
                $photoPath = Storage::url($fileName);
            } catch (\Exception $e) {
                Log::error('Failed to process base64 failure photo: ' . $e->getMessage());
            }
        }

        // Insert the processed report directly into the database mapping sync UUID
        $failure = VehicleFailure::create([
            'uuid' => $validated['uuid'],
            'vehicle_id' => $validated['vehicle_id'],
            'user_uuid' => $validated['user_uuid'],
            'category_id' => $validated['category_id'],
            'note' => $validated['note'],
            'photo_path' => $photoPath ?? $validated['photo_path'],
            'client_created_at' => $validated['client_created_at'],
            'status' => 'odoslané'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Failure report synchronized and saved.',
            'uuid' => $failure->uuid
        ], 201);
    }

    /**
     * Get current statuses of all failures for a specific device.
     */
    public function checkStatuses(
        Request $request
    ): JsonResponse {
        $validated = $request->validate([
            'user_uuid' => 'required|uuid',
        ]);

        dd($validated);

        $failures = VehicleFailure::query()
            ->where(column: 'user_uuid', operator: '=', value: $validated['user_uuid'], boolean: 'and')
            ->get(['uuid', 'status']);

        return response()->json($failures);
    }
}