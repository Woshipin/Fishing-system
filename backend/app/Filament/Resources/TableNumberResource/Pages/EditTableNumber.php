<?php

namespace App\Filament\Resources\TableNumberResource\Pages;

use App\Filament\Resources\TableNumberResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTableNumber extends EditRecord
{
    protected static string $resource = TableNumberResource::class;

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
            ->title('Table Number Updated')
            ->body('The Table Number has been successfully updated.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index'); // 关键代码：创建成功后跳转到 ListTags
    }
}
