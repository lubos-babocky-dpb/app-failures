<?php

namespace App\Observers;

use App\Models\VehicleFailure;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VehicleFailureObserver
{
    /**
     * Spustí sa automaticky po úspešnom zápise do dpb_vehicle_failures.
     */
    public function created(VehicleFailure $vehicleFailure): void
    {
        $auth = [
            'VAPID' => [
                'subject'    => 'mailto:babocky@gmail.com',
                'publicKey'  => config('services.webpush.public_key'),
                'privateKey' => config('services.webpush.private_key'),
            ],
        ];

        $webPush = new WebPush($auth);
        $webPush->setReuseVAPIDHeaders(true);

        // 1. Vytiahneme dáta priamo z tvojej tabuľky 'user_push_subscriptions'
        $subscriptionsData = DB::table('user_push_subscriptions')->get();

        if ($subscriptionsData->isEmpty()) {
            return;
        }

        // 2. Zostavíme payload z tvojich fillable stĺpcov
        $payload = json_encode([
            'notification' => [
                'title'              => '🚨 Nová porucha vozidla',
                'body'               => $vehicleFailure->note ?? 'Bez bližšieho popisu.',
                'icon'               => '/images/icon-192x192.png',
                'badge'              => '/images/badge-72x72.png',
                'importance'         => 'high',
                'priority'           => 2,
                'vibrate'            => [200, 100, 200, 100, 200],
                'requireInteraction' => true,
                'tag'                => 'failure-' . $vehicleFailure->uuid,
                'data'               => [
                    'url' => '/history/detail/' . $vehicleFailure->uuid
                ]
            ]
        ]);

        // 3. Nabúchame odbery do fronty podľa tvojich skutočných stĺpcov z DB
        foreach ($subscriptionsData as $sub) {
            if (empty($sub->endpoint)) {
                continue;
            }

            $subscription = Subscription::create([
                'endpoint'        => $sub->endpoint,
                'publicKey'       => $sub->p256dh,
                'authToken'       => $sub->auth,
                'contentEncoding' => 'aesgcm', // Štandardné kódovanie pre moderné pushky
            ]);

            $webPush->queueNotification($subscription, $payload);
        }

        // 4. Odpálenie na servery
        foreach ($webPush->flush() as $report) {
            if (!$report->isSuccess()) {
                Log::warning("WebPush zlyhal pre endpoint: " . $report->getEndpoint());
                
                // Ak je token starý/neplatný (používateľ zakázal notifikácie), rovno ho premažeme, nech čistíme DB
                DB::table('user_push_subscriptions')
                    ->where('endpoint', '=', $report->getEndpoint())
                    ->delete();
            }
        }
    }
}