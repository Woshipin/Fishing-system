<?php

namespace App\Filament\Resources\FishingCMSResource\Pages;

use App\Filament\Resources\FishingCMSResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFishingCMS extends ListRecords
{
    protected static string $resource = FishingCMSResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
