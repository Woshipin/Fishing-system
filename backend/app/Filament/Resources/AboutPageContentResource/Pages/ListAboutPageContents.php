<?php

namespace App\Filament\Resources\AboutPageContentResource\Pages;

use App\Filament\Resources\AboutPageContentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAboutPageContents extends ListRecords
{
    protected static string $resource = AboutPageContentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
