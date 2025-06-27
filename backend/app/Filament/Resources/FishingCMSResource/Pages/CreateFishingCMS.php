<?php

namespace App\Filament\Resources\FishingCMSResource\Pages;

use App\Filament\Resources\FishingCMSResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateFishingCMS extends CreateRecord
{
    protected static string $resource = FishingCMSResource::class;

    protected function getCreatedNotification(): ?\Filament\Notifications\Notification
    {
        // 这里可以自定义成功消息
        return \Filament\Notifications\Notification::make()
            ->success()
            ->title('Fishing CMS Created')
            ->body('The Fishing CMS has been successfully created.');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index'); // 关键代码：创建成功后跳转到 ListTags
    }
}
