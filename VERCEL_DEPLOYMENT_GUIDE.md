# Vercel 部署指南

## 📋 需要的环境变量

你的项目需要以下环境变量才能正常运行:

### 1. 高德地图 API Key (可选)
```
NEXT_PUBLIC_AMAP_KEY=your_amap_key_here
```
- **用途**: 地图功能
- **获取方式**: https://lbs.amap.com/
- **是否必需**: 可选(没有的话地图功能不可用,但其他功能正常)

### 2. DeepSeek API Key (必需)
```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```
- **用途**: AI行程规划功能
- **获取方式**: https://platform.deepseek.com/
- **是否必需**: 必需(AI规划功能需要)

### 3. DeepSeek API URL (可选)
```
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```
- **用途**: DeepSeek API端点
- **默认值**: https://api.deepseek.com/v1
- **是否必需**: 可选(使用默认值即可)

---

## 🚀 Vercel 部署步骤

### 方法一: 从GitHub导入(推荐)

#### 1. 访问Vercel并登录
- 打开 https://vercel.com/
- 使用GitHub账号登录

#### 2. 导入项目
1. 点击 **"Add New..."** → **"Project"**
2. 选择 **"Import Git Repository"**
3. 找到你的仓库 `ice348839086/lvyou2`
4. 点击 **"Import"**

#### 3. 配置项目
在配置页面:
- **Framework Preset**: 自动检测为 `Next.js`
- **Root Directory**: `./` (默认)
- **Build Command**: `npm run build` (默认)
- **Output Directory**: `.next` (默认)

#### 4. 添加环境变量 (重要!)

**正确的添加方式**:

1. 在 **"Environment Variables"** 部分
2. 点击 **"Add"** 或展开环境变量输入区域
3. 逐个添加变量:

**第一个变量 - DeepSeek API Key (必需)**:
```
Name: DEEPSEEK_API_KEY
Value: sk-xxxxxxxxxxxxxxxxxxxxxxxx
```
- ✅ 确保变量名完全正确,没有空格
- ✅ 确保Value是你的实际API Key
- ✅ 选择环境: Production, Preview, Development (全选)

**第二个变量 - 高德地图 Key (可选)**:
```
Name: NEXT_PUBLIC_AMAP_KEY
Value: your_amap_key_here
```
- ⚠️ 注意: 以 `NEXT_PUBLIC_` 开头的变量会暴露到客户端
- ✅ 选择环境: Production, Preview, Development (全选)

**第三个变量 - DeepSeek URL (可选)**:
```
Name: DEEPSEEK_API_URL
Value: https://api.deepseek.com/v1
```

#### 5. 部署
- 点击 **"Deploy"**
- 等待构建完成(大约2-3分钟)

---

## ⚠️ 常见错误和解决方案

### 错误1: 环境变量设置失败

**可能原因**:
- ❌ 变量名拼写错误
- ❌ Value包含特殊字符未正确转义
- ❌ 浏览器缓存问题

**解决方案**:
1. **检查变量名**: 必须完全匹配,区分大小写
   - ✅ `DEEPSEEK_API_KEY`
   - ❌ `deepseek_api_key`
   - ❌ `DEEPSEEK_API_KEY ` (末尾有空格)

2. **检查Value格式**:
   - API Key通常是: `sk-xxxxxxxxxxxxxxxxxxxxxxxx`
   - 不要包含引号: ❌ `"sk-xxx"` ✅ `sk-xxx`
   - 不要有前后空格

3. **清除浏览器缓存并重试**:
   - 按 `Ctrl + Shift + Delete`
   - 清除缓存
   - 重新登录Vercel

### 错误2: 部署后AI功能不工作

**检查步骤**:
1. 进入项目 → **Settings** → **Environment Variables**
2. 确认 `DEEPSEEK_API_KEY` 已设置
3. 如果需要更新,点击变量右侧的 **"Edit"**
4. 修改后需要 **重新部署**:
   - 进入 **Deployments** 标签
   - 点击最新部署右侧的 **"..."**
   - 选择 **"Redeploy"**

