<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\FailureReport;

use Dpb\Failures\Contracts\FailureReportRepositoryInterface;

class FailureReportController
{
    public function __construct(
        private readonly FailureReportRepositoryInterface $failureReportRepository
    ) {}

    public function readAction() {
        return FailureReportResource::collection($this->failureReportRepository->readAll());
    }
}