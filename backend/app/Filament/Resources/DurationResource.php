<?php
namespace App\Filament\Resources;

use App\Filament\Resources\DurationResource\Pages;
use App\Models\Duration;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DurationResource extends Resource
{
    // 指定对应的模型
    protected static ?string $model = Duration::class;

    // 侧边栏图标
    protected static ?string $navigationIcon = 'heroicon-o-clock';

    // 侧边栏显示的菜单文字
    protected static ?string $navigationLabel = 'Duration Options';

    // 数据表复数名
    protected static ?string $pluralModelLabel = 'Duration List';

    // 单个数据名称
    protected static ?string $modelLabel = 'Duration';

    // 表单设置
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // 表单区域，标题为 Duration Form，附加描述文字
                Section::make('Duration Form')
                    ->description('Create or edit a duration entry.')
                    ->schema([
                        // 只读字段：自动生成的时间名称（例如：3 hour(s) 30 minute(s)）
                        TextInput::make('name')
                            ->label('Auto Name')
                            ->disabled()   // 禁止用户修改
                            ->dehydrated() // 表单提交时仍然包含这个字段的值
                            ->default(function (?Duration $record) {
                                // 设置初始值（编辑时）为秒数拆分出来的小时和分钟组合文字
                                if (! $record) {
                                    return '0 minute';
                                }

                                $hours   = intdiv($record->seconds, 3600);
                                $minutes = intdiv($record->seconds % 3600, 60);

                                $name = '';
                                if ($hours > 0) {
                                    $name .= "{$hours} hour(s)";
                                }

                                if ($minutes > 0) {
                                    $name .= ($name !== '' ? ' ' : '') . "{$minutes} minute(s)";
                                }

                                if ($name === '') {
                                    $name = '0 minute';
                                }

                                return $name;
                            }),

                        // 使用 Grid 网格布局，分为两列：小时和分钟
                        Grid::make(2)->schema([
                            // 小时输入框
                            TextInput::make('hours')
                                ->label('Hours')                                                                 // 显示标签为 Hours
                                ->numeric()                                                                      // 限制只能输入数字
                                ->minValue(0)                                                                    // 最小值为 0
                                ->default(fn(?Duration $record) => $record ? intdiv($record->seconds, 3600) : 0) // 如果是编辑页面则从 seconds 拆出小时
                                ->reactive()                                                                     // 让 afterStateUpdated 钩子在用户输入时触发
                                ->afterStateUpdated(function (Get $get, Set $set) {
                                    // 获取用户输入的小时和分钟
                                    $hours   = (int) $get('hours');
                                    $minutes = (int) $get('minutes');

                                    // 计算总秒数并设置给 seconds 字段
                                    $seconds = ($hours * 3600) + ($minutes * 60);
                                    $set('seconds', $seconds);

                                    // 自动生成名称并更新 name 字段
                                    $name = '';
                                    if ($hours > 0) {
                                        $name .= "{$hours} hour(s)";
                                    }

                                    if ($minutes > 0) {
                                        $name .= ($name !== '' ? ' ' : '') . "{$minutes} minute(s)";
                                    }

                                    if ($name === '') {
                                        $name = '0 minute';
                                    }

                                    $set('name', $name);
                                }),

                            // 分钟输入框
                            TextInput::make('minutes')
                                ->label('Minutes')                                                                    // 显示标签为 Minutes
                                ->numeric()                                                                           // 限制只能输入数字
                                ->minValue(0)                                                                         // 最小值为 0
                                ->maxValue(59)                                                                        // 最大值为 59
                                ->default(fn(?Duration $record) => $record ? intdiv($record->seconds % 3600, 60) : 0) // 如果是编辑页面则从 seconds 拆出分钟
                                ->reactive()                                                                          // 让 afterStateUpdated 钩子在用户输入时触发
                                ->afterStateUpdated(function (Get $get, Set $set) {
                                    // 获取用户输入的小时和分钟
                                    $hours   = (int) $get('hours');
                                    $minutes = (int) $get('minutes');

                                    // 计算总秒数并设置给 seconds 字段
                                    $seconds = ($hours * 3600) + ($minutes * 60);
                                    $set('seconds', $seconds);

                                    // 自动生成名称并更新 name 字段
                                    $name = '';
                                    if ($hours > 0) {
                                        $name .= "{$hours} hour(s)";
                                    }

                                    if ($minutes > 0) {
                                        $name .= ($name !== '' ? ' ' : '') . "{$minutes} minute(s)";
                                    }

                                    if ($name === '') {
                                        $name = '0 minute';
                                    }

                                    $set('name', $name);
                                }),
                        ]),

                        // 总秒数字段（只读），实际用于保存到数据库
                        TextInput::make('seconds')
                            ->label('Total Seconds') // 显示标签为 Total Seconds
                            ->disabled()             // 禁止用户编辑
                            ->dehydrated(),          // 表单提交时包含此字段的值
                    ]),
            ]);
    }

    // 表格设置
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                // 显示名称
                Tables\Columns\TextColumn::make('name')
                    ->label('Duration Name')
                    ->sortable()
                    ->searchable(),

                // 显示总秒数（格式化为 H:i:s）
                Tables\Columns\TextColumn::make('seconds')
                    ->label('Total Duration')
                    ->formatStateUsing(fn($state) => gmdate('H:i:s', $state)),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                // 批量操作：删除
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    // 无关联模型
    public static function getRelations(): array
    {
        return [];
    }

    // 设置页面路由
    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListDurations::route('/'),
            'create' => Pages\CreateDuration::route('/create'),
            'edit'   => Pages\EditDuration::route('/{record}/edit'),
        ];
    }
}
