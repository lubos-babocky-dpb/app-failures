<?php

namespace Dpb\Failures\Http\Api\Actions\Report;

use App\Models\VehicleFailure;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadImageAction
{
    public function __invoke(
        Request $request,
        string $uuid
    ): JsonResponse {
        $responseData = [
            'status' => 'success',
            'message' => 'Photo uploaded and attached successfully.',
            'photo_url' => null
        ];
        $responseCode = 201;

        try {
            $request->validate([
                'photo' => 'required|image|max:10240',
            ]);

            $failure = VehicleFailure::query()
                ->where('uuid', $uuid)
                ->firstOrFail();

            $file = $request->file('photo');
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $fileName = sprintf('failures/%s.%s', Str::uuid(), $extension);
            
            Storage::disk('public')->putFileAs(
                path: 'failures',
                file: $file,
                name: basename($fileName)
            );

            $photoUrl = Storage::url($fileName);
            $failure->update([
                'photo_path' => $photoUrl
            ]);

            $responseData['photo_url'] = $photoUrl;

        } catch (Exception $ex) {
            Log::error("Failed to upload photo for failure report {$uuid}: " . $ex->getMessage());
            
            $responseData = [
                'status' => 'error',
                'message' => $ex->getMessage()
            ];

            $responseCode = $ex->getCode() >= 400 && $ex->getCode() <= 505 ? $ex->getCode() : 400;
        } finally {
            return new JsonResponse(
                data: $responseData,
                status: $responseCode
            );
        }
    }
}