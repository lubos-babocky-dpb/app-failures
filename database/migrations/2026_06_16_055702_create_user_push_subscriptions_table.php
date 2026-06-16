<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_push_subscriptions', function (Blueprint $table) {
            $table->id();
            // Prepojenie na tvojho zamestnanca (predpokladám tabuľku users)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Tieto 3 polia vyžaduje protokol, ktorý sme rozoberali vyššie
            $table->string('endpoint', 500)->unique(); // URL adresa push servera
            $table->string('p256dh')->nullable();       // Verejný kľúč prehliadača
            $table->string('auth')->nullable();         // Autentifikačný kľúč prehliadača
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_push_subscriptions');
    }
};