<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class SendTestPushController
{
    public function __invoke(
        Request $request
    ): JsonResponse {

        $ghostPushSubscription = $request->user()?->pushSubscriptions->last();

        if(empty($ghostPushSubscription)) {
            return response()->json([
                'error' => 'No push subscription registered',
            ], 404);
        }


        $webPush = new WebPush([
            'VAPID' => [
                'subject' => config('services.webpush.subject'),
                'publicKey' => config('services.webpush.public_key'),
                'privateKey' => config('services.webpush.private_key'),
            ],
        ]);

        $subscription = Subscription::create([
            'endpoint' => $ghostPushSubscription->endpoint,
            'keys' => [
                'p256dh' => $ghostPushSubscription->p256dh,
                'auth' => $ghostPushSubscription->auth,
            ],
        ]);

        $webPush->queueNotification(
            $subscription,
            json_encode([
                'type' => $request->input(
                    'type',
                    'sync-reportable-assets'
                ),
            ])
        );

        foreach ($webPush->flush() as $report) {
            return response()->json([
                'success' => $report->isSuccess(),
                'reason' => $report->getReason(),
            ]);
        }

        return response()->json([
            'error' => 'Push was not sent',
        ], 500);
    }
}