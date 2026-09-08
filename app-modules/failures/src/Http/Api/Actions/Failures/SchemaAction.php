<?php
declare(strict_types=1);
namespace Dpb\Failures\Http\Api\Actions\Failures;

use Dpb\Failures\Http\Api\Actions\BaseSingleActionController;
use Dpb\Failures\Http\Api\Requests\Failures\FailuresListRequest;
use Dpb\Failures\Models\FailureCategory;
use Dpb\Failures\Models\FailureType;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SchemaAction extends BaseSingleActionController
{
    public function __invoke(
        FailuresListRequest $request
    ): JsonResponse {
        return $this->renderJsonResponse(
            responseData: [
                'categories' => FailureCategory::query()
                    ->get(['id', 'parent_id', 'name', 'path', 'alias_of'])
                    ->toArray(),
                'failures' => FailureType::query()
                    ->get(['id', 'category_id', 'name', 'path'])
                    ->toArray(),
                'acl_rules' => DB::table('dpb_failures_map_reportableacl')
                    ->get(),
            ]
        );
    }
}