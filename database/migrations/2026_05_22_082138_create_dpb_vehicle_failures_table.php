<?php

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
        Schema::create('dpb_vehicle_failures', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();                 // Added: Unique sync key for PWA mapping
            $table->unsignedBigInteger('vehicle_id');       // Reference to the vehicles table
            $table->uuid('user_uuid');                      // Reference to the user UUID
            $table->string('category_id');                  // Reference to the subcategory ID string (e.g., "01_kabina")
            $table->text('note')->nullable();               // Optional driver notes
            $table->string('photo_path')->nullable();       // Path to the stored photo file
            $table->string('status')->default('odoslané');  // Aktuálny stav porúch (odoslané, v riešení, vyriešené...)
            $table->timestamp('client_created_at');         // Exact time when the driver created the report offline
            $table->timestamps();                           // Laravel standard created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dpb_vehicle_failures');
    }
};