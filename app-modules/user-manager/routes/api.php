<?php
declare(strict_types=1);

use Dpb\Sanctuary\Middleware\PermissionMiddleware;
use Dpb\UserManager\Http\Api\Actions\User\CreateAction;
use Dpb\UserManager\Http\Api\Actions\User\DeleteAction;
use Dpb\UserManager\Http\Api\Actions\User\ReadAction;
use Dpb\UserManager\Http\Api\Actions\User\UpdateAction;
use Illuminate\Support\Facades\Route;

define('GUARD', 'sanctuary_api');

Route::middleware(PermissionMiddleware::using('model.user.read', GUARD))
    ->get('user', ReadAction::class);

Route::middleware(PermissionMiddleware::using('model.user.delete', GUARD))
    ->delete('user/{userUuid}', DeleteAction::class);

Route::middleware(PermissionMiddleware::using('model.user.create', GUARD))
    ->post('user', CreateAction::class);

Route::middleware(PermissionMiddleware::using('model.user.update', GUARD))
    ->patch('user/{userUuid}', UpdateAction::class);