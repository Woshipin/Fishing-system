<div class="space-y-6">
    <!-- Order Summary -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">Order ID:</span>
                <span class="text-gray-900 dark:text-white">#{{ $record->id }}</span>
            </div>
            <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">Customer:</span>
                <span class="text-gray-900 dark:text-white">{{ $record->user->name }}</span>
            </div>
            <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">Table:</span>
                <span class="text-gray-900 dark:text-white">{{ $record->tableNumber->table_number }}</span>
            </div>
            <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    {{ $record->status === 'completed' ? 'bg-green-100 text-green-800' :
                       ($record->status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                       ($record->status === 'pending' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800')) }}">
                    {{ ucfirst($record->status) }}
                </span>
            </div>
        </div>
    </div>

    <!-- Order Items -->
    <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Items</h3>

        @if($record->orderItems->count() > 0)
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Item Name
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Type
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Price
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        @foreach($record->orderItems as $item)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        @if($item->image)
                                            <img class="h-10 w-10 rounded-full object-cover mr-3"
                                                 src="{{ asset('storage/' . $item->image) }}"
                                                 alt="{{ $item->item_name }}">
                                        @endif
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                                            {{ $item->item_name }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        {{ $item->item_type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800' }}">
                                        {{ ucfirst($item->item_type) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    ${{ number_format($item->item_price, 2) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {{ $item->quantity }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    ${{ number_format($item->total_price, 2) }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Order Total -->
            <div class="mt-6 flex justify-end">
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-w-64">
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span class="text-gray-900 dark:text-white">${{ number_format($record->subtotal, 2) }}</span>
                        </div>
                        @if($record->tax > 0)
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Tax:</span>
                                <span class="text-gray-900 dark:text-white">${{ number_format($record->tax, 2) }}</span>
                            </div>
                        @endif
                        <div class="flex justify-between text-lg font-semibold border-t pt-2">
                            <span class="text-gray-900 dark:text-white">Total:</span>
                            <span class="text-gray-900 dark:text-white">${{ number_format($record->total, 2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        @else
            <div class="text-center py-8">
                <div class="text-gray-500 dark:text-gray-400">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No items found</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This order doesn't have any items.</p>
                </div>
            </div>
        @endif
    </div>
</div>
