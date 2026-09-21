<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\ReportableAsset;

use Dpb\Failures\Contracts\ReportableAssetRepositoryInterface;

class ReportableAssetController
{
    public function __construct(
        private readonly ReportableAssetRepositoryInterface $reportableAssetRepository
    ) {}

    public function readAction()
    {
        return ReportableAssetResource::collection($this->reportableAssetRepository->findAll());
    }
}