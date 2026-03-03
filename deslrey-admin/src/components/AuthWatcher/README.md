# AuthWatcher 组件

## 功能

AuthWatcher 组件用于监控用户的认证状态，确保只有已登录的用户才能访问受保护的路由。

## 使用方法

```tsx
import AuthWatcher from './AuthWatcher';

function App() {
  return (
    <AuthWatcher>
      {/* 受保护的路由内容 */}
    </AuthWatcher>
  );
}
```
