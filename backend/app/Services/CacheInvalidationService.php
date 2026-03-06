<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CacheInvalidationService
{
    protected string $nextjsUrl;
    protected string $revalidateToken;

    public function __construct()
    {
        $this->nextjsUrl = config('services.nextjs.url', 'http://localhost:3000');
        $this->revalidateToken = config('services.nextjs.revalidate_token', '');
    }

    /**
     * Revalidate a single cache tag
     */
    public function revalidateTag(string $tag): bool
    {
        return $this->revalidateTags([$tag]);
    }

    /**
     * Revalidate multiple cache tags
     */
    public function revalidateTags(array $tags): bool
    {
        if (empty($this->revalidateToken)) {
            Log::warning('Cache revalidation skipped: NEXTJS_REVALIDATE_TOKEN not configured');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'x-revalidate-token' => $this->revalidateToken,
                'Content-Type' => 'application/json',
            ])->timeout(10)->post("{$this->nextjsUrl}/api/revalidate", [
                'tags' => $tags,
            ]);

            if ($response->successful()) {
                Log::info('Cache revalidated successfully', [
                    'tags' => $tags,
                    'response' => $response->json(),
                ]);
                return true;
            }

            Log::error('Cache revalidation failed', [
                'tags' => $tags,
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Cache revalidation error', [
                'tags' => $tags,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
