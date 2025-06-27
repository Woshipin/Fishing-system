<?php

namespace App\Filament\Resources\AboutPageContentResource\Pages;

use App\Filament\Resources\AboutPageContentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAboutPageContent extends EditRecord
{
    protected static string $resource = AboutPageContentResource::class;

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
            ->title('About Our Story Updated')
            ->body('The About Our Story has been successfully updated.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index'); // 关键代码：创建成功后跳转到 ListTags
    }
}
