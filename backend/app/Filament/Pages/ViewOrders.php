<?php

namespace App\Filament\Pages;

use App\Models\Order;
use Filament\Pages\Page;
use Illuminate\Contracts\Pagination\Paginator;

class ViewOrders extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-eye';
    protected static ?string $navigationLabel = 'View All Orders';
    protected static ?string $navigationGroup = 'Orders';
    protected static ?string $slug = 'view-all-orders';
    protected ?string $heading = 'All Orders and Items';

    // 这将正确指向您的自定义视图文件
    protected static string $view = 'filament.pages.view-orders';

    /**
     * 这是视图文件获取数据的唯一方法。
     * 它现在会正确地预加载所有必需的关联，以解决图片问题。
     *
     * @return Paginator
     */
    public function getAllOrders(): Paginator
    {
        return Order::query()
            ->with([
                'user',
                'tableNumber',
                'duration',
                // 这是解决图片问题的关键代码:
                // 它加载了订单项，以及关联的item（产品或套餐），
                // 并且对产品，它还加载了productImages关系。
                'orderItems.item.productImages',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    /**
     * 这个辅助方法被您的视图使用，我将按要求保留它。
     *
     * @param Order $order
     * @return string
     */
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
