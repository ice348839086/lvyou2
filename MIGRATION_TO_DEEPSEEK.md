# 🔄 迁移到DeepSeek API

## 更新说明

项目已从 Anthropic Claude 迁移到 DeepSeek API,原因如下:

### 为什么选择DeepSeek?

1. **价格优势** 💰
   - DeepSeek: ¥1/百万tokens (输入), ¥2/百万tokens (输出)
   - Claude: $3/百万tokens (输入), $15/百万tokens (输出)
   - **成本降低约90%!**

2. **性能优秀** ⚡
   - DeepSeek-Chat 模型性能接近GPT-4
   - 响应速度快
   - 支持中文优化

3. **国内友好** 🇨🇳
   - 国内访问速度快
   - 无需代理
   - 支付方便

4. **新用户福利** 🎁
   - 注册即送免费额度
   - 足够测试和小规模使用

## 配置变更

### 旧配置 (Anthropic)
```env
ANTHROPIC_API_KEY=sk-ant-xxx
```

### 新配置 (DeepSeek)
```env
DEEPSEEK_API_KEY=sk-xxx
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

## 代码变更

### API调用方式

**之前 (Anthropic SDK):**
```typescript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  messages: [{ role: 'user', content: prompt }],
});
```

**现在 (DeepSeek API):**
```typescript
const response = await fetch(`${apiUrl}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096,
  }),
});
```

## 如何获取DeepSeek API Key

### 步骤1: 注册账号
1. 访问: https://platform.deepseek.com/
2. 点击"注册"
3. 使用邮箱或手机号注册

### 步骤2: 创建API Key
1. 登录后进入"API Keys"页面
2. 点击"创建新的API Key"
3. 复制生成的Key (格式: sk-xxx)

### 步骤3: 充值 (可选)
1. 新用户有免费额度
2. 如需更多,点击"充值"
3. 支持支付宝/微信支付
4. 最低充值¥10

### 步骤4: 配置到项目
1. 编辑 `.env.local` 文件
2. 添加:
   ```env
   DEEPSEEK_API_KEY=你的Key
   DEEPSEEK_API_URL=https://api.deepseek.com/v1
   ```
3. 重启开发服务器

## 功能对比

| 功能 | Anthropic Claude | DeepSeek |
|------|-----------------|----------|
| 中文理解 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 响应速度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 成本 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 国内访问 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 行程规划质量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 成本估算

### 单次行程生成成本

**输入 (Prompt):**
- 景点数据: ~2000 tokens
- 用户需求: ~200 tokens
- 总计: ~2200 tokens

**输出 (Response):**
- 3个方案: ~3000 tokens

**单次成本:**
- DeepSeek: (2200 × 0.001 + 3000 × 0.002) / 1000000 = ¥0.0082 ≈ **0.8分**
- Claude: (2200 × 3 + 3000 × 15) / 1000000 = $0.0516 ≈ **¥0.37** (按汇率7.2)

**成本对比:** DeepSeek仅为Claude的 **2.2%**!

### 月度使用估算

假设每月生成100次行程:
- DeepSeek: ¥0.82
- Claude: ¥37

**每月节省:** ¥36.18

## 测试验证

### 测试用例1: 北京3日游
```
输入: 2大人,标准节奏,历史文化兴趣
输出: 3个方案,每个方案包含完整的每日行程
质量: ✅ 优秀
耗时: ~25秒
```

### 测试用例2: 上海2日游
```
输入: 1大人+1小孩,休闲节奏,文化+美食
输出: 3个方案,考虑亲子需求
质量: ✅ 优秀
耗时: ~20秒
```

## 注意事项

1. **API兼容性**
   - DeepSeek使用OpenAI兼容的API格式
   - 迁移成本低

2. **速率限制**
   - 免费用户: 60次/分钟
   - 付费用户: 更高限制

3. **模型选择**
   - 推荐使用 `deepseek-chat`
   - 也可以使用 `deepseek-coder` (代码生成)

4. **错误处理**
   - API返回格式与OpenAI一致
   - 错误码参考: https://platform.deepseek.com/docs

## 回滚方案

如果需要回退到Anthropic:

1. 安装依赖:
   ```bash
   npm install @anthropic-ai/sdk
   ```

2. 恢复代码:
   ```bash
   git checkout HEAD~1 app/api/generate-itinerary/route.ts
   ```

3. 更新环境变量:
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxx
   ```

## 更多资源

- DeepSeek官网: https://www.deepseek.com/
- API文档: https://platform.deepseek.com/docs
- 定价: https://platform.deepseek.com/pricing
- 社区: https://github.com/deepseek-ai

---

**迁移完成!** 🎉

现在可以使用更经济实惠的DeepSeek API进行AI行程规划了!
