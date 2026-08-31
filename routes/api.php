<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

Route::post('/push/test', function (Request $request) {
    $subscription = $request->validate([
        'endpoint' => ['required', 'string'],
        'keys.p256dh' => ['required', 'string'],
        'keys.auth' => ['required', 'string'],
    ]);

    cache()->put('test_push_subscription', $subscription, now()->addHour());

    return response()->json([
        'success' => true,
    ]);
});

Route::post('/push/send-test', function (Request $request) {

    $data = cache()->get('test_push_subscription');

    if (!$data) {
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
        'endpoint' => $data['endpoint'],
        'keys' => [
            'p256dh' => $data['keys']['p256dh'],
            'auth' => $data['keys']['auth'],
        ],
    ]);

    $webPush->queueNotification(
        $subscription,
        json_encode(['type' => $request->input('type', 'sync-reportable-assets')])
    );

    foreach ($webPush->flush() as $report) {
        return response()->json([
            'success' => $report->isSuccess(),
            'reason' => $report->getReason(),
        ]);
    }

    return response()->json([
        'error' => 'Push was not sent'
    ], 500);
});