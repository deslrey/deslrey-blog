# CLAUDE.md

## 项目概览

个人博客系统，三模块：Go 后端 API 服务 + Web 前台（读者端）+ Admin 后台（管理端）。

```
/
├── deslrey-go/        # Go 后端 (~3800 行)  Gin + GORM + PostgreSQL + Redis
├── deslrey-web/       # Web 前台 (React 19 + Vite)  读者浏览
├── deslrey-admin/     # Admin 后台 (React 19 + MUI + Vite)  作者管理
├── sql/public.sql     # PostgreSQL DDL (Navicat 导出)
└── build_all.bat      # 一键构建全部
```

## 常用命令

### Go 后端

```bash
cd deslrey-go
go run main.go -configs configs.dev.yaml   # 开发启动
go build -o deslrey-go main.go             # 本地构建
# Linux 交叉构建（部署用）:
set GOOS=linux && set GOARCH=amd64 && set CGO_ENABLED=0 && go build -o deslrey-go main.go
```

### Web 前台 & Admin 后台

```bash
cd deslrey-web        # 或 deslrey-admin
pnpm dev              # 开发服务器
pnpm build            # tsc -b && vite build
pnpm lint             # ESLint
```

- Web 前台开发端口 3000
- Admin 后台开发时 Vite 代理 `/blog-api` → `localhost:8080`

---

## Go 后端 — 架构细节

### 启动流程 (main.go)

```
config.Init()     →  加载 YAML ( -configs 参数, 默认 ./configs.yaml )
logger.Init()     →  charmbracelet/log + lumberjack 日志轮转 (debug 模式输出到 stderr)
cache.Init()      →  Redis 连接 (sync.Once 单例)
repository.Init() →  PostgreSQL → GORM AutoMigrate(已注释) → 各模块 InitDB(db) → 缓存预热
scheduler.Start() →  cron 每日 0 点刷新缓存
router.Start()    →  Gin 路由 + 中间件 + HTTP 服务
```

### 目录结构

```
deslrey-go/
├── main.go
├── configs.yaml / configs.dev.yaml   # YAML 配置
├── internal/
│   ├── config/config.go        # ConfigType 结构体 + flag 解析加载
│   ├── repository/db.go        # DB/Redis 初始化, AutoMigrate, InitCache 缓存预热
│   ├── middleware/
│   │   ├── auth.go              # JWT Bearer 鉴权 (Redis 二次校验 + 续期)
│   │   ├── cors.go              # CORS (配置 domainName)
│   │   ├── prometheus.go        # Prometheus 请求延迟直方图 + 慢请求(≥300ms)警告日志
│   │   └── visit.go             # 访问日志: 排除静态资源, Redis SetNX 防刷, 异步入队
│   ├── router/router.go         # 路由注册 + 404 兜底 JWT 校验
│   ├── scheduler/scheduler.go   # 每日 0 点 cron + Redis SetNX 分布式锁 (10min TTL)
│   └── biz/                     # 业务模块 (handler → model → repo 三层)
│       ├── article/   # 文章 [+ cache_util.go 缓存 key 管理]
│       ├── carousel/  # 轮播图 (随机取外部图片 URL)
│       ├── category/  # 分类
│       ├── draft/     # 草稿
│       ├── folder/    # 图片目录
│       ├── image/     # 图片上传/删除
│       ├── tag/       # 标签
│       ├── user/      # 用户 (加盐哈希密码)
│       └── visit/     # 访问日志 (异步队列 4 worker + IP 归属地 + 设备识别)
└── pkg/
    ├── cache/redis.go   # JSON 序列化封装: Set/Get/Del/Exists/HSet/HGet/SetNX/Incr/DelByPrefix
    ├── logger/logger.go # 结构化日志 + lumberjack 轮转 (debug→stderr, prod→stderr+文件)
    ├── result/          # 统一响应: Results[T]{code, message, data} + Ok/Fail/Err 构造器
    │   ├── result.go    # 泛型构造器 + Send/SendCode 方法
    │   └── code.go      # 错误码枚举 (200/400/403/404/500)
    └── util/
        ├── page.go      # 分页: GetPageParams + PageInfo[T] + PaginateScope GORM scope
        ├── jwt.go       # JWT 签发 (HS256, 7天过期) + 解析 + Redis token key 构造
        └── generate.go  # nanoid 生成器 (标准/16位/6位数字)
```

