<?php

namespace Dpb\Failures\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Table('dpb_failures_model_reportablevehicle')]
#[Fillable(['id', 'uuid', 'code', 'type_id', 'type_name', 'model_id', 'model_name', 'is_active'])]
class ReportableVehicle extends Model
{
    /**
     * Indicates if the IDs are auto-incrementing.
     * Set to false to accommodate explicit keys injected via remote DPB sync API.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Get all failure reports targetted at this specific vehicle asset.
     */
    public function reports(): MorphMany
    {
        return $this->morphMany(FailureReport::class, 'reportable', 'reportable_type', 'reportable_id');
    }
}