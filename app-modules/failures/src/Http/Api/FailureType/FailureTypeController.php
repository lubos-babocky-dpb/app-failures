<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\FailureType;

use Dpb\Failures\Contracts\FailureTypeRepositoryInterface;

class FailureTypeController
{
    public function __construct(
        private readonly FailureTypeRepositoryInterface $failureTypeRepository
    ) {}
    public function readAction()
    {
        return FailureTypeResource::collection($this->failureTypeRepository->readAll());
    }
}