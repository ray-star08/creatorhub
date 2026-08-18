<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * Register a new creator and issue a Sanctum API token.
     *
     * The Next.js SPA authenticates with a bearer token (stored client-side and
     * sent as `Authorization: Bearer …`), so we return the plain-text token here
     * rather than starting a session.
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // hashed via the model cast
        ]);

        // Seed the starter daily quests so the dashboard is never empty.
        $this->seedStarterQuests($user);

        return response()->json([
            'user' => $this->userPayload($user),
            'token' => $user->createToken('spa')->plainTextToken,
        ], 201);
    }

    /**
     * Authenticate an existing creator and issue a fresh Sanctum API token.
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'user' => $this->userPayload($user),
            'token' => $user->createToken('spa')->plainTextToken,
        ]);
    }

    /**
     * Return the authenticated creator (used by the frontend to hydrate state).
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->userPayload($request->user()),
        ]);
    }

    /**
     * Securely log the current user out.
     *
     * The `auth:sanctum` middleware already guarantees an authenticated user
     * (401 otherwise), so validation is handled before we get here. CreatorHub
     * authenticates the SPA with stateless bearer tokens, so the real action is
     * revoking the token that made this request. The session / CSRF steps only
     * apply under the cookie flow; they are guarded so they run when a session
     * is present and safely no-op on the stateless token API (which has no
     * session store bound to the request) instead of throwing.
     */
    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        // Only a persisted personal access token can be revoked. Under cookie
        // auth this would be a TransientToken, which has nothing to delete.
        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Shape the user record the same way across every auth response.
     *
     * @return array<string, mixed>
     */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            ...$user->gamification(),
        ];
    }

    private function seedStarterQuests(User $user): void
    {
        $user->quests()->createMany([
            ['title' => 'Generate 1 Script', 'xp_reward' => 15],
            ['title' => 'Save 2 Ideas', 'xp_reward' => 10],
            ['title' => 'Move 1 task to Editing', 'xp_reward' => 20],
        ]);
    }
}
