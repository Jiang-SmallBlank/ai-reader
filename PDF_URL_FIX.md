# PDF URL 修复说明

## 问题

PDF 文件无法加载，错误信息：
```
Missing PDF "http://localhost:3001/api/uploads/book-xxx.pdf"
```

## 根本原因

URL 路径构建错误：
- **错误路径**: `http://localhost:3001/api/uploads/book-xxx.pdf`
- **正确路径**: `http://localhost:3001/uploads/book-xxx.pdf`

文件上传路由是 `/uploads`，不是 `/api/uploads`。

## 修复方案

### 文件: src/views/Reader.tsx

**修改前**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
return `${API_BASE_URL}${book.file_url}`;
// 结果: http://localhost:3001/api + /uploads/book-xxx.pdf
//       = http://localhost:3001/api/uploads/book-xxx.pdf ❌
```

**修改后**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BASE_URL = API_BASE_URL.replace('/api', '');
return `${BASE_URL}${book.file_url}`;
// 结果: http://localhost:3001 + /uploads/book-xxx.pdf
//       = http://localhost:3001/uploads/book-xxx.pdf ✓
```

## 后端路由配置

### backend/src/server.ts

```typescript
// 静态文件服务 - 直接在根路径
app.use('/uploads', ...);

// API 路由 - 在 /api 路径下
app.use('/api', apiRoutes);
```

**路径说明**:
- API 端点: `http://localhost:3001/api/books`
- 文件访问: `http://localhost:3001/uploads/book-xxx.pdf`

## 测试验证

### 1. 检查文件是否可访问
在浏览器中直接访问：
```
http://localhost:3001/uploads/book-1768138971995-670327644.pdf
```

应该能直接下载或显示 PDF。

### 2. 检查前端控制台

**成功时的日志**:
```
📖 Using PDF viewer for: [书名]
📄 Loading PDF: http://localhost:3001/uploads/book-xxx.pdf
✅ PDF loaded successfully: XX pages
```

**失败时的日志**:
```
❌ Error loading PDF: Missing PDF "..."
```

### 3. 网络请求检查

打开浏览器开发者工具 → Network 标签：
- 找到 PDF 文件请求
- 状态应该是 `200 OK`
- URL 应该是 `http://localhost:3001/uploads/...`

## 相关文件

- [src/views/Reader.tsx:27-41](src/views/Reader.tsx#L27-L41) - URL 构建逻辑
- [backend/src/server.ts:45-52](backend/src/server.ts#L45-L52) - 静态文件服务配置

## 其他需要修复的地方

如果其他地方也构建文件 URL，需要应用相同的修复：

```typescript
// 通用方法
const getFileUrl = (fileUrl: string) => {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http')) return fileUrl;

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const BASE_URL = API_BASE_URL.replace('/api', '');

  return `${BASE_URL}${fileUrl}`;
};
```

## 环境变量

### .env 或 .env.local

```bash
# 前端配置
VITE_API_URL=http://localhost:3001/api

# 正确的文件访问路径
# 文件: http://localhost:3001/uploads/xxx.pdf
# API:  http://localhost:3001/api/books
```

## 刷新页面

修复后需要：
1. **刷新浏览器** (Ctrl+R 或 Cmd+R)
2. **硬刷新** (Ctrl+Shift+R 或 Cmd+Shift+R)
3. **重新点击书籍**进入阅读器

现在 PDF 应该可以正常加载了！
