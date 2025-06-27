<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FishingCMSResource\Pages;
use App\Models\Fishing_cms;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Forms\Components\Section as FormSection;
use Filament\Forms\Components\Grid as FormGrid;
use Filament\Infolists\Components\Section as InfolistSection;
use Filament\Infolists\Components\Grid as InfolistGrid;

class FishingCMSResource extends Resource
{
    protected static ?string $model = Fishing_cms::class;

    protected static ?string $slug = 'fishing-cms';

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    /**
     * 定义 Edit 页面的表单结构 (Form)
     */
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                FormSection::make('Home Page Content')
                    ->description('Settings for the main landing page.')
                    ->schema([
                        Forms\Components\TextInput::make('home_title')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('home_description')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                FormSection::make('About Us Page')
                    ->description('Content for the "About Us" section.')
                    ->schema([
                        Forms\Components\TextInput::make('about_us_title')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('about_us_description')
                            ->rows(5)
                            ->columnSpanFull(),
                    ]),

                FormSection::make('Contact & Opening Hours')
                    ->description('Manage contact details and business hours.')
                    ->collapsible()
                    ->schema([
                        FormGrid::make(2)->schema([
                            Forms\Components\TextInput::make('phone_number')
                                ->tel()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('email')
                                ->email()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('address')
                                ->columnSpanFull()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('opening_days_text')
                                ->label('Open Days')
                                ->placeholder('e.g., Mon - Sat'),
                            Forms\Components\TextInput::make('closing_day_text')
                                ->label('Close Day(s)')
                                ->placeholder('e.g., Sunday'),
                            Forms\Components\TimePicker::make('open_time')
                                ->label('Open Time')
                                ->seconds(false),
                            Forms\Components\TimePicker::make('close_time')
                                ->label('Close Time')
                                ->seconds(false),
                            Forms\Components\TextInput::make('special_holidays_text')
                                ->label('Special Holidays Info')
                                ->placeholder('e.g., Varies or Closed on public holidays')
                                ->columnSpanFull(),
                        ]),
                    ]),
            ]);
    }

    /**
     * 定义 View 页面的详情展示结构 (Infolist)
     */
    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                InfolistSection::make('Home Page Content')
                    ->schema([
                        Infolists\Components\TextEntry::make('home_title'),
                        Infolists\Components\TextEntry::make('home_description')->columnSpanFull(),
                    ]),
                InfolistSection::make('About Us Page')
                    ->schema([
                        Infolists\Components\TextEntry::make('about_us_title'),
                        Infolists\Components\TextEntry::make('about_us_description')->columnSpanFull(),
                    ]),
                InfolistSection::make('Contact & Opening Hours')
                    ->collapsible()
                    ->schema([
                        InfolistGrid::make(2)->schema([
                            Infolists\Components\TextEntry::make('phone_number')->icon('heroicon-s-phone'),
                            Infolists\Components\TextEntry::make('email')->icon('heroicon-s-envelope'),
                            Infolists\Components\TextEntry::make('address')->columnSpanFull(),
                            Infolists\Components\TextEntry::make('opening_days_text')->label('Open Days'),
                            Infolists\Components\TextEntry::make('closing_day_text')->label('Close Day(s)'),
                            Infolists\Components\TextEntry::make('open_time')
                                ->label('Hours')
                                ->formatStateUsing(function ($record) {
                                    if (! $record->open_time || ! $record->close_time) {
                                        return 'N/A';
                                    }
                                    return $record->open_time->format('g:i A') . ' - ' . $record->close_time->format('g:i A');
                                }),
                            Infolists\Components\TextEntry::make('special_holidays_text')
                                ->label('Special Holidays Info')
                                ->columnSpanFull(),
                        ]),
                    ]),
            ]);
    }

    /**
     * 定义资源的页面路由
     */
    public static function getPages(): array
    {
        return [
            'index' => Pages\ViewFishingCms::route('/'),
            'edit'  => Pages\EditFishingCMS::route('/edit'),
        ];
    }
}
