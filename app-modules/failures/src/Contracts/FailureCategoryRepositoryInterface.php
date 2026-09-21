<?php
declare(strict_types=1);
namespace Dpb\Failures\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface FailureCategoryRepositoryInterface
{
    public function readAll(): Collection;
}