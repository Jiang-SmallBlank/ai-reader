# 微信扫码登录实现说明

## 概述

本项目实现了完整的微信扫码登录功能，包括前端 UI、后端 API 和轮询机制。

## 功能特性

### 1. 双登录模式
- **微信扫码登录** - 用户使用微信扫描二维码登录
- **邮箱密码登录** - 传统的邮箱密码登录方式
- **演示账号** - 一键使用演示账号快速体验

### 2. 登录流程

#### 微信扫码登录流程

```
前端                    后端                    微信服务器
  |                       |                        |
  |--- 生成二维码 ------->|                        |
  |<-- 返回 sessionId ----|                        |
  |                       |                        |
  |--- 显示二维码 --------|                        |
  |                       |                        |
  |--- 轮询状态 --------->|                        |
  |<-- 返回 pending ------|                        |
  |                       |                        |
  |                       |                        |
  |                       |<-- 用户扫码 ----------|
  |                       |--- 回调确认 --------->|
  |                       |                        |
  |--- 轮询状态 --------->|                        |
  |<-- 返回 scanned ------|                        |
  |                       |                        |
  |--- 轮询状态 --------->|                        |
  |<-- 返回 confirmed + token ---------------------|
  |                       |                        |
  |--- 登录成功 ----------|                        |
```

#### 邮箱登录流程

```
前端                    后端                  Supabase
  |                       |                      |
  |--- 提交登录 --------->|                      |
  |                       |--- 查询用户 -------->|
  |                       |<-- 返回用户数据 ------|
  |                       |                      |
  |                       |--- 生成 JWT token ---|
  |<-- 返回 token + user -|                      |
  |                       |                      |
  |--- 存储token 到本地 --|                      |
  |                       |                      |
  |--- 跳转到主页 --------|                      |
```

## API 端点

### 微信登录相关

#### 1. 生成二维码
```http
POST /api/auth/wechat/qrcode
```

**响应：**
```json
{
  "sessionId": "uuid-v4",
  "qrCodeUrl": "https://api.qrserver.com/...",
  "expiresInSeconds": 300
}
```

#### 2. 查询二维码状态
```http
GET /api/auth/wechat/status/:sessionId
```

**响应（pending）：**
```json
{
  "status": "pending"
}
```

**响应（confirmed，登录成功）：**
```json
{
  "status": "confirmed",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "用户名",
    "avatar_url": "https://...",
    "role": "free",
    "preferences": {...}
  }
}
```

#### 3. 微信回调（实际生产环境）
```http
POST /api/auth/wechat/callback
```

**请求体：**
```json
{
  "sessionId": "uuid",
  "code": "微信授权码",
  "openid": "微信用户openid"
}
```

#### 4. 演示：模拟扫码
```http
POST /api/auth/wechat/demo/scan
```

**请求体：**
```json
{
  "sessionId": "uuid"
}
```

### 邮箱登录相关

#### 登录
```http
POST /api/auth/login
```

**请求体：**
```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

**响应：**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "demo@example.com",
    "username": "演示用户",
    "role": "premium"
  }
}
```

#### 注册
```http
POST /api/auth/register
```

#### 获取当前用户
```http
GET /api/auth/me
Authorization: Bearer {token}
```

## 前端实现

### 1. AuthContext

提供全局认证状态管理：

```typescript
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

### 2. Login 组件

完整的登录界面，支持：
- Tab 切换（微信/邮箱）
- 二维码生成和刷新
- 状态轮询
- 表单验证

### 3. 使用示例

```typescript
// 显示登录模态框
const [showLogin, setShowLogin] = useState(false);
<button onClick={() => setShowLogin(true)}>登录</button>

// 登录成功后
{showLogin && (
  <Login
    onLoginSuccess={() => {
      setShowLogin(false);
      // 跳转到主页
    }}
    isDarkMode={isDarkMode}
  />
)}
```

## 生产环境配置

### 微信开放平台设置

1. **注册微信开放平台账号**
   - 访问 https://open.weixin.qq.com
   - 完成开发者资质认证

2. **创建网站应用**
   - 填写网站信息
   - 配置授权回调域名

3. **获取凭证**
   - AppID
   - AppSecret

### 后端配置

在 `backend/.env` 中添加：

```env
# WeChat Login
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret
WECHAT_REDIRECT_URI=https://yourdomain.com/auth/wechat/callback
```

### 实现真实的微信 API

修改 `backend/src/controllers/wechatController.ts`：

```typescript
import axios from 'axios';

const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET;

// 生成真实的微信二维码
export async function generateQRCode(req, res) {
  // 获取微信登录二维码
  const response = await axios.post(
    'https://open.weixin.qq.com/connect/qrconnect',
    null,
    {
      params: {
        appid: WECHAT_APP_ID,
        redirect_uri: encodeURIComponent(process.env.WECHAT_REDIRECT_URI),
        response_type: 'code',
        scope: 'snsapi_login',
        state: generateState()
      }
    }
  );

  // 返回二维码URL
  res.json({
    qrCodeUrl: response.data.code_url,
    sessionId: state
  });
}

// 处理微信回调
export async function wechatCallback(req, res) {
  const { code } = req.query;

  // 获取 access_token
  const tokenResponse = await axios.get(
    'https://api.weixin.qq.com/sns/oauth2/access_token',
    {
      params: {
        appid: WECHAT_APP_ID,
        secret: WECHAT_APP_SECRET,
        code: code,
        grant_type: 'authorization_code'
      }
    }
  );

  const { access_token, openid } = tokenResponse.data;

  // 获取用户信息
  const userInfo = await axios.get(
    'https://api.weixin.qq.com/sns/userinfo',
    {
      params: {
        access_token,
        openid
      }
    }
  );

  // 创建或查找用户
  // ...
}
```

## 演示模式

当前实现包含演示模式，可以不依赖微信服务测试登录流程：

1. **邮箱登录**：使用 `demo@example.com` / `demo123`
2. **模拟扫码**：点击"使用演示账号登录"按钮

## 安全注意事项

1. **JWT Secret** - 生产环境使用强密钥
2. **HTTPS** - 生产环境必须使用 HTTPS
3. **Session 管理** - 生产环境使用 Redis 存储会话
4. **密码加密** - 使用 bcrypt 加密存储
5. **CSRF 保护** - 实现 CSRF token
6. **速率限制** - 防止暴力破解

## 测试

```bash
# 启动后端
cd backend
npm run dev

# 启动前端
npm run dev

# 访问 http://localhost:5173
# 点击登录，选择演示账号
# 或使用: demo@example.com / demo123
```

## 常见问题

### Q: 二维码一直显示"生成中"？
A: 检查后端是否正常运行，API 地址是否正确配置

### Q: 登录后刷新页面会退出？
A: 确保浏览器允许 localStorage，token 存储在本地

### Q: 如何添加其他登录方式？
A: 参考邮箱登录实现，添加新的 provider（Google、GitHub等）

## 文件结构

```
src/
├── contexts/
│   └── AuthContext.tsx       # 认证状态管理
├── views/
│   ├── Login.tsx              # 登录组件
│   └── Landing.tsx            # 落地页
├── api/
│   ├── client.ts              # API 客户端
│   └── index.ts               # API 方法
└── App.tsx                    # 主应用组件

backend/src/
├── controllers/
│   ├── authController.ts      # 认证控制器
│   └── wechatController.ts    # 微信登录控制器
├── middleware/
│   └── auth.ts                # JWT 中间件
└── routes/
    └── index.ts               # 路由定义
```
