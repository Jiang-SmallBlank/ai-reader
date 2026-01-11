# 登录问题排查指南

## 问题：邮箱登录无法工作

### 1. 检查后端是否运行

```bash
cd backend
npm run dev
```

后端应该运行在 `http://localhost:3001`

### 2. 检查前端配置

确保 `.env` 文件存在并配置正确：

```bash
# 在项目根目录创建 .env 文件
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

### 3. 测试 API 连接

在浏览器中打开：
- `http://localhost:3001/health` - 应该看到 `{"status":"ok"}`

或使用 curl：
```bash
curl http://localhost:3001/health
```

### 4. 测试登录 API

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

应该返回：
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "username": "test",
    ...
  }
}
```

### 5. 检查 Supabase 配置

确保 `backend/.env` 文件配置正确：

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 6. 初始化数据库

确保运行了数据库迁移：

```bash
# 在 Supabase Dashboard 的 SQL Editor 中运行
# backend/supabase/migrations/001_initial_schema.sql
```

或运行种子数据：
```bash
cd backend
npm run db:seed
```

### 7. 检查浏览器控制台

打开浏览器开发者工具（F12），查看：
- **Console** 标签：查看 JavaScript 错误
- **Network** 标签：查看 API 请求是否成功

常见错误：
- `Failed to fetch` - 后端未运行或 CORS 错误
- `404 Not Found` - API 路径错误
- `500 Internal Server Error` - 后端错误，查看后端日志

### 8. 清除浏览器缓存

```bash
# 清除 localStorage
# 在浏览器控制台运行：
localStorage.clear()
location.reload()
```

### 9. 重新安装依赖

```bash
# 前端
rm -rf node_modules package-lock.json
npm install

# 后端
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 10. 使用演示账号

点击登录界面中的"使用演示账号登录"按钮，会自动填充：
- Email: `demo@example.com`
- Password: `demo123`

## 快速测试脚本

创建 `test-api.sh`：

```bash
#!/bin/bash

echo "Testing API..."

# Health check
echo "1. Health check:"
curl http://localhost:3001/health
echo -e "\n"

# Login
echo "2. Login:"
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
echo -e "\n"
```

运行：
```bash
chmod +x test-api.sh
./test-api.sh
```

## 常见错误及解决方案

### CORS 错误
**错误**: `Access to fetch at '...' has been blocked by CORS policy`

**解决**: 检查 `backend/.env` 中的 `CORS_ORIGIN` 设置为前端地址

### JWT_SECRET 未设置
**错误**: `JWT_SECRET not configured`

**解决**: 在 `backend/.env` 中设置 `JWT_SECRET=your-secret-key`

### Supabase 连接失败
**错误**: `Failed to create user`

**解决**: 检查 Supabase 凭证是否正确，数据库表是否已创建

### Token 未保存
**错误**: 刷新页面后需要重新登录

**解决**: 检查浏览器是否允许 localStorage，查看控制台是否有错误

## 调试模式

### 前端调试

在 `src/api/client.ts` 中添加日志：

```typescript
async request<T>(endpoint: string, options: RequestInit = {}) {
  const url = `${this.baseURL}${endpoint}`;
  console.log('API Request:', url, options);

  // ... existing code ...

  console.log('API Response:', response.status);
  return response.json();
}
```

### 后端调试

在 `backend/src/controllers/authController.ts` 中添加日志：

```typescript
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log('Login request:', req.body);

  // ... existing code ...

  console.log('Login successful:', user.email);
  res.json({ token, user });
};
```

## 完整重启流程

1. 停止所有运行的服务
2. 清除所有 node_modules：
   ```bash
   rm -rf node_modules package-lock.json
   cd backend
   rm -rf node_modules package-lock.json
   cd ..
   ```
3. 重新安装依赖：
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```
4. 配置环境变量（检查 `.env` 文件）
5. 启动后端：
   ```bash
   cd backend
   npm run dev
   ```
6. 启动前端：
   ```bash
   npm run dev
   ```
7. 打开 `http://localhost:5173`

## 仍无法解决？

检查以下文件是否存在：

```
ai-reader/
├── .env                          # 前端环境变量
├── backend/
│   ├── .env                      # 后端环境变量
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts       # Supabase 配置
│   │   ├── controllers/
│   │   │   └── authController.ts # 认证控制器
│   │   └── server.ts
│   └── package.json
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   └── index.ts
│   └── views/
│       └── Login.tsx
└── package.json
```

如果问题依然存在，请提供：
1. 浏览器控制台的错误信息
2. 后端服务器的日志输出
3. Network 标签中失败的请求详情
