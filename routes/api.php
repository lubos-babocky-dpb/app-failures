<?php

use App\Http\Controllers\Api\SendTestPushController;
use Illuminate\Support\Facades\Route;


Route::get('/push/send-test', SendTestPushController::class);
Route::middleware('auth:sanctuary_api')->group(function () {
});
