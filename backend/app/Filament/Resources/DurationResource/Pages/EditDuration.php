<?php

namespace App\Filament\Resources\DurationResource\Pages;

use App\Filament\Resources\DurationResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDuration extends EditRecord
{
    protected static string $resource = DurationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getSavedNotification(): ?\Filament\Notifications\Notification
    {
        return \Filament\Notifications\Notification::make()
            ->success()
            ->title('Duration Updated')
            ->body('The Duration has been successfully updated.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index'); // 关键代码：创建成功后跳转到 ListTags
    }
}
