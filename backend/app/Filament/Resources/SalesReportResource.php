<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SalesReportResource\Pages;
use App\Models\Order;
use Carbon\Carbon;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SalesReportResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?string $navigationLabel = 'Sales Report';

    protected static ?string $slug = 'sales-report';

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
                    ->searchable(),

                TextColumn::make('user.name')
                    ->label('User Name')
                    ->searchable(),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->date('d M Y')
                    ->timezone($malaysiaTimezone)
                    ->sortable(),

                TextColumn::make('display_time')
                    ->label('Time')
                    ->getStateUsing(fn(Order $record): ?string => $record->created_at?->timezone($malaysiaTimezone)->format('h:i A')),

                TextColumn::make('subtotal')
                    ->label('Subtotal (RM)')
                    ->money('MYR')
                    ->sortable()
                    ->summarize(
                        Sum::make()
                            ->label('')
                            ->money('MYR')
                            // *** THE FIX IS HERE: Changed the color classes ***
                            ->extraAttributes([
                                'class' => 'text-base font-bold text-black dark:text-white',
                            ])
                    ),
            ])
            ->filters([
                Filter::make('daily')
                    ->label('Today')
                    ->query(fn(Builder $query): Builder => $query->whereDate('created_at', Carbon::today($malaysiaTimezone))),
                Filter::make('weekly')
                    ->label('This Week')
                    ->query(fn(Builder $query): Builder => $query->whereBetween('created_at', [
                        Carbon::now($malaysiaTimezone)->startOfWeek(),
                        Carbon::now($malaysiaTimezone)->endOfWeek(),
                    ])),
                Filter::make('monthly')
                    ->label('This Month')
                    ->query(fn(Builder $query): Builder => $query->whereYear('created_at', Carbon::now($malaysiaTimezone)->year)
                            ->whereMonth('created_at', Carbon::now($malaysiaTimezone)->month)),
            ])
            ->actions([])
            ->bulkActions([]);
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
}
