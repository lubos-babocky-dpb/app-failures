<?php
declare(strict_types=1);
namespace Dpb\UserManager\Http\Api\User;

use Dpb\UserManager\Contracts\UserRepositoryInterface;
use Exception;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Factory;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController
{
    public function __construct(
        private readonly ResponseFactory $responseFactory,
        private readonly UserRepositoryInterface $userRepository,
        private readonly Factory $authFactory
    ) {}

    public function createAction(
        Request $request
    ): JsonResponse {
        $userData = $request->validate([
            'user.uuid' => ['required', 'uuid'],
            'user.name' => ['required', 'string'],
            'user.email' => ['required', 'email', 'unique:users,email'],
            'user.personal_id' => ['required', 'string'],
        ])['user'];

        $userData['password'] = '0000';
        $newUser = $this->userRepository->create($userData);

        return $this->responseFactory
            ->json(
                data: new UserResource($newUser),
                status: 201
            );
    }

    public function readAction()
    {
        return UserResource::collection($this->userRepository->findAll());
    }

    public function updateAction(
        string $userUuid,
        Request $request
    ) {
        $userData = $request->validate(
            rules: [
                'delta.name' => ['sometimes', 'required', 'string'],
                'delta.email' => ['sometimes', 'required', 'email', "unique:users,email,$userUuid,uuid"],
                'delta.personal_id' => ['sometimes', 'required', 'string'],
            ]
        )['delta'];

        $user = $this->userRepository->findByUuid($userUuid);
        $user->fill($userData);

        $this->userRepository->update($user);

        return new UserResource($user);
    }

    public function deleteAction(
        string $userUuid
    ) {
        try {
            if($this->getCurrentUser()?->uuid === $userUuid) {
                throw new Exception('You cannot delete yourself.');
            }
            $this->userRepository->delete($this->userRepository->findByUuid($userUuid));
            return $this->responseFactory->noContent();
        } catch(Exception $ex) {
            return $this->responseFactory->json(
                data: ['message' => $ex->getMessage()],
                status: 403
            );
        }
    }

    private function getCurrentUser(): Authenticatable|null
    {
        return $this->authFactory
            ->guard('sanctuary_api')
            ->user()
            ?->activeSession
            ?->authenticatable ?? null;
    }
}