### 业务模块约定

每个模块固定三个文件（carousel 仅 handler）：

| 文件 | 职责 |
|------|------|
| `model.go` | GORM struct + TableName + InitDB(*gorm.DB) |
| `repo.go` | 数据库查询 (GORM 链式调用), 无状态公共函数 |
| `handler.go` | Gin HandlerFunc: 解析参数 → 查缓存/调 repo → result.Send |

- db 实例通过全局变量 `var db *gorm.DB` 持有
- article 模块额外有 `cache_util.go` 管理缓存 key 构造和批量清除

### 配置结构 (configs.yaml)

```yaml
debug: bool                    # true → 日志输出到 stderr; false → 文件轮转
domainName: "*"                # CORS 允许域名
port: 8080                     # HTTP 监听端口
jwtSigningKey: string          # JWT 签名密钥
custom:
  staticSourcePath: string     # 静态资源本地路径
  staticUrl: string            # 静态资源 URL 前缀 (Gin Static 路由)
  url: string                  # 完整 CDN 地址
postgresql: {host, user, password, dbName, port}
redis: {host, user, password, dbName, port, size}
```

---

## 完整 API 接口文档

所有接口统一响应格式：`{"code": number, "message": string, "data": T}`

### 公开接口 (无需鉴权)

#### 轮播图

| 方法 | 路径 | 功能 | 请求参数 | 响应 data |
|------|------|------|----------|-----------|
| GET | `/blog-api/web/carousel/sex` | 随机美女轮播图 | — | `string` (URL) |
| GET | `/blog-api/web/carousel/scenery` | 随机风景轮播图 | — | `string` (URL) |

#### 文章

| 方法 | 路径 | 功能 | 请求参数 | 响应 data | 缓存 |
|------|------|------|----------|-----------|------|
| GET | `/blog-api/web/article/list` | 前台文章分页列表 | `page`(默认1), `pageSize`(默认10) | `PageInfo<ArticleWebListItem>` | ✅ 永久+手动清除 |
| GET | `/blog-api/web/article/:articleId` | 文章详情 | 路径参数 `articleId` | `ArticleDetail` | ✅ 永久+手动清除 |

**ArticleWebListItem：** `id, title, des, category(string), tags([]string), sticky, edit, createTime, updateTime`

**ArticleDetail：** `id, title, content, wordCount, views, readTime, category(string), des, sticky, edit, createTime, updateTime`

#### 标签

| 方法 | 路径 | 功能 | 请求参数 | 响应 data | 缓存 |
|------|------|------|----------|-----------|------|
| GET | `/blog-api/web/tag/count` | 标签聚合计数 | — | `[]TitleCount{id, title, count}` | ✅ 启动+定时刷新 |
| GET | `/blog-api/web/tag/:id` | 标签下文章列表 | 路径参数 `id`, `page`, `pageSize` | `PageInfo<ArticleListItem>` | ✅ 永久+手动清除 |

#### 分类

| 方法 | 路径 | 功能 | 请求参数 | 响应 data | 缓存 |
|------|------|------|----------|-----------|------|
| GET | `/blog-api/web/category/count` | 分类聚合计数 | — | `[]TitleCount{id, title, count}` | ✅ 启动+定时刷新 |
| GET | `/blog-api/web/category/:id` | 分类下文章列表 | 路径参数 `id`, `page`, `pageSize` | `PageInfo<ArticleListItem>` | ✅ 永久+手动清除 |

#### 访问统计

| 方法 | 路径 | 功能 | 请求参数 | 响应 data | 缓存 |
|------|------|------|----------|-----------|------|
| GET | `/blog-api/web/visit/stats` | 总访问量 | — | `VisitStats{totalVisits}` | ✅ Redis |

