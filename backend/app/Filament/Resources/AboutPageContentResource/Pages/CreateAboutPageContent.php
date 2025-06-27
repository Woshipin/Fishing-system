<?php

namespace App\Filament\Resources\AboutPageContentResource\Pages;

use App\Filament\Resources\AboutPageContentResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateAboutPageContent extends CreateRecord
{
    protected static string $resource = AboutPageContentResource::class;

    protected function getCreatedNotification(): ?\Filament\Notifications\Notification
    {
        // 这里可以自定义成功消息
        return \Filament\Notifications\Notification::make()
            ->success()
            ->title('About Our Story Created')
            ->body('The About Our Story has been successfully created.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index'); // 关键代码：创建成功后跳转到 ListTags
    }
}
