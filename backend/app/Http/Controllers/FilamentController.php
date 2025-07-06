<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse; // 确保导入这个类

class FilamentController extends Controller
{
    /**
     * Retrieve and return the details for a specific order as a JSON response.
     */
    public function filamentshowOrderItems(Order $order): JsonResponse
    {
        $order->load(['orderItems', 'user', 'tableNumber']);

        return response()->json([
            'order_id' => $order->id,
            'customer' => $order->user->name,
            'table' => optional($order->tableNumber)->table_number,
            'status' => $order->status,
            'subtotal' => $order->subtotal,
            'total' => $order->total,
            'order_items' => $order->orderItems->map(function ($item) {
                return [
                    'item_name' => $item->item_name,
                    'item_type' => $item->item_type,
                    'item_price' => $item->item_price,
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'image' => $item->image ? asset('storage/' . $item->image) : null,
                    'details' => $item->item_details,
                ];
            }),
        ]);
    }

    /**
     * Mark a specific order as 'completed'.
     */
    public function filamentcompleteOrder(Order $order): RedirectResponse
    {
        if ($order->status === 'pending') {
            $order->status = 'completed';
            $order->save();

            return back()->with('success', "Order #{$order->id} has been marked as completed.");
        }

        return back()->with('error', "Order #{$order->id} could not be completed.");
    }

    /**
     * Mark a specific order as 'cancelled'.
     */
    public function filamentcancelOrder(Order $order): RedirectResponse
    {
        if ($order->status === 'pending') {
            $order->status = 'cancelled';
            $order->save();

            return back()->with('success', "Order #{$order->id} has been successfully cancelled.");
        }

        return back()->with('error', "Order #{$order->id} could not be cancelled.");
    }
}
