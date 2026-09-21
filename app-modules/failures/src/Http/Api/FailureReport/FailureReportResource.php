<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\FailureReport;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

class FailureReportResource extends JsonResource
{
    #[Override]
    public function toArray(
        Request $request
    ) {
        return [
            'uuid' => $this->uuid,
            'failureType' => $this->failureType->uuid,
            'reportableAsset' => $this->reportable->uuid,
            'note' => $this->note,
            'status' => $this->status,
            'clientCreatedAt' => $this->client_created_at
        ];
    }
}