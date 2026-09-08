<?php

namespace Dpb\Failures\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Dpb\Failures\Models\FailureReport;

class FailureImageController extends Controller
{
    /**
     * Securely stream the binary image file for Service Worker caching and Frontend display.
     */
    public function show(
        string $reportUuid,
        string $imageUuid
    ): BinaryFileResponse|JsonResponse {
        // 1. Locate the report by external UUID using database index
        /** @var FailureReport */
        $report = FailureReport::where('uuid', $reportUuid)->first();

        if (!$report) {
            return response()->json(['error' => 'Failure report not found.'], 404);
        }

        // 2. Locate the image ensuring strict relational integrity via relationship
        $image = $report->images()->where('uuid', $imageUuid)->first();

        if (!$image) {
            return response()->json(['error' => 'Image not found for this report.'], 404);
        }

        // 3. Verify physical existence of the file in storage
        if (!Storage::disk('local')->exists($image->file_path)) {
            return response()->json(['error' => 'Physical file missing on server.'], 404);
        }

        $absolutePath = Storage::disk('local')->path($image->file_path);

        // 4. Return binary file stream with appropriate cache control headers
        return response()->file($absolutePath, [
            'Content-Type' => $image->mime_type,
            'Cache-Control' => 'private, max-age=31536000', // Optimizes SW background sync validation
        ]);
    }
}