<?php

use Dpb\Failures\Enums\FailureReportStatus;
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
        Schema::create('dpb_failures_model_failurereport', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('user_id')->nullable();
            $table->uuid('ghost_id')->nullable();
            $table->unsignedBigInteger('failure_type_id'); 
            
            // Polymorphic morphs fields
            $table->string('reportable_type');
            $table->unsignedBigInteger('reportable_id');
            $table->text('note')->nullable();

            $table->enum('status', array_column(FailureReportStatus::cases(), 'value'))
                ->default(FailureReportStatus::RECEIVED->value);

            $table->dateTime('client_created_at');
            $table->timestamps();

            // Foreign keys
            $table->foreign('failure_type_id')
                  ->references('id')
                  ->on('dpb_failures_model_failuretype')
                  ->onDelete('restrict');

            $table->index('uuid', 'report_uuid_idx');
            $table->index(['reportable_type', 'reportable_id'], 'report_reportable_idx'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dpb_failures_model_failurereport');
    }
};