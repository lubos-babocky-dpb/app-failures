<?php
namespace Dpb\Failures\Http\Api\Actions;

use Illuminate\Http\JsonResponse;

class BaseSingleActionController
{
    protected function renderJsonResponse(
        array $responseData,
        int $statusCode = 200
    ): JsonResponse {
        return new JsonResponse(
            data: $responseData,
            status: $statusCode
        );
    }
}