<?php

namespace Dpb\Failures\Providers;

use Dpb\Failures\Http\Middleware\RequireRole;
use Dpb\Failures\Models\ReportableVehicle;
use Dpb\Failures\Models\User;
use Dpb\Failures\Observers\ReportableVehicleObserver;
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
        $this->mergeConfigFrom(
            __DIR__.'/../../config/failures.php', 'failures'
        );
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