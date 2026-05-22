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
    public function store(Request $request): JsonResponse
    {
        // Validate incoming payload from the PWA application
        $validated = $request->validate([
            'vehicle_id' => 'required|integer',
            'user_uuid' => 'required|uuid',
            'category_id' => 'required|string',
            'note' => 'nullable|string',
            'photo' => 'nullable|string', // Expecting base64 encoded string from PWA
            'created_at' => 'required|date'
        ]);

        $photoPath = null;

        // Handle base64 photo upload if present
        if (!empty($validated['photo']) && Str::startsWith($validated['photo'], 'data:image')) {
            try {
                $imageStream = explode(',', $validated['photo']);
                $decodedImage = base64_decode($imageStream[1]);
                
                // Determine file extension
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

        // Insert the processed report directly into the database
        $failure = VehicleFailure::create([
            'vehicle_id' => $validated['vehicle_id'],
            'user_uuid' => $validated['user_uuid'],
            'category_id' => $validated['category_id'],
            'note' => $validated['note'],
            'photo_path' => $photoPath,
            'client_created_at' => $validated['created_at'],
            'status' => 'odoslané'
        ]);

        // Return standard response with the actual database primary key
        return response()->json([
            'status' => 'success',
            'message' => 'Failure report synchronized and saved.',
            'id' => $failure->id
        ], 201);
    }

    /**
     * Get current statuses of all failures for a specific device.
     */
    public function checkStatuses(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_uuid' => 'required|uuid',
        ]);

        $failures = VehicleFailure::query()
            ->where(column: 'user_uuid', operator: '=', value: $validated['user_uuid'], boolean: 'and')
            ->get(['id', 'status']);

        return response()->json($failures);
    }
}