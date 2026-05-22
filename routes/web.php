<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 1. VŠETKY API ROUTY (Dáta pre PWA)
|--------------------------------------------------------------------------
| Tieto URL komunikujú cez JSON. Sem neskôr dopíšeš svoje Controllery.
*/
Route::prefix('api')->group(function () {
    Route::get('/vehicles', function () {
        // Ukážka: vráti zoznam vozidiel z DB pre formulár vo Vue
        return response()->json([
            ['id' => 1, 'name' => 'Električka Škoda 30T'],
            ['id' => 2, 'name' => 'Autobus SOR NS 12'],
        ]);
    });

    Route::post('/failures', function () {
        // Sem bude Dexie z mobilu strieľať offline nahlásené poruchy
        return response()->json(['success' => true]);
    });
});

/*
|--------------------------------------------------------------------------
| 2. SPA FALLBACK ROUTE (Štartovací bod pre Vue)
|--------------------------------------------------------------------------
| Akákoľvek webová URL príde (či už domovská /, alebo /historia pri F5),
| Laravel ju nezlyhá na 404-ke, ale vráti túto jednu Blade šablónu.
| Vue Router si už potom URL v prehliadači rozparsuje offline sám.
*/
Route::fallback(function () {
    return view('pwa');
});