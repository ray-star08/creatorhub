<?php

namespace App\Providers;

use App\Services\AI\TabiAIService;
use App\Services\GeminiService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(GeminiService::class, function () {
            return new GeminiService(
                apiKey: (string) config('services.gemini.key'),
                model: (string) config('services.gemini.model'),
                baseUrl: (string) config('services.gemini.base_url'),
            );
        });

        $this->app->singleton(TabiAIService::class, function () {
            return new TabiAIService(
                apiKey: (string) config('services.tabi.key'),
                baseUrl: (string) config('services.tabi.base_url'),
                model: (string) config('services.tabi.model'),
                backupModels: (array) config('services.tabi.backup_models'),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
