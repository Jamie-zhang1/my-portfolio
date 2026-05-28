# 上线执行记录：作品集网站 heard-sheep.cloud

**执行日期：** 2026-05-28  
**目标域名：** `heard-sheep.cloud`  
**目标结构：**

```text
https://heard-sheep.cloud/      -> Jamie Zhang AI 产品作品集
https://heard-sheep.cloud/sheep -> 听到了咩真实产品
```

---

## 1. 初始代码基线

- 仓库：`https://github.com/Jamie-zhang1/my-portfolio`
- 功能分支：`feat/portfolio-interactive-showcase`
- 初始 HEAD：`11c0eb7 feat: build editorial portfolio with interactive project showcase`
- 初始状态：功能分支已与远端同步，工作区干净
- `main` 基线：`67c2dc8 Add files via upload`

---

## 2. 当前页面结构

```text
/
/projects/heard-sheep
/projects/proddoc-ai
/projects/decision-copilot
/try
/try/proddoc-ai
/try/decision-copilot
```

项目展示顺序：

1. `01 / 听到了咩`：主项目，真实产品入口
2. `02 / ProdDoc AI`：第二重点项目，本地交互 Demo
3. `03 / AI Decision Copilot`：弱化展示的实验 Demo

---

## 3. 内容核验记录

真实 heard-sheep 项目目录：

```text
C:\Users\ZHANGJIANGMIN0902\heard-sheep\heard-sheep
```

已核对：

- `next.config.mjs` 默认 `basePath=/sheep`
- 页面路由包含首页、任务页、历史页、个人中心、分析结果页、任务详情页
- API 路由包含转写、图片文字提取、AI 分析、记录与任务
- README 声明当前为可运行 Web MVP，单用户本地 JSON 存储

作品集允许陈述的真实能力：

- 录音、暂停/继续、录音重点标记
- 上传音频、粘贴转写稿、上传图片
- 转写确认与手动修正
- AI 分析、整理文本、候选任务、执行方案
- 候选任务选择、编辑并加入任务清单
- 任务筛选、任务详情、历史记录
- 个人中心、数据导出、本地数据清空、PWA 安装引导

不得陈述为已完成的能力：

- 多用户账号体系
- 团队协作
- 云端同步
- 正式日历联动
- 真实会员/支付体系

---

## 4. 已处理问题

- heard-sheep 三处体验入口已统一读取 `src/data/site-config.ts`
- 本地开发默认指向 `http://localhost:3001/sheep`
- 生产环境默认指向 `/sheep`
- README 和 `.env.example` 已说明 Vercel 预览需设置 `NEXT_PUBLIC_HEARD_SHEEP_URL`
- 最终展示截图已使用 Playwright 独立 Chromium 环境重新截取
- README、SEO、环境变量说明与上线记录已更新
- TypeScript、build、lint、本地页面、线上页面和 Demo 验收已通过
- 功能分支已快进合并到 `main`
- 作品集已部署到生产根路径，`/sheep` 保持真实产品服务
- HTTPS、`www` 跳转和线上体验入口已验证

---

## 5. 阶段提交记录

| 阶段 | Commit | 状态 |
| --- | --- | --- |
| 阶段 1：内容、入口、文档与 SEO 基础修复 | `dbf7ede` | 已推送 |
| 阶段 2：截图替换与视觉复核 | `77a5295` | 已推送 |
| 阶段 3：README/SEO/部署记录最终化 | `cadcfee`, `f9c9bcc`, `b9e62a3` | 已推送 |
| 阶段 4：合并 `main` | `b9e62a3` | 已快进合并并推送 |
| 阶段 5-9：生产审计、部署、HTTPS 与线上验收 | 无代码提交 | 已完成 |
| 阶段 10：生产部署记录 | `docs: record production deployment for heard-sheep cloud portfolio` | 已提交并推送到 `main` |

---

## 5.1 本地入口验证

验证环境：

