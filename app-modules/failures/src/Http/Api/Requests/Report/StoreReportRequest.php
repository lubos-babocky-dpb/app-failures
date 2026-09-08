<?php
namespace Dpb\Failures\Http\Api\Requests\Report;

use Dpb\Failures\Http\Api\Requests\BaseRequest;
use Dpb\Failures\Models\FailureType;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\Rules\Unique;

class StoreReportRequest extends BaseRequest
{
    /**
     * @return array<string, array<int, string|Exists|Unique>>
     */
    public function rules(): array
    {
        return [
            'failures' => ['required', 'array', 'min:1'],
            'failures.*.uuid' => ['required', 'uuid'],
            'failures.*.failure_type_id' => [
                'required', 
                'integer', 
                Rule::exists((new FailureType())->getTable(), 'id')
            ],
            'failures.*.note' => ['nullable', 'string'],
            'failures.*.client_created_at' => ['required', 'date'],
        ];
    }
}