<?php

namespace Dpb\Failures\Database\Migrations;

use Dpb\Failures\Database\Seeders\FailureRulesSeeder;
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
        Schema::create('dpb_failures_map_reportableacl', function (Blueprint $table) {
            $table->id();
            
            /** @var \Illuminate\Database\Schema\ForeignKeyDefinition */
            $table->foreignId('failure_type_id')
                ->constrained('dpb_failures_model_failuretype')
                ->cascadeOnDelete();

            // Accessibility rule scope levels (Type, Model, Specific Asset)
            $table->unsignedBigInteger('type_id')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->uuid('reportable_id')->nullable();

            // Availability flag: 1 = Allowed, 0 = Explicit Deny / Override
            $table->boolean('is_accessible')->default(true);

            $table->timestamps();

            // Distinct unique constraints per hierarchy layer to safely handle NULL values
            $table->unique(['failure_type_id', 'type_id'], 'uq_failure_type');
            $table->unique(['failure_type_id', 'model_id'], 'uq_failure_model');
            $table->unique(['failure_type_id', 'reportable_id'], 'uq_failure_reportable');
        });

        (new FailureRulesSeeder())->run();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dpb_failures_map_reportableacl');
    }
};