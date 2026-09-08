<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures\Types;

use Dpb\Failures\Models\FailureCategory;
use Dpb\Failures\Models\FailureType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CreateFailureTypeAction
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_uuid' => [
                'required',
                'uuid',
                'exists:dpb_failures_model_failurecategory,uuid',
            ],
        ]);

        $category = FailureCategory::query()
            ->where('uuid', $validated['category_uuid'])
            ->firstOrFail();

        $failureType = new FailureType();
        $failureType->uuid = (string) Str::uuid();
        $failureType->category_id = $category->id;
        $failureType->name = $validated['name'];
        $failureType->path = $category->path;
        $failureType->save();

        return response()->json([
            'data' => [
                'uuid' => $failureType->uuid,
                'category_uuid' => $category->uuid,
                'name' => $failureType->name,
                'path' => $failureType->path,
            ],
        ], 201);
    }
}