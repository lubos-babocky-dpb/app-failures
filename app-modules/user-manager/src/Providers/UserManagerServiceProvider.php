<?php
declare(strict_types=1);
namespace Dpb\UserManager\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
class UserManagerServiceProvider extends ServiceProvider
{
    public function register() {

    }

    public function boot() {
        $this->registerRoutes();
    }

    protected function registerRoutes(): void
    {
        // Enforcing the failures-api/v1 root prefix without strict global lockouts
        Route::prefix('api/user-manager/v1')
            ->middleware(['auth:sanctuary_api'])
            ->group(__DIR__ . '/../../routes/api.php');
    }
}