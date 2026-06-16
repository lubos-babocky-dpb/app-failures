<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'endpoint', 'p256dh', 'auth'])]
class UserPushSubscription extends Model
{
    /**
     * Vzťah späť na používateľa (zamestnanca).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}