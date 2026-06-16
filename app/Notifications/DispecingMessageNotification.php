<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class DispecingMessageNotification extends Notification
{
    use Queueable;

    private string $title;
    private string $body;
    private string $url;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $title, string $body, string $url = '/')
    {
        $this->title = $title;
        $this->body = $body;
        $this->url = $url;
    }

    /**
     * Smerovanie notifikácie.
     */
    public function via(object $notifiable): array
    {
        $this->sendWebPush($notifiable);

        return ['database'];
    }

    /**
     * Odoslanie push správy s presným mapovaním tvojho config/services.php
     */
    private function sendWebPush(object $notifiable): void
    {
        $subscriptions = $notifiable->pushSubscriptions;

        if ($subscriptions->isEmpty()) {
            return;
        }

        // TUTO ŤAHÁME PRESNÉ NÁZVY Z TVOJHO CONFIGU
        $auth = [
            'VAPID' => [
                'subject'   => config('services.webpush.subject'),
                'publicKey' => config('services.webpush.public_key'),
                'private_key' => config('services.webpush.private_key'),
            ],
        ];

        $webPush = new WebPush($auth);

        $payload = json_encode([
            'notification' => [
                'title' => $this->title,
                'body'  => $this->body,
                'icon'  => '/icon-512.png',
                'data'  => [
                    'url' => $this->url
                ]
            ]
        ]);

        foreach ($subscriptions as $sub) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint'  => $sub->endpoint,
                    'publicKey' => $sub->p256dh, 
                    'authToken' => $sub->auth,   
                ]),
                $payload
            );
        }

        foreach ($webPush->flush() as $report) {
            if (!$report->isSuccess() && $report->isSubscriptionExpired()) {
                $notifiable->pushSubscriptions()
                    ->where('endpoint', $report->getEndpoint())
                    ->delete();
            }
        }
    }

    /**
     * Záloha pre database kanál.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'body' => $this->body,
        ];
    }
}