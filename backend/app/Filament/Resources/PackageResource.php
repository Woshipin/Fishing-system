<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackageResource\Pages;
use App\Models\Package;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;

class PackageResource extends Resource
{
    protected static ?string $model = Package::class;

    protected static ?string $navigationIcon = 'heroicon-o-archive-box';
    protected static ?string $navigationLabel = 'Packages';
    protected static ?int $navigationSort = 12;

    protected static ?string $pluralModelLabel = 'Packages';
    protected static ?string $modelLabel = 'Package';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'success';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Package Details')
                ->schema([
                    TextInput::make('name')
                        ->label('Package Name')
                        ->required()
                        ->maxLength(255),

                    Textarea::make('description')
                        ->label('Description')
                        ->rows(4),

                    TextInput::make('price')
                        ->label('Price')
                        ->numeric()
                        ->prefix('RM')
                        ->required(),

                    FileUpload::make('image')
                        ->label('Package Image')
                        ->image()
                        ->directory('packages/images')
                        ->disk('public')
                        ->visibility('public')
                        ->enableOpen()
                        ->enableDownload()
                        ->required(),

                    Toggle::make('is_active')
                        ->label('Active')
                        ->default(true),

                    Select::make('category_id')
                        ->label('Category')
                        ->relationship('category', 'name')
                        ->searchable()
                        ->required()
                        ->preload(),

                    Select::make('products')
                        ->label('Select Products')
                        ->relationship('products', 'name')
                        ->multiple()
                        ->preload()
                        ->searchable()
                        ->required(),
                ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('name')->searchable()->sortable(),
                ImageColumn::make('image')
                    ->label('Image')
                    ->disk('public')
                    ->visibility('public'),
                TextColumn::make('price')->money('MYR')->sortable(),
                IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                TextColumn::make('products.name')
                    ->label('Products')
                    ->badge()
                    ->limitList(3),
                TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable(),
            ])
            ->filters([
                //
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
            'index' => Pages\ListPackages::route('/'),
            'create' => Pages\CreatePackage::route('/create'),
            'edit' => Pages\EditPackage::route('/{record}/edit'),
        ];
    }
}
