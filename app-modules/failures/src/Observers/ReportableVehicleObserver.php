<?php
declare(strict_types=1);
namespace Dpb\Failures\Observers;

use Dpb\Failures\Events\ReportablesChanged;
use Dpb\Failures\Models\ReportableVehicle;
use Illuminate\Contracts\Events\Dispatcher;

class ReportableVehicleObserver
{
    public function __construct(
        private readonly Dispatcher $dispatcher
    ) {}
    public function created(
        ReportableVehicle $reportableVehicle
    ): void {
        $this->dispatcher->dispatch(new ReportablesChanged());
    }

    public function updated(
        ReportableVehicle $reportableVehicle
    ): void {
        $this->dispatcher->dispatch(new ReportablesChanged());
    }

    public function deleted(
        ReportableVehicle $reportableVehicle
    ): void {
        $this->dispatcher->dispatch(new ReportablesChanged());
    }
}