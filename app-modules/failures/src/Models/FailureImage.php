<?php

namespace Dpb\Failures\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Table('dpb_failures_model_failureimage')]
#[Fillable(['uuid', 'failure_report_id', 'file_path', 'mime_type', 'file_size'])]
#[Hidden(['id', 'failure_report_id'])]
class FailureImage extends Model
{
    use HasFactory;

    /**
     * Get the parent failure report that owns the image.
     */
    public function failureReport(): BelongsTo
    {
        // Explicitly defining the foreign key and owner key due to custom table names
        return $this->belongsTo(FailureReport::class, 'failure_report_id', 'id');
    }
}