<?php // PHP 文件的开始标记。

namespace App\Filament\Resources; // 声明此文件所在的 PHP 命名空间，用于组织代码和避免命名冲突。

// 导入（use）需要用到的类，以便在代码中直接使用它们的短名称。
use App\Filament\Resources\MilestoneResource\Pages; // 导入此资源关联的页面类（如列表、创建、编辑页面）。
use App\Models\Milestone;                           // 导入与此资源对应的 Eloquent 模型。
use Filament\Forms\Components\Section;              // 从表单组件中导入区域（Section）布局类。
use Filament\Forms\Components\Textarea;             // 从表单组件中导入文本区域（Textarea）输入类。
use Filament\Forms\Components\TextInput;            // 从表单组件中导入文本输入（TextInput）类。
use Filament\Forms\Form;                            // 导入 Form 类，用于定义表单结构。
use Filament\Resources\Resource;                    // 导入 Filament 的基础资源类，我们的资源类需要继承它。
use Filament\Tables\Actions\BulkActionGroup;        // 从表格操作中导入批量操作组类。
use Filament\Tables\Actions\DeleteAction;           // 从表格操作中导入删除单条记录的动作类。
use Filament\Tables\Actions\DeleteBulkAction;       // 从表格操作中导入批量删除记录的动作类。
use Filament\Tables\Actions\EditAction;             // 从表格操作中导入编辑单条记录的动作类。
use Filament\Tables\Actions\ViewAction;             // 从表格操作中导入查看单条记录的动作类。
use Filament\Tables\Columns\TextColumn;             // 从表格列中导入文本列类。
use Filament\Tables\Table;                          // 导入 Table 类，用于定义表格结构。

// 定义一个 Filament 资源类，它关联 Milestone 模型。
class MilestoneResource extends Resource
{
    // protected: 访问修饰符，表示该属性只能在类自身及其子类中访问。
    // static: 表示这是一个静态属性，属于类本身而不是类的实例。
    // ?string: 类型提示，表示该属性可以是字符串（string）或者空（null）。

    protected static ?string $model = Milestone::class; // 指定此资源管理的 Eloquent 模型类。

