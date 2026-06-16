<?php

use App\Http\Controllers\Api\FailureCategoryController;
use App\Http\Controllers\Api\FailureReportController;
use App\Http\Controllers\Api\UserHandshakeController;
use App\Http\Controllers\Api\VehicleSyncController;
use App\Http\Controllers\Api\PushSubscriptionController; // 1. PRIDANÝ IMPORT
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// 2. PRIDANÁ TRASA: Pre ukladanie push tokenov z app.js (fetch smeruje na /api/push-subscription)
Route::post('/push-subscription', PushSubscriptionController::class);

Route::prefix('v1')->group(function () {
    Route::prefix('sync')->group(function () {
        Route::get('/vehicles', VehicleSyncController::class);
        Route::get('/categories', FailureCategoryController::class);
    });
    
    // Endpoints for vehicle failures
    Route::post('/failures/store', [FailureReportController::class, 'store']);
    
    // 3. OPRAVENÉ: Zmenené z GET /failures/statuses na POST /failures/check-statuses, aby to sedelo s IndexedDB sync
    Route::post('/failures/statuses', [FailureReportController::class, 'checkStatuses']);
    
    Route::post('/user/handshake', UserHandshakeController::class);
});

Route::get('v1/data', fn() => response()->json([
    'status' => 'success',
    'message' => 'Dáta boli úspešne načítané',
    'payload' => [
        'id' => 1,
        'name' => 'Momo'
    ]
]));