---

### 鉴权接口 (需 Authorization: Bearer <token>)

#### 认证 (公开)

| 方法 | 路径 | 功能 | 请求体 | 响应 data |
|------|------|------|--------|----------|
| POST | `/blog-api/admin/auth/login` | 登录 | `{userName, passWord}` | `{token, userName}` |
| POST | `/blog-api/admin/auth/register` | 注册 | `{userName, passWord, email?}` | — |

#### 文章管理

| 方法 | 路径 | 功能 | 请求参数/体 | 响应 data | 清除缓存 |
|------|------|------|------------|-----------|----------|
| GET | `/blog-api/admin/article/list` | 管理员文章列表 | `page`, `pageSize` | `PageInfo<ArticleAdminListItem>` | — |
| GET | `/blog-api/admin/article/viewHot` | 热门文章排行 Top10 | — | `[]ArticleViewHot{title, views}` | — |
| GET | `/blog-api/admin/article/counts` | 文章月度发布统计 | — | `[{month, count}]` (1-12月) | — |
| GET | `/blog-api/admin/article/editArticle/:articleId` | 获取文章编辑信息 | 路径参数 `articleId` | `ArticleEditVO` | — |
| POST | `/blog-api/admin/article/addArticle` | 新增/编辑文章 | `AddArticleRequest{id?, title, content?, des?, categoryId?, tagIdList?}` | — | ✅ 全部文章缓存 |
| POST | `/blog-api/admin/article/editExist` | 软删除/恢复文章 | `{id, exist}` | — | ✅ 全部文章缓存 |

**ArticleAdminListItem：** `id, title, category(string), createTime, updateTime, views, sticky, edit, exist`

**ArticleEditVO：** `id, title, content, des, tagIdList([]int), category{id, categoryTitle}`

**AddArticleRequest：**
- `id: null` → 新建文章；`id: 数字` → 更新已有文章
- 新建时自动计算 wordCount 和 readTime (content长度/200)
- 更新时重建 article_tag 关联 (先删除旧关联再插入)

#### 标签管理

| 方法 | 路径 | 功能 | 请求参数/体 | 响应 data | 清除缓存 |
|------|------|------|------------|-----------|----------|
| GET | `/blog-api/admin/tag/tagList` | 标签分页列表 | `page`, `pageSize` | `PageInfo<Tag>` | — |
| GET | `/blog-api/admin/tag/tagNameList` | 全部标签名称列表 | — | `[]Tag{id, tagTitle}` | — |
| POST | `/blog-api/admin/tag/addTag` | 添加标签 | `{tagTitle}` | — | ✅ 文章缓存 |
| POST | `/blog-api/admin/tag/updateTagTitle` | 更新标签名 | `{id, tagTitle}` | — | ✅ 文章缓存 |

#### 分类管理

| 方法 | 路径 | 功能 | 请求参数/体 | 响应 data | 清除缓存 |
|------|------|------|------------|-----------|----------|
| GET | `/blog-api/admin/category/categoryList` | 分类分页列表 | `page`, `pageSize` | `PageInfo<Category>` | — |
| GET | `/blog-api/admin/category/categoryArticleList` | 所有分类及其文章数 | — | `[]Category{id, categoryTitle}` | — |
| POST | `/blog-api/admin/category/addCategory` | 添加分类 | `{categoryTitle}` | — | ✅ 文章+分类缓存 |
| POST | `/blog-api/admin/category/updateCategoryTitle` | 更新分类名 | `{id, categoryTitle}` | — | ✅ 文章+分类缓存 |

#### 目录管理 (图片文件夹)

