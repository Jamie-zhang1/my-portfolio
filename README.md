# Jamie Zhang Portfolio

Jamie Zhang 的双语个人作品集，用真实页面记录 AI 产品、Agent 工作流与交互原型实践。

- 线上站点：<https://heard-sheep.cloud/>
- 中文版：<https://heard-sheep.cloud/zh>
- English：<https://heard-sheep.cloud/en>
- Heard Sheep：<https://heard-sheep.cloud/sheep>

根路径固定跳转至 `/zh`。`/sheep` 由独立的 Heard Sheep 服务提供，本仓库只负责作品集及其案例展示。

## 项目内容

当前作品集收录四个案例：

| 项目 | 定位 | 站内页面 |
| --- | --- | --- |
| ResearchFlow Agent | 研究资料整理与证据追踪工作流原型 | `/[locale]/projects/researchflow-agent` |
| Heard Sheep | 将语音、图片与文本整理成候选任务的移动端工具 | `/[locale]/projects/heard-sheep` |
| ProdDoc AI | 产品文档整理、编辑与导出实验 | `/[locale]/projects/proddoc-ai` |
| AI Decision Copilot | 选项、比较标准与风险并列呈现的决策辅助实验 | `/[locale]/projects/ai-decision-copilot` |

其中 ProdDoc AI 与 AI Decision Copilot 提供作品集内的稳定演示页；ResearchFlow 与 Heard Sheep 的案例页会说明真实能力与当前边界。

## 主要能力

- `zh` / `en` 双语内容、metadata、canonical、hreflang 与 sitemap
- 首页项目轨道、案例详情、产品演示、简历与联系入口
- Motion、GSAP 与 Lenis 驱动的克制交互，并支持 `prefers-reduced-motion`
- 桌面端与移动端适配、深色模式、键盘操作与横向溢出检查
- Playwright 验收脚本与截图/动效证据脚本
- 同域多服务部署：作品集位于 `/`，Heard Sheep 位于 `/sheep`

## 技术栈

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4
- next-intl 4
- Motion for React、GSAP、Lenis
- Playwright

## 本地运行

要求 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

访问 <http://localhost:3000>。本地开发时，Heard Sheep 按钮默认指向 `http://localhost:3001/sheep`；如需覆盖：

```powershell
$env:NEXT_PUBLIC_HEARD_SHEEP_URL="https://example.com/sheep"
npm run dev
```

环境变量模板见 [`.env.example`](.env.example)。变量以 `NEXT_PUBLIC_` 开头，只能用于公开地址，不能存放密钥。

## 质量检查

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`npm run test:e2e` 不会自动启动站点。先在另一个终端运行生产或开发服务器，再执行：

```powershell
$env:PORTFOLIO_BASE_URL="http://127.0.0.1:3000"
npm run test:e2e
```

验收脚本覆盖中英文首页、四个案例路由、已移除的 Notes 路由、桌面与移动端布局、深色模式、项目卡片交互和关键公开链接。输出写入被 Git 忽略的 `output/`。

截图与动效证据可通过 `npm run screenshots` 生成；该流程需要 Playwright Chromium，录制视频时还需要 FFmpeg。

## 路由

```text
/
/zh
/en
/{locale}/projects/heard-sheep
/{locale}/projects/researchflow-agent
/{locale}/projects/proddoc-ai
/{locale}/projects/ai-decision-copilot
/{locale}/try
/{locale}/try/proddoc-ai
/{locale}/try/decision-copilot
/sheep
```

旧的 Decision Copilot 地址由 `next.config.ts` 兼容跳转。Notes 子系统已经移除，不应重新出现在导航、sitemap 或验收基线中。

## 目录结构

```text
messages/                 双语短文案
public/                   简历、图片、项目截图与公开静态资源
scripts/                  验收、截图与简历生成脚本
src/app/[locale]/         双语页面与路由
src/components/           首页、案例页与交互组件
src/data/                 个人信息、项目数据与双语案例长文案
src/i18n/                 next-intl 路由与导航配置
docs/                     内容维护与部署手册
ops/analytics/            私有访问分析页面的生成与服务配置
```

修改个人信息、项目文案、截图或新增案例时，请先阅读 [内容维护指南](docs/MAINTENANCE.md)。生产部署、健康检查与回滚见 [部署手册](docs/DEPLOYMENT.md)。私有访问分析的统计口径与服务器文件见 [analytics 说明](ops/analytics/README.md)。

## 内容原则

- 本站是个人作品记录，不把原型描述成成熟商业系统。
- 案例只陈述已实现、可访问或能由仓库证据支持的能力。
- API 密钥、Basic Auth 凭据、服务器环境文件和访问日志不得提交。
- 项目长文案必须同步维护中文与英文版本。
- 公开截图不得包含调试浮层、浏览器扩展、真实密钥或私人数据。

## 生产架构

```text
Nginx 80/443
├── /sheep      → Heard Sheep service (127.0.0.1:3003)
├── /analytics/ → password-protected static dashboard
└── /           → Portfolio service (127.0.0.1:3004)
```

部署作品集时不得停止 Heard Sheep、改变其 3003 端口或破坏 `/sheep` 前缀。私有 analytics 页面不属于公开导航，并必须继续受认证、`noindex` 与禁止缓存策略保护。

## 设计来源说明

首页构图、作品区结构与人像交互曾参考 Dymas Alfin 为 Mikan Team 发布的 Dribbble 作品 [Personal Portfolio Website - Animations](https://dribbble.com/shots/26995447-Personal-Portfolio-Website-Animations)。本项目不是该设计的官方实现；内容、代码、个人资料、案例、简历和项目图片均为本作品集重新组织或制作，原作权利归其作者所有。

## English summary

This repository contains Jamie Zhang's bilingual personal portfolio. It presents four AI product and Agent workflow practices with explicit prototype boundaries, localized case studies, responsive interaction, and a self-hosted deployment. Start with `npm run dev`, use the checks above before shipping, and keep Chinese and English content synchronized.

## 联系方式

- GitHub：<https://github.com/Jamie-zhang1>
- Email：<zhangjiangmin0902@gmail.com>
- Resume：<https://heard-sheep.cloud/resume-jamie-zhang.pdf>
