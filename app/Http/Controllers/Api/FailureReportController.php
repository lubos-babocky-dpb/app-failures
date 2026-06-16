<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleFailure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FailureReportController extends Controller
{
    /**
     * Zariadi spracovanie požiadavky od vodiča.
     * Prijme Base64, uloží ho na disk a do DB zapíše len textovú cestu.
     */
    public function store(Request $request): JsonResponse 
    {
        logger()->info(__METHOD__ . ' called');
        $validated = $request->validate([
            'uuid' => 'required|uuid',
            'vehicle_id' => 'required|integer',
            'user_uuid' => 'required|uuid',
            'category_id' => 'required|string',
            'note' => 'nullable|string',
            'photo' => 'nullable|string', 
            'client_created_at' => 'required|date'
        ]);

        $existingFailure = VehicleFailure::query()
            ->where(column: 'uuid', operator: '=', value: $validated['uuid'])
            ->first();

        if ($existingFailure) {
            return response()->json([
                'status' => 'success',
                'message' => 'Failure report already synchronized previously.',
                'uuid' => $existingFailure->uuid
            ], 200);
        }

        $photoPathForDb = null;

        // Ak prichádza validný Base64 stream, spracujeme ho na lokálny disk
        if (!empty($validated['photo']) && Str::startsWith($validated['photo'], 'data:image')) {
            try {
                $imageStream = explode(',', $validated['photo']);
                $decodedImage = base64_decode($imageStream[1]);
                
                $extension = 'jpg';
                if (Str::contains($imageStream[0], 'png')) {
                    $extension = 'png';
                }

                $fileName = 'failures/' . Str::uuid() . '.' . $extension;
                
                // Zápis surových binárnych dát na lokálny public disk
                Storage::disk('public')->put($fileName, $decodedImage);
                
                // Do DB pôjde iba URL cesta, napr. "/storage/failures/uuid.jpg"
                $photoPathForDb = Storage::url($fileName);
            } catch (\Exception $e) {
                Log::error('Failed to process base64 failure photo: ' . $e->getMessage());
            }
        }

        // Vďaka validnému SQL zápisu prebehne transakcia úspešne a odpáli sa VehicleFailureObserver
        $failure = VehicleFailure::create([
            'uuid' => $validated['uuid'],
            'vehicle_id' => $validated['vehicle_id'],
            'user_uuid' => $validated['user_uuid'],
            'category_id' => $validated['category_id'],
            'note' => $validated['note'] ?? null,
            'photo_path' => $photoPathForDb, 
            'client_created_at' => $validated['client_created_at'],
            'status' => 'odoslané'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Failure report synchronized and saved.',
            'uuid' => $failure->uuid
        ], 201);
    }

    /**
     * Vytiahne stavy porúch pre vodiča.
     * Načíta cestu z DB, vytiahne súbor z disku a pre PWA ho transformuje na Base64 dáta.
     */
    public function checkStatuses(Request $request): JsonResponse 
    {
        $validated = $request->validate([
            'user_uuid' => 'required|uuid',
        ]);

        $failures = VehicleFailure::query()
            ->where(column: 'user_uuid', operator: '=', value: $validated['user_uuid'], boolean: 'and')
            ->get([
                'uuid', 
                'status', 
                'vehicle_id', 
                'category_id', 
                'note', 
                'photo_path', 
                'created_at'
            ]);

        $transformedFailures = $failures->map(function (VehicleFailure $failure) {
            $base64PhotoStream = null;

            if ($failure->photo_path) {
                // Odstránime prefix '/storage/', aby sme získali čistú relatívnu cestu voči public disku
                $cleanPath = str_replace('/storage/', '', $failure->photo_path);

                if (Storage::disk('public')->exists($cleanPath)) {
                    $fileContent = Storage::disk('public')->get($cleanPath);
                    
                    if ($fileContent !== false) {
                        $extension = strtolower(pathinfo($cleanPath, PATHINFO_EXTENSION));
                        $mimeType = ($extension === 'png') ? 'image/png' : 'image/jpeg';
                        
                        // Dynamicky skomponujeme Base64 dátový URI prúd pre PWA klienta
                        $base64PhotoStream = 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
                    }
                }
            }

            return [
                'uuid' => $failure->uuid,
                'status' => $failure->status,
                'vehicle_id' => $failure->vehicle_id,
                'category_id' => $failure->category_id,
                'note' => $failure->note,
                'created_at' => $failure->created_at->toIso8601String(),
                'photo' => $base64PhotoStream, 
            ];
        });

        return response()->json($transformedFailures->toArray());
    }
}