<?php
declare(strict_types=1);

namespace Dpb\UserManager\Http\Api\Actions\User;

use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;

use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Http\JsonResponse;

class DeleteAction
{
    public function __construct(
        private readonly ResponseFactory $responseFactory,
        private readonly AuthFactory $authFactory
    ) {}

    public function __invoke(
        string $userUuid
    ): JsonResponse {
        return $this->responseFactory->json(['x' => $this->authFactory->guard('sanctuary_api')->user()->activeSession->authenticatable->uuid]);
        $currentUser = Auth::guard('sanctuary_api')
            ->user()
            ->activeSession
            ->authenticatable;

        if ($currentUser->uuid === $userUuid) {
            abort(403, 'You cannot delete yourself.');
        }

        User::where(column: 'uuid', operator: '=', value: $userUuid, boolean: 'and')
            ->firstOrFail()
            ->delete();

        return $this->responseFactory->noContent();
    }
}