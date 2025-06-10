<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer',
                'duration_id' => 'nullable|integer',
                'table_number_id' => 'nullable|integer',
                'subtotal' => 'required|numeric',
                'total' => 'required|numeric',
                'items' => 'required|array',
                'items.*.item_type' => 'required|string',
                'items.*.item_id' => 'required|integer',
                'items.*.item_name' => 'required|string',
                'items.*.item_price' => 'required|numeric',
                'items.*.quantity' => 'required|integer',
                'items.*.features' => 'nullable',
                'items.*.image' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                Log::error('Validation errors: ' . json_encode($validator->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();

            DB::beginTransaction();

            // Create the order
            $order = Order::create([
                'user_id' => $validatedData['user_id'],
                'duration_id' => $validatedData['duration_id'],
                'table_number_id' => $validatedData['table_number_id'],
                'subtotal' => $validatedData['subtotal'],
                'total' => $validatedData['total'],
                'status' => 'pending',
            ]);

            // Add items to the order
            foreach ($validatedData['items'] as $item) {
                $features = $item['features'] ?? null;
                $featuresValue = is_array($features) ? json_encode($features) : $features;

                OrderItem::create([
                    'order_id' => $order->id,
                    'item_type' => $item['item_type'],
                    'item_id' => $item['item_id'],
                    'item_name' => $item['item_name'],
                    'item_price' => $item['item_price'],
                    'quantity' => $item['quantity'],
                    'features' => $featuresValue,
                    'image' => $item['image'] ?? null,
                ]);
            }

            DB::commit();

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Order completed successfully!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete purchase',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
