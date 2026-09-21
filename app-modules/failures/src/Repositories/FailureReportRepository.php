<?php
declare(strict_types=1);
namespace Dpb\Failures\Repositories;

use Dpb\Failures\Contracts\FailureReportRepositoryInterface;
use Dpb\Failures\Models\FailureReport;
use Illuminate\Database\Eloquent\Collection;
use Override;

class FailureReportRepository implements FailureReportRepositoryInterface
{
    #[Override]
    public function readAll(): Collection
    {
        return FailureReport::query()
            ->with(['reportable'])
            ->get();
    }
}