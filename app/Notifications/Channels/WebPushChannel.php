<?php
namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class WebPushChannel
{
    protected WebPush $webPush;

    public function __construct()
    {
        // Objektová inicializácia protokolu s našou konfiguráciou
        $this->webPush = new WebPush([
            'VAPID' => [
                'subject' => config('services.webpush.subject'),
                'publicKey' => config('services.webpush.public_key'),
                'private_key' => config('services.webpush.private_key'),
            ],
        ]);
    }

    /**
     * Odoslanie notifikácie cez Laravel Notification systém.
     */
    public function send(mixed $notifiable, Notification $notification): void
    {
        // Overíme, či notifikácia implementuje potrebnú metódu pre náš kanál
        if (! method_exists($notification, 'toWebPush')) {
            return;
        }

        // Získame push odbery zamestnanca (vytvoríme si na to metódu na modeli)
        $subscriptions = $notifiable->routeNotificationFor('WebPush', $notification);

        if (empty($subscriptions)) {
            return;
        }

        $payload = json_encode($notification->toWebPush($notifiable));

        // Pripravíme hromadnú frontu správ pre push servery
        foreach ($subscriptions as $sub) {
            $webPushSubscription = Subscription::create([
                'endpoint' => $sub->endpoint,
                'publicKey' => $sub->p256dh,
                'authToken' => $sub->auth,
            ]);

            $this->webPush->queueNotification($webPushSubscription, $payload);
        }

        // Spracovanie odoslania
        foreach ($this->webPush->flush() as $report) {
            if (! $report->isSuccess() && $report->isExpired()) {
                // Ak je token exspirovaný (zamestnanec odinštaloval appku), vymažeme ho
                $notifiable->deletePushSubscription($report->getEndpoint());
            }
        }
    }
}