<?php
namespace App\Filament\Resources\GalleryResource\Pages;

use App\Filament\Resources\GalleryResource;
use App\Models\Gallery;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateGallery extends CreateRecord
{
    protected static string $resource = GalleryResource::class;

    // 重写 create() 方法，实现批量插入功能
    public function create(bool $another = false): void
    {
        $formData = $this->form->getState();

        if (isset($formData['galleries']) && is_array($formData['galleries'])) {
            foreach ($formData['galleries'] as $galleryData) {
                Gallery::create($galleryData);
            }

            Notification::make()
                ->success()
                ->title('Gallery Created')
                ->body('The Gallery has been successfully created.')
                ->send();

            $this->redirect($this->getRedirectUrl());
        } else {
            parent::create($another);
        }
    }

    // 成功提示（可以自定义）
    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Gallery Created')
            ->body('The Gallery has been successfully created.');
    }

    // 创建成功后跳转的 URL
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
