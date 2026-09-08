<?php

namespace Dpb\Failures\Http\Api\Actions\Report;

use Dpb\Failures\Enums\FailureReportStatus;
use Dpb\Failures\Http\Api\Requests\Report\StoreReportRequest;
use Dpb\Failures\Models\FailureReport;
use Dpb\Failures\Models\ReportableVehicle;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class StoreAction
{
    public function __invoke(
        StoreReportRequest $request
    ): JsonResponse {
        $validated = $request->validated();
        $synchronizedUuids = [];
        foreach ($validated['failures'] as $failureData) {
            $failureData['user_uuid'] = $request->user()->getUuid();
            $uuid = $failureData['uuid'];

            if ($this->isSynced($uuid)) {
                $synchronizedUuids[] = $uuid;
                continue;
            }

            try {
                $this->createVehicleFailure(data: $failureData);
                $synchronizedUuids[] = $uuid;
            } catch (Exception $ex) {
                Log::error("Failed to insert failure report {$uuid}: " . $ex->getMessage());
            }
        }

        return new JsonResponse(
            data: [
                'status' => 'success',
                'synchronized' => $synchronizedUuids
            ],
            status: 201
        );
    }

    /**
     * Check if the report already exists in the database.
     */
    private function isSynced(
        string $uuid
    ): bool {
        return FailureReport::query()
            ->where('uuid', $uuid)
            ->exists();
    }

    /**
     * Persist a single failure report record into the database.
     */
    private function createVehicleFailure(
        array $data
    ): FailureReport {
        return FailureReport::create([
            'uuid' => $data['uuid'],
            'user_uuid' => $data['user_uuid'],
            'failure_type_id' => $data['failure_type_id'],
            'reportable_type' => ReportableVehicle::class,
            'reportable_id' => 11,
            'note' => $data['note'] ?? null,
            'client_created_at' => $data['client_created_at'],
            'status' => FailureReportStatus::RECEIVED
        ]);
    }
}