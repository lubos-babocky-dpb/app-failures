<?php

declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'personal_id' => $this->personal_id,

            'permissions' => $this->getAllPermissions()
                ->pluck('name')
                ->values()
                ->all(),
        ];
    }
}