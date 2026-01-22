# Vercel 部署指南

## 问题: 推送代码后没有自动部署

### 解决步骤:

#### 1. 检查Git集成设置

1. 进入Vercel项目页面
2. 点击顶部的 **Settings** 标签
3. 点击左侧的 **Git** 选项
4. 检查以下设置:
   - **Connected Git Repository**: 应该显示 `ice348839086/lvyou2`
   - **Production Branch**: 应该是 `main`
   - **Deploy Hooks**: 可以创建一个来手动触发

#### 2. 重新连接Git仓库(推荐)

如果自动部署不工作,尝试重新连接:

1. 在 **Settings** → **Git** 页面
2. 找到 **Disconnect** 按钮并点击
3. 点击 **Connect Git Repository**
4. 选择 `ice348839086/lvyou2`
5. 这会自动触发一次部署

#### 3. 使用Deploy Hook手动触发

1. 在 **Settings** → **Git** 页面
2. 找到 **Deploy Hooks** 部分
3. 点击 **Create Hook**
4. 输入名称: `manual-deploy`
5. 选择分支: `main`
6. 点击 **Create Hook**
7. 复制生成的URL
8. 在浏览器访问这个URL,或使用下面的命令:

```bash
curl -X POST [你的Deploy Hook URL]
```

#### 4. 检查构建设置

在 **Settings** → **General** 中:

1. **Framework Preset**: 应该自动检测为 `Next.js`
2. **Build Command**: `npm run build` 或留空(使用默认)
3. **Output Directory**: `.next` 或留空(使用默认)
4. **Install Command**: `npm install` 或留空(使用默认)

确保没有设置 **Ignored Build Step**

#### 5. 手动从Vercel CLI部署

如果以上都不行,可以安装Vercel CLI:

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## 环境变量设置

部署成功后,需要添加以下环境变量:

### 必需:
- `DEEPSEEK_API_KEY`: 你的DeepSeek API密钥
- `DEEPSEEK_API_URL`: https://api.deepseek.com/v1

### 可选:
- `NEXT_PUBLIC_AMAP_KEY`: 高德地图API密钥

### 添加方法:

1. 进入 **Settings** → **Environment Variables**
2. 点击 **Add New**
3. 输入变量名和值
4. 选择环境: Production ✓ Preview ✓ Development ✓
5. 点击 **Save**
6. 重新部署以应用环境变量

## 常见问题

### Q: 为什么推送代码后没有自动部署?

A: 可能原因:
- Git集成未正确配置
- Production Branch设置不是main
- 仓库权限问题
- Vercel的GitHub App权限不足

### Q: 如何查看部署日志?

A: 
1. 点击 **Deployments** 标签
2. 点击具体的部署
3. 查看 **Building** 和 **Deployment** 日志

### Q: 部署失败怎么办?

A:
1. 查看部署日志中的错误信息
2. 检查package.json中的依赖
3. 确保代码在本地可以正常构建
4. 检查环境变量是否正确设置

## 验证部署

部署成功后:
- 访问: https://lvyou4.vercel.app
- 检查功能是否正常
- 查看控制台是否有错误

## 获取帮助

如果遇到问题:
1. 查看Vercel文档: https://vercel.com/docs
2. 查看部署日志
3. 检查GitHub仓库的Webhooks设置
