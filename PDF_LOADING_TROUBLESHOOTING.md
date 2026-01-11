# PDF 加载问题排查指南

## 问题描述
点击"继续阅读"后显示"无法加载 PDF 文件"

## 已实施的修复

### 1. CORS 配置修复 ✅
**文件**: backend/src/server.ts

**修改内容**:
```typescript
// 1. 修改 Helmet 配置允许跨域资源
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. 为 /uploads 路由添加 CORS 头
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));
```

### 2. 改进 PDF 错误日志 ✅
**文件**: src/components/PDFViewer.tsx

**修改内容**:
- 添加详细的错误信息输出
- 在错误提示中显示具体的错误消息
- 添加 `withCredentials: true` 选项

## 测试步骤

### 步骤 1: 重启后端服务
```bash
cd backend
npm run dev
```

### 步骤 2: 在浏览器中打开测试页面
打开文件: `test-pdf.html`

依次测试:
1. **Test 1**: 点击 PDF 链接，确认文件可以直接访问
2. **Test 2**: 点击 "Test API Connection" 按钮
3. **Test 3**: 点击 "Test PDF.js" 按钮

### 步骤 3: 检查浏览器控制台
1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 点击"继续阅读"
4. 查看错误信息

### 步骤 4: 检查网络请求
1. 切换到 Network 标签
2. 刷新页面
3. 查找 PDF 文件的请求 (应该类似 `book-xxx.pdf`)
4. 检查:
   - Status Code (应该是 200)
   - Response Headers (应该有 CORS 头)
   - Size (应该 > 0)

## 常见问题诊断

### 问题 A: 404 Not Found
**原因**: 文件路径错误或文件不存在

**解决**:
```bash
# 检查文件是否存在
ls -lah backend/uploads/

# 检查文件权限
chmod 644 backend/uploads/*.pdf
```

### 问题 B: CORS Error
**症状**: 控制台显示 "Access to fetch at 'xxx' has been blocked by CORS policy"

**原因**: 后端没有正确设置 CORS 头

**解决**:
1. 确认后端已应用上述修复
2. 重启后端服务
3. 检查 `.env` 文件中的 `CORS_ORIGIN` 设置

### 问题 C: PDF.js Loading Error
**症状**: `Unexpected server response (404)`

**原因**: PDF.js worker 无法加载

**解决**:
确认 worker URL 正确:
```typescript
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

### 问题 D: 权限错误
**症状**: `Permission denied` 或 `403 Forbidden`

**解决**:
```bash
# 确保上传目录可读
chmod 755 backend/uploads/
```

## 调试命令

### 1. 测试文件访问
```bash
curl -I http://localhost:3001/uploads/book-1768139449709-3824812.pdf
```

应该返回:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Content-Type: application/pdf
```

### 2. 检查后端日志
后端控制台应该显示:
```
📚 Upload request received
📄 File received: xxx.pdf, size: xxxxx
🔍 Extracting PDF metadata...
✅ PDF metadata extracted
✅ Book created with ID: xxx
✅ Reading progress initialized
```

### 3. 检查前端请求
在浏览器控制台应该看到:
```
📖 Using PDF viewer for: [书名]
📄 Loading PDF: http://localhost:3001/uploads/book-xxx.pdf
✅ PDF loaded successfully: XX pages
```

## 替代方案

如果上述方法都不行，可以尝试:

### 方案 1: 使用 Base64 编码
将 PDF 转换为 Base64 嵌入数据库:
```typescript
// 在上传时
const base64 = await fs.readFile(file.path, 'base64');
await supabase.from('books').insert({ file_data: base64 });

// 在前端加载时
const pdfData = atob(book.file_data);
const loadingTask = pdfjsLib.getDocument({ data: pdfData });
```

### 方案 2: 使用 Blob URL
```typescript
const response = await fetch(fileUrl);
const blob = await response.blob();
const blobUrl = URL.createObjectURL(blob);
const loadingTask = pdfjsLib.getDocument(blobUrl);
```

## 下一步

1. **重启后端**: `cd backend && npm run dev`
2. **刷新前端**: 硬刷新 (Ctrl+Shift+R 或 Cmd+Shift+R)
3. **再次测试**: 上传新的 PDF 或尝试打开现有的
4. **查看日志**: 浏览器控制台和后端终端的输出

## 需要提供的信息

如果问题仍然存在，请提供:
1. 浏览器控制台的完整错误信息
2. Network 标签中 PDF 请求的详细信息
3. test-pdf.html 的测试结果
4. 后端日志输出
