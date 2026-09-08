<?php
namespace Dpb\Failures\Http\Api\Concerns;

use Exception;
trait HasRequestAuthorization {
    public function authorize(): bool
    {
        return $this->user() !== null;
    }
}