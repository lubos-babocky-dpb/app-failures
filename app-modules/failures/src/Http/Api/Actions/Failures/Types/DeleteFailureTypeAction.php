<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures\Types;

use Dpb\Failures\Models\FailureType;
use Illuminate\Http\JsonResponse;

class DeleteFailureTypeAction
{
    public function __invoke(string $uuid): JsonResponse
    {
        $failureType = FailureType::query()
            ->where('uuid', $uuid)
            ->firstOrFail();

        $failureType->delete();

        return response()->json([
            'data' => [
                'uuid' => $uuid,
            ],
        ]);
    }
}