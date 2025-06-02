<?php
namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Product Basic Info')
                ->schema([
                    Section::make('Basic Fields')
                        ->schema([
                            Grid::make(3)->schema([
                                TextInput::make('name')
                                    ->label('Product Name')
                                    ->required(),

                                TextInput::make('slug')
                                    ->label('Slug')
                                    ->required()
                                    ->unique(ignoreRecord: true),

                                Select::make('category_id')
                                    ->label('Category')
                                    ->relationship('category', 'name')
                                    ->required(),
                            ]),

                            Grid::make(3)->schema([
                                TextInput::make('price')
                                    ->label('Price')
                                    ->numeric()
                                    ->prefix('RM')
                                    ->required(),

                                TextInput::make('stock')
                                    ->label('Stock')
                                    ->numeric()
                                    ->default(0),

                                Toggle::make('is_active')
                                    ->label('Active Status')
                                    ->inline(false)
                                    ->default(true),
                            ]),
                        ]),

                    Section::make('Product Description')->schema([
                        Textarea::make('description')
                            ->label('Product Description')
                            ->rows(5)
                            ->placeholder('Enter product details')
                            ->columnSpanFull(),
                    ]),

                    Section::make('Product Images')
                        ->schema([
                            Repeater::make('images')
                                ->label('Product Images')
                                ->relationship('images')
                                ->schema([
                                    FileUpload::make('image_path')
                                        ->label('Image')
                                        ->image()
                                        ->disk('public')
                                        ->directory('product/images')
                                        ->visibility('public')
                                        ->enableOpen()
                                        ->enableDownload()
                                        ->required(),
                                ])
                                ->createItemButtonLabel('Add Image')
                                ->collapsible(),
                        ]),

                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordUrl(null)
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('name')
                    ->label('Product Name')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                ImageColumn::make('images.0.image_path')
                    ->label('Product image')
                    ->disk('public')
                    ->defaultImageUrl(function (Product $record) {
                        $image = $record->images()->first();
                        return $image ? Storage::disk('public')->url($image->image_path) : null;
                    }),

                TextColumn::make('description')
                    ->label('Product Description')
                    ->limit(50)
                    ->wrap(),

                TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('price')
                    ->label('Price (RM)')
                    ->money('MYR')
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),

                TextColumn::make('created_at')
                    ->label('Created At')
                    ->date('d M Y'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit'   => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