| 方法 | 路径 | 功能 | 请求参数/体 | 响应 data |
|------|------|------|------------|-----------|
| GET | `/blog-api/admin/folder/list` | 目录分页列表 | `page`, `pageSize` | `PageInfo<FolderItem>` |
| GET | `/blog-api/admin/folder/folderNameList` | 全部目录列表 | — | `[]FolderNameItem{id, folderName}` |
| POST | `/blog-api/admin/folder/addFolder` | 添加目录 | `{folderName}` | — |
| POST | `/blog-api/admin/folder/updateFolder` | 更新目录名 | `{id, folderName}` | — |

#### 图片管理

| 方法 | 路径 | 功能 | 请求参数/体 | 响应 data |
|------|------|------|------------|-----------|
| GET | `/blog-api/admin/image/list` | 图片分页列表 | `page`, `pageSize` | `PageInfo<ImageItem>` |
| POST | `/blog-api/admin/image/uploadImage` | 上传图片 | `folderId`(form) + `file`(form) | `string` (相对URL) |
| GET | `/blog-api/admin/image/obscure` | 按目录名模糊查询图片 | `folderName`(query) | `[]ImageItem` |
| DELETE | `/blog-api/admin/image/deleteImage/:imageId` | 删除图片 | 路径参数 `imageId` | — |

- 上传时以纳秒时间戳重命名文件，保存到 `staticSourcePath/{folder.path}/` 目录
- 返回格式：`folder.path/{newName}`

#### 草稿管理

| 方法 | 路径 | 功能 | 请求参数/体 | 响应 data |
|------|------|------|------------|-----------|
| GET | `/blog-api/admin/draft/draftList` | 草稿分页列表 | `page`, `pageSize` | `PageInfo<Draft>` |
| GET | `/blog-api/admin/draft/detail/:id` | 草稿详情 | 路径参数 `id` | `Draft` |
| POST | `/blog-api/admin/draft/addDraft` | 添加草稿 | `{title, content?, des?, articleId?}` | — |
| POST | `/blog-api/admin/draft/updateDraft` | 更新草稿 | `{id, title?, content?, des?, articleId?}` | — |
| DELETE | `/blog-api/admin/draft/deleteDraft/:id` | 删除草稿 | 路径参数 `id` | — |

#### 用户管理