    protected static ?string $navigationIcon       = 'heroicon-o-flag';   // 设置在侧边导航栏中显示的图标。
    protected static ?string $navigationGroup      = 'About Us Page CMS'; // 将此资源归类到 "About Us Page CMS" 导航组下。
    protected static ?int $navigationSort = 2;
    protected static ?string $recordTitleAttribute = 'title';            // 当在其他地方引用此记录时，默认使用 'title' 字段作为显示标题。

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'success';
    }

    /**
     * 定义用于创建和编辑记录的表单结构。
     *
     * @param Form $form 表单实例
     * @return Form 配置好的表单实例
     */
    public static function form(Form $form): Form
    {
        // 返回表单实例，并通过 schema() 方法定义其包含的所有字段和布局。
        return $form->schema([
            // 创建一个名为 'Milestone Event' 的表单区域（Section）。
            Section::make('Milestone Event')
                // 为该区域添加一段描述性文字。
                ->description('Key events or achievements in the company\'s journey.')
                // 设置该区域内的布局网格为 2 列。
                ->columns(2)
                // 定义该区域内包含的表单组件。
                ->schema([
                    // 创建一个文本输入框，用于 'title' 字段。
                    TextInput::make('title')
                        // 将此字段设置为必填项。
                        ->required()
                        // 设置最大输入长度为 255 个字符。
                        ->maxLength(255)
                        // 让该组件占据整个宽度（即跨越父容器的所有列，这里是 2 列）。
                        ->columnSpanFull(),

                    // 创建一个文本输入框，用于 'year' 字段。
                    TextInput::make('year')
                        // 限制只能输入数字。
                        ->numeric()
                        // 将此字段设置为必填项。
                        ->required()
                        // 设置允许的最小值为 1900。
                        ->minValue(1900)
                        // 设置允许的最大值为当前年份。
                        ->maxValue(date('Y'))
                        // 设置在界面上显示的标签文字。
                        ->label('Year (e.g., 2021)'),

                    // 创建一个多行文本输入区域，用于 'description' 字段。
                    Textarea::make('description')
                        // 设置在界面上显示的标签文字。
                        ->label('Description')
                        // 设置默认显示的行数为 4 行。
                        ->rows(4)
                        // 让该组件占据整个宽度。
                        ->columnSpanFull(),
                ]),
        ]);
    }

    /**
     * 定义用于显示记录列表的表格结构。
     *
     * @param Table $table 表格实例
     * @return Table 配置好的表格实例
     */
    public static function table(Table $table): Table
    {
        // 返回表格实例，并配置其列、过滤器、操作等。
        return $table
            // 定义表格需要显示的列。
            ->columns([
                // 定义一个文本列，用于显示记录的 ID。
                TextColumn::make('id')
                    ->label('#')              // 设置列的表头标题。
                    ->sortable()            // 允许对该列进行排序。
                    ->alignCenter()         // 将列内容居中对齐。
                    ->color('gray'),        // 设置文本颜色为灰色。

                // 定义一个文本列，用于显示 'year' 字段。
                TextColumn::make('year')
                    ->label('Year')         // 设置列的表头标题。
                    ->sortable()            // 允许对该列进行排序。
                    ->alignCenter()         // 将列内容居中对齐。
                    ->color('primary'),     // 设置文本颜色为主题的主色调。

                // 定义一个文本列，用于显示 'title' 字段。
                TextColumn::make('title')
                    ->label('Milestone Title') // 设置列的表头标题。
                    ->limit(50)                // 限制显示的文本长度为 50 个字符。
                    ->tooltip(fn(Milestone $record) => $record->title) // 鼠标悬停时显示完整的标题内容。
                    ->searchable()             // 允许在全局搜索框中搜索此列的内容。
                    ->color('primary'),        // 设置文本颜色为主题的主色调。

                // 定义一个文本列，用于显示 'description' 字段。
                TextColumn::make('description')
                    ->label('Description')     // 设置列的表头标题。
                    ->limit(60)                // 限制显示的文本长度为 60 个字符。
                    ->wrap()                   // 允许内容换行显示。
                    ->toggleable(isToggledHiddenByDefault: true), // 允许用户切换此列的可见性，且默认是隐藏的。

                // 定义一个文本列，用于显示记录的最后更新时间。
                TextColumn::make('updated_at')
                    ->label('Last Updated') // 设置列的表头标题。
                    ->since()               // 以 "xx 时间前" 的友好格式显示日期时间。
                    ->sortable()            // 允许对该列进行排序。
                    ->toggleable(isToggledHiddenByDefault: true), // 允许用户切换此列的可见性，且默认是隐藏的。
            ])
            // 启用斑马纹（隔行变色）样式，提升可读性。
            ->striped()
            // 设置每页显示记录数的可选选项。
            ->paginationPageOptions([5, 10, 25])
            // 定义每一行记录可以执行的操作。
            ->actions([
                ViewAction::make(),   // 添加一个标准的“查看”操作。
                EditAction::make(),   // 添加一个标准的“编辑”操作。
                DeleteAction::make(), // 添加一个标准的“删除”操作。
            ])
            // 定义可以对选中的多条记录执行的批量操作。
            ->bulkActions([
                // 将多个批量操作组合在一起，形成一个下拉菜单。
                BulkActionGroup::make([
                    // 添加一个标准的“批量删除”操作。
                    DeleteBulkAction::make()
                        ->icon('heroicon-o-trash'), // 自定义按钮上显示的图标。
                ]),
            ])
            // 【新增配置】禁用表格行的点击行为，这样用户必须通过点击“编辑”按钮才能进入编辑页面。
            ->recordAction(null);
    }

    /**
     * 定义该资源包含的页面及其对应的路由。
     *
     * @return array 页面和路由的映射数组。
     */
    public static function getPages(): array
    {
        // 返回一个数组，键是页面的唯一标识，值是页面的路由配置。
        return [
            'index'  => Pages\ListMilestones::route('/'),           // 'index' 页面（列表页）的路由为根路径 '/'。
            'create' => Pages\CreateMilestone::route('/create'),    // 'create' 页面（创建页）的路由为 '/create'。
            'edit'   => Pages\EditMilestone::route('/{record}/edit'), // 'edit' 页面（编辑页）的路由为 '/{record}/edit'，其中 {record} 是记录的 ID。
        ];
    }
}
