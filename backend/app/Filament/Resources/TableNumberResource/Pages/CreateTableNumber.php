<?php

namespace App\Filament\Resources\TableNumberResource\Pages;

use App\Filament\Resources\TableNumberResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateTableNumber extends CreateRecord
{
    protected static string $resource = TableNumberResource::class;

    protected function getCreatedNotification(): ?\Filament\Notifications\Notification
    {
        // 这里可以自定义成功消息
        return \Filament\Notifications\Notification::make()
            ->success()
            ->title('Table Number Created')
            ->body('The Table Number has been successfully created.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index'); // 关键代码：创建成功后跳转到 ListTags
    }
}
