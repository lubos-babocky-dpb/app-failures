<?php
declare(strict_types=1);
namespace Dpb\Failures\Repositories;

use Dpb\Failures\Contracts\ReportableAssetRepositoryInterface;
use Dpb\Failures\Models\ReportableVehicle;
use Illuminate\Database\Eloquent\Collection;

class ReportableAssetRepository implements ReportableAssetRepositoryInterface
{
    public function findAll(): Collection
    {
        return ReportableVehicle::query()
            ->get();
    }
}