- 作品集：`http://127.0.0.1:3000`
- heard-sheep production preview：`http://127.0.0.1:3001/sheep`

技术检查：

- `npx tsc --noEmit`：通过
- `npm run build`：通过，生成 11 个静态页面
- heard-sheep `npm run build`：通过

入口验证结果：

| 来源页面 | 按钮文本 | href | 目标状态 |
| --- | --- | --- | --- |
| `/` | `立即体验` | `http://localhost:3001/sheep` | 200 |
| `/try` | `进入听到了咩` | `http://localhost:3001/sheep` | 200 |
| `/projects/heard-sheep` | `立即体验` | `http://localhost:3001/sheep` | 200 |

说明：三处入口均来自 `src/data/site-config.ts` 的 `heardSheepLiveUrl`；本地开发环境自动指向 `localhost:3001/sheep`，生产默认仍为 `/sheep`。

---

## 5.2 截图替换记录

截图来源：

- heard-sheep：`http://127.0.0.1:3001/sheep` production preview
- my-portfolio：`http://127.0.0.1:3456` production preview
- 浏览器环境：Playwright Chromium 独立 headless context，不复用用户 Chrome

已重新生成 heard-sheep 产品截图：

- `public/projects/heard-sheep/home-mobile.png`
- `public/projects/heard-sheep/input-mobile.png`
- `public/projects/heard-sheep/analysis-result-mobile.png`
- `public/projects/heard-sheep/candidate-tasks-mobile.png`
- `public/projects/heard-sheep/tasks-mobile.png`
- `public/projects/heard-sheep/tasks-with-data-mobile.png`
- `public/projects/heard-sheep/task-detail-mobile.png`
- `public/projects/heard-sheep/history-mobile.png`
- `public/projects/heard-sheep/me-mobile.png`

已重新生成作品集截图：

- `public/screenshots/portfolio/home-desktop.png`
- `public/screenshots/portfolio/home-mobile.png`
- `public/screenshots/portfolio/sheep-desktop.png`
- `public/screenshots/portfolio/sheep-mobile.png`
- `public/screenshots/portfolio/try-desktop.png`
- `public/screenshots/portfolio/try-mobile.png`
- `public/screenshots/portfolio/proddoc-desktop.png`
- `public/screenshots/portfolio/proddoc-mobile.png`
- `public/screenshots/portfolio/copilot-desktop.png`
- `public/screenshots/portfolio/copilot-mobile.png`

视觉复核结论：

- 未发现右侧粉色悬浮控件
- 未发现左下角黑色 Next.js 开发标记
- 未发现浏览器插件、调试工具或密钥信息
- 移动端顶部导航已做小范围响应式修复，避免 375px 下挤压重叠
- 作品集截图脚本已滚动触发懒加载，避免详情页下方产品图空白

---

## 5.3 README、SEO 与质量检查

已完成：

- README 已改为公开作品集仓库说明，包含在线地址、页面结构、体验入口、技术栈、部署结构、截图与安全说明
- `.env.example` 已说明本地、生产和 Vercel 预览的 heard-sheep 入口配置
- `src/data/site-config.ts` 使用正式域名 `https://heard-sheep.cloud`
- `src/app/sitemap.ts` 覆盖项目页与 `/try` 页面
- `public/robots.txt` 指向 `https://heard-sheep.cloud/sitemap.xml`
- `public/manifest.json` 使用存在的公开图片资源
- 移除了 lint 中的未使用变量警告

检查结果：

- `npx tsc --noEmit`：通过
- `npm run lint`：通过，0 warning
- `npm run build`：通过，生成 11 个静态页面
- 占位域名/邮箱扫描：未发现占位邮箱、示例域名或旧域名；旧断点文档中仅保留“已移除不存在 favicon 引用”的历史说明

---

## 6. 生产部署结构

服务器：

```text
ubuntu@62.234.90.78
```

实际部署结构：

