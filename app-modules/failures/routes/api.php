<?php

use Dpb\Failures\Http\Api\Actions\Failures\Categories\CreateCategoryAction;
use Dpb\Failures\Http\Api\Actions\Failures\Categories\DeleteCategoryAction;
use Dpb\Failures\Http\Api\Actions\Failures\Types\CreateFailureTypeAction;
use Dpb\Failures\Http\Api\Actions\Failures\Types\DeleteFailureTypeAction;
use Dpb\Failures\Http\Api\Actions\Report\CreateFailureReportAction;
use Dpb\Failures\Http\Api\Actions\Report\ListFailureReportsAction;
use Dpb\Failures\Http\Api\FailureCategory\FailureCategoryController;
use Dpb\Failures\Http\Api\FailureReport\FailureReportController;
use Dpb\Failures\Http\Api\FailureType\FailureTypeController;
use Dpb\Failures\Http\Api\ReportableAsset\ReportableAssetController;
use Dpb\Sanctuary\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Decoupled Failures Module API Routes
|--------------------------------------------------------------------------
| Root URL Prefix: failures-api/v1/ (Injected globally via FailuresServiceProvider)
| Security Schema: Dynamic Bearer token matrix isolated per package
*/

Route::prefix('v1')
    ->middleware('auth:sanctuary_api')
    ->group(function (): void {
        Route::get('/reportable-asset', [ReportableAssetController::class, 'readAction']);
        Route::get('/failure-category', [FailureCategoryController::class, 'readAction']);
        Route::get('/failure-type', [FailureTypeController::class, 'readAction']);
        Route::get('/failure-report', [FailureReportController::class, 'readAction']);

        //[LB:] Old routes:
        Route::post('/failure-report', CreateFailureReportAction::class);
        //[LB:] Protected routes:
        Route::middleware(RoleMiddleware::using('admin'))
            ->group(function() {
                Route::post('/categories', CreateCategoryAction::class);
                Route::delete('/categories/{uuid}', DeleteCategoryAction::class);
                Route::post('/types', CreateFailureTypeAction::class);
                Route::delete('/types/{uuid}', DeleteFailureTypeAction::class);
            });
    });