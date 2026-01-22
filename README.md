# 🗺️ 智旅 2.0 - AI驱动的智能旅行规划助手

一个基于Next.js和AI技术的现代化旅行规划应用,提供智能景点推荐、行程规划和个性化旅游体验。

## ✨ 核心功能

### 🔍 智能景点浏览
- **地图可视化** - 高德地图集成,直观展示景点位置
- **多维度筛选** - 按类型、时长、适合人群等筛选
- **AI精华摘要** - 每个景点都有AI生成的亮点、建议和避坑指南
- **响应式网格** - 自适应布局,完美支持各种设备

### 📋 行程管理
- **添加到行程** - 一键添加感兴趣的景点
- **智能状态** - 已添加景点显示绿色标识,防止重复
- **本地存储** - 数据持久化,刷新不丢失
- **灵活管理** - 查看、排序、移除景点

### ❤️ 收藏功能
- **快速收藏** - 收藏喜欢的景点方便查看
- **状态同步** - 实时显示收藏状态
- **独立管理** - 专门的收藏页面

### 🤖 AI智能规划
- **个性化定制** - 根据日期、人数、节奏、兴趣生成行程
- **优先安排** - 自动整合用户已添加的景点
- **多方案对比** - 一次生成3个不同风格的方案
- **详细行程** - 每日时间轴、景点推荐理由、游玩小贴士

### 🎯 底部导航
- **三大模块** - 浏览、行程、收藏一键切换
- **实时徽章** - 显示行程和收藏数量
- **流畅切换** - 无缝的页面切换体验

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **地图**: 高德地图 JS API
- **AI**: DeepSeek API
- **状态管理**: React Context API
- **存储**: localStorage

## 📦 安装和运行

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 环境配置
创建 `.env.local` 文件并配置以下变量:

```env
# 高德地图 API Key (可选,用于地图功能)
NEXT_PUBLIC_AMAP_KEY=your_amap_key_here

# DeepSeek API Key (必需,用于AI规划)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 生产构建
```bash
npm run build
npm start
```

## 📂 项目结构

```
travel-app-2.0/
├── app/                      # Next.js App Router
│   ├── api/                  # API路由
│   │   ├── attractions/      # 景点数据API
│   │   └── generate-itinerary/ # AI行程生成API
│   ├── components/           # React组件
│   │   ├── AttractionCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── MapView.tsx
│   │   └── Timeline.tsx
│   ├── contexts/             # Context状态管理
│   │   └── TravelContext.tsx
│   ├── plan/                 # AI规划页面
│   ├── page.tsx              # 首页(浏览/行程/收藏)
│   └── layout.tsx            # 根布局
├── lib/                      # 工具库
│   ├── ai/                   # AI相关
│   │   └── prompts.ts        # AI提示词
│   ├── attractions.ts        # 景点数据加载
│   ├── attractions-client.ts # 客户端工具
│   ├── map.ts                # 地图工具
│   └── types.ts              # TypeScript类型
├── data/                     # 景点数据
│   └── attractions/
│       ├── beijing.json
│       ├── shanghai.json
│       ├── hangzhou.json
│       └── chengdu.json
└── public/                   # 静态资源
```

## 🎨 功能特色

### 1. 智能交互
- 添加到行程按钮动态状态(未添加/已添加)
- 收藏按钮实时切换(🤍/❤️)
- Toast消息提示
- 平滑的动画效果

### 2. 地图集成
- 景点标记和信息窗口
- 自动视野调整
- 点击标记查看详情
- 弹窗打开时隐藏地图Logo

### 3. AI规划
- 基于DeepSeek大模型
- 考虑地理位置、开放时间、人群特征
- 动静结合、室内外交替
- 自动安排用餐和交通

### 4. 数据持久化
- localStorage存储行程和收藏
- 页面刷新数据不丢失
- 自动同步状态

## 📝 使用指南

### 浏览景点
1. 选择城市(北京/上海/杭州/成都)
2. 使用筛选条件缩小范围
3. 在地图或卡片上查看景点
4. 点击景点查看详细信息

### 管理行程
1. 在景点详情中点击"添加到行程"
2. 切换到"行程"Tab查看
3. 可以查看详情或移除景点
4. 行程数据自动保存

### AI规划
1. 点击顶部"AI规划行程"按钮
2. 填写目的地、日期、人数等信息
3. 选择旅行节奏和兴趣偏好
4. 如果已添加景点,会优先安排
5. 生成3个不同风格的方案
6. 查看详细的每日行程

## 🔧 配置说明

### 高德地图配置
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 创建应用获取Web端(JS API) Key
3. 在 `.env.local` 中设置 `NEXT_PUBLIC_AMAP_KEY`
4. 重启开发服务器

### DeepSeek API配置
1. 访问 [DeepSeek官网](https://www.deepseek.com/)
2. 注册并获取API Key
3. 在 `.env.local` 中设置 `DEEPSEEK_API_KEY`
4. 重启开发服务器

## 🚀 部署

### Vercel部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 环境变量
在Vercel项目设置中配置:
- `NEXT_PUBLIC_AMAP_KEY`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_API_URL`

## 📄 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本更新历史。

## 🤝 贡献

欢迎提交Issue和Pull Request!

## 📜 许可证

MIT License

## 👨‍💻 作者

ice348839086

---

**享受你的智能旅行规划体验!** 🎉
