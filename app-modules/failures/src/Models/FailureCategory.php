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

#[Table('dpb_failures_model_failurecategory')]
#[Fillable(['parent_id', 'name'])]
class FailureCategory extends Model
{
    use SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (self $category): void {
            $category->uuid ??= (string) Str::uuid();
        });
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id', 'id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id', 'id');
    }

    public function failureTypes(): HasMany
    {
        return $this->hasMany(FailureType::class, 'category_id', 'id');
    }

    public function aliasOf(): BelongsTo
    {
        return $this->belongsTo(self::class, 'alias_of', 'id');
    }
}