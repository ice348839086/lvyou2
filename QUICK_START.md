# 🚀 快速启动指南

## 前置要求

- Node.js 18+
- npm或yarn
- 高德地图API Key (必需)
- Anthropic API Key (可选,用于AI功能)

## 5分钟快速启动

### 1. 安装依赖

```bash
cd c:\code\linglong\travel-app-2.0
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件:

```env
# 高德地图API Key (必需)
NEXT_PUBLIC_AMAP_KEY=your_amap_key_here

# DeepSeek API Key (可选,用于AI功能)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

**获取高德地图API Key:**
1. 访问 https://lbs.amap.com/
2. 注册并登录
3. 创建应用 → 添加Key → 选择"Web端(JS API)"
4. 配置域名白名单: `localhost:3000`

**获取DeepSeek API Key (可选):**
1. 访问 https://platform.deepseek.com/
2. 注册并登录
3. 创建API Key
4. 注意: DeepSeek价格实惠,新用户有免费额度

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问: http://localhost:3000

## 功能演示

### 1. 地图探索 (首页)

- 选择城市(北京/上海)
- 查看景点标记
- 点击标记查看详情
- 使用筛选栏过滤景点
- 点击景点卡片查看完整信息

### 2. AI规划 (需要DeepSeek API Key)

- 点击"AI规划行程"按钮
- 填写旅行信息:
  - 目的地
  - 日期
  - 人数
  - 旅行节奏
  - 兴趣偏好
- 点击"生成AI行程"
- 等待20-40秒 (DeepSeek速度较快)
- 查看3个AI生成的方案

### 3. 行程管理

- 选择一个方案
- 查看时间轴和地图
- 切换不同天数
- 点击活动查看详情
- 浏览灵感地点库

## 常见问题

### Q: 地图显示空白?

**A:** 检查以下几点:
1. 是否配置了`NEXT_PUBLIC_AMAP_KEY`
2. API Key是否正确
3. 域名是否在白名单中
4. 浏览器控制台是否有错误

### Q: AI生成失败?

**A:** 可能的原因:
1. 未配置`DEEPSEEK_API_KEY`
2. API Key无效或余额不足
3. 网络连接问题
4. 选择的天数超出范围(1-10天)

### Q: 没有景点数据?

**A:** 当前只有北京和上海的示例数据。要添加更多城市:
1. 在`data/attractions/`创建新的JSON文件
2. 按照数据结构填充景点信息
3. 在首页城市选择器中添加选项

### Q: 如何添加新景点?

**A:** 编辑`data/attractions/{city}.json`,按照以下格式添加:

```json
{
  "id": "city-attraction-name",
  "name": "景点名称",
  "city": "city",
  "type": "historical",
  "location": {
    "lat": 39.9163,
    "lng": 116.3972,
    "address": "详细地址"
  },
  "duration": {
    "quick": 60,
    "normal": 120,
    "deep": 180
  },
  // ... 其他字段
}
```

## 开发技巧

### 热重载

修改代码后会自动重载,无需手动刷新浏览器。

### 查看日志

- 浏览器控制台: 前端日志
- 终端: 服务端日志和API调用

### 调试地图

在浏览器控制台输入:
```javascript
window.AMap // 查看地图实例
```

### 测试AI功能

如果没有DeepSeek API Key,可以:
1. 注册DeepSeek获取免费额度
2. 使用模拟数据测试UI
3. 修改API路由返回固定的JSON数据

## 下一步

- 📖 阅读 [README.md](./README.md) 了解完整功能
- 🚀 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 学习部署
- 📊 查看 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) 了解项目详情

## 需要帮助?

- 查看代码注释
- 阅读文档
- 检查浏览器控制台错误
- 查看终端日志

---

**祝你使用愉快! 🎉**
