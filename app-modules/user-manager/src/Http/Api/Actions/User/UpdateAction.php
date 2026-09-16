<?php
declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\Actions\User;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;


class UpdateAction
{
    public function __construct(
        private readonly ResponseFactory $responseFactory
    ) {}

public function __invoke(
    Request $request,
    string $uuid
): JsonResponse {
    return $this->responseFactory->json([
        'test' => 'OK',
        'uuid' => $uuid,
        'delta' => $request->all()
    ]);

    $currentUser = Auth::guard('sanctuary_api')
        ->user()
        ->activeSession
        ->authenticatable;
    return $this->responseFactory->json($currentUser->toArray());
    }
}