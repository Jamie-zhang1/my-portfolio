# Jamie Zhang — AI 产品作品集

个人 AI 产品与 Vibe Coding 作品集，展示从真实问题、产品流程到可运行原型的完整实践。

## 在线访问

- 作品集首页：<https://heard-sheep.cloud/>
- 听到了咩真实产品：<https://heard-sheep.cloud/sheep>

生产部署目标是同一域名下分流：根路径 `/` 承载作品集，`/sheep` 保留真实 heard-sheep 产品。

## 核心展示项目

### 01 / 听到了咩

以录音为主入口的 AI 任务助手。真实产品支持录音、上传音频、粘贴转写稿、上传图片、转写确认、AI 分析、候选任务选择、任务管理、历史记录、个人中心与 PWA 安装引导。当前是移动端优先的单用户 Web MVP，默认部署在 `/sheep`。

### 02 / ProdDoc AI

通用型软件产品说明书与操作文档生成工作台。作品集中提供本地交互 Demo，用模板生成结构化文档预览，不在该 Demo 中调用在线 AI 服务。

### 03 / AI Decision Copilot

早期 AI 决策分析交互原型。作品集中保留为弱化展示的实验 Demo，采用预设案例展示结构化决策分析流程，不调用外部 AI 服务。

## 页面结构

```text
/
/projects/heard-sheep
/projects/proddoc-ai
/projects/decision-copilot
/try
/try/proddoc-ai
/try/decision-copilot
```

## 体验入口

heard-sheep 的三处入口共用 `src/data/site-config.ts` 中的 `heardSheepLiveUrl`：

- 本地开发默认进入 `http://localhost:3001/sheep`
- 自有服务器生产环境默认进入 `/sheep`
- Vercel 预览或临时环境可设置 `NEXT_PUBLIC_HEARD_SHEEP_URL` 为完整产品地址

Vercel 预览只证明作品集本身可以构建和访问；如果未配置真实产品地址，预览环境中的 `/sheep` 不代表生产同域部署状态。

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- next/font
- Playwright 截图脚本

## 本地运行

作品集：

```bash
npm install
npm run dev
```

默认访问：<http://localhost:3000>

heard-sheep 真实产品需要在独立目录启动：

```bash
cd C:\Users\ZHANGJIANGMIN0902\heard-sheep\heard-sheep
npm install
npm run build
npm run start -- -p 3001
```

默认访问：<http://localhost:3001/sheep>

## 环境变量

复制 `.env.example` 后按需设置：

```env
NEXT_PUBLIC_HEARD_SHEEP_URL=
```

该变量只用于覆盖 heard-sheep 体验入口。当前作品集前端不包含任何真实服务凭证。

## 部署结构

生产部署优先使用已有云服务器与 Nginx：

```text
https://heard-sheep.cloud/      -> my-portfolio 作品集服务
https://heard-sheep.cloud/sheep -> heard-sheep 真实产品服务
```

作品集和 heard-sheep 使用独立本地端口与独立进程，由 Nginx 按路径转发。修改生产 Nginx 前必须备份当前站点配置，并验证 `/sheep` 在修改前后都可访问。

## 代表性截图

- 首页：`public/screenshots/portfolio/home-desktop.png`
- 首页移动端：`public/screenshots/portfolio/home-mobile.png`
- heard-sheep 详情页：`public/screenshots/portfolio/sheep-desktop.png`
- 体验入口页：`public/screenshots/portfolio/try-desktop.png`
- heard-sheep 产品截图：`public/projects/heard-sheep/`

## 当前状态

- 功能分支：`feat/portfolio-interactive-showcase`
- 当前基线提交：`11c0eb7 feat: build editorial portfolio with interactive project showcase`
- 作品集页面与 Demo 已实现
- 生产目标域名：`heard-sheep.cloud`
- 最终生产部署与 HTTPS 验收记录见 `docs/上线执行记录_作品集网站_heard-sheep-cloud.md`

## 安全说明

- `.env`、`.env.local`、`.env.*.local` 不提交
- `.claude-debug/` 与 `.claude/settings.local.json` 不提交
- `node_modules/`、`.next/`、本地日志和私钥不提交
- 前端只包含公开配置；真实 AI 服务凭证应仅保存在对应服务端环境中
