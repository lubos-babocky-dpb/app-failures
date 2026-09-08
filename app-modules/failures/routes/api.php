<?php

use Dpb\Failures\Http\Api\Actions\Failures\Categories\CreateCategoryAction;
use Dpb\Failures\Http\Api\Actions\Failures\Categories\DeleteCategoryAction;
use Dpb\Failures\Http\Api\Actions\Failures\Categories\ListCategoriesAction;
use Dpb\Failures\Http\Api\Actions\Failures\Types\CreateFailureTypeAction;
use Dpb\Failures\Http\Api\Actions\Failures\Types\DeleteFailureTypeAction;
use Dpb\Failures\Http\Api\Actions\Failures\Types\ListFailureTypesAction;
use Dpb\Failures\Http\Api\Actions\Report\CreateFailureReportAction;
use Dpb\Failures\Http\Api\Actions\Report\ListFailureReportsAction;
use Dpb\Failures\Http\Api\Actions\ReportableAssets\ListReportableAssetsAction;
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
        Route::get('/reportable-asset', ListReportableAssetsAction::class);
        Route::get('/failure-category', ListCategoriesAction::class);        
        Route::get('/failure-type', ListFailureTypesAction::class);
        Route::get('/failure-report', ListFailureReportsAction::class);
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