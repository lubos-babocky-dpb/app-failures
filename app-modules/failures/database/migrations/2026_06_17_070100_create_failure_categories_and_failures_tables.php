<?php

use Dpb\Failures\Database\Seeders\FailureCategorySeeder;
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
        // 1. Categories table: Tree structure using Adjacency List + Materialized Path
        Schema::create('dpb_failures_model_failurecategory', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name');
            
            // Materialized path stores the hierarchy as a string (e.g., "/1/5/12/")
            // It allows for instant subtree queries using LIKE operators.
            $table->string('path')
                ->nullable()
                ->index()
                ->comment('Materialized path for hierarchical filtering');
            
            // Reference to the original category node when this is an alias/softlink
            $table->unsignedBigInteger('alias_of')
                ->nullable()
                ->comment('ID of the original category if this is a softlink');
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('parent_id')
                  ->references('id')
                  ->on('dpb_failures_model_failurecategory')
                  ->onDelete('cascade');

            $table->foreign('alias_of')
                  ->references('id')
                  ->on('dpb_failures_model_failurecategory')
                  ->onDelete('cascade');
        });

        // 2. Failure types table: Leaves of the tree
        Schema::create('dpb_failures_model_failuretype', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('category_id');
            $table->string('name');
            
            // Denormalized path pointing to the category this type belongs to
            // This enables O(1) filtering on the frontend (Dexie/Vue)
            $table->string('path')
                ->nullable()
                ->index()
                ->comment('Replicated category path for fast filtering');
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')
                  ->references('id')
                  ->on('dpb_failures_model_failurecategory')
                  ->onDelete('cascade');
        });

        (new FailureCategorySeeder())->run();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dpb_failures_model_failuretype');
        Schema::dropIfExists('dpb_failures_model_failurecategory');
    }
};