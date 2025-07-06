<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class DailyOrdersChart extends ChartWidget
{
    protected static ?string $heading = 'Orders per day';
    protected static ?int $sort = 1;
    protected int | string | array $columnSpan = [
        'md' => 6,
        'xl' => 6,
    ];

    // 缓存时间为1小时（3600秒）
    protected static ?string $maxHeight = '300px';

    protected function getData(): array
    {
        // 获取当前月份的所有天数
        $currentMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // 生成当月所有日期
        $dates = [];
        $current = $currentMonth->copy();
        while ($current <= $endOfMonth) {
            $dates[] = $current->copy();
            $current->addDay();
        }

        // 获取当月每日订单数据
        $orderData = Order::query()
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('created_at', [$currentMonth, $endOfMonth])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');

        // 构建完整的数据数组（包含没有订单的日期）
        $labels = [];
        $orderCounts = [];

        foreach ($dates as $date) {
            $dateString = $date->format('Y-m-d');
            $labels[] = $date->format('j'); // 只显示日期数字
            $orderCounts[] = $orderData->get($dateString)->count ?? 0;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $orderCounts,
                    'backgroundColor' => 'rgba(255, 193, 7, 0.2)', // 橙黄色背景
                    'borderColor' => 'rgba(255, 193, 7, 1)', // 橙黄色边框
                    'borderWidth' => 2,
                    'fill' => true,
                    'tension' => 0.4,
                    'pointBackgroundColor' => 'rgba(255, 193, 7, 1)',
                    'pointBorderColor' => '#ffffff',
                    'pointBorderWidth' => 2,
                    'pointRadius' => 3,
                    'pointHoverRadius' => 5,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'maintainAspectRatio' => false,
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'bottom',
                    'labels' => [
                        'usePointStyle' => true,
                        'padding' => 20,
                        'font' => [
                            'size' => 12,
                        ],
                    ],
                ],
                'title' => [
                    'display' => false,
                ],
            ],
            'scales' => [
                'x' => [
                    'display' => true,
                    'grid' => [
                        'display' => false,
                    ],
                    'ticks' => [
                        'font' => [
                            'size' => 11,
                        ],
                        'color' => '#6b7280',
                    ],
                ],
                'y' => [
                    'display' => true,
                    'beginAtZero' => true,
                    'grid' => [
                        'display' => true,
                        'color' => 'rgba(0, 0, 0, 0.05)',
                    ],
                    'ticks' => [
                        'stepSize' => 1,
                        'font' => [
                            'size' => 11,
                        ],
                        'color' => '#6b7280',
                    ],
                ],
            ],
            'elements' => [
                'point' => [
                    'hoverRadius' => 6,
                ],
            ],
            'interaction' => [
                'intersect' => false,
                'mode' => 'index',
            ],
        ];
    }

    // 设置刷新间隔（可选）
    protected static ?string $pollingInterval = null; // 不自动刷新

    // 可以添加手动刷新功能
    public function getDescription(): ?string
    {
        return 'Daily orders for ' . Carbon::now()->format('F Y');
    }
}
