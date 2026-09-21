<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\FailureType;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

class FailureTypeResource extends JsonResource
{
    #[Override]
    public function toArray(
        Request $request
    ) {
        return [
            'uuid' => $this->uuid,
            'category_uuid' => $this->category?->uuid,
            'name' => $this->name,
            'path' => $this->path,
        ];
    }
}