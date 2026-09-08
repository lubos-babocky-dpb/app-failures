<?php
declare(strict_types=1);
namespace Dpb\Failures\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[Table('dpb_failures_model_failuretype')]
#[Fillable(['category_id', 'name'])]
class FailureType extends Model
{
    use SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (self $failure): void {
            $failure->uuid ??= (string) Str::uuid();
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FailureCategory::class, 'category_id', 'id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(FailureReport::class, 'failure_type_id', 'id');
    }
}