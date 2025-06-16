<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart; // <-- 1. 确保引入了 Cart 模型
use App\Models\Duration;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\UserSelectedDuration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{

    // public function store(Request $request)
    // {
    //     try {
    //         // Validate the incoming request data
    //         $validator = Validator::make($request->all(), [
    //             'user_id'            => 'required|integer',
    //             'duration_id'        => 'nullable|integer',
    //             'table_number_id'    => 'nullable|integer',
    //             'subtotal'           => 'required|numeric',
    //             'total'              => 'required|numeric',
    //             'items'              => 'required|array',
    //             'items.*.item_type'  => 'required|string',
    //             'items.*.item_id'    => 'required|integer',
    //             'items.*.item_name'  => 'required|string',
    //             'items.*.item_price' => 'required|numeric',
    //             'items.*.quantity'   => 'required|integer',
    //             'items.*.features'   => 'nullable',
    //             'items.*.image'      => 'nullable|string',
    //         ]);

    //         if ($validator->fails()) {
    //             Log::error('Validation errors: ' . json_encode($validator->errors()));
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Validation failed',
    //                 'errors'  => $validator->errors(),
    //             ], 422);
    //         }

    //         $validatedData = $validator->validated();

    //         DB::beginTransaction();

    //         // Create the order
    //         $order = Order::create([
    //             'user_id'         => $validatedData['user_id'],
    //             'duration_id'     => $validatedData['duration_id'],
    //             'table_number_id' => $validatedData['table_number_id'],
    //             'subtotal'        => $validatedData['subtotal'],
    //             'total'           => $validatedData['total'],
    //             'status'          => 'pending',
    //         ]);

    //         // Store user-selected duration if duration_id is provided
    //         if (isset($validatedData['duration_id'])) {
    //             UserSelectedDuration::create([
    //                 'user_id'     => $validatedData['user_id'],
    //                 'duration_id' => $validatedData['duration_id'],
    //             ]);
    //         }

    //         // Add items to the order
    //         foreach ($validatedData['items'] as $item) {
    //             $features      = $item['features'] ?? null;
    //             $featuresValue = is_array($features) ? json_encode($features) : $features;

    //             OrderItem::create([
    //                 'order_id'   => $order->id,
    //                 'item_type'  => $item['item_type'],
    //                 'item_id'    => $item['item_id'],
    //                 'item_name'  => $item['item_name'],
    //                 'item_price' => $item['item_price'],
    //                 'quantity'   => $item['quantity'],
    //                 'features'   => $featuresValue,
    //                 'image'      => $item['image'] ?? null,
    //             ]);
    //         }

    //         DB::commit();

    //         // Return a success response
    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Order completed successfully!',
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Order creation failed: ' . $e->getMessage());
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to complete purchase',
    //             'error'   => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'user_id'            => 'required|exists:users,id',
                'duration_id'        => 'nullable|exists:durations,id',
                'table_number_id'    => 'nullable|exists:table_numbers,id',
                'subtotal'           => 'required|numeric|min:0',
                'total'              => 'required|numeric|min:0',
                'items'              => 'required|array|min:1',
                'items.*.item_type'  => 'required|string|in:product,package',
                'items.*.item_id'    => 'required|integer',
                'items.*.item_name'  => 'required|string',
                'items.*.item_price' => 'required|numeric',
                'items.*.quantity'   => 'required|integer|min:1',
                'items.*.features'   => 'nullable|array', // Es mejor validar como array si se espera un JSON array
                'items.*.image'      => 'nullable|string',
            ]);

            if ($validator->fails()) {
                Log::error('Order validation errors: ' . json_encode($validator->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $validatedData = $validator->validated();

            DB::beginTransaction();

            // Create the order
            $order = Order::create([
                'user_id'         => $validatedData['user_id'],
                'duration_id'     => $validatedData['duration_id'],
                'table_number_id' => $validatedData['table_number_id'],
                'subtotal'        => $validatedData['subtotal'],
                'total'           => $validatedData['total'],
                'status'          => 'pending',
            ]);

            // Store user-selected duration if duration_id is provided
            if (isset($validatedData['duration_id']) && $validatedData['duration_id']) {
                $duration = Duration::find($validatedData['duration_id']);
                // Se ha añadido una comprobación para asegurar que la duración existe antes de usarla
                if ($duration) {
                     // Asumiendo que tu campo se llama 'seconds'. Si se llama 'duration_seconds', cámbialo aquí.
                    $endTime = now()->addSeconds($duration->seconds);

                    UserSelectedDuration::create([
                        'user_id'         => $validatedData['user_id'],
                        'duration_id'     => $validatedData['duration_id'],
                        'table_number_id' => $validatedData['table_number_id'],
                        'start_time'      => now(),
                        'end_time'        => $endTime,
                        'status'          => 'active',
                    ]);
                }
            }

            // Add items to the order
            foreach ($validatedData['items'] as $item) {
                // Asegurarse de que 'features' se almacene como una cadena JSON
                $featuresValue = isset($item['features']) ? json_encode($item['features']) : null;

                OrderItem::create([
                    'order_id'   => $order->id,
                    'item_type'  => $item['item_type'],
                    'item_id'    => $item['item_id'],
                    'item_name'  => $item['item_name'],
                    'item_price' => $item['item_price'],
                    'quantity'   => $item['quantity'],
                    'features'   => $featuresValue,
                    'image'      => $item['image'] ?? null,
                ]);
            }

            // ======================================================================
            // ===== ESTA ES LA CORRECCIÓN CLAVE: Vaciar el carrito del usuario de la BD =====
            // ======================================================================
            Cart::where('user_id', $validatedData['user_id'])->delete();
            Log::info('Cart cleared for user_id: ' . $validatedData['user_id'] . ' after order creation.');


            DB::commit();

            // Return a success response
            return response()->json([
                'success'  => true,
                'message'  => 'Order completed successfully!',
                'order_id' => $order->id // Es buena práctica devolver el ID del nuevo pedido
            ], 201); // Usar el estado 201 Created para la creación exitosa de un recurso

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed for user_id ' . ($request->user_id ?? 'unknown') . ': ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete purchase. Please try again.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function getOrdersByUserId(Request $request)
    {
        try {
            // 记录请求信息用于调试
            \Log::info('Orders API Request:', [
                'query_params'   => $request->all(),
                'user_id_param'  => $request->get('user_id'),
                'request_method' => $request->method(),
                'request_url'    => $request->fullUrl(),
            ]);

            $validatedData = $request->validate([
                'user_id' => 'required|integer',
            ]);

            $userId = $validatedData['user_id'];
            \Log::info("Fetching orders for user ID: {$userId}");

            // 首先检查用户是否存在
            $userExists = \App\Models\User::where('id', $userId)->exists();
            if (! $userExists) {
                \Log::warning("User with ID {$userId} does not exist");
                return response()->json([
                    'error'   => 'User not found',
                    'message' => "User with ID {$userId} does not exist",
                ], 404);
            }

            // 查询订单，添加更多调试信息
            $orders = Order::with(['orderItems', 'duration', 'tableNumber'])
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            \Log::info("Found {$orders->count()} orders for user {$userId}");

            // 如果没有订单，返回空数组但记录日志
            if ($orders->isEmpty()) {
                \Log::info("No orders found for user {$userId}");
                return response()->json([]);
            }

            $formattedOrders = $orders->map(function ($order) {
                \Log::info("Processing order ID: {$order->id}");

                // 记录订单项信息
                \Log::info("Order {$order->id} has {$order->orderItems->count()} items");

                // 确定订单类型
                $hasProducts = $order->orderItems->where('item_type', 'product')->count() > 0;
                $orderType   = $hasProducts ? 'product' : 'package';

                // 格式化订单项
                $items = $order->orderItems->map(function ($item) {
                    return [
                        'id'          => $item->id,
                        'name'        => $item->item_name,
                        'price'       => (float) $item->item_price,
                        'quantity'    => $item->quantity,
                        'image'       => $item->image ?? '/placeholder.svg',
                        'description' => $item->features,
                    ];
                });

                // 计算金额
                $subtotal = (float) $order->subtotal;
                $total    = (float) $order->total;
                $tax      = $total - $subtotal;

                // 模拟支付方式
                $paymentMethods = ['TNG', 'Cash', 'Debit Card', 'Credit Card'];
                $paymentMethod  = $paymentMethods[array_rand($paymentMethods)];

                $payment = ['method' => $paymentMethod];

                if (in_array($paymentMethod, ['Debit Card', 'Credit Card'])) {
                    $payment['last4']      = '1234';
                    $payment['expiryDate'] = '12/26';
                }

                $formattedOrder = [
                    'id'       => $order->id,
                    'type'     => $orderType,
                    'date'     => $order->created_at->toISOString(),
                    'status'   => $order->status ?? 'Processing',
                    'total'    => $total,
                    'tax'      => $tax,
                    'items'    => $items,
                    'payment'  => $payment,
                    'duration' => $order->duration ? [
                        'id'   => $order->duration->id,
                        'name' => $order->duration->name ?? 'Standard',
                    ] : null,
                    'table'    => $order->tableNumber ? [
                        'id'     => $order->tableNumber->id,
                        'number' => $order->tableNumber->number ?? 'N/A',
                    ] : null,
                ];

                \Log::info("Formatted order {$order->id}:", $formattedOrder);
                return $formattedOrder;
            });

            \Log::info("Returning {$formattedOrders->count()} formatted orders");

            return response()->json($formattedOrders);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed:', $e->errors());
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error fetching orders:', [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
                'trace'   => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error'   => 'Failed to fetch orders',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function cancelOrder(Request $request, $orderId)
    {
        try {
            // Log the cancel order request information
            Log::info('Cancel Order API Request:', [
                'order_id'       => $orderId,
                'request_body'   => $request->all(),
                'request_method' => $request->method(),
                'request_url'    => $request->fullUrl(),
            ]);

            // Validate request data
            $validatedData = $request->validate([
                'user_id' => 'required|integer',
            ]);

            $userId = $validatedData['user_id'];
            Log::info("Attempting to cancel order {$orderId} for user {$userId}");

            // Find the order
            $order = Order::where('id', $orderId)
                ->where('user_id', $userId)
                ->first();

            if (! $order) {
                Log::warning("Order {$orderId} not found for user {$userId}");
                return response()->json([
                    'error'   => 'Order not found',
                    'message' => 'Order not found or you do not have permission to cancel this order',
                ], 404);
            }

            // Check if the order status can be cancelled
            $cancellableStatuses = ['pending', 'processing'];
            if (! in_array(strtolower($order->status), $cancellableStatuses)) {
                Log::warning("Order {$orderId} cannot be cancelled. Current status: {$order->status}");
                return response()->json([
                    'error'   => 'Cannot cancel order',
                    'message' => "Order with status '{$order->status}' cannot be cancelled",
                ], 400);
            }

            // Update order status to cancelled
            $oldStatus         = $order->status;
            $order->status     = 'cancelled';
            $order->updated_at = now();
            $order->save();

            Log::info("Order {$orderId} status updated from '{$oldStatus}' to 'cancelled'");

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'data'    => [
                    'order_id'        => $order->id,
                    'previous_status' => $oldStatus,
                    'current_status'  => $order->status,
                    'cancelled_at'    => $order->updated_at->toISOString(),
                ],
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Cancel order validation failed:', $e->errors());
            return response()->json([
                'error'   => 'Validation failed',
                'message' => 'Invalid request data',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error cancelling order:', [
                'order_id' => $orderId,
                'message'  => $e->getMessage(),
                'file'     => $e->getFile(),
                'line'     => $e->getLine(),
                'trace'    => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error'   => 'Failed to cancel order',
                'message' => 'An error occurred while cancelling the order',
            ], 500);
        }
    }

}
