<?php

use App\Http\Controllers\PushSubscriptionController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use App\Http\Controllers\Api\FailureReportController;

/*
|--------------------------------------------------------------------------
| API Routes - V1 API pre poruchy
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function (): void {
    
    // 1. Endpoint pre ukladanie offline porúch od vodičov (POST)
    Route::post('/failures/store', [FailureReportController::class, 'store']);
    
    // 2. Endpoint pre kontrolu aktuálnych statusov porúch pre zariadenie (POST)
    Route::post('/failures/check-statuses', [FailureReportController::class, 'checkStatuses']);
    
});

// PRESNÁ ROUTA, KTORÚ VOLÁ TVOJ FRONTEND (Opravuje chybu 405 a obnovuje synchronizáciu)
Route::post('/push-subscription', [PushSubscriptionController::class, 'store']);

Route::get('/v1/vapid-key', function () {
    return response()->json([
        'publicKey' => config('services.webpush.public_key')
    ]);
});

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
            'title' => '🚨 NOVÁ PORUCHA!',
            'body'  => 'Na linke A nastal skrat. Okamžite prever situáciu.',
            'icon'  => '/images/icon-192x192.png',
            'badge' => '/images/badge-72x72.png',
            
            // --- TU DEFINUJEŠ SPRÁVANIE PRE TELEFÓN ---
            'importance'         => 'high',        // Vysoká dôležitosť pre zobrazenie banneru
            'priority'           => 2,             // Maximálna priorita pre staršie Androidy
            'vibrate'            => [200, 100, 200], // Mobil MUSÍ zavibrovať/pípnuť, inak vyskakovacie okno nespustí
            'requireInteraction' => true,          // Notifikácia nezmizne sama, kým ju nezmažeš
            'tag'                => 'porucha-alarm', // Ak príde nová, prepíše starú a znova vyskočí
            
            'data' => [
                'url' => '/poruchy/detail/123'    // URL, ktorú potom spracuje tvoj Service Worker pri kliknutí
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