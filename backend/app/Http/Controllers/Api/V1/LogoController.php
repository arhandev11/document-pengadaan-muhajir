<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogoController extends Controller
{
    /**
     * GET /api/v1/logo
     * Public-ish: semua user yang authenticated bisa baca (semua role butuh
     * lihat logo untuk preview dokumen).
     */
    public function show(Request $request): JsonResponse
    {
        $setting = AppSetting::instance();
        $media = $setting->getLogoMedia();

        return response()->json([
            'url' => $setting->getLogoUrl(),
            'mime_type' => $media?->mime_type,
            'size_bytes' => $media?->size,
            'original_name' => $media?->file_name,
            'uploaded_at' => $media?->created_at?->toIso8601String(),
        ]);
    }

    /**
     * POST /api/v1/logo (multipart: file)
     * Menutup gap PRD §15.8 dengan validasi ukuran 2MB hard-limit.
     * Permission: logo.manage (admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $request->user()->can('logo.manage') ?: abort(403);

        $validated = $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:png,jpg,jpeg,svg',
                'max:2048', // KB → 2MB
            ],
        ]);

        $setting = AppSetting::instance();

        $setting->clearMediaCollection(AppSetting::LOGO_COLLECTION);

        $media = $setting
            ->addMediaFromRequest('file')
            ->toMediaCollection(AppSetting::LOGO_COLLECTION);

        activity('logo')
            ->causedBy($request->user())
            ->event('UPLOADED')
            ->withProperties([
                'original_name' => $media->file_name,
                'size_bytes' => $media->size,
                'mime_type' => $media->mime_type,
            ])
            ->log('Logo diperbarui');

        return response()->json([
            'message' => 'Logo berhasil diunggah.',
            'url' => $setting->getLogoUrl(),
            'size_bytes' => $media->size,
        ], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->user()->can('logo.manage') ?: abort(403);

        $setting = AppSetting::instance();
        $setting->clearMediaCollection(AppSetting::LOGO_COLLECTION);

        activity('logo')
            ->causedBy($request->user())
            ->event('REMOVED')
            ->log('Logo dihapus');

        return response()->json(['message' => 'Logo dihapus.']);
    }
}
