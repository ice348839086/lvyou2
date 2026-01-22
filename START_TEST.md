# 🚀 启动测试指南

## 快速启动 (3步)

### 步骤1: 安装依赖 ✅

```bash
cd c:\code\linglong\travel-app-2.0
npm install
```

**说明**: 安装所有必需的npm包,包括Next.js、React、Tailwind CSS等。

### 步骤2: 配置环境变量 (重要!)

创建 `.env.local` 文件:

```bash
# 在项目根目录创建 .env.local 文件
```

添加以下内容:

```env
# 高德地图API Key (必需,否则地图无法显示)
NEXT_PUBLIC_AMAP_KEY=你的高德地图API_Key

# DeepSeek API Key (可选,用于AI功能)
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

**如何获取高德地图API Key:**

1. 访问: https://lbs.amap.com/
2. 注册并登录
3. 进入"应用管理" → "我的应用" → "创建新应用"
4. 添加Key → 选择"Web端(JS API)"
5. 服务平台选择"Web端(JS API)"
6. 复制生成的Key
7. 配置白名单: `localhost:3000` 和 `127.0.0.1:3000`

**临时测试方案 (无API Key):**

如果暂时没有API Key,可以先测试其他功能:
- 景点数据展示
- 筛选功能
- UI界面
- 页面路由

只是地图会显示"地图加载失败"的提示。

### 步骤3: 启动开发服务器

```bash
npm run dev
```

**预期输出:**

```
> travel-app-2.0@0.1.0 dev
> next dev

  ▲ Next.js 16.1.4
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.3s
```

然后在浏览器打开: **http://localhost:3000**

## 🧪 测试功能清单

### 1. 首页地图探索 (http://localhost:3000)

**测试项目:**
- [ ] 页面正常加载
- [ ] 顶部导航显示正确
- [ ] 城市选择器可用 (北京/上海)
- [ ] 筛选栏显示正常
- [ ] 景点卡片横向滚动
- [ ] 地图加载 (需要API Key)
- [ ] 点击景点卡片打开详情弹窗
- [ ] 筛选功能生效

**测试步骤:**
1. 选择"北京"
2. 查看是否显示5个景点卡片
3. 点击"类型"筛选 → 选择"历史遗迹"
4. 应该只显示故宫、长城等历史景点
5. 点击任意景点卡片
6. 应该弹出详情窗口,显示AI摘要

### 2. AI规划页面 (http://localhost:3000/plan)

**测试项目:**
- [ ] 页面正常加载
- [ ] 表单输入正常
- [ ] 日期选择器可用
- [ ] 人数调整正常
- [ ] 旅行节奏选择
- [ ] 兴趣标签多选
- [ ] 生成按钮可点击
- [ ] AI生成功能 (需要DeepSeek API Key)

**测试步骤 (无API Key):**
1. 点击顶部"AI规划行程"按钮
2. 填写表单:
   - 目的地: 北京
   - 开始日期: 明天
   - 结束日期: 后天
   - 成人: 2人
   - 节奏: 标准
   - 兴趣: 勾选"历史文化"
3. 点击"生成AI行程"
4. 如果没有API Key,会显示错误提示

**测试步骤 (有API Key):**
1. 完成上述步骤
2. 等待30-60秒
3. 应该显示3个方案
4. 每个方案有标题、描述、行程预览

### 3. 行程总览页面 (http://localhost:3000/itinerary/test)

**测试项目:**
- [ ] 页面正常加载
- [ ] 时间轴显示
- [ ] 天数切换器
- [ ] 活动卡片显示
- [ ] 地图区域显示
- [ ] 灵感地点库显示

**测试步骤:**
1. 直接访问 http://localhost:3000/itinerary/test
2. 查看时间轴是否显示Day1的行程
3. 点击"Day 2"按钮 (如果有)
4. 点击任意活动卡片
5. 应该弹出活动详情

### 4. 响应式测试

**测试项目:**
- [ ] 桌面端 (1920x1080)
- [ ] 平板端 (768x1024)
- [ ] 移动端 (375x667)

**测试步骤:**
1. 打开浏览器开发者工具 (F12)
2. 切换到设备模拟器
3. 测试不同屏幕尺寸
4. 检查布局是否正常

## 🐛 常见问题排查

### 问题1: 地图显示"地图加载失败"

**原因**: 未配置高德地图API Key

**解决**:
1. 创建 `.env.local` 文件
2. 添加 `NEXT_PUBLIC_AMAP_KEY=你的Key`
3. 重启开发服务器 (Ctrl+C 然后 npm run dev)

### 问题2: npm install 失败

**原因**: 网络问题或npm版本过低

**解决**:
```bash
# 清除缓存
npm cache clean --force

# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### 问题3: 端口3000被占用

**原因**: 其他程序占用了3000端口

**解决**:
```bash
# 使用其他端口
npm run dev -- -p 3001
```

### 问题4: TypeScript错误

**原因**: 类型定义问题

**解决**:
```bash
# 重新安装类型定义
npm install --save-dev @types/node @types/react @types/react-dom
```

### 问题5: 页面空白

**原因**: JavaScript错误

**解决**:
1. 打开浏览器控制台 (F12)
2. 查看Console标签的错误信息
3. 检查Network标签是否有请求失败

## 📊 性能检查

### 检查项目:
- [ ] 首屏加载时间 < 3秒
- [ ] 地图渲染流畅
- [ ] 筛选响应即时
- [ ] 页面切换流畅
- [ ] 无内存泄漏

### 使用Chrome DevTools:
1. F12 打开开发者工具
2. Performance标签 → 录制
3. 操作页面
4. 停止录制,查看性能报告

## 🔍 调试技巧

### 1. 查看控制台日志

```javascript
// 浏览器控制台
console.log('当前景点数据:', attractions)
```

### 2. 查看网络请求

F12 → Network标签:
- 查看API请求
- 检查响应数据
- 确认状态码

### 3. React DevTools

安装React DevTools扩展:
- 查看组件树
- 检查Props和State
- 性能分析

## ✅ 测试完成清单

完成以下测试后,项目基本功能正常:

- [ ] 首页正常加载
- [ ] 城市切换正常
- [ ] 景点数据显示正常
- [ ] 筛选功能正常
- [ ] 景点详情弹窗正常
- [ ] AI规划页面正常
- [ ] 行程总览页面正常
- [ ] 响应式布局正常
- [ ] 无控制台错误
- [ ] 性能指标达标

## 🎯 下一步

测试通过后,可以:

1. **添加更多数据**: 编辑 `data/attractions/*.json`
2. **自定义样式**: 修改 `app/globals.css`
3. **扩展功能**: 添加新的组件和页面
4. **部署上线**: 参考 `DEPLOYMENT.md`

---

**祝测试顺利! 🚀**

有问题随时查看:
- README.md - 项目说明
- QUICK_START.md - 快速开始
- PROJECT_SUMMARY.md - 项目总结