| 方法 | 路径 | 功能 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/blog-api/admin/user/updateUserName` | 修改用户名 | `{oldName, newName}` | — |
| POST | `/blog-api/admin/user/updatePassword` | 修改密码 | `{oldPassword, newPassword}` | — |
| | | (userId 从 JWT claims 中提取) | | |

#### 访问日志管理

| 方法 | 路径 | 功能 | 请求参数 | 响应 data |
|------|------|------|----------|-----------|
| GET | `/blog-api/admin/visit/stats` | 总访问量 | — | `VisitStats{totalVisits}` |
| GET | `/blog-api/admin/visit/weekly` | 近 7 日访问趋势 | — | `[{date, count}]` |
| GET | `/blog-api/admin/visit/logs` | 访问日志分页查询 | `page`, `pageSize`, `keyword?`, `device?`, `startDate?`, `endDate?` | `PageInfo<VisitLog>` |

**VisitLog：** `id, ip, location, visitTime, userAgent, referer, path, device`

---

## 缓存策略

- **Key 前缀：** `deslrey:` ( `cache.KeyPrefix` )
- **序列化：** JSON ( `json.Marshal` / `json.Unmarshal` )
- **Token 存储：** `deslrey:token:{userId}` → token 字符串, 24h TTL (访问续期)

| 缓存内容 | Key 示例 | 策略 | 清除时机 |
|----------|----------|------|----------|
| 文章前台列表 | `deslrey:article:web_list:p1:s10` | 永久缓存 | 文章新增/编辑/删除/恢复时 `ClearArticleCache()` |
| 文章详情 | `deslrey:article:detail:123` | 永久缓存 | 同上 |
| 热门排行 | `deslrey:article:hot` | 永久缓存 | 同上 |
| 月度统计 | `deslrey:article:month_counts` | 永久缓存 | 同上 |
| 标签计数 | `deslrey:tag:count` | 启动预热 | 标签新增/编辑时由 article.ClearArticleCache 连带清除 |
| 分类计数 | `deslrey:category:count` | 启动预热 | 分类新增/编辑时连带清除 |
| 标签文章列表 | `deslrey:tag:articles:{id}:{page}:{size}` | 永久缓存 | 标签变更时 `DelByPrefix("tag:articles:")` |
| 分类文章列表 | `deslrey:category:articles:{id}:{page}:{size}` | 永久缓存 | 分类变更时 `DelByPrefix("category:articles:")` |
| 访问总量 | `deslrey:stats:visits` | INCR 原子递增 | 每日 0 点从 DB 重新统计覆盖 |
| 去重锁 | `deslrey:visit:${ip}` / `deslrey:visit:${ip}:article:${id}` | 10min/1min SetNX | 自动过期 |
| 刷新锁 | `lock:cache:refresh` | 10min SetNX 分布式锁 | 自动过期 |

### 访问去重逻辑 (middleware/visit.go)

- 文章详情页：每个 IP+文章ID 1 分钟内只记 1 次访问
- 其他路径：每个 IP 10 分钟内只记 1 次访问
- 排除路径：静态资源(.js/.css/.png等)、轮播图、统计接口自身

---

## Web 前台 — 架构细节

```
src/
├── main.tsx              # 入口: BrowserRouter
├── App.tsx               # 根路由 (懒加载 + Suspense)
├── api/index.ts          # API 端点常量
├── components/           # 30+ 组件
├── hooks/                # useReadingTitle / useTypingEffect / useWindowSize
├── pages/                # 10 个页面 (均有 index.tsx)
├── loader/               # 3 种加载动画 (Truck/Loader/Banter)
├── store/navStore.ts     # zustand 导航标题
├── types/index.ts        # Article / TocItem / RouteType 等
└── utils/
    ├── http/request.ts   # axios 封装: baseURL + 超时5s + 401拦截
    ├── ui/message.tsx    # notistack 通知
    ├── markdown/         # 代码块增强 (语言图标)
    ├── content/          # H2 目录提取
    └── misc/tagIcons     # 技术栈图标映射
