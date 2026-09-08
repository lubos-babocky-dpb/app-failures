<?php

namespace Dpb\Failures\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FailureRulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $typeMapping = [
            'A' => 1,
            'E' => 2,
            'T' => 3,
        ];

        $failureTypes = DB::table('dpb_failures_model_failuretype')->get();

        foreach ($failureTypes as $failureType) {
            $assignedVehicleTypes = $this->getVehicleTypesForFailure($failureType->name);

            foreach ($assignedVehicleTypes as $typeLetter) {
                if (isset($typeMapping[$typeLetter])) {
                    DB::table('dpb_failures_map_reportableacl')->insert([
                        'failure_type_id' => $failureType->id,
                        'type_id'         => $typeMapping[$typeLetter],
                        'model_id'        => null,
                        'reportable_id'   => null,
                        'is_accessible'   => true,
                        'created_at'      => $now,
                        'updated_at'      => $now,
                    ]);
                }
            }

            if ($failureType->name === 'Porucha mechanizmu dverí') {
                $specificVehicle = DB::table('dpb_failures_model_reportablevehicle')
                    ->where('code', '1031')
                    ->first();

                if ($specificVehicle !== null) {
                    DB::table('dpb_failures_map_reportableacl')->insert([
                        'failure_type_id' => $failureType->id,
                        'type_id'         => null,
                        'model_id'        => null,
                        'reportable_id'   => $specificVehicle->uuid,
                        'is_accessible'   => false,
                        'created_at'      => $now,
                        'updated_at'      => $now,
                    ]);
                }
            }
        }
    }

    /**
     * Map failure names to corresponding vehicle type letters.
     *
     * @param string $failureName
     * @return array<int, string>
     */
    private function getVehicleTypesForFailure(string $failureName): array
    {
        $rules = [
            'Nefunkčný označovač'       => ['A', 'E', 'T'],
            'Zaseknutý lístok'          => ['A', 'E', 'T'],
            'Porucha motorovej časti'   => ['A'],
            'Únik chladiacej kvapaliny' => ['A'],
            'Zlomený zberač'            => ['E', 'T'],
            'Porucha mechanizmu dverí'  => ['A', 'E', 'T'],
        ];

        return $rules[$failureName] ?? ['A', 'E', 'T'];
    }
}