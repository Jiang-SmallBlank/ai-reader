# AI Reader - 智能阅读应用

一个功能完整的全栈阅读应用，支持 PDF/EPUB 上传、阅读进度追踪、书籍管理等功能。

## 功能特性

- 🔐 **用户认证** - 基于 JWT 的邮箱登录系统
- 📚 **书籍管理** - 上传 PDF/EPUB 文件，自动提取元数据
- 📖 **PDF 阅读** - 使用 PDF.js 实现的完整 PDF 阅读器
- 📊 **阅读进度** - 追踪阅读进度和页数
- 🗑️ **书籍删除** - 删除书籍及相关数据，释放存储空间
- 🎨 **响应式设计** - 支持网格/列表视图切换
- 💾 **云端存储** - 使用 Supabase 作为数据库后端
- 🔍 **智能搜索** - 快速搜索书库中的书籍

## 技术栈

### 前端
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **TailwindCSS** - 样式框架
- **Lucide Icons** - 图标库
- **PDF.js** - PDF 渲染引擎

### 后端
- **Node.js** - 运行时环境
- **Express.js** - Web 框架
- **TypeScript** - 类型安全
- **Supabase** - 数据库和认证服务
- **JWT** - 身份验证
- **Multer** - 文件上传处理
- **pdf-parse** - PDF 元数据提取

## 数据库

- **PostgreSQL** - 通过 Supabase 提供
- **11 张数据表** - 完整的数据模型设计

## 快速开始

### 前置要求

- Node.js 20+ (推荐使用 nvm 管理 Node 版本)
- npm 或 yarn
- Supabase 账号

### 1. 克隆项目

```bash
git clone https://github.com/your-username/ai-reader.git
cd ai-reader
```

### 2. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 3. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 获取项目的 URL 和 anon key
3. 在 Supabase Dashboard 的 SQL Editor 中运行以下 SQL 脚本：

```sql
-- 禁用 RLS 以便开发
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE highlights DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE book_tags DISABLE ROW LEVEL SECURITY;
```

### 4. 配置环境变量

创建 `backend/.env` 文件：

```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-random-secret-key
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

创建前端 `.env` 文件（可选）：

```env
VITE_API_URL=http://localhost:3001/api
```

### 5. 启动应用

**启动后端**（在 backend 目录）：
```bash
cd backend
npm run dev
```

后端将运行在 `http://localhost:3001`

**启动前端**（在根目录）：
```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

### 6. 使用应用

1. 打开浏览器访问 `http://localhost:5173`
2. 点击"登录"按钮
3. 输入邮箱地址（任意格式即可）
4. 登录后即可开始使用
5. 点击"导入新书"上传 PDF 文件
6. 点击书籍封面开始阅读

## 项目结构

```
ai-reader/
├── src/                    # 前端源代码
│   ├── api/               # API 客户端
│   ├── components/        # React 组件
│   │   ├── PDFViewer.tsx # PDF 阅读器组件
│   │   └── ...
│   ├── constants/         # 常量定义
│   ├── types/            # TypeScript 类型
│   ├── views/            # 页面组件
│   │   ├── Dashboard.tsx # 书库页面
│   │   ├── Reader.tsx    # 阅读器页面
│   │   └── ...
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 入口文件
├── backend/              # 后端源代码
│   ├── src/
│   │   ├── config/      # 配置文件
│   │   ├── controllers/  # 控制器
│   │   ├── middleware/   # 中间件
│   │   ├── routes/      # 路由
│   │   ├── types/       # 类型定义
│   │   ├── utils/       # 工具函数
│   │   └── server.ts    # 服务器入口
│   ├── uploads/         # 上传文件目录（已 gitignore）
│   └── package.json
├── public/              # 静态资源
├── .gitignore          # Git 忽略文件
├── README.md           # 项目说明
└── package.json        # 前端依赖
```

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 书籍
- `GET /api/books` - 获取所有书籍
- `GET /api/books/:id` - 获取单本书籍详情
- `POST /api/books/upload` - 上传书籍
- `DELETE /api/books/:id` - 删除书籍
- `PUT /api/books/:id` - 更新书籍信息

### 阅读进度
- `GET /api/books/:id/progress` - 获取阅读进度
- `PUT /api/books/:id/progress` - 更新阅读进度

### 书签
- `GET /api/books/:id/bookmarks` - 获取书签列表
- `POST /api/books/:id/bookmarks` - 添加书签
- `DELETE /api/bookmarks/:id` - 删除书签

## 核心功能实现

### PDF 上传和阅读

1. **上传流程**：
   - 用户选择 PDF 文件
   - 前端使用 FormData 发送文件
   - 后端使用 Multer 接收文件
   - 使用 pdf-parse 提取 PDF 元数据（标题、作者、页数）
   - 保存到 Supabase 数据库
   - 初始化阅读进度记录

2. **阅读流程**：
   - 前端检测书籍是否有 file_url
   - 如果有，使用 PDFViewer 组件显示 PDF
   - 如果没有，显示模拟文本内容
   - PDF.js 处理 PDF 渲染和翻页

### 书籍删除

- 删除数据库中的书籍记录
- 删除服务器上的 PDF 文件
- 级联删除相关的阅读进度、书签和笔记
- 自动刷新书籍列表

## 常见问题

### PDF 无法加载

如果遇到 "Missing PDF" 错误：

1. 检查后端是否正在运行
2. 确认文件路径正确（`/uploads/filename.pdf`）
3. 检查浏览器控制台的错误信息
4. 确认 CORS 配置正确

详见 [PDF_LOADING_TROUBLESHOOTING.md](PDF_LOADING_TROUBLESHOOTING.md)

### 登录后无法跳转

确保已修复 RLS 策略问题，在 Supabase SQL Editor 中运行提供的 SQL 脚本。

### Node 版本问题

项目需要 Node.js 20+，可以使用 nvm 切换版本：

```bash
nvm install 20
nvm use 20
```

## 开发指南

### 添加新功能

1. 在 `backend/src/controllers/` 添加控制器逻辑
2. 在 `backend/src/routes/` 注册路由
3. 在 `src/api/` 添加前端 API 方法
4. 在 React 组件中使用 API 方法

### 数据库修改

1. 在 Supabase Dashboard 的 SQL Editor 中编写迁移脚本
2. 更新 `backend/src/types/` 中的类型定义
3. 更新相关的控制器和查询逻辑

## 部署

### 前端部署

构建生产版本：

```bash
npm run build
```

将 `dist` 目录部署到 Vercel、Netlify 或其他静态托管服务。

### 后端部署

可以使用以下平台部署后端：

- Railway
- Render
- Fly.io
- AWS EC2
- DigitalOcean

确保设置正确的环境变量。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请在 GitHub 上提 Issue。

## 更新日志

### v1.0.0 (2025-01-11)
- ✅ 完整的用户认证系统
- ✅ PDF/EPUB 上传功能
- ✅ PDF.js 阅读器
- ✅ 书籍管理（增删查改）
- ✅ 阅读进度追踪
- ✅ 网格/列表视图切换
- ✅ 书籍删除功能
- ✅ 响应式设计
