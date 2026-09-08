<?php
declare(strict_types=1);
namespace Dpb\Failures\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ReportablesChanged implements ShouldBroadcastNow
{
    public function broadcastOn(): array
    {
        return [
            new Channel('reportables')
        ];
    }

    public function broadcastAs(): string
    {
        return 'reportables.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => 'Reportables changed',
        ];
    }
}