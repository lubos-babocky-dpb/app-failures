<?php

declare(strict_types=1);

namespace Dpb\AdminUiVue\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class AdminUiVueServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'admin-ui');

        Route::middleware(['web'])
            ->prefix('admin')
            ->group(function (): void {
                $this->loadRoutesFrom(__DIR__ . '/../../routes/web.php');
            });
    }
}