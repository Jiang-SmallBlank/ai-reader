# AI Reader - 智能阅读应用

一个基于 React + Node.js + Supabase 构建的智能阅读应用，支持书籍管理、阅读进度追踪、AI 生成的阅读洞察和周报功能。

## 功能特性

- 📚 **书籍管理** - 导入、分类、搜索您的数字藏书
- 📖 **深度阅读器** - 沉浸式阅读体验，支持书签和笔记
- 📊 **阅读统计** - 追踪阅读时长、页数、专注度等数据
- 🤖 **AI 洞察** - 自动生成阅读总结、概念提取和金句推荐
- 🏆 **成就系统** - 阅读徽章和连胜记录激励持续阅读
- 🌙 **深色模式** - 支持明暗主题切换

## 技术栈

### 前端
- React 19 + TypeScript
- Vite
- TailwindCSS (通过 CDN)
- Recharts (图表)
- Lucide Icons

### 后端
- Node.js + Express + TypeScript
- Supabase (PostgreSQL 数据库)
- JWT 认证
- 文件上传支持

## 项目结构

```
ai-reader/
├── src/                      # 前端源代码
│   ├── api/                  # API 客户端
│   │   ├── client.ts         # HTTP 客户端封装
│   │   └── index.ts          # API 方法
│   ├── components/           # React 组件
│   │   └── Sidebar.tsx
│   ├── views/                # 页面视图
│   │   ├── Landing.tsx       # 登录页
│   │   ├── Dashboard.tsx     # 仪表板
│   │   ├── Reader.tsx        # 阅读器
│   │   ├── Report.tsx        # 阅读报告
│   │   ├── Profile.tsx       # 用户资料
│   │   └── Settings.tsx      # 设置
│   ├── types.ts              # TypeScript 类型定义
│   ├── constants.ts          # 常量数据
│   ├── App.tsx               # 主应用组件
│   └── main.tsx              # 入口文件
│
├── backend/                  # 后端源代码
│   ├── src/
│   │   ├── config/           # 配置文件
│   │   │   └── database.ts   # Supabase 客户端
│   │   ├── controllers/      # 控制器
│   │   │   ├── authController.ts
│   │   │   ├── bookController.ts
│   │   │   ├── readingController.ts
│   │   │   └── reportController.ts
│   │   ├── middleware/       # 中间件
│   │   │   ├── auth.ts       # JWT 认证
│   │   │   ├── validation.ts # 请求验证
│   │   │   └── error.ts      # 错误处理
│   │   ├── routes/           # 路由
│   │   │   └── index.ts
│   │   ├── types/            # 类型定义
│   │   │   └── index.ts
│   │   ├── scripts/          # 工具脚本
│   │   │   └── seed.ts       # 种子数据
│   │   └── server.ts         # 服务器入口
│   ├── supabase/
│   │   └── migrations/       # 数据库迁移
│   │       └── 001_initial_schema.sql
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── index.html                # HTML 入口
├── vite.config.ts            # Vite 配置
├── package.json              # 前端依赖
├── tsconfig.json             # TypeScript 配置
├── .env.example              # 前端环境变量示例
└── BACKEND_README.md         # 本文档
```

## 快速开始

### 1. 设置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在项目设置中获取以下信息:
   - Project URL
   - anon/public key
   - service_role key (仅用于后端)
3. 在 SQL Editor 中运行 `backend/supabase/migrations/001_initial_schema.sql` 创建数据表

### 2. 后端设置

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入您的 Supabase 凭证

# 运行开发服务器
npm run dev

# (可选) 运行种子数据
npm run db:seed
```

后端将运行在 `http://localhost:3001`

### 3. 前端设置

```bash
# 在项目根目录
npm install

# 配置环境变量
cp .env.example .env
# .env 文件内容: VITE_API_URL=http://localhost:3001/api

# 运行开发服务器
npm run dev
```

前端将运行在 `http://localhost:5173`

### 4. 登录应用

使用种子数据创建的演示账号登录:
- Email: `demo@example.com`
- Password: 任意密码（演示模式）

## API 文档

### 认证

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户资料

### 书籍

- `GET /api/books` - 获取书籍列表
- `GET /api/books/:id` - 获取单本书籍详情
- `GET /api/books/recent` - 获取最近阅读的书籍
- `POST /api/books` - 创建新书籍
- `PUT /api/books/:id` - 更新书籍
- `DELETE /api/books/:id` - 删除书籍

### 阅读进度

- `GET /api/reading/progress/:bookId` - 获取阅读进度
- `PUT /api/reading/progress/:bookId` - 更新阅读进度
- `POST /api/reading/sessions/:bookId/start` - 开始阅读会话
- `PUT /api/reading/sessions/:sessionId/end` - 结束阅读会话

### 书签和金句

- `GET /api/bookmarks` - 获取书签列表
- `POST /api/bookmarks` - 创建书签
- `DELETE /api/bookmarks/:id` - 删除书签
- `GET /api/quotes` - 获取金句列表
- `POST /api/quotes` - 创建金句

### 报告和统计

- `GET /api/reports/weekly` - 获取周报
- `GET /api/reports/weekly/stats` - 获取周统计数据
- `GET /api/reports/insights` - 获取 AI 洞察
- `GET /api/reports/heatmap` - 获取阅读热力图
- `GET /api/reports/profile-stats` - 获取用户统计数据
- `GET /api/reports/achievements` - 获取成就

## 部署

### 后端部署

1. 设置生产环境变量
2. 构建 TypeScript: `npm run build`
3. 启动服务: `npm start`
4. 推荐使用 PM2 或 Docker 进行进程管理

### 前端部署

1. 构建生产版本: `npm run build`
2. 部署到 Vercel/Netlify 或任何静态托管服务
3. 确保设置正确的 `VITE_API_URL` 环境变量

## 环境变量

### 后端 (backend/.env)

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=production
CORS_ORIGIN=your_frontend_url
```

### 前端 (.env)

```env
VITE_API_URL=your_backend_api_url
```

## 数据库模式

应用使用以下主要数据表:

- `users` - 用户信息
- `books` - 书籍
- `reading_progress` - 阅读进度
- `reading_sessions` - 阅读会话
- `bookmarks` - 书签
- `quotes` - 收藏金句
- `insights` - AI 洞察
- `weekly_reports` - 周报
- `achievements` - 成就
- `reading_activity` - 阅读活动记录

详细的数据库结构请参考 [backend/supabase/migrations/001_initial_schema.sql](backend/supabase/migrations/001_initial_schema.sql)

## 开发计划

- [ ] 添加 PDF/EPUB 解析和存储
- [ ] 集成 AI 服务进行真实的洞察生成
- [ ] 添加社交分享功能
- [ ] 实现阅读计时器
- [ ] 添加多语言支持

## 许可证

MIT License
