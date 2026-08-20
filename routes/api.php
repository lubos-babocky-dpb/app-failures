<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('sync')->group(function () {
        Route::get('/vehicles', fn() => response()->json([]));
        Route::get('/categories', fn() => response()->json([]));
    });
});