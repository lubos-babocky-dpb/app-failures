<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class SendTestPushController
{
    public function __invoke(
        Request $request
    ): JsonResponse {
        $webPush = new WebPush([
            'VAPID' => [
                'subject' => config('services.webpush.subject'),
                'publicKey' => config('services.webpush.public_key'),
                'privateKey' => config('services.webpush.private_key'),
            ],
        ]);

        $payload = json_encode([
            'type' => $request->input(
                'type',
                'sync-user-manager-data'
            ),
        ]);

        $pushSubscriptions = DB::table('dpb_sanctuary_model_ghostpushsubscription')
            ->get();

        if ($pushSubscriptions->isEmpty()) {
            return response()->json([
                'error' => 'No push subscriptions registered',
            ], 404);
        }

        foreach ($pushSubscriptions as $pushSubscription) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $pushSubscription->endpoint,
                    'keys' => [
                        'p256dh' => $pushSubscription->p256dh,
                        'auth' => $pushSubscription->auth,
                    ],
                ]),
                $payload
            );
        }

        $reports = [];

        foreach ($webPush->flush() as $report) {
            $response = $report->getResponse();

            $reports[] = [
                'success' => $report->isSuccess(),
                'endpoint' => $report->getEndpoint(),
                'status' => $response?->getStatusCode(),
                'reason' => $report->getReason(),
                'expired' => $report->isSubscriptionExpired(),
                'response' => $report->getResponseContent(),
            ];
        }

        return response()->json([
            'payload' => $payload,
            'subscriptions' => $pushSubscriptions->count(),
            'sent' => collect($reports)->where('success', true)->count(),
            'failed' => collect($reports)->where('success', false)->count(),
            'reports' => $reports,
        ]);
    }
}