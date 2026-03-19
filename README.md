# 🖼️ 图片背景移除工具

基于 **Next.js** + **TailwindCSS** + **Remove.bg API** 的智能图片背景移除工具。

## ✨ 特性

- 🎨 **精美界面** - 现代化 UI 设计，操作简单直观
- ⚡ **快速处理** - AI 智能算法，秒级完成抠图
- 🔒 **安全隐私** - 图片内存处理，不落盘存储
- 📱 **响应式** - 完美支持桌面和移动端
- 💰 **成本低廉** - 每月 50 张免费，超出后 $0.20/张

## 🚀 快速开始

### 1. 克隆项目

```bash
cd project
git clone https://github.com/lyz20010822/image-background-remover.git
cd image-background-remover
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件并填入你的 API Key：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```env
REMOVEBG_API_KEY=your_api_key_here
```

> 访问 [remove.bg](https://www.remove.bg/api) 注册并获取 API Key

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 使用工具

### 5. 构建生产版本

```bash
npm run build
npm run start
```

## 📖 API 接口

### 端点

```
POST /api/remove-background
Content-Type: multipart/form-data
```

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| image | File | ✅ | 图片文件（JPG/PNG/WEBP） |

### 响应

**成功：**
- Status: `200`
- Content-Type: `image/png`
- Body: PNG 图片二进制

**失败：**
```json
{
  "error": "错误描述",
  "details": "详细信息"
}
```

### 使用示例

#### JavaScript (Fetch)

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('/api/remove-background', {
  method: 'POST',
  body: formData,
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
// 下载或显示图片
```

#### cURL

```bash
curl -X POST \
  -F "image=@photo.jpg" \
  http://localhost:3000/api/remove-background \
  -o output.png
```

## 📐 限制

| 参数 | 限制 |
|------|------|
| 格式 | JPG, PNG, WEBP |
| 大小 | ≤ 25MB |
| 分辨率 | ≤ 25MP |
| 免费额度 | 50 张/月（Remove.bg） |

## 💰 成本

| 项目 | 免费额度 | 超出后 |
|------|----------|--------|
| Remove.bg API | 50 张/月 | $0.20/张 |
| Vercel 部署 | 免费 | $20/月起 |

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: TailwindCSS 4
- **语言**: TypeScript
- **API**: Remove.bg API
- **部署**: Vercel / Node.js Server

## 📁 项目结构

```
image-background-remover/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 主页面（前端 UI）
│   │   └── api/
│   │       └── remove-background/
│   │           └── route.ts  # API 路由
│   └── ...
├── public/                   # 静态资源
├── .env.local                # 环境变量（需自行创建）
├── .env.local.example        # 环境变量示例
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🌐 部署

### 方式一：Vercel 部署（推荐）

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 在 Vercel 后台设置环境变量 `REMOVEBG_API_KEY`
4. 点击 Deploy

### 方式二：Node.js 服务器部署

```bash
# 构建
npm run build

# 启动
npm run start
```

### 方式三：Docker 部署

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next .next
COPY public public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

## 🔧 开发

### 本地调试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 代码规范

```bash
# 运行 ESLint
npm run lint
```

## ⚠️ 注意事项

1. **API Key 安全**：不要将 `.env.local` 提交到 Git，已添加到 `.gitignore`
2. **隐私保护**：图片不落盘，但建议添加隐私政策
3. **配额管理**：监控 Remove.bg 使用量，避免超额
4. **错误处理**：生产环境建议添加重试机制和错误监控

## 🔄 替代方案

如果 Remove.bg 成本太高，可以考虑：

| 方案 | 成本 | 质量 |
|------|------|------|
| ClipDrop API | $0.02/张 | ⭐⭐⭐⭐ |
| 自建 RMBG-1.4 | 服务器成本 | ⭐⭐⭐⭐ |
| HuggingFace | 免费/限额 | ⭐⭐⭐ |

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Remove.bg](https://www.remove.bg/)

---

**Made with 🦞 by 飞书用户 7250WA 的助手**
