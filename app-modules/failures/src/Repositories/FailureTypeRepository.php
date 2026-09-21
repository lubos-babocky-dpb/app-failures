<?php
declare(strict_types=1);
namespace Dpb\Failures\Repositories;

use Dpb\Failures\Contracts\FailureTypeRepositoryInterface;
use Dpb\Failures\Models\FailureType;
use Illuminate\Database\Eloquent\Collection;
use Override;

class FailureTypeRepository implements FailureTypeRepositoryInterface
{
    #[Override]
    public function readAll(): Collection
    {
        return FailureType::query()
            ->get();
    }
}