<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Prune activity log entries lebih tua dari `clean_after_days` (default 365).
// Menutup PRD §15.9 (log rotation). Dijadwalkan harian pukul 03:00 WIB.
Schedule::command('activitylog:clean')
    ->dailyAt('03:00')
    ->onOneServer()
    ->runInBackground();

// Prune expired Sanctum tokens (jika ada expiration di-set).
Schedule::command('sanctum:prune-expired --hours=24')
    ->dailyAt('03:30')
    ->onOneServer();