### 错误3: 地图不显示

**解决方案**:
- 这是正常的,如果没有设置 `NEXT_PUBLIC_AMAP_KEY`
- 应用会显示友好的提示信息
- 其他功能(浏览、行程、收藏、AI规划)都能正常使用
- 如需地图功能,添加高德地图Key后重新部署

---

## 🔄 部署后更新环境变量

如果需要在部署后修改环境变量:

1. 进入项目页面
2. 点击 **"Settings"** 标签
3. 选择 **"Environment Variables"**
4. 找到要修改的变量,点击右侧的 **"Edit"**
5. 修改后点击 **"Save"**
6. **重要**: 返回 **"Deployments"** 标签
7. 点击最新部署的 **"..."** → **"Redeploy"**
8. 选择 **"Use existing Build Cache"** 或 **"Rebuild"**

---

## 📝 方法二: 使用Vercel CLI部署

如果网页部署有问题,可以使用命令行:

### 1. 安装Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录
```bash
vercel login
```

### 3. 部署
```bash
cd c:\code\linglong\travel-app-2.0
vercel
```

### 4. 添加环境变量
```bash
# 添加生产环境变量
vercel env add DEEPSEEK_API_KEY production
# 然后粘贴你的API Key

vercel env add NEXT_PUBLIC_AMAP_KEY production
# 然后粘贴你的地图Key
```

### 5. 重新部署
```bash
vercel --prod
```

---

## 🎯 验证部署成功

部署完成后,访问Vercel提供的URL(类似 `https://lvyou2.vercel.app`):

### 检查清单:
- ✅ 首页能正常加载
- ✅ 可以浏览景点
- ✅ 可以添加到行程
- ✅ 可以收藏景点
- ✅ 点击"AI规划行程"能进入规划页面
- ✅ 填写信息后能生成AI行程(如果设置了DEEPSEEK_API_KEY)
- ⚠️ 地图功能(如果没设置AMAP_KEY会显示提示)

---

## 🆘 如果还是不行

### 方案A: 先不设置环境变量,部署基础版本

1. 在Vercel导入项目时,**跳过环境变量设置**
2. 直接点击 **"Deploy"**
3. 等待部署完成
4. 部署成功后,进入 **Settings** → **Environment Variables**
5. 逐个添加环境变量
6. 添加完成后,进入 **Deployments** → **Redeploy**

### 方案B: 使用Vercel CLI(更稳定)

参考上面的"方法二"使用命令行部署

### 方案C: 创建新项目

1. 在Vercel删除当前项目
2. 重新从GitHub导入
3. 这次仔细按照步骤添加环境变量

---

## 📞 获取帮助

如果遇到具体错误信息:
1. 截图错误提示
2. 检查 Vercel 项目的 **"Deployments"** 标签中的构建日志
3. 查看是否有红色错误信息

常见错误关键词:
- `Missing environment variable` - 缺少环境变量
- `Build failed` - 构建失败
- `Module not found` - 缺少依赖
- `API error` - API调用失败

---

## 🎉 部署成功后

你的应用将获得:
- ✅ 免费的HTTPS域名
- ✅ 全球CDN加速
- ✅ 自动SSL证书
- ✅ 每次git push自动部署
- ✅ 预览部署(每个PR都有独立预览URL)

你可以:
1. 绑定自定义域名(在Settings → Domains)
2. 查看访问分析(Analytics标签)
3. 监控性能(Speed Insights标签)
4. 查看部署日志(Deployments标签)

---

## 💡 最佳实践

1. **环境变量安全**:
   - 不要在代码中硬编码API Key
   - 不要将 `.env.local` 提交到Git
   - 定期更换API Key

2. **部署策略**:
   - 开发时使用 Preview 部署测试
   - 确认无误后合并到 main 分支触发生产部署

3. **监控**:
   - 定期检查 Vercel Analytics
   - 关注错误率和性能指标
   - 查看函数调用日志

---

**祝部署顺利!** 🚀

如果还有问题,请提供具体的错误截图或错误信息,我会帮你进一步排查。
