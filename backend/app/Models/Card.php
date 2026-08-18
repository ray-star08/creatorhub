<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'title', 'type', 'column', 'position'])]
class Card extends Model
{
    /**
     * The ordered Kanban columns (ported from the static pipeline state).
     */
    public const COLUMNS = ['ideas', 'scripted', 'filming', 'editing', 'posted'];

    /**
     * XP awarded when a card is moved into a column, mirroring the static
     * `drop()` rewards: posting is the big dopamine hit, editing a smaller one.
     */
    public const MOVE_REWARDS = [
        'posted' => 50,
        'editing' => 20,
    ];

    public const DEFAULT_MOVE_REWARD = 5;

    protected function casts(): array
    {
        return [
            'position' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
