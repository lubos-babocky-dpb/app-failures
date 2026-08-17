<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 1. VŠETKY API ROUTY (Dáta pre PWA)
|--------------------------------------------------------------------------
*/
Route::prefix('api')->group(function () {
    Route::get('/vehicles', function () {
        return response()->json([
            ['id' => 1, 'name' => 'Električka Škoda 30T'],
            ['id' => 2, 'name' => 'Autobus SOR NS 12'],
        ]);
    });

    Route::post('/failures', function () {
        return response()->json(['success' => true]);
    });
});

/*
|--------------------------------------------------------------------------
| 2. DOČASNÁ ROUTA PRE NOVÝ SVET (Modulárny Monolit)
|--------------------------------------------------------------------------
| Ak URL začína na /pwa-new, vždy vrátime nový template. Vue Router vnútri 
| modular-app.js si už tú zvyšnú časť (napr. /history) spracuje sám.
*/
Route::get('/pwa-new/{any?}', function () {
    return view('modular-monolith-pwa');
})->where('any', '.*');

/*
|--------------------------------------------------------------------------
| 3. STARÝ SPA FALLBACK ROUTE (Pôvodná aplikácia)
|--------------------------------------------------------------------------
| Všetko ostatné, čo nie je API a nezačína na /pwa-new, spadne sem 
| a načíta starú aplikáciu. Vďaka tomu ti produkcia stále beží.
*/
Route::fallback(function () {
    return view('pwa');
});