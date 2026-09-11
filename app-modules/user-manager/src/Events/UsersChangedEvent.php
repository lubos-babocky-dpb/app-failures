<?php
declare(strict_types=1);
namespace Dpb\UserManager\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UsersChangedEvent implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [
            new Channel('users')
        ];
    }

    public function broadcastAs(): string
    {
        return 'users.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => 'Users changed',
        ];
    }
}