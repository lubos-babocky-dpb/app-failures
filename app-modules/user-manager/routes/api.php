<?php
declare(strict_types=1);

use Dpb\Sanctuary\Middleware\PermissionMiddleware;
use Dpb\UserManager\Http\Api\User\UserController;
use Illuminate\Support\Facades\Route;

define('GUARD', 'sanctuary_api');

/**/
Route::middleware(PermissionMiddleware::using('model.user.read', GUARD))
    ->get('user', [UserController::class, 'readAction']);
/**/
Route::middleware(PermissionMiddleware::using('model.user.delete', GUARD))
    ->delete('user/{userUuid}', [UserController::class, 'deleteAction']);

Route::middleware(PermissionMiddleware::using('model.user.create', GUARD))
    ->post('user', [UserController::class, 'createAction']);

Route::middleware(PermissionMiddleware::using('model.user.update', GUARD))
    ->patch('user/{userUuid}', [UserController::class, 'updateAction']);