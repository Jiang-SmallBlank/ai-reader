# PDF 阅读器实现

## 问题描述

用户点击"继续阅读"后，Reader 界面显示的是硬编码的模拟内容，而不是上传的 PDF 文件的实际内容。

## 解决方案

### 1. 安装 PDF.js 库

安装 Mozilla 的 PDF.js 库用于在浏览器中渲染 PDF 文件：

```bash
npm install pdfjs-dist@3.11.174
```

### 2. 创建 PDFViewer 组件

**文件**: [src/components/PDFViewer.tsx](src/components/PDFViewer.tsx)

#### 主要功能：
- 使用 PDF.js 加载和渲染 PDF 文件
- 支持翻页（上一页/下一页）
- 支持缩放（放大/缩小）
- 显示当前页码和总页数
- 加载状态指示器
- 错误处理

#### 核心代码：

```typescript
// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Load PDF document
const loadingTask = pdfjsLib.getDocument(fileUrl);
const pdf = await loadingTask.promise;

// Get page
const page = await pdf.getPage(pageNum);

// Render to canvas
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
const viewport = page.getViewport({ scale });
await page.render({ canvasContext: ctx, viewport }).promise;
```

### 3. 更新 Reader 组件

**文件**: [src/views/Reader.tsx](src/views/Reader.tsx)

#### 智能检测：
根据书籍是否有 `file_url` 字段自动判断使用哪种阅读器：

```typescript
useEffect(() => {
  if (book.file_url) {
    setUsePDFViewer(true);  // 使用 PDF 查看器
  } else {
    setUsePDFViewer(false); // 使用模拟内容
  }
}, [book]);
```

#### 条件渲染：

```typescript
{usePDFViewer ? (
  // PDF 查看器
  <PDFViewer
    fileUrl={getFileUrl()}
    title={book.title}
    onPageChange={(page) => setCurrentPage(page)}
  />
) : (
  // 模拟文本内容
  <div>{READER_CONTENT_BODY}</div>
)}
```

### 4. 文件 URL 处理

正确构建 PDF 文件的完整 URL：

```typescript
const getFileUrl = () => {
  if (!book.file_url) return '';

  // 如果已经是完整 URL，直接返回
  if (book.file_url.startsWith('http')) {
    return book.file_url;
  }

  // 否则添加后端 URL 前缀
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${API_BASE_URL}${book.file_url}`;
};
```

## 功能特性

### PDFViewer 组件
✅ **PDF 加载**: 从后端 URL 加载 PDF 文件
✅ **页面渲染**: 使用 Canvas 渲染 PDF 页面
✅ **翻页功能**: 上一页/下一页按钮
✅ **缩放功能**: 放大/缩小控制
✅ **页码显示**: 显示当前页码和总页数
✅ **加载状态**: 显示加载动画
✅ **错误处理**: 友好的错误提示
✅ **页面回调**: 通知父组件当前页面变化

### Reader 组件
✅ **智能切换**: 自动检测使用 PDF 查看器还是模拟内容
✅ **进度显示**: 在标题栏显示当前页码
✅ **向后兼容**: 没有文件的书籍仍显示模拟内容
✅ **完整 UI**: 保留侧边栏和其他功能

## 数据流程

```
1. 用户上传 PDF
   ↓
2. 后端保存文件到 backend/uploads/
   ↓
3. 后端返回 file_url: "/uploads/book-xxx.pdf"
   ↓
4. 前端保存 book 对象（包含 file_url）
   ↓
5. 用户点击"继续阅读"
   ↓
6. Reader 组件检测 book.file_url
   ↓
7. 构建完整 URL: "http://localhost:3001/uploads/book-xxx.pdf"
   ↓
8. PDFViewer 组件加载并渲染 PDF
   ↓
9. 用户可以看到真实的 PDF 内容
```

## CORS 配置

确保后端正确配置 CORS 以允许前端访问上传的文件：

**backend/src/server.ts**:
```typescript
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

**backend/.env**:
```env
CORS_ORIGIN=http://localhost:5173
```

## 测试步骤

1. 上传一个 PDF 文件
2. 等待上传完成
3. 在书籍列表中看到新上传的书籍
4. 点击书籍封面或"继续阅读"按钮
5. 应该看到 PDF 的实际内容
6. 测试翻页功能
7. 测试缩放功能

## 已知限制

1. **EPUB 支持**: 当前仅支持 PDF，EPUB 需要额外的库
2. **大文件**: 大型 PDF 文件可能加载较慢
3. **打印功能**: 当前没有实现打印功能
4. **注释功能**: PDF 上的注释还未实现

## 后续优化建议

1. **EPUB 支持**: 添加 epub.js 库支持 EPUB 格式
2. **书签功能**: 保存阅读位置和书签到数据库
3. **高亮功能**: 允许用户在 PDF 上高亮文本
4. **笔记功能**: 在特定页面添加笔记
5. **搜索功能**: 在 PDF 中搜索关键词
6. **双页视图**: 并排显示两页
7. **夜间模式**: PDF 的深色主题
8. **TTS**: 文字转语音功能
9. **离线缓存**: 使用 IndexedDB 缓存 PDF
10. **进度同步**: 定期保存阅读进度到后端

## 相关文件

- [src/components/PDFViewer.tsx](src/components/PDFViewer.tsx) - PDF 查看器组件
- [src/views/Reader.tsx](src/views/Reader.tsx) - 阅读器主界面
- [src/types.ts](src/types.ts) - Book 类型定义
- [backend/src/controllers/bookController.ts](backend/src/controllers/bookController.ts) - 书籍上传处理
- [backend/src/middleware/upload.ts](backend/src/middleware/upload.ts) - 文件上传配置
