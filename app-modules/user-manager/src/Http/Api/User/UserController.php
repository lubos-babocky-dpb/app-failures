<?php
declare(strict_types=1);
namespace Dpb\UserManager\Http\Api\User;

use Dpb\UserManager\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Routing\ResponseFactory;

class UserController
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function readAction()
    {
        return UserResource::collection($this->userRepository->findAll());
    }
}
