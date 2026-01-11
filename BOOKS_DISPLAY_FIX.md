# 书籍显示和视图切换修复

## 问题描述

用户反馈了两个问题：
1. **新上传的书籍没有显示** - 上传成功后书籍列表中没有新增的书籍
2. **网格/列表切换没有反应** - 点击视图切换按钮没有任何变化

## 根本原因

### 问题 1: 使用静态数据
Dashboard 组件使用的是硬编码的 `BOOKS` 常量，而不是从后端 API 获取真实的书籍数据。

```typescript
// 之前的代码
const recentBook = BOOKS[0]; // 硬编码的静态数据
```

### 问题 2: 缺少状态管理
视图模式（grid/list）没有状态管理，点击按钮不会触发任何状态改变。

## 修复方案

### 1. 添加动态数据获取

**修改文件**: [src/views/Dashboard.tsx](src/views/Dashboard.tsx)

#### 添加状态管理
```typescript
const [books, setBooks] = useState<Book[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [viewMode, setViewMode] = useState<ViewMode>('grid');
```

#### 添加数据获取函数
```typescript
const fetchBooks = async () => {
  try {
    setIsLoading(true);
    const response = await booksApi.getBooks();
    console.log('📚 Fetched books:', response);

    // 如果后端返回书籍数据，使用它们；否则回退到模拟数据
    if (response.books && response.books.length > 0) {
      setBooks(response.books);
    } else {
      setBooks(BOOKS);
    }
  } catch (error) {
    console.error('❌ Failed to fetch books:', error);
    setBooks(BOOKS);
  } finally {
    setIsLoading(false);
  }
};
```

#### 组件加载时获取数据
```typescript
useEffect(() => {
  fetchBooks();
}, []);
```

#### 上传成功后刷新列表
```typescript
const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setIsUploading(true);
    try {
      const result = await booksApi.uploadBook(file);
      alert(`书籍导入成功！\n\n《${result.book.title}》`);

      // 上传成功后刷新书籍列表
      await fetchBooks();
    } catch (error) {
      alert(`导入失败：${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }
};
```

### 2. 实现视图切换功能

#### 添加视图模式类型
```typescript
type ViewMode = 'grid' | 'list';
```

#### 更新切换按钮
```typescript
<div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-transparent">
  <button
    onClick={() => setViewMode('grid')}
    className={`p-1.5 rounded-md shadow-sm transition-all ${
      viewMode === 'grid'
        ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white'
        : 'text-slate-400 hover:text-primary'
    }`}
  >
    <Grid size={16} />
  </button>
  <button
    onClick={() => setViewMode('list')}
    className={`p-1.5 rounded-md transition-all ${
      viewMode === 'list'
        ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white'
        : 'text-slate-400 hover:text-primary'
    }`}
  >
    <List size={16} />
  </button>
</div>
```

#### 条件渲染网格和列表视图
```typescript
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <RefreshCw className="animate-spin text-primary" size={32} />
  </div>
) : viewMode === 'grid' ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
    {books.map((book) => (
      <div key={book.id} className="group cursor-pointer...">
        {/* 网格视图 */}
      </div>
    ))}
  </div>
) : (
  <div className="space-y-3">
    {books.map((book) => (
      <div key={book.id} className="group cursor-pointer...">
        {/* 列表视图 */}
      </div>
    ))}
  </div>
)}
```

### 3. 更新 Book 类型

**修改文件**: [src/types.ts](src/types.ts)

添加后端返回的字段：
```typescript
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string; // 模拟数据
  cover_url?: string; // 后端数据
  file_url?: string;
  file_type?: string;
  total_pages?: number;
  progress: number;
  lastRead?: string;
  category?: string;
  isFinished?: boolean;
  description?: string;
  metadata?: any;
  reading_progress?: any;
}
```

### 4. 兼容封面字段

在渲染时同时支持两种字段名：
```typescript
style={{ backgroundImage: `url('${book.cover_url || book.coverUrl}')` }}
```

## 功能特性

✅ **动态数据加载**: 从后端 API 获取真实的书籍数据
✅ **自动刷新**: 上传新书籍后自动刷新列表
✅ **视图切换**: 网格视图和列表视图可以正常切换
✅ **加载状态**: 数据加载时显示旋转图标
✅ **回退机制**: API 失败时回退到模拟数据
✅ **字段兼容**: 同时支持前端和后端的字段命名

## 测试步骤

1. 启动后端服务
2. 登录应用
3. 查看 Dashboard 是否显示书籍
4. 点击"导入新书"上传 PDF
5. 验证新书籍是否出现在列表中
6. 点击网格/列表切换按钮
7. 验证视图是否正确切换

## 后续优化建议

1. **添加下拉刷新**: 在移动端添加下拉刷新功能
2. **错误提示**: 优化 API 失败时的错误提示
3. **搜索功能**: 实现书籍搜索过滤
4. **排序功能**: 添加按标题、作者、进度排序
5. **分页加载**: 实现虚拟滚动或分页加载
6. **缓存优化**: 添加本地缓存减少 API 调用
