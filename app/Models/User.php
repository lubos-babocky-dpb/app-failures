<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'uuid', 'personal_number', 'department_code', 'department_name'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Vzťah na uložené zariadenia zamestnanca.
     */
    public function pushSubscriptions(): HasMany
    {
        return $this->hasMany(UserPushSubscription::class); // Tvoj model pre tabuľku odberov
    }

    /**
     * Laravel automaticky hľadá túto metódu pri smerovaní notifikácií.
     */
    public function routeNotificationForWebPush(): iterable
    {
        return $this->pushSubscriptions()->get();
    }

    /**
     * Odstránenie neplatného zariadenia (napr. pri odinštalovaní PWA).
     */
    public function deletePushSubscription(string $endpoint): void
    {
        $this->pushSubscriptions()->where('endpoint', $endpoint)->delete();
    }
}
