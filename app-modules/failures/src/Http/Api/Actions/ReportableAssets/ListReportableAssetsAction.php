<?php

namespace Dpb\Failures\Http\Api\Actions\ReportableAssets;

use Dpb\Failures\Models\ReportableVehicle;
use Illuminate\Http\JsonResponse;

class ListReportableAssetsAction
{
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(
            data: ReportableVehicle::query()
                ->where('is_active', true)
                ->get()
                ->map(fn (ReportableVehicle $vehicle) => $this->transformData($vehicle)),
            status: 200
        );
    }

    private function transformData(
        ReportableVehicle $vehicle
    ): array {
        return [
            'id' => $vehicle->id,
            'code' => $vehicle->code,
            'type' => [
                'id' => $vehicle->type_id,
                'name' => $vehicle->type_name
            ],
            'model' => [
                'id' => $vehicle->model_id,
                'name' => $vehicle->model_name
            ]
        ];
    }
}