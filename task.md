🚀 CreatorHub — Claude Code Development Runbook

AGENT INSTRUCTION:
You are Claude Code, an expert Senior Full-Stack Engineer. Read this document as your absolute source of truth. Execute tasks sequentially. If a path is specified, use exactly that path. If a command is provided, run it.

Project Overview

CreatorHub is an Integrated Creator Operating System.
Philosophy: "Masuk, Buat, Beres" (Enter, Create, Done).
Monorepo Structure (Expected):

/backend -> Laravel 13 API + PostgreSQL

/frontend -> Next.js 16 App Router + Tailwind + shadcn/ui

📌 Milestone 1 — Project Initialization

Backend (Laravel)

[ ] Initialize Laravel: composer create-project laravel/laravel backend

[ ] Setup PostgreSQL database connection in backend/.env (Assume DB name: creatorhub_db)

[ ] Install Sanctum API: php artisan install:api

[ ] Configure CORS in config/cors.php to allow http://localhost:3000.

Frontend (Next.js)

[ ] Initialize Next.js: npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

[ ] Initialize shadcn/ui: cd frontend && npx shadcn@latest init (Style: Default, Color: Slate)

[ ] Install dependencies: npm install axios zustand lucide-react

[ ] Setup Axios instance in frontend/lib/axios.ts pointing to http://localhost:8000.

📌 Milestone 2 — Database Schema & Models

Action: Run artisan commands in /backend to generate Models, Migrations, and Controllers (API).
Command format: php artisan make:model ModelName -mcr --api

[ ] Table: users (Modify existing migration)

id, name, email, password, timestamps

[ ] Table: profiles

id, user_id (foreign, cascade), niche (string), platform (string), audience (string), style (string), timestamps

[ ] Table: ideas

id, user_id (foreign, cascade), title (string), description (text), engagement_score (integer), timestamps

[ ] Table: scripts

id, user_id (foreign, cascade), idea_id (foreign, cascade), title (string), hook (text), content (text), cta (string), timestamps

[ ] Table: tasks (For Kanban)

id, user_id (foreign, cascade), title (string), status (enum: 'idea', 'draft', 'editing', 'ready', 'published'), timestamps

[ ] Table: schedules

id, user_id (foreign, cascade), title (string), publish_date (datetime), timestamps

[ ] Run Migration: php artisan migrate

📌 Milestone 3 — Authentication & State

Backend

[ ] Create app/Http/Controllers/API/AuthController.php

[ ] Add endpoints: POST /api/register, POST /api/login, POST /api/logout (using Sanctum tokens).

[ ] Define routes in routes/api.php.

Frontend

[ ] Create UI components: npx shadcn@latest add form input button card

[ ] Create Zustand store: frontend/stores/useAuthStore.ts (state for user, token, login(), logout()).

[ ] Create Auth Pages:

frontend/app/(auth)/login/page.tsx

frontend/app/(auth)/register/page.tsx

[ ] Create middleware frontend/middleware.ts to protect /(dashboard) routes.

📌 Milestone 4 — Frictionless Onboarding

Backend

[ ] Create app/Http/Controllers/API/ProfileController.php.

[ ] Add endpoint: POST /api/profile/setup to create/update user profile.

Frontend

[ ] Create Page: frontend/app/(onboarding)/setup/page.tsx

[ ] Build a multi-step form or single clean form using shadcn/ui components for Niche, Platform, Audience, and Content Style.

[ ] On successful submission, redirect to /dashboard.

📌 Milestone 5 — Dashboard Layout & Widgets

Frontend Layout

[ ] Add shadcn components: npx shadcn@latest add sheet avatar dropdown-menu

[ ] Create frontend/components/layout/Sidebar.tsx and Navbar.tsx.

[ ] Create layout wrapper: frontend/app/(dashboard)/layout.tsx.

Dashboard Page (frontend/app/(dashboard)/page.tsx)

[ ] Build Greeting Card based on useAuthStore user name.

[ ] Build Analytics Cards (Total Scripts, Drafts, Published).

[ ] Build Quick Actions (Buttons linking to /ideas/generate, /scripts/generate, /kanban, /calendar).

📌 Milestone 6 — AI Integration Core (Tabi AI)

Backend

[x] MIGRATED: Azure OpenAI → Tabi AI (third-party, OpenAI-compatible). Completed.

