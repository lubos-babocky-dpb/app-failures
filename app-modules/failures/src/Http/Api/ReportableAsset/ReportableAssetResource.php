<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\ReportableAsset;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

class ReportableAssetResource extends JsonResource
{
    #[Override]
    public function toArray(
        Request $request
    ): array {
        return [
            'uuid' => $this->uuid,
            'code' => $this->code,
            'type' => [
                'id' => $this->type_id,
                'name' => $this->type_name
            ],
            'model' => [
                'id' => $this->model_id,
                'name' => $this->model_name
            ]
        ];
    }
}