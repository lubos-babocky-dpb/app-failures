<?php

use Dpb\Failures\Database\Seeders\ReportableVehicleSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dpb_failures_model_reportablevehicle', function (Blueprint $table) {
            // Synchronized directly with the remote master API ID (e.g., 11, 721)
            $table->unsignedBigInteger('id')->primary(); 
            $table->uuid('uuid')->unique(); // PWA API public mask
            
            $table->string('code')->unique(); // DPB internal asset code (e.g., "1031", "7401")
            
            // Clean, decoupled type relation columns
            $table->unsignedBigInteger('type_id');
            $table->string('type_name'); // e.g., "Autobus", "Električka"
            
            // Clean, decoupled model relation columns
            $table->unsignedBigInteger('model_id');
            $table->string('model_name'); // e.g., "Irisbus Citelis 12", "Škoda 29T ForCity Plus"
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Strict index naming for performance without breaking MySQL 64-char boundaries
            $table->index('uuid', 'veh_uuid_idx');
            $table->index('code', 'veh_code_idx');
        });
        (new ReportableVehicleSeeder())->run();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dpb_failures_model_reportablevehicle');
    }
};