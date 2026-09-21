<?php

namespace Dpb\Failures\Providers;

use Dpb\Failures\Contracts\FailureCategoryRepositoryInterface;
use Dpb\Failures\Contracts\FailureReportRepositoryInterface;
use Dpb\Failures\Contracts\FailureTypeRepositoryInterface;
use Dpb\Failures\Contracts\ReportableAssetRepositoryInterface;
use Dpb\Failures\Models\ReportableVehicle;
use Dpb\Failures\Observers\ReportableVehicleObserver;
use Dpb\Failures\Repositories\FailureCategoryRepository;
use Dpb\Failures\Repositories\FailureReportRepository;
use Dpb\Failures\Repositories\FailureTypeRepository;
use Dpb\Failures\Repositories\ReportableAssetRepository;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class FailuresServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../../config/failures.php', 'failures');

        $this->app->bind(FailureCategoryRepositoryInterface::class, FailureCategoryRepository::class);
        $this->app->bind(FailureTypeRepositoryInterface::class, FailureTypeRepository::class);
        $this->app->bind(FailureReportRepositoryInterface::class, FailureReportRepository::class);
        $this->app->bind(ReportableAssetRepositoryInterface::class, ReportableAssetRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(
        Router $router
    ): void {
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        $this->registerRoutes();
        $this->registerObservers();
    }

    /**
     * Register the unified package API routes.
     * Guarding is moved to the routing file for fine-grained control (guest vs auth).
     */
    private function registerRoutes(): void
    {
        Route::prefix('api/failures')
            ->middleware(['api'])
            ->group(__DIR__ . '/../../routes/api.php');
    }

    private function registerObservers(): void{
        ReportableVehicle::observe(ReportableVehicleObserver::class);
    }
}