<?php

namespace App\Filament\Resources\DurationResource\Pages;

use App\Filament\Resources\DurationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDurations extends ListRecords
{
    protected static string $resource = DurationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
