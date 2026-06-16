<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PushSubscriptionController extends Controller
{
    /**
     * Zaregistruje alebo aktualizuje push odber podľa tvojej presnej DB štruktúry.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'endpoint'    => ['required', 'string'],
            'keys.p256dh' => ['required', 'string'],
            'keys.auth'   => ['required', 'string'],
            'user_uuid'   => ['required', 'string'],
        ]);

        $user = User::query()->where('uuid', $validated['user_uuid'])->first();

        // Autogen pre localhost, ak v DB ešte nemáš zhodné UUID, nech ti to nepadá na 404
        if ($user === null) {
            $user = new User();
            $user->uuid = $validated['user_uuid'];
            $user->name = 'Testovací Vodič (Autogen)';
            $user->email = 'pwa-' . Str::random(5) . '@dpb.sk';
            $user->password = bcrypt(Str::random(16));
            $user->save();
        }

        // Zápis s tvojimi stĺpcami z databázy
        $user->pushSubscriptions()->updateOrCreate(
            ['endpoint' => $validated['endpoint']],
            [
                'p256dh' => $validated['keys']['p256dh'],
                'auth'   => $validated['keys']['auth'],
            ]
        );

        return new JsonResponse([
            'success' => true,
            'message' => 'Odber notifikácií bol úspešne uložený do tvojej tabuľky.',
        ], 200);
    }
}