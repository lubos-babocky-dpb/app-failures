<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class VehicleSyncController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $demoVehicles = [
            [
                'id' => 11,
                'code' => '1031',
                'type' => ['id' => 1, 'name' => 'Autobus'],
                'model' => ['id' => 1, 'name' => 'Irisbus Citelis 12']
            ],
            [
                'id' => 721,
                'code' => '7401',
                'type' => ['id' => 2, 'name' => 'Električka'],
                'model' => ['id' => 24, 'name' => 'Škoda 29T ForCity Plus']
            ],
            [
                'id' => 560,
                'code' => '6121',
                'type' => ['id' => 3, 'name' => 'Trolejbus'],
                'model' => ['id' => 17, 'name' => 'SOR TNS 12']
            ]
        ];

        return response()->json($demoVehicles);
    }
}