<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SalesReportResource\Pages;
use App\Models\Order;
use Carbon\Carbon;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;

class SalesReportResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?string $navigationLabel = 'Sales Report';

    protected static ?string $slug = 'sales-report';

    protected static ?int $navigationSort = 16;

    /**
     * Build the table schema.
     *
     * @param  Table  $table
     * @return Table
     */
    public static function table(Table $table): Table
    {
        // Define the target timezone
        $malaysiaTimezone = 'Asia/Kuala_Lumpur';

        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('Order ID')
                    ->sortable()
                    ->searchable()
                    ->badge()
                    ->color('primary')
                    ->prefix('#')
                    ->size('sm')
                    ->weight('bold'),

                TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->icon('heroicon-m-user')
                    ->iconColor('gray')
                    ->weight('medium')
                    ->wrap(),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->date('d M Y')
                    ->timezone($malaysiaTimezone)
                    ->sortable()
                    ->icon('heroicon-m-calendar-days')
                    ->iconColor('blue')
                    ->badge()
                    ->color('info')
                    ->size('sm'),

                TextColumn::make('display_time')
                    ->label('Time')
                    ->getStateUsing(fn(Order $record): ?string => $record->created_at?->timezone($malaysiaTimezone)->format('h:i A'))
                    ->icon('heroicon-m-clock')
                    ->iconColor('green')
                    ->badge()
                    ->color('success')
                    ->size('sm'),

                TextColumn::make('subtotal')
                    ->label('Amount')
                    ->money('MYR')
                    ->sortable()
                    ->size('base')
                    ->icon('heroicon-m-currency-dollar')
                    ->iconColor('success')
                    ->summarize([
                        Sum::make()
                            ->label('')
                            ->money('MYR')
                            ->extraAttributes([
                                'class' => 'text-2xl font-bold px-6 py-3 rounded-xl border-2 border-success-200 dark:border-success-800 shadow-lg flex items-center gap-2',
                            ])
                            ->prefix('💰 ')
                    ]),
            ])
            ->filters([
                Filter::make('daily')
                    ->label('Today')
                    ->query(fn(Builder $query): Builder => $query->whereDate('created_at', Carbon::today($malaysiaTimezone)))
                    ->indicator('Today'),

                Filter::make('weekly')
                    ->label('This Week')
                    ->query(fn(Builder $query): Builder => $query->whereBetween('created_at', [
                        Carbon::now($malaysiaTimezone)->startOfWeek(),
                        Carbon::now($malaysiaTimezone)->endOfWeek(),
                    ]))
                    ->indicator('This Week'),

                Filter::make('monthly')
                    ->label('This Month')
                    ->query(fn(Builder $query): Builder => $query->whereYear('created_at', Carbon::now($malaysiaTimezone)->year)
                            ->whereMonth('created_at', Carbon::now($malaysiaTimezone)->month))
                    ->indicator('This Month'),

                Filter::make('amount_range')
                    ->form([
                        TextInput::make('from')
                            ->label('Minimum Amount (RM)')
                            ->numeric()
                            ->placeholder('0.00'),
                        TextInput::make('to')
                            ->label('Maximum Amount (RM)')
                            ->numeric()
                            ->placeholder('1000.00'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn (Builder $query, $date): Builder => $query->where('subtotal', '>=', $data['from']),
                            )
                            ->when(
                                $data['to'],
                                fn (Builder $query, $date): Builder => $query->where('subtotal', '<=', $data['to']),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['from'] ?? null) {
                            $indicators['from'] = 'Min: RM' . number_format($data['from'], 2);
                        }
                        if ($data['to'] ?? null) {
                            $indicators['to'] = 'Max: RM' . number_format($data['to'], 2);
                        }
                        return $indicators;
                    }),
            ])
            ->actions([])
            ->bulkActions([])
            ->striped()
            ->paginated([10, 25, 50, 100])
            ->poll('30s') // Auto-refresh every 30 seconds
            ->emptyStateIcon('heroicon-o-chart-bar')
            ->emptyStateHeading('No sales data found')
            ->emptyStateDescription('Start making sales to see your reports here.')
            ->headerActions([
                Tables\Actions\Action::make('refresh')
                    ->label('Refresh')
                    ->icon('heroicon-o-arrow-path')
                    ->color('gray')
                    ->action(fn () => null), // This will trigger a page refresh
            ])
            ->extremePaginationLinks()
            ->persistFiltersInSession()
            ->persistSortInSession()
            ->recordUrl(null) // Disable row click navigation
            ->recordAction(null); // Disable row click actions
    }

    /**
     * Get the resource pages.
     *
     * @return array
     */
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSalesReports::route('/'),
        ];
    }

    /**
     * This resource is for viewing data only, so we disable the create functionality.
     *
     * @return bool
     */
    public static function canCreate(): bool
    {
        return false;
    }

    /**
     * Get the navigation badge (shows total orders count).
     *
     * @return string|null
     */
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    /**
     * Get the navigation badge color.
     *
     * @return string|array|null
     */
    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'success';
    }
}
