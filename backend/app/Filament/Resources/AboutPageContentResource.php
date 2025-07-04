<?php // PHP 文件的开始标记。

namespace App\Filament\Resources; // 声明此文件所在的 PHP 命名空间，用于组织代码和避免命名冲突。

// 导入（use）需要用到的类，以便在代码中直接使用它们的短名称。
use App\Filament\Resources\AboutPageContentResource\Pages; // 导入此资源关联的页面类（如列表、创建、编辑页面）。
use App\Models\AboutPageContent;                          // 导入与此资源对应的 Eloquent 模型。
use Filament\Forms\Components\RichEditor;                // 从表单组件中导入富文本编辑器类。
use Filament\Forms\Components\Section;                   // 从表单组件中导入区域（Section）布局类。
use Filament\Forms\Form;                                 // 导入 Form 类，用于定义表单结构。
use Filament\Resources\Resource;                         // 导入 Filament 的基础资源类，我们的资源类需要继承它。
use Filament\Tables\Actions\BulkActionGroup;             // 从表格操作中导入批量操作组类。
use Filament\Tables\Actions\DeleteAction;                // 从表格操作中导入删除单条记录的动作类。
use Filament\Tables\Actions\DeleteBulkAction;            // 从表格操作中导入批量删除记录的动作类。
use Filament\Tables\Actions\EditAction;                  // 从表格操作中导入编辑单条记录的动作类。
use Filament\Tables\Actions\ViewAction;                  // 从表格操作中导入查看单条记录的动作类。
use Filament\Tables\Columns\TextColumn;                  // 从表格列中导入文本列类。
use Filament\Tables\Table;                               // 导入 Table 类，用于定义表格结构。

// 定义一个 Filament 资源类，它关联 AboutPageContent 模型。
class AboutPageContentResource extends Resource
{
    // protected: 访问修饰符，表示该属性只能在类自身及其子类中访问。
    // static: 表示这是一个静态属性，属于类本身而不是类的实例。
    // ?string: 类型提示，表示该属性可以是字符串（string）或者空（null）。

    protected static ?string $model = AboutPageContent::class; // 指定此资源管理的 Eloquent 模型类。

    protected static ?string $navigationIcon  = 'heroicon-o-document-text'; // 设置在侧边导航栏中显示的图标。
    protected static ?string $navigationLabel = 'Story Content';            // 设置在侧边导航栏中显示的名称。
    protected static ?string $navigationGroup = 'About Us Page CMS';
    protected static ?int $navigationSort = 2;

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
            // 创建一个名为 'Our Story' 的表单区域（Section），用于在视觉上组织相关字段。
            Section::make('Our Story')
                // 为该区域添加一段描述性文字，解释这个区域的作用。
                ->description('The main narrative for the About Us page.')
                // 定义该区域内包含的表单组件。
                ->schema([
                    // 创建一个富文本编辑器，用于输入和编辑 'story_description' 字段。
                    RichEditor::make('story_description')
                        // 设置在界面上显示的标签文字。
                        ->label('Story Description')
                        // 将此字段设置为必填项。
                        ->required()
                        // 让该组件占据整个表单的宽度（跨越所有列）。
                        ->columnSpanFull()
                        // 自定义富文本编辑器的工具栏按钮，只保留指定的功能。
                        ->toolbarButtons([
                            'bold', 'italic', 'underline', 'strike', // 文本格式：加粗、斜体、下划线、删除线。
                            'bulletList', 'orderedList', 'link',    // 列表与链接：无序列表、有序列表、插入链接。
                            'undo', 'redo',                         // 编辑操作：撤销、重做。
                        ]),
                ])
                // 设置该区域内的布局网格为 1 列。
                ->columns(1),
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
                    // 设置列的表头标题为 '#'。
                    ->label('#')
                    // 允许用户点击表头对该列进行排序。
                    ->sortable()
                    // 将列内容居中对齐。
                    ->alignCenter()
                    // 设置文本颜色为灰色。
                    ->color('gray'),

                // 定义一个文本列，用于显示 'story_description' 的内容。
                TextColumn::make('story_description')
                    // 设置列的表头标题。
                    ->label('Story Snippet')
                    // 允许该列内容以 HTML 格式渲染（因为内容来自富文本编辑器）。
                    ->html()
                    // 限制显示的文本长度为 80 个字符，超出部分会截断。
                    ->limit(80)
                    // 当鼠标悬停在内容上时，显示完整的、移除了HTML标签的纯文本内容作为提示。
                    ->tooltip(fn($record) => strip_tags($record->story_description))
                    // 允许内容换行显示，防止过长的文本破坏表格布局。
                    ->wrap()
                    // 设置文本颜色为主题的主色调。
                    ->color('primary'),

                // 定义一个文本列，用于显示记录的最后更新时间。
                TextColumn::make('updated_at')
                    // 设置列的表头标题。
                    ->label('Last Updated')
                    // 以 "xx 时间前" 的友好格式显示日期时间。
                    ->since()
                    // 允许用户点击表头对该列进行排序。
                    ->sortable()
                    // 设置文本颜色为灰色。
                    ->color('gray'),
            ])
            // 启用斑马纹（隔行变色）样式，提升可读性。
            ->striped()
            // 设置每页显示记录数的可选选项。
            ->paginationPageOptions([5, 10, 25])
            // 定义表格的过滤器，这里为空数组，表示没有设置过滤器。
            ->filters([])
            // 定义每一行记录可以执行的操作（通常显示在行末）。
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
                        // 自定义按钮上显示的文字。
                        ->label('Delete Selected')
                        // 自定义按钮上显示的图标。
                        ->icon('heroicon-o-trash'),
                ]),
            ])
            // 【重要修改】禁用表格行的默认点击行为。设置为 null 后，点击行内数据将不再触发任何操作。
            ->recordAction(null); // ✅ 禁止整行点击跳转
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
            'index'  => Pages\ListAboutPageContents::route('/'),           // 'index' 页面（列表页）的路由为根路径 '/'。
            'create' => Pages\CreateAboutPageContent::route('/create'),    // 'create' 页面（创建页）的路由为 '/create'。
            'edit'   => Pages\EditAboutPageContent::route('/{record}/edit'), // 'edit' 页面（编辑页）的路由为 '/{record}/edit'，其中 {record} 是记录的 ID。
        ];
    }
}
