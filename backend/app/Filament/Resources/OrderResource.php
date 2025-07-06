<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
// 关键改动：引入 Relation Manager
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make()
                            ->schema([
                                Forms\Components\Select::make('user_id')
                                    ->relationship('user', 'name')
                                    ->searchable()
                                    ->required(),
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'processing' => 'Processing',
                                        'completed' => 'Completed',
                                        'cancelled' => 'Cancelled',
                                    ])
                                    ->default('pending') // 推荐为新订单设置默认值
                                    ->required(),
                                Forms\Components\Select::make('table_number_id')
                                    ->relationship('tableNumber', 'table_number')
                                    ->searchable(),
                                Forms\Components\Select::make('duration_id')
                                    ->relationship('duration', 'name')
                                    ->searchable(),
                            ])->columns(2),

                        // 已移除空的 "Order Items" Section，因为它将由 Relation Manager 处理
                    ])
                    ->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make()
                            ->schema([
                                Forms\Components\Placeholder::make('created_at')
                                    ->label('Created at')
                                    ->content(fn (?Order $record): string => $record?->created_at?->toFormattedDateString() ?? 'Not saved yet'),
                                // 改进：在创建页面隐藏占位符
                                Forms\Components\Placeholder::make('updated_at')
                                    ->label('Last updated at')
                                    ->content(fn (?Order $record): string => $record?->updated_at?->diffForHumans() ?? 'Not updated yet'),
                                Forms\Components\Placeholder::make('subtotal')
                                    ->label('Subtotal')
                                    ->content(fn (?Order $record): string => '$' . number_format($record?->subtotal ?? 0, 2)),
                                Forms\Components\Placeholder::make('total')
                                    ->label('Total')
                                    ->content(fn (?Order $record): string => '$' . number_format($record?->total ?? 0, 2)),
                            ])->hiddenOn('create') // 在创建页面隐藏此部分
                    ])
                    ->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('user.name')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('tableNumber.table_number')->label('Table')->sortable(),
                Tables\Columns\TextColumn::make('duration.name')->label('Duration')->sortable(),
                Tables\Columns\TextColumn::make('subtotal')->money('USD')->sortable(),
                Tables\Columns\TextColumn::make('total')->money('USD')->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'secondary' => 'pending',
                        'warning' => 'processing',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Section::make('Order Information')
                    ->schema([
                        TextEntry::make('user.name')->label('Customer'),
                        TextEntry::make('tableNumber.table_number')->label('Table'),
                        TextEntry::make('status')->badge(),
                        TextEntry::make('total')->money('USD'),
                    ])->columns(2),
                Section::make('Order Items')
                    ->schema([
                        RepeatableEntry::make('orderItems')
                            ->schema([
                                TextEntry::make('item_name'),
                                TextEntry::make('item_type')->badge(),
                                TextEntry::make('item_price')->money('USD'),
                                TextEntry::make('quantity'),
                            ])->columns(4),
                    ]),
            ]);
    }

    /**
     * 关键改动：在这里注册关联管理器
     */
    public static function getRelations(): array
    {
        return [
            RelationManagers\OrderItemsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
