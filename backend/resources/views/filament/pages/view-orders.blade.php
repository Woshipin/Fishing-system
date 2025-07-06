<x-filament-panels::page>
    <style>
        /* 基础样式 */
        .order-item {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
            transition: all 0.3s ease-in-out;
        }

        .dark .order-item {
            background-color: rgba(31, 41, 55, 0.5);
            border-color: #374151;
        }

        /* --- 状态辉光边框样式 --- */
        .border-glow-pending {
            border-color: #fcd34d;
            box-shadow: 0 0 12px 1px rgba(251, 191, 36, 0.4);
        }

        .dark .border-glow-pending {
            border-color: #f59e0b;
            box-shadow: 0 0 12px 1px rgba(245, 158, 11, 0.3);
        }

        .border-glow-completed {
            border-color: #6ee7b7;
            box-shadow: 0 0 12px 1px rgba(52, 211, 153, 0.5);
        }

        .dark .border-glow-completed {
            border-color: #10b981;
            box-shadow: 0 0 12px 1px rgba(16, 185, 129, 0.4);
        }

        .border-glow-cancelled {
            border-color: #fca5a5;
            box-shadow: 0 0 12px 1px rgba(239, 68, 68, 0.4);
        }

        .dark .border-glow-cancelled {
            border-color: #ef4444;
            box-shadow: 0 0 12px 1px rgba(239, 68, 68, 0.3);
        }

        .order-details {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-in-out;
        }

        .order-details.show {
            max-height: 2000px;
        }

        /* 按钮样式 */
        .btn-complete {
            background-color: #059669 !important;
            color: white !important;
            border: none !important;
            padding: 0.5rem 1rem !important;
            border-radius: 0.5rem !important;
            font-weight: 600 !important;
            width: 100% !important;
            cursor: pointer !important;
            transition: background-color 0.2s !important;
        }

        .btn-complete:hover {
            background-color: #047857 !important;
        }

        .btn-cancel {
            background-color: white !important;
            color: #dc2626 !important;
            border: 1px solid #fca5a5 !important;
            padding: 0.5rem 1rem !important;
            border-radius: 0.5rem !important;
            font-weight: 600 !important;
            width: 100% !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .btn-cancel:hover {
            background-color: #fef2f2 !important;
        }

        .dark .btn-cancel {
            background-color: #1f2937 !important;
            border-color: #dc2626 !important;
            color: #ef4444 !important;
        }

        .dark .btn-cancel:hover {
            background-color: rgba(220, 38, 38, 0.1) !important;
        }

        /* 状态标签样式 */
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        .status-completed {
            background-color: #d1fae5;
            color: #065f46;
        }

        .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .dark .status-pending {
            background-color: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
        }

        .dark .status-completed {
            background-color: rgba(16, 185, 129, 0.2);
            color: #34d399;
        }

        .dark .status-cancelled {
            background-color: rgba(239, 68, 68, 0.2);
            color: #f87171;
        }

        /* 搜索框样式 */
        .search-input {
            width: 100%;
            padding: 0.5rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            background-color: white;
            color: #111827;
        }

        .dark .search-input {
            background-color: #1f2937;
            border-color: #4b5563;
            color: white;
        }

        .search-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    </style>

    <div class="space-y-6">
        <!-- Session Status Messages -->
        @if (session('success'))
            <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-800/20 dark:text-green-300"
                role="alert">
                <span class="font-medium">Success!</span> {{ session('success') }}
            </div>
        @endif
        @if (session('error'))
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-800/20 dark:text-red-300"
                role="alert">
                <span class="font-medium">Error!</span> {{ session('error') }}
            </div>
        @endif

        <!-- Search and Filter Controls -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <input wire:model.live.debounce.300ms="search" type="text" placeholder="Search by Price or Customer Name..." class="search-input">
            </div>
            <div>
                <select wire:model.live="dateFilter" class="search-input">
                    <option value="">All Time</option>
                    <option value="today">Today's Orders</option>
                    <option value="week">This Week's Orders</option>
                    <option value="month">This Month's Orders</option>
                </select>
            </div>
        </div>

        <!-- Orders List -->
        <div class="space-y-4" id="ordersList">
            @forelse($this->getAllOrders() as $order)
                @php
                    $orderType = $this->getOrderType($order);
                    $statusClass = match ($order->status) {
                        'pending' => 'status-pending',
                        'completed' => 'status-completed',
                        'cancelled' => 'status-cancelled',
                        default => 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                    };
                    $borderGlowClass = match ($order->status) {
                        'pending' => 'border-glow-pending',
                        'completed' => 'border-glow-completed',
                        'cancelled' => 'border-glow-cancelled',
                        default => '',
                    };
                @endphp
                <div class="order-item {{ $borderGlowClass }}" data-order-id="{{ $order->id }}"
                    wire:key="order-{{ $order->id }}">
                    <!-- Order Header (Clickable) -->
                    <div class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80"
                        onclick="toggleOrderDetails({{ $order->id }})">
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-4">
                                <h3 class="font-bold text-lg text-gray-900 dark:text-white">Order #{{ $order->id }}
                                </h3>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-400">
                                    {{ $orderType }}
                                </span>
                                <span class="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                                    {{ $order->created_at->format('M d, Y') }} by {{ $order->user->name }}
                                </span>
                            </div>
                            <div class="flex items-center gap-4">
                                <span
                                    class="text-lg font-bold text-gray-800 dark:text-gray-200">${{ number_format($order->total, 2) }}</span>
                                <span
                                    class="{{ $statusClass }} inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold">
                                    {{ ucfirst($order->status) }}
                                </span>
                                <svg id="arrow-{{ $order->id }}"
                                    class="w-5 h-5 text-gray-500 transition-transform duration-300" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Order Details (Collapsible Content) -->
                    <div id="details-{{ $order->id }}"
                        class="order-details border-t border-gray-200 dark:border-gray-700">
                        <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <!-- Left Column: Order Items & Totals -->
                            <div class="lg:col-span-2 space-y-6">
                                <h4 class="text-xl font-semibold text-gray-900 dark:text-white">Order Items</h4>
                                <div class="space-y-4">
                                    @foreach ($order->orderItems as $item)
                                        <div
                                            class="flex items-start justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                            <div class="flex items-center gap-4">
                                                {{-- This now works because the relationship is properly loaded --}}
                                                <img class="h-16 w-16 rounded-md object-cover"
                                                    src="{{ $item->display_image_url }}" alt="{{ $item->item_name }}">
                                                <div>
                                                    <p class="font-semibold text-gray-800 dark:text-gray-200">
                                                        {{ $item->item_name }}</p>
                                                    <p class="text-sm text-gray-600 dark:text-gray-400">
                                                        ${{ number_format($item->item_price, 2) }} x
                                                        {{ $item->quantity }}
                                                    </p>
                                                    @if ($item->item_details)
                                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            [{{ implode(', ', $item->item_details) }}]
                                                        </p>
                                                    @endif
                                                </div>
                                            </div>
                                            <p class="text-lg font-bold text-gray-900 dark:text-white">
                                                ${{ number_format($item->total_price, 2) }}
                                            </p>
                                        </div>
                                    @endforeach
                                </div>
                                <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                    <div class="flex justify-between items-center text-md"><span
                                            class="text-gray-600 dark:text-gray-400">Subtotal:</span><span
                                            class="font-medium text-gray-900 dark:text-white">${{ number_format($order->subtotal, 2) }}</span>
                                    </div>
                                    <div class="flex justify-between items-center text-md"><span
                                            class="text-gray-600 dark:text-gray-400">Tax:</span><span
                                            class="font-medium text-gray-900 dark:text-white">${{ number_format($order->tax, 2) }}</span>
                                    </div>
                                    <div
                                        class="flex justify-between items-center text-xl font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span class="text-gray-800 dark:text-gray-200">Total:</span><span
                                            class="text-gray-900 dark:text-white">${{ number_format($order->total, 2) }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: Order & Payment Info -->
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order
                                        Information</h4>
                                    <dl class="space-y-3 text-sm">
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Order ID:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">{{ $order->id }}
                                            </dd>
                                        </div>
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Order Date:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">
                                                {{ $order->created_at->format('M d, Y H:i') }}</dd>
                                        </div>
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Status:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">
                                                {{ ucfirst($order->status) }}</dd>
                                        </div>
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Order Type:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">{{ $orderType }}
                                            </dd>
                                        </div>
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Table:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">
                                                {{ $order->tableNumber->number ?? 'N/A' }}</dd>
                                        </div>
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Duration:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">
                                                {{ $order->duration->name ?? 'N/A' }}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment Method
                                    </h4>
                                    <dl class="space-y-3 text-sm">
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Method:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">
                                                {{ $order->payment_method ?? 'Debit Card' }}</dd>
                                        </div>
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Card Number:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">
                                                {{ $order->card_last_four ? '**** **** **** ' . $order->card_last_four : '**** **** **** 1234' }}
                                            </dd>
                                        </div>
                                        <div class="flex justify-between">
                                            <dt class="text-gray-500 dark:text-gray-400">Expiry Date:</dt>
                                            <dd class="font-medium text-gray-900 dark:text-white">
                                                {{ $order->card_expiry ?? '12/26' }}</dd>
                                        </div>
                                    </dl>
                                </div>

                                @if ($order->status === 'pending')
                                    <div class="space-y-3">
                                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Actions</h4>
                                        <div class="flex items-center gap-4">
                                            <!-- Complete Order Button -->
                                            <form action="{{ route('filament.orders.complete', $order) }}"
                                                method="POST" class="flex-1">
                                                @csrf
                                                @method('PUT')
                                                <button type="submit" class="btn-complete"
                                                    onclick="return confirm('Are you sure you want to mark this order as completed?')">
                                                    ✓ Complete Order
                                                </button>
                                            </form>
                                            <!-- Cancel Order Button -->
                                            <form action="{{ route('filament.orders.cancel', $order) }}"
                                                method="POST" class="flex-1">
                                                @csrf
                                                @method('PUT')
                                                <button type="submit" class="btn-cancel"
                                                    onclick="return confirm('Are you sure you want to cancel Order #{{ $order->id }}? This action cannot be undone.')">
                                                    ✕ Cancel Order
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div
                    class="text-center py-12 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No orders found</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">There are currently no orders to display.
                    </p>
                </div>
            @endforelse
        </div>

        <!-- Pagination -->
        <div class="mt-6">
            {{ $this->getAllOrders()->links() }}
        </div>
    </div>

    <!-- JavaScript for interactivity -->
    <script>
        function toggleOrderDetails(orderId) {
            const details = document.getElementById(`details-${orderId}`);
            const arrow = document.getElementById(`arrow-${orderId}`);
            if (details.classList.contains('show')) {
                details.classList.remove('show');
                arrow.style.transform = 'rotate(0deg)';
            } else {
                details.classList.add('show');
                arrow.style.transform = 'rotate(90deg)';
            }
        }

        // This function is no longer needed as Livewire handles filtering.
        // function filterOrders() { ... }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.order-details').forEach(detail => detail.classList.remove('show'));
            document.querySelectorAll('[id^="arrow-"]').forEach(arrow => arrow.style.transform = 'rotate(0deg)');
        });
    </script>
</x-filament-panels::page>
