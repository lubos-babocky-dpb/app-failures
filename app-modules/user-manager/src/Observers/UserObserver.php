<?php
declare(strict_types=1);
namespace Dpb\UserManager\Observers;

use App\Models\User;
use Dpb\Sanctuary\Events\WebPushMessage;
use Dpb\UserManager\Events\UsersChangedEvent;
use Illuminate\Contracts\Events\Dispatcher;

class UserObserver
{
    public function __construct(
        private readonly Dispatcher $dispatcher
    ) {}

    public function created(
        User $user
    ): void {
        WebPushMessage::dispatch('sync-user-manager-data');
        $this->dispatcher->dispatch(new UsersChangedEvent());
    }

    public function updated(
        User $user
    ): void {
        $this->dispatcher->dispatch(new UsersChangedEvent());
    }

    public function deleted(
        User $user
    ): void {
        $this->dispatcher->dispatch(new UsersChangedEvent());
    }
}