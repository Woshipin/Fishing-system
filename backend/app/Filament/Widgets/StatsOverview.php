<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        // 1. Today's Orders
        $todayOrders = Order::whereDate('created_at', Carbon::today())->count();

        // 2. This Week's Orders
        $weekOrders = Order::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();

        // 3. This Month's Orders
        $monthOrders = Order::whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year)->count();

        // 4. Total Subtotal
        $totalSubtotal = Order::sum('subtotal');

        return [
            Stat::make('Today\'s Orders', $todayOrders)
                ->description('Total orders placed today')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('This Week\'s Orders', $weekOrders)
                ->description('Total orders this week')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('This Month\'s Orders', $monthOrders)
                ->description('Total orders this month')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('Total Revenue (Subtotal)', 'RM ' . number_format($totalSubtotal, 2))
                ->description('Sum of all order subtotals')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('success'),
        ];
    }
}
