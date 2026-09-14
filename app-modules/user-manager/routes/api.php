<?php
declare(strict_types=1);

use Dpb\Sanctuary\Middleware\PermissionMiddleware;
use Dpb\UserManager\Http\Api\Actions\User\DeleteAction;
use Dpb\UserManager\Http\Api\Actions\User\ReadAction;
use Illuminate\Support\Facades\Route;

Route::middleware(PermissionMiddleware::using('model.user.read', 'sanctuary_api'))
    ->get('users', ReadAction::class);

Route::middleware(PermissionMiddleware::using('model.user.delete', 'sanctuary_api'))
    ->delete('user/{userUuid}', DeleteAction::class);