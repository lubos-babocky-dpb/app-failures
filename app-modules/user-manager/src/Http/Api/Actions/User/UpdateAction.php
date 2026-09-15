<?php
declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\Actions\User;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class UpdateAction
{
    public function __construct(
        private readonly ResponseFactory $responseFactory
    ) {}

public function __invoke(
    Request $request
): JsonResponse {

    $currentUser = Auth::guard('sanctuary_api')
        ->user()
        ->activeSession
        ->authenticatable;
    return $this->responseFactory->json($currentUser->toArray());
    }
}