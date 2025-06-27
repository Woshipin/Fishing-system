<?php

namespace App\Filament\Resources\FishingCMSResource\Pages;

use App\Filament\Resources\FishingCMSResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewFishingCms extends ViewRecord
{
    protected static string $resource = FishingCMSResource::class;

    public function mount(string|int $record = null): void
    {
        $recordModel = static::getModel()::firstOrCreate([]);
        parent::mount($recordModel->getKey());
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\Action::make('close')
                ->label('Close')
                ->color('gray')
                ->url(fn (): string => url('/admin')),
        ];
    }
}
