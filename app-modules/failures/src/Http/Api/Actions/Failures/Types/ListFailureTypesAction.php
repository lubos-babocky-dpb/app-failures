<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures\Types;

use Dpb\Failures\Models\FailureType;
use Illuminate\Http\JsonResponse;

class ListFailureTypesAction
{
    public function __invoke(): JsonResponse
    {
        $failureTypes = FailureType::query()
            ->with([
                'category:id,uuid',
            ])
            ->orderBy('path')
            ->orderBy('id')
            ->get()
            ->map(static function (FailureType $failureType): array {
                return [
                    'uuid' => $failureType->uuid,
                    'category_uuid' => $failureType->category?->uuid,
                    'name' => $failureType->name,
                    'path' => $failureType->path,
                ];
            });

        return response()->json($failureTypes);
    }
}