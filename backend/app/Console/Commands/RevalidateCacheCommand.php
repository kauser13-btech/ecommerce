<?php

namespace App\Console\Commands;

use App\Services\CacheInvalidationService;
use Illuminate\Console\Command;

class RevalidateCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:revalidate {tags* : One or more cache tags to revalidate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Revalidate Next.js cache tags';

    /**
     * Execute the console command.
     */
    public function handle(CacheInvalidationService $cacheService): int
    {
        $tags = $this->argument('tags');

        $this->info("Revalidating cache tags: " . implode(', ', $tags));

        $result = $cacheService->revalidateTags($tags);

        if ($result) {
            $this->info('✓ Cache revalidated successfully!');
            return Command::SUCCESS;
        }

        $this->error('✗ Failed to revalidate cache. Check logs for details.');
        return Command::FAILURE;
    }
}