```text
Nginx 80/443
├── heard-sheep.cloud/       -> http://127.0.0.1:3004  my-portfolio
├── heard-sheep.cloud/sheep  -> http://127.0.0.1:3003  heard-sheep
└── www.heard-sheep.cloud/*  -> https://heard-sheep.cloud/*
```

作品集部署目录：

```text
/home/ubuntu/apps/my-portfolio
/home/ubuntu/apps/my-portfolio/releases/b9e62a3-20260528-225117
/home/ubuntu/apps/my-portfolio/current
```

部署代码来源：

- `main` 已推送到 GitHub，最新上线基线为 `b9e62a31c28b425c4681605e0d59214785002794`
- 服务器直连 GitHub `git clone/fetch` 出现 TLS 中断，因此使用本地已合并并已推送的 `main` commit 生成 Git archive
- 上传包：`/tmp/my-portfolio-b9e62a3.tar`
- 服务器 release 内记录：`DEPLOY_COMMIT=b9e62a31c28b425c4681605e0d59214785002794`

作品集进程：

- 管理方式：systemd
- 服务名：`my-portfolio.service`
- 监听地址：`127.0.0.1:3004`
- 启动目录：`/home/ubuntu/apps/my-portfolio/current`

heard-sheep 原服务：

- 管理方式：Docker
- 容器名：`heard-sheep`
- 公网监听映射：`0.0.0.0:3003->3000/tcp`
- Nginx 保留 `/sheep` 前缀转发，不剥离路径

---

## 7. 服务器审计结果

服务器状态：

- 主机名：`VM-0-4-ubuntu`
- 系统：Ubuntu 22.04.5 LTS
- Node：`v24.15.0`
- npm：`11.12.1`
- PM2：未安装
- Nginx：运行中
- 80/443：Nginx 已监听

上线前状态：

- `https://heard-sheep.cloud/sheep`：200，真实产品可访问
- `https://heard-sheep.cloud/`：302 到 `/sheep`
- `http://heard-sheep.cloud/` 与 `/sheep`：跳转 HTTPS
- DNS：
  - `heard-sheep.cloud A 62.234.90.78`
  - `www.heard-sheep.cloud A 62.234.90.78`

证书状态：

- Certbot 证书名：`www.heard-sheep.cloud`
- 覆盖域名：`www.heard-sheep.cloud`、`heard-sheep.cloud`
- 到期时间：`2026-08-13 14:28:44+00:00`
- 上线时状态：有效

Nginx 配置：

- 启用站点：`/etc/nginx/sites-enabled/heard-sheep-domain`
- 实际配置文件：`/etc/nginx/sites-available/heard-sheep-domain`
- 上线前完整快照：`/home/ubuntu/nginx-before-portfolio-deploy-20260528-151238.txt`

---

## 8. Nginx 配置备份与变更

修改前备份：

- `/etc/nginx/sites-available/heard-sheep-domain.bak.20260528-225408`
- `/etc/nginx/sites-available/heard-sheep-domain.bak.20260528-225440`
- `/etc/nginx/sites-available/heard-sheep-domain.bak.20260528-225544`

最终生效备份：

```text
/etc/nginx/sites-available/heard-sheep-domain.bak.20260528-225544
```

最终变更：

- `server_name heard-sheep.cloud` 的 HTTPS server block 中：
  - `location ^~ /sheep` 转发到 `http://127.0.0.1:3003`
  - `location /` 转发到 `http://127.0.0.1:3004`
- `server_name www.heard-sheep.cloud` 的 HTTPS server block 中：
  - 301 跳转到 `https://heard-sheep.cloud$request_uri`
- HTTP server block：
  - 301 跳转到 `https://heard-sheep.cloud$request_uri`

应用结果：

- `sudo nginx -t`：通过
- `sudo systemctl reload nginx`：成功

本文档不保存证书私钥、服务器私钥、Token 或完整敏感配置。

---

## 9. 线上验证结果

验证方式：

