<?php

use App\Http\Controllers\Api\SendTestPushController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctuary_api')->group(function () {
    Route::post('/push/send-test', SendTestPushController::class);
});
