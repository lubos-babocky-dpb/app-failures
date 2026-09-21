<?php
declare(strict_types=1);
namespace Dpb\Failures\Repositories;

use Dpb\Failures\Contracts\FailureCategoryRepositoryInterface;
use Dpb\Failures\Models\FailureCategory;
use Illuminate\Database\Eloquent\Collection;
use Override;

class FailureCategoryRepository implements FailureCategoryRepositoryInterface
{
    #[Override]
    public function readAll(): Collection
    {
        return FailureCategory::query()
            ->get();
    }
}