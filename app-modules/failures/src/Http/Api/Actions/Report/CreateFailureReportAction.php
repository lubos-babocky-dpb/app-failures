<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Report;

use Dpb\Failures\Enums\FailureReportStatus;
use Dpb\Failures\Models\FailureReport;
use Dpb\Failures\Models\FailureType;
use Dpb\Sanctuary\Models\Ghost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use InvalidArgumentException;

class CreateFailureReportAction
{
    public function __construct(
        private readonly ResponseFactory $response
    ) {}

    public function __invoke(
        Request $request
    ): JsonResponse
    {
        $failureReportData = $request->input('failureReport');
        dd($failureReportData);
        $failureType = FailureType::query()
            ->where(column: 'uuid', operator: '=', value: $failureReportData['failureType']['uuid'])
            ->first();

        FailureReport::create([
            'uuid' => $failureReportData['uuid'] ?? throw new InvalidArgumentException('Missing uuid'),
            'user_id' => $request->user()?->activeSession?->authenticatable?->id ?? null,
            'ghost_id'=> $request->user()?->id ?? throw new InvalidArgumentException('ghost_id can not be null!!!'),
            'failure_type_id' => $failureType->id,
            'reportable_type' => 'reportable_asset',
            'reportable_id' => $failureReportData['reportableAsset']['id'] ?? throw new InvalidArgumentException('Missing reportableAsset.id'),
            'note' => $failureReportData['note'] ?? '',
            'status' => FailureReportStatus::RECEIVED->value,
            'client_created_at' => $failureReportData['createdAt']
        ]);
        return $this->response->json(['ok']);
    }
}