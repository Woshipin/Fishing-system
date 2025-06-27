<?php

namespace App\Filament\Resources\FishingCMSResource\Pages;

use App\Filament\Resources\FishingCMSResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Filament\Notifications\Notification;

class EditFishingCMS extends EditRecord
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
            Actions\DeleteAction::make(),
        ];
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Fishing CMS Updated')
            ->body('The Fishing CMS has been successfully updated.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
