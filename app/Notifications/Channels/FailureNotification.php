<?php
namespace App\Notifications;

use App\Notifications\Channels\WebPushChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class FailureNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $title,
        protected string $message
    ) {}

    /**
     * Definujeme náš vlastný čistý WebPush kanál.
     */
    public function via(mixed $notifiable): array
    {
        return [WebPushChannel::class];
    }

    /**
     * Štruktúra dát, ktorú spracuje náš kanál a pošle do PWA.
     */
    public function toWebPush(mixed $notifiable): array
    {
        return [
            'notification' => [
                'title' => $this->title,
                'body' => $this->message,
                'icon' => '/assets/icons/icon-192x192.png',
                'badge' => '/assets/icons/badge-72x72.png',
                'data' => [
                    'url' => '/dispecing/spravy'
                ]
            ]
        ];
    }
}