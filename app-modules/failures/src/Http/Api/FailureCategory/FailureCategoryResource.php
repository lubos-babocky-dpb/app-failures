<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\FailureCategory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

class FailureCategoryResource extends JsonResource
{
    #[Override]
    public function toArray(
        Request $request
    ) {
        return [
            'uuid' => $this->uuid,
            'parent_uuid' => $this->parent?->uuid,
            'name' => $this->name,
            'path' => $this->path,
            'alias_of' => $this->aliasOf?->uuid,
        ];
    }
}