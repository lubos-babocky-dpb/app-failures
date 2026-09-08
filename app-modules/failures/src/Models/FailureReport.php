<?php

namespace Dpb\Failures\Models;

use Dpb\Failures\Enums\FailureReportStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Table('dpb_failures_model_failurereport')]
#[Fillable(['uuid', 'user_id', 'ghost_id', 'failure_type_id', 'reportable_type', 'reportable_id', 'note', 'status', 'client_created_at'])]
class FailureReport extends Model
{
    /**
     * Define internal attribute castings using native Laravel method instead of attributes.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'client_created_at' => 'datetime',
            'status' => FailureReportStatus::class
        ];
    }

    /**
     * Get the owning reportable asset entity (Polymorphic relationship).
     * Resolves dynamically to ReportableVehicle or future asset targets.
     */
    public function reportable(): MorphTo
    {
        return $this->morphTo('reportable', 'reportable_type', 'reportable_id');
    }

    /**
     * Get the precise technical failure type assigned to this incident report.
     */
    public function failureType(): BelongsTo
    {
        return $this->belongsTo(FailureType::class, 'failure_type_id', 'id');
    }

    /**
     * Get all uploaded images attached to this failure report (1:N relation).
     */
    public function images(): HasMany
    {
        return $this->hasMany(FailureImage::class, 'failure_report_id', 'id');
    }
}