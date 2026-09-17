<?php
declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\Actions\User;

use Dpb\UserManager\Contracts\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;

class UpdateAction
{
    public function __construct(
        private readonly ResponseFactory $responseFactory,
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function __invoke(
        Request $request,
        string $uuid
    ): JsonResponse {
        $user = $this->userRepository->findByUuid($uuid);
        $user->fill($request->input('delta', []));
        $user->save();

        return $this->responseFactory->json(['userResource' => $user->fresh()->toArray()]);
    }
}