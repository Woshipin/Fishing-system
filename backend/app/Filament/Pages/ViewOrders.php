<?php

namespace App\Filament\Pages;

use App\Models\Order;
use Filament\Pages\Page;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class ViewOrders extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-eye';
    protected static ?string $navigationLabel = 'View All Orders';
    protected static ?string $navigationGroup = 'Orders';
    protected static ?string $slug = 'view-all-orders';
    protected ?string $heading = 'All Orders and Items';

    protected static string $view = 'filament.pages.view-orders';

    public string $search = '';
    public string $dateFilter = '';

    public function getAllOrders(): Paginator
    {
        $query = Order::query()
            ->with([
                'user',
                'tableNumber',
                'duration',
                'orderItems.item.productImages',
            ])
            ->when($this->search, function (Builder $query) {
                $query->where(function (Builder $q) {
                    $q->where('total', 'like', "%{$this->search}%")
                      ->orWhereHas('user', function (Builder $userQuery) {
                          $userQuery->where('name', 'like', "%{$this->search}%");
                      });
                });
            })
            ->when($this->dateFilter, function (Builder $query) {
                match ($this->dateFilter) {
                    'today' => $query->whereDate('created_at', Carbon::today()),
                    'week' => $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]),
                    'month' => $query->whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year),
                    default => $query,
                };
            });

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    public function getOrderType(Order $order): string
    {
        $hasProduct = $order->orderItems->contains('item_type', 'product');
        $hasPackage = $order->orderItems->contains('item_type', 'package');

        if ($hasProduct && $hasPackage) {
            return 'Mixed Order';
        }
        if ($hasProduct) {
            return 'Product Order';
        }
        if ($hasPackage) {
            return 'Package Order';
        }
        return 'Empty Order';
    }
}
