<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class AppSetting extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'app_settings';

    public const LOGO_COLLECTION = 'logo';

    /**
     * Singleton accessor — selalu kembalikan row id=1. Kalau belum ada, create.
     */
    public static function instance(): self
    {
        return self::firstOrCreate(['id' => 1]);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::LOGO_COLLECTION)
            ->singleFile() // otomatis replace file lama saat upload baru
            ->acceptsMimeTypes(['image/png', 'image/jpeg', 'image/svg+xml']);
    }

    public function getLogoMedia(): ?Media
    {
        return $this->getFirstMedia(self::LOGO_COLLECTION);
    }

    public function getLogoUrl(): ?string
    {
        return $this->getFirstMediaUrl(self::LOGO_COLLECTION) ?: null;
    }
}
