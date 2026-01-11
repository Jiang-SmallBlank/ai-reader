# 登录跳转问题调试

## 问题
登录成功后没有自动跳转到主页

## 可能的原因

1. **isAuthenticated 状态未更新** - AuthContext 中的 user 状态没有正确设置
2. **handleLoginSuccess 未被调用** - Login 组件中的 onLoginSuccess 回调没有执行
3. **isLoading 阻止渲染** - 加载状态一直为 true

## 调试步骤

### 1. 打开浏览器控制台 (F12)

检查 Console 标签，应该看到类似这样的日志：
```
🔐 Login attempt for email: demo@example.com
🔍 Checking if user exists in database...
👤 User not found, creating new user...
✅ User created successfully: xxx
🎫 Generated token for user: xxx
```

### 2. 检查 Network 标签

找到 `/api/auth/login` 请求：
- **Status**: 应该是 200
- **Response**: 应该包含 token 和 user 对象

### 3. 检查 Application 标签

- **Local Storage**: 查找 `auth_token`，应该有 JWT token
- 如果没有 token，说明 API 客户端没有正确保存

### 4. 手动测试

在浏览器控制台运行：
```javascript
// 检查 token 是否保存
localStorage.getItem('auth_token')

// 检查用户状态
localStorage.clear()
location.reload()
```

## 常见问题和解决方案

### 问题 1: Token 没有保存

**原因**: API 调用成功但 token 没有保存到 localStorage

**解决**: 检查 `src/api/client.ts` 中的 `setToken` 方法

### 问题 2: getMe() 返回 401

**原因**: Token 无效或已过期

**解决**: 检查 JWT_SECRET 是否一致，token 是否正确生成

### 问题 3: 组件没有重新渲染

**原因**: React 状态更新问题

**解决**: 检查 AuthContext 是否正确包裹了 App 组件

## 快速修复

如果以上都正常，尝试：

1. **清除浏览器数据**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

2. **检查 API 返回**
   在后端日志中查找：
   ```
   ✅ User created successfully
   🎫 Generated token for user
   ```

3. **手动设置 token 测试**
   在登录成功后的控制台运行：
   ```javascript
   const response = await fetch('http://localhost:3001/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'demo@example.com', password: 'demo123' })
   })
   const data = await response.json()
   localStorage.setItem('auth_token', data.token)
   location.reload()
   ```

## 需要检查的文件

1. `src/api/client.ts` - API 客户端
2. `src/api/index.ts` - API 方法
3. `src/contexts/AuthContext.tsx` - 认证上下文
4. `src/views/Login.tsx` - 登录组件
5. `src/App.tsx` - 主应用组件

