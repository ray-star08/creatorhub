<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Frictionless onboarding (Milestone 4). Captures the creator's Niche, Platform,
 * Audience and Content Style so every downstream AI prompt is on-brand.
 */
class ProfileController extends Controller
{
    /**
     * Return the authenticated creator's profile (null until onboarding is done).
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->profile,
        ]);
    }

    /**
     * Create or update the creator's profile in a single idempotent call.
     */
    public function setup(Request $request): JsonResponse
    {
        $data = $request->validate([
            'niche' => ['required', 'string', 'max:255'],
            'platform' => ['required', 'string', 'max:255'],
            'audience' => ['required', 'string', 'max:255'],
            'style' => ['required', 'string', 'max:255'],
        ]);

        // The hasOne relation scopes by user_id, so an empty match set means
        // "the current user's profile" — created on first setup, updated after.
        $profile = $request->user()->profile()->updateOrCreate([], $data);

        return response()->json([
            'data' => $profile,
        ], $profile->wasRecentlyCreated ? 201 : 200);
    }
}
