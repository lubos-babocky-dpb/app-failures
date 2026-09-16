<?php
declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\Actions\User;

use Dpb\UserManager\Contracts\UserRepositoryInterface;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Symfony\Component\HttpFoundation\Response;

class DeleteAction
{
    public function __construct(
        private readonly ResponseFactory $responseFactory,
        private readonly AuthFactory $authFactory,
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function __invoke(
        string $userUuid
    ): Response {

        $currentUser = $this->authFactory
            ->guard('sanctuary_api')
            ->user()
            ?->activeSession
            ?->authenticatable ?? null;
        
        $user = $this->userRepository->findByUuid($userUuid);

        if (($currentUser?->uuid ?? '') === $userUuid) {
            return $this->responseFactory->json(
                data: [
                    'message' => 'You cannot delete yourself.',
                    'user' => $user->toArray()
                ],
                status: 403
            );
        } else {
            $user->delete();
            return $this->responseFactory->noContent();
        }
    }
}