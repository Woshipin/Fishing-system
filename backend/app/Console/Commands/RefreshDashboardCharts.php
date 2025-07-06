<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class RefreshDashboardCharts extends Command
{
    protected $signature = 'dashboard:refresh-charts';
    protected $description = 'Refresh dashboard charts data monthly';

    public function handle()
    {
        // 清除图表相关的缓存
        Cache::forget('daily_orders_chart');
        Cache::forget('daily_revenue_chart');

        $this->info('Dashboard charts refreshed successfully!');

        return 0;
    }
}
