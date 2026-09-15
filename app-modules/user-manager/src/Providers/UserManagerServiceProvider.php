<?php
declare(strict_types=1);
namespace Dpb\UserManager\Providers;

use App\Models\User;
use Dpb\UserManager\Observers\UserObserver;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class UserManagerServiceProvider extends ServiceProvider
{
    public function register() {

    }

    public function boot() {
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        $this->registerRoutes();
        $this->registerObservers();
    }

    protected function registerRoutes(): void
    {
        Route::prefix('api/user-manager/v1')
            ->middleware(['auth:sanctuary_api'])
            ->group(__DIR__ . '/../../routes/api.php');
    }

    private function registerObservers(): void{
        User::observe(UserObserver::class);
    }
}