```

### 路由表 (全部懒加载)

| 路径 | 页面组件 | 说明 |
|------|----------|------|
| `/` | HomePage | 首页 (最新发布/分类/标签墙) |
| `/article` | ArticlePage | 文章列表 |
| `/archive` | ArchivePage | 归档页 |
| `/about` | AboutPage | 关于页 |
| `/detail/:id` | ArticleDetailPage | 文章详情 (Markdown渲染+目录+评论) |
| `/category` | CategoryPage | 分类概览 |
| `/category/:category` | CategoryTitlePage | 分类文章列表 |
| `/tag` | TagPage | 标签云 |
| `/tag/:tag` | TagTitlePage | 标签文章列表 |
| `*` | NotFoundPage | 404 |

### 关键组件

| 组件 | 职责 |
|------|------|
| ThemeProvider | light/dark/system 三模式 Context |
| ColorProvider | 基于路由路径动态主题色 |
| BgSeriesProvider | sex/pure/scenery 背景系列切换 |
| Markdown/viewer | bytemd + rehype-slug + 语法高亮 + 图片懒加载 |
| MarkdownToc | 文章目录 (基于 H2) |
| ImagePreviewManager | 图片点击预览 (react-zoom-pan-pinch) |
| TopProgressBar | 路由跳转顶部进度条 |
| ValineComment | LeanCloud Valine 评论 (VITE_LEANCLOUD_APP_ID/KEY) |
| SEO | 标题 + meta 标签动态更新 |
| NavComponents + MobileNav | 桌面/移动端导航 |

### Vite 构建拆分

```js
manualChunks: {
  bytemd:    ['bytemd', '@bytemd/plugin-*'],
  highlight: ['highlight.js', 'lowlight'],
  react:     ['react', 'react-dom', 'react-router', 'zustand', 'styled-components'],
}
```

---

## Admin 后台 — 架构细节

```
src/
├── main.tsx              # 入口
├── App.tsx               # AuthWatcher + 路由 (Login / Register / /admin/*)
├── api/                  # 9 个 API 模块路径常量
├── components/           # AuthWatcher / Header / TabsBar / Loader
├── config/               # 子路由配置 (含图标) + 页面标题映射
├── context/TabLocationContext.tsx  # 标签页位置追踪
├── hooks/                # usePagedQuery (通用分页) + useTime
├── pages/
│   ├── Login/            # 登录页
│   ├── Register/         # 注册页
│   └── Admin/            # 11 个子管理页面
├── store/
│   ├── user/UserStore.ts  # zustand + sessionStorage 持久化
│   └── tab/TabStore.ts    # 标签页状态
├── utils/authEvents.ts   # 认证过期事件总线
└── styles/global.scss
```

### Admin 子路由

| 路径 | 页面 | 图标 | 说明 |
|------|------|------|------|
| `/admin/home` | Home | House | 仪表盘 |
| `/admin/visit` | Visit | MousePointerClick | 访问日志/统计 |
| `/admin/article` | Article | Newspaper | 文章列表管理 |
| `/admin/imageTable` | ImagePage | Image | 图片管理 |
| `/admin/folder` | FolderPage | Folder | 图片目录管理 |
| `/admin/category` | CategoryPage | ChartBarStacked | 分类管理 |
| `/admin/tag` | TagPage | Tag | 标签管理 |
| `/admin/draft` | Draft | Pencil | 草稿箱 |
| `/admin/user` | User | User | 用户信息/密码修改 |
| `/admin/addArticle` | AddArticle | — | 新增文章 |
| `/admin/editArticle` | EditArticle | — | 编辑文章 |

### 登录鉴权流程

1. 登录时后端校验密码 (加盐 SHA256)，签发 JWT (HS256, 7天)，存入 Redis (24h TTL)
2. 前端存入 zustand + sessionStorage
3. AuthWatcher 监听路由变化，从 sessionStorage 读取 token，缺失/过期则跳转 /login
4. 所有 API 请求通过 axios 拦截器：401 → 清除登录态 → 跳转登录页
5. 后端 JWT 中间件：Bearer token 解析 → JWT 校验 → Redis 二次校验 → 续期 (24h)

---

## 数据库 (PostgreSQL)

9 张核心表（完整 DDL 见 `sql/public.sql`）：

| 表 | 关键字段 | 说明 |
|----|----------|------|
| article | id(PK), title, content, des, category_id, views, word_count, read_time, sticky, exist, edit, create_time, update_time | 核心文章表 |
| article_tag | article_id(PK), tag_id(PK) | 多对多关联 |
| category | id(PK), title, create_time | 分类 |
| tag | id(PK), title, create_time | 标签 |
| draft | id(PK), article_id, title, content, des, create_time, update_time | 草稿 |
| folder | id(PK), folder_name, path, create_time, update_time | 图片目录 |
| image | id(PK), folder_id, image_name, origin_name, path, url, size, create_time | 图片 |
| visit_log | id(PK), ip, location, user_agent, referer, path, device, visit_time | 访问日志 |
| user_info | id(PK), user_name, pass_word, email, salt, avatar, exist, create_time, update_time | 用户 |

各表主键使用序列自增（`*_id_seq`）。

---

## 关键特征

- **分页**：统一 `util.PageInfo[T]{page, pageSize, total, list, hasNextPage}`, 查询参数 `page` + `pageSize`, 最大 100 条/页
- **统一响应**：Go 端 `Results[T]{code, message, data}`, 前端 `request.ts` 同名接口类型 + 泛型
- **错误码**：200 成功 / 400 参数错误 / 403 无权限 / 404 未找到 / 500 操作失败 / 401 token 无效
- **JWT**：HS256, 7天过期, Redis 存储 + 每次请求续期 24h, Bearer 格式
- **密码**：随机 16 位 nanoid salt + SHA256 哈希
- **Prometheus**：`deslrey_data_endpoints_latency_statistic` 直方图，10 个 bucket (1ms~10s)
