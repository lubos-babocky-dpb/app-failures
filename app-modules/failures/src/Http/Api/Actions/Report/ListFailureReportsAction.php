<?php
namespace Dpb\Failures\Http\Api\Actions\Report;

use Dpb\Failures\Models\FailureReport;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class ListFailureReportsAction
{
    public function __construct(
        private readonly ResponseFactory $response
    ) {}

    public function __invoke(
        Request $request
    ) {
        $failureReports = FailureReport::query()
            ->orderBy('id')
            ->get()
            ->map(static function (FailureReport $report): array {
                return [
                    'uuid' => $report->uuid,
                    'failureType' => $report->failureType->uuid,
                    'reportableAsset' => $report->reportable->uuid,
                    'note' => $report->note,
                    'status' => $report->status,
                    'client_created_at' => $report->client_created_at
                ];
            });
        return $this->response->json($failureReports);
    }
}