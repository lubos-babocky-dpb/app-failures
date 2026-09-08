<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures\FailureReports;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class ListFailureTypesAction
{
    public function __construct(
        private readonly ResponseFactory $response
    ) {}

    public function __invoke(
        Request $request
    ): JsonResponse {
        return $this->response->json([
            'data' => []
        ]);
    }
}