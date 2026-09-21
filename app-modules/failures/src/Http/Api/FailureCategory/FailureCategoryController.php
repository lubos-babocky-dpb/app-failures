<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\FailureCategory;

use Dpb\Failures\Contracts\FailureCategoryRepositoryInterface;

class FailureCategoryController
{
    public function __construct(
        private readonly FailureCategoryRepositoryInterface $failureCategoryRespository
    ) {}

    public function readAction(

    ) {
        return FailureCategoryResource::collection($this->failureCategoryRespository->readAll());
    }
}