- `curl.exe --noproxy "*"` 验证 HTTP/HTTPS 状态码与跳转
- Playwright Chromium headless 独立上下文验证页面、按钮、Demo、控制台错误和关键资源请求

| URL | 预期 | 结果 |
| --- | --- | --- |
| `https://heard-sheep.cloud/` | 作品集首页 | 200，通过 |
| `https://heard-sheep.cloud/try` | 体验汇总页 | 200，通过 |
| `https://heard-sheep.cloud/try/proddoc-ai` | ProdDoc AI Demo | 200，通过，交互生成结果正常 |
| `https://heard-sheep.cloud/try/decision-copilot` | Decision Copilot Demo | 200，通过，交互结果正常 |
| `https://heard-sheep.cloud/projects/heard-sheep` | heard-sheep 案例页 | 200，通过 |
| `https://heard-sheep.cloud/projects/proddoc-ai` | ProdDoc AI 案例页 | 200，通过 |
| `https://heard-sheep.cloud/projects/decision-copilot` | Decision Copilot 案例页 | 200，通过 |
| `https://heard-sheep.cloud/sheep` | heard-sheep 真实产品 | 200，通过 |
| `https://www.heard-sheep.cloud/` | 跳转主域名 | 301 到 `https://heard-sheep.cloud/` |
| `http://heard-sheep.cloud/` | 跳转 HTTPS | 301 到 `https://heard-sheep.cloud/` |
| `http://heard-sheep.cloud/sheep` | 跳转 HTTPS 且保留路径 | 301 到 `https://heard-sheep.cloud/sheep` |

体验入口验证：

| 来源页面 | 按钮文本 | href | 最终 URL | 结果 |
| --- | --- | --- | --- | --- |
| `/` | `立即体验` | `/sheep` | `https://heard-sheep.cloud/sheep` | 200 |
| `/try` | `进入听到了咩` | `/sheep` | `https://heard-sheep.cloud/sheep` | 200 |
| `/projects/heard-sheep` | `立即体验` | `/sheep` | `https://heard-sheep.cloud/sheep` | 200 |

线上浏览器验收：

- 关键资源请求失败数：0
- 控制台 error 数：0
- 首页、项目页、体验页、两个 Demo、heard-sheep 产品页均可访问
- 未发现占位邮箱、示例域名或错误文案
- 未发现粉色悬浮控件、黑色 Next.js 开发标记、浏览器插件污染或隐私信息

---

## 10. 线上验收截图

保存目录：

```text
public/screenshots/production/
```

截图清单：

- `public/screenshots/production/home-desktop.png`
- `public/screenshots/production/home-mobile.png`
- `public/screenshots/production/try-desktop.png`
- `public/screenshots/production/heard-sheep-detail-desktop.png`
- `public/screenshots/production/heard-sheep-live-mobile.png`

复核结论：

- 截图来自正式 HTTPS 域名
- 截图不包含私人信息、密钥、调试工具或浏览器扩展
- heard-sheep 产品截图保留真实产品界面

---

## 11. 回滚方式

如根路径作品集异常但 `/sheep` 正常：

```bash
sudo systemctl status my-portfolio
sudo systemctl restart my-portfolio
```

如 Nginx 切流导致 `/sheep` 异常，优先恢复 Nginx 备份：

```bash
sudo cp /etc/nginx/sites-available/heard-sheep-domain.bak.20260528-225544 /etc/nginx/sites-available/heard-sheep-domain
sudo nginx -t
sudo systemctl reload nginx
curl -Ik https://heard-sheep.cloud/sheep
```

如需停止作品集服务：

```bash
sudo systemctl stop my-portfolio
sudo systemctl disable my-portfolio
```

保护 `/sheep` 的原则：

- 不停止 Docker 容器 `heard-sheep`
- 不修改 `heard-sheep` 容器端口 `3003`
- 不剥离 `/sheep` 路径前缀
- 回滚后优先验证 `https://heard-sheep.cloud/sheep`
