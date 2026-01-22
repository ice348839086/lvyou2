# 🚀 部署指南

## Vercel部署 (推荐)

### 1. 准备工作

确保你已经:
- 注册Vercel账号
- 安装Vercel CLI: `npm i -g vercel`
- 准备好高德地图API Key和Anthropic API Key

### 2. 环境变量配置

在Vercel项目设置中添加以下环境变量:

```
NEXT_PUBLIC_AMAP_KEY=your_amap_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 3. 部署步骤

#### 方法一: 通过GitHub自动部署

1. 将代码推送到GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. 在Vercel中导入GitHub仓库
3. 配置环境变量
4. 点击Deploy

#### 方法二: 使用Vercel CLI

```bash
# 登录Vercel
vercel login

# 部署到生产环境
vercel --prod
```

### 4. 域名配置

在Vercel项目设置中可以:
- 使用Vercel提供的免费域名
- 绑定自定义域名

## 其他平台部署

### Docker部署

1. 创建Dockerfile:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

2. 构建和运行:

```bash
docker build -t travel-app-2.0 .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_AMAP_KEY=your_key \
  -e ANTHROPIC_API_KEY=your_key \
  travel-app-2.0
```

### Netlify部署

1. 在项目根目录创建`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. 连接GitHub仓库并部署

## 性能优化建议

### 1. 图片优化
- 使用Next.js Image组件
- 启用图片懒加载
- 使用WebP格式

### 2. 代码分割
- 使用动态导入(`dynamic import`)
- 按路由分割代码

### 3. 缓存策略
- 启用浏览器缓存
- 使用CDN加速静态资源
- 实现API响应缓存

### 4. 监控和分析
- 集成Google Analytics
- 使用Vercel Analytics
- 监控Core Web Vitals

## 常见问题

### Q: 地图无法加载?
A: 检查高德地图API Key是否正确配置,域名是否在白名单中

### Q: AI生成失败?
A: 检查Anthropic API Key是否有效,账户余额是否充足

### Q: 部署后样式错乱?
A: 确保Tailwind CSS配置正确,检查`postcss.config.mjs`

### Q: 环境变量不生效?
A: 确保以`NEXT_PUBLIC_`开头的变量才能在客户端访问

## 更新日志

### v1.0.0 (2026-01-22)
- ✅ 初始版本发布
- ✅ 地图探索功能
- ✅ AI行程规划
- ✅ 行程管理
