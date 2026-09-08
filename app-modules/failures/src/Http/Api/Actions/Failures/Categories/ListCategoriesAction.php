<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures\Categories;

use Dpb\Failures\Models\FailureCategory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class ListCategoriesAction
{
    public function __construct(
        private readonly ResponseFactory $response
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $categories = FailureCategory::query()
            ->with(['parent' => fn (BelongsTo $query) => $query->withTrashed()])
            ->orderBy('path')
            ->orderBy('id')
            ->get()
            ->map(static function (FailureCategory $category): array {
                return [
                    'uuid' => $category->uuid,
                    'parent_uuid' => $category->parent?->uuid,
                    'name' => $category->name,
                    'path' => $category->path,
                    'alias_of' => $category->aliasOf?->uuid,
                ];
            });
        return $this->response->json($categories);
    }
}