<?php

use App\Http\Controllers\PushSubscriptionController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// PRESNÁ ROUTA, KTORÚ VOLÁ TVOJ FRONTEND (Opravuje chybu 405 a obnovuje synchronizáciu)
Route::post('/push-subscription', [PushSubscriptionController::class, 'store']);

// BEZPEČNÝ TESTOVACÍ ENDPOINT PRE ODOSLANIE NOTIFIKÁCIE
Route::get('/odpal-to-natvrdo', function () {
    // Vytiahne prvého usera, ktorý úspešne uložil odber do tabuľky user_push_subscriptions
    $user = User::has('pushSubscriptions')->first();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'V tabulke "user_push_subscriptions" zatial nie je ziadny riadok. Najprv klikni v appke!'
        ], 404);
    }

    // Inicializácia šifrovania s tvojím presným config/services.php
    $auth = [
        'VAPID' => [
            'subject'    => config('services.webpush.subject'),
            'publicKey'  => config('services.webpush.public_key'),
            'privateKey' => config('services.webpush.private_key'), // OPRAVENÉ: privateKey namiesto private_key
        ],
    ];

    $webPush = new WebPush($auth);

    // Payload, ktorý zachytí a spracuje tvoj sw.js
    $payload = json_encode([
        'notification' => [
            'title' => '⚠️ DISPEČING DPB',
            'body'  => 'Ostrý test push notifikácie bez skurvených balíčkov.',
            'icon'  => '/icon-512.png',
            'data'  => [
                'url' => '/'
            ]
        ]
    ]);

    // Zaradenie všetkých prehliadačov daného usera do frontu knižnice
    foreach ($user->pushSubscriptions as $sub) {
        $webPush->queueNotification(
            Subscription::create([
                'endpoint'  => $sub->endpoint,
                'publicKey' => $sub->p256dh, // tvoj reálny stĺpec z HeidiSQL
                'authToken' => $sub->auth,   // tvoj reálny stĺpec z HeidiSQL
            ]),
            $payload
        );
    }

    // Synchrónne odoslanie (vyhne sa akýmkolvek problemom s queue:work)
    $results = [];
    foreach ($webPush->flush() as $report) {
        $results[] = $report->isSuccess() 
            ? "Odoslané úspešne" 
            : "Zlyhalo: " . $report->getReason();
    }

    return response()->json([
        'success' => true,
        'vysledok' => $results
    ]);
});