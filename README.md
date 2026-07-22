# Jamie Zhang — AI Product Portfolio

AI 产品交互型个人品牌站，展示 Jamie Zhang 如何把真实需求转化为可体验、可验证、可交付的 AI 产品原型。

## Online

- Portfolio: <https://heard-sheep.cloud/>
- Chinese: <https://heard-sheep.cloud/zh>
- English: <https://heard-sheep.cloud/en>
- Heard Sheep live product: <https://heard-sheep.cloud/sheep>

根路径会根据 `NEXT_LOCALE` cookie 和浏览器语言跳转到 `/zh` 或 `/en`。`/sheep` 由同域下的独立 Heard Sheep 服务继续承载。

## Design reference and attribution

The homepage composition, selected-work structure, and portrait interaction were studied with reference to Dymas Alfin's Dribbble shot [Personal Portfolio Website - Animations](https://dribbble.com/shots/26995447-Personal-Portfolio-Website-Animations) for Mikan Team.

This site is not an official implementation of that work. The content, code, personal information, case studies, resume, and project imagery are redesigned and produced for Jamie Zhang's portfolio; the reference link is included to disclose the visual research source, and the original design rights remain with its author.
## Featured products

- Heard Sheep — multimodal AI task assistant
- ProdDoc AI — AI product documentation workspace
- AI Decision Copilot — structured AI decision assistant

每个项目均提供中文和英文 Case Study，覆盖项目概览、问题、方案、角色、核心流程、AI 能力、技术栈与复盘。

## Routes

```text
/{locale}
/{locale}/projects/heard-sheep
/{locale}/projects/proddoc-ai
/{locale}/projects/ai-decision-copilot
/{locale}/try
/{locale}/try/proddoc-ai
/{locale}/try/decision-copilot
```

支持 `zh` 与 `en`。旧项目路径仍会跳转到对应的中文或英文语义路径。

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4
- next-intl 4
- Motion for React
- GSAP ScrollTrigger
- Lenis
- Playwright

GSAP、Lenis 均在客户端按需加载。站点支持 `prefers-reduced-motion`，移动端关闭自定义鼠标效果。

## Local development

```bash
npm install
npm run dev
```

默认访问 <http://localhost:3000>。

```bash
npm run lint
node node_modules/typescript/bin/tsc --noEmit
npm run build
npm run test:e2e
```

端到端脚本验证中英文首页、卡片展开、产品实验室、Command Menu、案例页和移动端横向溢出。

## Internationalization

- `src/i18n/routing.ts` — locale 与路由策略
- `src/i18n/request.ts` — 请求级消息加载
- `src/i18n/navigation.ts` — locale-aware Link 和 Router
- `src/proxy.ts` — 浏览器语言 / cookie 检测与前缀跳转
- `messages/zh.json`, `messages/en.json` — 短文案
- `src/data/case-studies-localized.ts` — 分语言长案例内容

语言切换会保持当前语义路径，并由 next-intl 同步 `NEXT_LOCALE` cookie。

## SEO

- 分语言 title、description 与 Open Graph
- `html lang="zh-CN"` / `html lang="en"`
- `zh-CN`、`en`、`x-default` hreflang
- 含中英文页面与 alternates 的 sitemap
- canonical URL 与旧链接兼容跳转

## Production layout

```text
Nginx 80/443
├── /sheep  -> Heard Sheep service on 127.0.0.1:3003
└── /       -> Portfolio service on 127.0.0.1:3004
```

部署记录与回滚说明见 `docs/上线执行记录_作品集网站_heard-sheep-cloud.md`。发布时不得停止 Heard Sheep 容器、改变 3003 端口或剥离 `/sheep` 前缀。

## Public contact

- GitHub: <https://github.com/Jamie-zhang1>
- Email: <zhangjiangmin0902@gmail.com>
- Resume: `/resume-jamie-zhang.pdf`
