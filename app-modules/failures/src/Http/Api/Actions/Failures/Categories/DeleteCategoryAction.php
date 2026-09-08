<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures\Categories;

use Dpb\Failures\Models\FailureCategory;
use Illuminate\Http\JsonResponse;

class DeleteCategoryAction
{
    public function __invoke(
        string $uuid
    ): JsonResponse {
        $category = FailureCategory::query()
            ->where('uuid', $uuid)
            ->firstOrFail();

        $category->delete();

        return response()->json([
            'data' => [
                'uuid' => $uuid,
            ],
        ]);
    }
}