[x] Add Tabi AI credentials to .env: TABI_AI_API_KEY, TABI_AI_BASE_URL, TABI_AI_MODEL.

[x] Create Service: app/Services/AI/TabiAIService.php (replaces AzureAIService.php, now removed).

Method generateJSON($systemPrompt, $userPrompt) using Laravel's Http::withToken() to call the OpenAI-compatible endpoint POST {TABI_AI_BASE_URL}/chat/completions with a `Bearer {API_KEY}` header. Parses choices.0.message.content and enforces JSON via response_format=json_object + defensive fence-stripping.

📌 Milestone 7 — AI Idea Generator

Backend

[x] Create endpoint POST /api/ideas/generate in IdeaController.

[x] Build Prompt logic: Inject user's profile context (Niche, Audience) + User Input (Topic).

[x] Parse Tabi AI JSON response and save to ideas table. Return the saved objects.

Frontend

[ ] Create Page: frontend/app/(dashboard)/ideas/generate/page.tsx.

[ ] Create Form: Topic input.

[ ] Create loading state (Skeleton) while waiting for AI response.

[ ] Display results in a list of Cards. Add a "Create Script from Idea" button on each card.

📌 Milestone 8 — AI Script Generator

Backend

[x] Create endpoint POST /api/scripts/generate in ScriptController.

[ ] Input: idea_id, tone, duration.

[x] Build Prompt logic: Request detailed script with title, opening hook, main content, and CTA.

[x] Parse JSON, save to scripts table, and return data.

Frontend

[ ] Create Page: frontend/app/(dashboard)/scripts/generate/page.tsx (Accepts ?ideaId=X query param).

[ ] Form for Tone (Dropdown) and Duration.

[ ] Display output using a rich text area or formatted Markdown view.

📌 Milestone 9 — Kanban Board

Frontend Packages & UI

[ ] Install DnD library: npm install @hello-pangea/dnd

[ ] Create Page: frontend/app/(dashboard)/kanban/page.tsx.

[ ] Build Kanban columns: Idea, Draft, Editing, Ready, Published.

Backend & Integration

[ ] Create endpoint GET /api/tasks and PUT /api/tasks/{task}/status in TaskController.

[ ] Implement onDragEnd in Frontend to fire Axios PUT request updating the task status.

[ ] Use Zustand or React Query to optimistic-update the UI.

📌 Milestone 10 — Smart Calendar

Packages & UI

[ ] Install calendar library: npm install react-big-calendar date-fns (and their types).

[ ] Create Page: frontend/app/(dashboard)/calendar/page.tsx.

Backend & Integration

[ ] Create endpoints GET /api/schedules and POST /api/schedules.

[ ] Connect the frontend calendar view to display schedules from the database.

📌 Milestone 11 — Seeding & Demo Polish (Final)

Backend

[ ] Update database/seeders/DatabaseSeeder.php.

[ ] Create UserSeeder, ProfileSeeder, IdeaSeeder, ScriptSeeder, TaskSeeder.

[ ] Generate at least 1 user (email: demo@creatorhub.com, pass: password), 20 dummy ideas, 15 scripts, and pre-populated Kanban tasks to ensure the dashboard looks alive for the video pitch.

[ ] Run php artisan db:seed.

Frontend

[ ] Verify error states (Toast notifications via npx shadcn@latest add toast).

[ ] Verify loading states (spinners on AI generate buttons).

[ ] Ensure full responsive design (mobile-friendly Sidebar/Navbar).

📌 Milestone 12 — AI Provider Hardening (Post-Migration)

Context: AI stack is now Tabi AI (OpenAI-compatible /v1/chat/completions, Bearer auth). Azure OpenAI / Foundry fully removed. Legacy GeminiService remains only for /api/ai/* proxy routes.

[ ] SECURITY: rotate the leaked Azure key (was committed in .env) and confirm .env is gitignored.

[ ] Add a smoke test hitting TabiAIService::generateJSON() against a mocked Http::fake() to lock the request shape.

[ ] Decide fate of legacy Gemini proxy (/api/ai/script|analyze|ideas|hooks): migrate onto TabiAIService or remove GeminiService to consolidate on a single provider.

[ ] Add graceful fallback / retry when Tabi AI returns 429 or 5xx.