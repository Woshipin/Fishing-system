<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use App\Models\Package; // 引入 Package 模型
use App\Models\Product; // 引入 Product 模型
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get; // 引入 Get
use Filament\Forms\Set; // 引入 Set
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Collection; // 引入 Collection

class OrderItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'orderItems';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                // 1. 选择项目类型 (产品或套餐)
                Forms\Components\Select::make('item_type')
                    ->options([
                        'product' => 'Product',
                        'package' => 'Package',
                    ])
                    ->required()
                    ->live() // 使用 live() 使其成为响应式
                    ->afterStateUpdated(fn (Set $set) => $set('item_id', null)), // 类型改变时重置 item_id

                // 2. 根据 item_type 的选择，显示对应的项目
                Forms\Components\Select::make('item_id')
                    ->label('Item')
                    ->required()
                    ->searchable()
                    ->getSearchResultsUsing(function (string $search, Get $get): array {
                        $type = $get('item_type');
                        if (!$type) {
                            return [];
                        }
                        $model = $type === 'product' ? new Product() : new Package();
                        return $model->where('name', 'like', "%{$search}%")->limit(50)->pluck('name', 'id')->all();
                    })
                    ->getOptionLabelUsing(function ($value, Get $get): ?string {
                        $type = $get('item_type');
                        if (!$type) {
                            return null;
                        }
                        $model = $type === 'product' ? new Product() : new Package();
                        return $model->find($value)?->name;
                    })
                    // 当选择一个具体项目后，自动填充名称和价格
                    ->afterStateUpdated(function ($state, Get $get, Set $set) {
                        if (!$state) {
                            return;
                        }
                        $type = $get('item_type');
                        $model = $type === 'product' ? new Product() : new Package();
                        $item = $model->find($state);
                        if ($item) {
                            $set('item_name', $item->name);
                            $set('item_price', $item->price);
                        }
                    })
                    ->live(), // 确保在填充后UI能更新

                // 3. 自动填充或手动输入的字段
                Forms\Components\TextInput::make('item_name')
                    ->required()
                    ->maxLength(255),

                Forms\Components\TextInput::make('item_price')
                    ->label('Price')
                    ->numeric()
                    ->prefix('$')
                    ->required(),

                Forms\Components\TextInput::make('quantity')
                    ->numeric()
                    ->default(1)
                    ->required(),
            ])->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('item_name')
            ->columns([
                Tables\Columns\TextColumn::make('item_name'),
                Tables\Columns\TextColumn::make('item_type')->badge(),
                Tables\Columns\TextColumn::make('item_price')->money('USD'),
                Tables\Columns\TextColumn::make('quantity'),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total')
                    ->money('USD')
                    ->getStateUsing(fn ($record) => $record ? $record->item_price * $record->quantity : 0),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
