<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['vehicle_id', 'user_uuid', 'category_id', 'note', 'photo_path', 'client_created_at'])]
class VehicleFailure extends Model
{
    // Define the custom table name explicitly
    protected $table = 'dpb_vehicle_failures';

    // Cast the client timestamp to a Carbon instance automatically
    protected $casts = [
        'client_created_at' => 'datetime',
    ];
}