<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TableNumberResource\Pages;
use App\Models\TableNumber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class TableNumberResource extends Resource
{
    protected static ?string $model = TableNumber::class;

    protected static ?string $navigationIcon = 'heroicon-o-hashtag';
    protected static ?string $navigationLabel = 'Table Numbers';
    protected static ?string $pluralModelLabel = 'Table Numbers';
    protected static ?string $modelLabel = 'Table Number';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Table Info')
                    ->description('Please enter the table number.')
                    ->schema([
                        TextInput::make('number')
                            ->label('Table Number')
                            ->required()
                            ->maxLength(10)
                            ->placeholder('e.g., T1, 101')
                            ->columnSpanFull()
                            ->autofocus(),
                    ])
                    ->columns(1)
                    ->icon('heroicon-o-hashtag')
                    ->collapsible()
                    ->collapsed(false)
                    ->compact(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('number')
                    ->label('Table Number')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('Y-m-d H:i'),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime('Y-m-d H:i'),
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
            'index' => Pages\ListTableNumbers::route('/'),
            'create' => Pages\CreateTableNumber::route('/create'),
            'edit' => Pages\EditTableNumber::route('/{record}/edit'),
        ];
    }
}
