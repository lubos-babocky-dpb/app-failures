<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures\Categories;

use Dpb\Failures\Models\FailureCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CreateCategoryAction
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'parent_uuid' => ['nullable', 'uuid', 'exists:dpb_failures_model_failurecategory,uuid'],
        ]);

        $parent = null;

        if ($validated['parent_uuid'] ?? null) {
            $parent = FailureCategory::query()
                ->where('uuid', $validated['parent_uuid'])
                ->firstOrFail();
        }

        $category = new FailureCategory();
        $category->uuid = (string) Str::uuid();
        $category->name = $validated['name'];
        $category->parent_id = $parent?->id;
        $category->path = null;
        $category->save();

        $category->path = $parent
            ? $parent->path . $category->id . '/'
            : '/' . $category->id . '/';

        $category->save();

        return response()->json([
            'data' => [
                'uuid' => $category->uuid,
                'parent_uuid' => $parent?->uuid,
                'name' => $category->name,
                'path' => $category->path,
                'alias_of' => null,
            ],
        ], 201);
    }
}