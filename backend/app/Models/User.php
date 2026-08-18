<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'level', 'xp', 'next_level_xp', 'title', 'momentum', 'streak'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Creator titles unlocked at each level (ported from the static `game.titles`).
     */
    public const TITLES = [
        1 => 'Aspiring Creator',
        2 => 'Content Builder',
        3 => 'Growth Hacker',
        4 => 'Viral Strategist',
        5 => 'Algorithm Whisperer',
    ];

    /**
     * Default gamification state for a brand-new creator. These mirror the DB
     * column defaults so freshly created (un-refreshed) instances are always
     * safe to read from and pass through addXp().
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'level' => 1,
        'xp' => 0,
        'next_level_xp' => 100,
        'title' => 'Aspiring Creator',
        'momentum' => 0,
        'streak' => 0,
    ];

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
            'level' => 'integer',
            'xp' => 'integer',
            'next_level_xp' => 'integer',
            'momentum' => 'integer',
            'streak' => 'integer',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function quests(): HasMany
    {
        return $this->hasMany(Quest::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }

    public function ideas(): HasMany
    {
        return $this->hasMany(Idea::class);
    }

    public function scripts(): HasMany
    {
        return $this->hasMany(Script::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Award XP and momentum, cascading through any level-ups.
     *
     * Ported from the static `game.addXP()` / `game.levelUp()` logic and kept
     * server-authoritative so the frontend can never spoof progression. Returns
     * a summary the API hands back so the UI can fire confetti / the level modal.
     *
     * @return array{gained_xp:int, leveled_up:bool, levels_gained:int, new_title:string|null}
     */
    public function addXp(int $amount): array
    {
        $startingLevel = $this->level;

        $this->xp += $amount;
        $this->momentum = min(100, $this->momentum + intdiv($amount, 2));

        // A single award can cross several thresholds, so loop until settled.
        // The `> 0` guard is a safety net: a zero/null threshold would otherwise
        // spin forever, and max(1, ...) keeps the curve strictly increasing.
        while ($this->next_level_xp > 0 && $this->xp >= $this->next_level_xp) {
            $this->level++;
            $this->xp -= $this->next_level_xp;
            $this->next_level_xp = max(1, (int) floor($this->next_level_xp * 1.5));
            $this->title = self::TITLES[$this->level] ?? $this->title;
        }

        $this->save();

        $levelsGained = $this->level - $startingLevel;

        return [
            'gained_xp' => $amount,
            'leveled_up' => $levelsGained > 0,
            'levels_gained' => $levelsGained,
            'new_title' => $levelsGained > 0 ? $this->title : null,
        ];
    }

    /**
     * The gamification slice of state the frontend store mirrors.
     *
     * @return array<string, mixed>
     */
    public function gamification(): array
    {
        return [
            'level' => $this->level,
            'xp' => $this->xp,
            'next_level_xp' => $this->next_level_xp,
            'title' => $this->title,
            'momentum' => $this->momentum,
            'streak' => $this->streak,
        ];
    }
}
