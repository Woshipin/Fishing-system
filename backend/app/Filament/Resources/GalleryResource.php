<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GalleryResource\Pages;
use App\Models\Gallery;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class GalleryResource extends Resource
{
    protected static ?string $model = Gallery::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    public static function form(Form $form): Form
    {
        // 判断是创建还是编辑页面
        if (request()->routeIs('filament.resources.galleries.create')) {
            // 批量新增
            return $form->schema([
                Section::make('Gallery Information 📸')
                    ->description('Please fill in the image details. You can add multiple images at once.')
                    ->schema([
                        Repeater::make('galleries')
                            ->label('Add Multiple Galleries')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        TextInput::make('title')
                                            ->label('Image Title')
                                            ->required()
                                            ->maxLength(255),
                                        FileUpload::make('image_path')
                                            ->label('Upload Image')
                                            ->disk('public')
                                            ->directory('galleries')
                                            ->image()
                                            ->imagePreviewHeight('250')
                                            ->acceptedFileTypes(['image/*'])
                                            ->required(),
                                    ]),
                            ])
                            ->columns(1)
                            ->minItems(1)
                            ->createItemButtonLabel('Add Another Image')
                            ->collapsible()
                            ->collapsed(false),
                    ])
                    ->columns(1)
                    ->collapsible()
                    ->collapsed(false)
                    ->icon('heroicon-o-photo')
                    ->compact(),
            ]);
        } else {
            // 单条编辑或查看
            return $form->schema([
                Section::make('Gallery Information 📸')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('title')
                                    ->label('Image Title')
                                    ->required()
                                    ->maxLength(255),
                                FileUpload::make('image_path')
                                    ->label('Upload Image')
                                    ->disk('public') // ✅ 修复这里
                                    ->directory('galleries')
                                    ->image()
                                    ->imagePreviewHeight('250')
                                    ->acceptedFileTypes(['image/*'])
                                    ->required(),
                            ]),
                    ])
                    ->columns(1)
                    ->collapsible()
                    ->collapsed(false)
                    ->icon('heroicon-o-photo')
                    ->compact(),
            ]);
        }
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('title')
                    ->label('Title')
                    ->sortable()
                    ->searchable(),
                ImageColumn::make('image_path')
                    ->label('Image')
                    ->disk('public'),
            ])
            ->filters([])
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
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListGalleries::route('/'),
            'create' => Pages\CreateGallery::route('/create'),
            'edit'   => Pages\EditGallery::route('/{record}/edit'),
        ];
    }
}
