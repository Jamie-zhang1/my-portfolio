# 内容维护指南

本文档只说明当前仓库的内容来源与更新流程。页面实现、字段结构或验收脚本变化后，应同步更新本指南，避免再次出现“文档描述的是旧版本”的情况。

## 1. 内容来源

| 内容 | 文件 | 说明 |
| --- | --- | --- |
| 站点名称、域名、邮箱、GitHub、简历、Heard Sheep 地址 | `src/data/site-config.ts` | 全站公共配置 |
| 个人定位、简介、技能 | `src/data/profile.ts` | 首页个人信息 |
| 导航与页脚 | `src/data/navigation.ts` | 外部链接需标明 `external` |
| 项目基础信息、截图、功能、技术栈 | `src/data/projects.ts` | 两种语言共享的事实数据 |
| 双语案例叙事 | `src/data/case-studies-localized.ts` | 中文与英文必须同时维护 |
| 首页和界面短文案 | `messages/zh.json`、`messages/en.json` | key 必须保持一致 |
| sitemap | `src/app/sitemap.ts` | 新增或删除公开案例时同步修改 |
| 公开图片、截图、简历 | `public/` | 使用稳定、可读的文件名 |

`src/data/projects.ts` 的数组位置不是首页最终顺序。`getLocalizedCaseStudies()` 会根据项目 `createdAt` 倒序排列；调整展示顺序时应修改日期或明确调整排序逻辑，不能只移动数组对象。

## 2. 修改个人信息

1. 在 `src/data/profile.ts` 修改角色、简介、技能或技术栈。
2. 在 `src/data/site-config.ts` 核对 SEO title、description、keywords、邮箱和简历路径。
3. 如果导航标签或锚点变化，同步修改 `src/data/navigation.ts`、中英文 messages 和验收脚本。
4. 中文定位发生实质变化时，检查英文首页是否仍表达同一边界。

不要把个人作品记录改写成公司官网，也不要把实验原型描述成已经成熟商用的系统。

## 3. 修改现有项目

项目事实和案例叙事分为两层：

- `src/data/projects.ts`：名称、链接、截图、功能、技术栈、状态等共享事实。
- `src/data/case-studies-localized.ts`：中文和英文的定位、问题、方案、角色、流程、能力边界与复盘。

修改时按以下顺序：

1. 先核对对应项目仓库或线上页面，确认能力仍然存在。
2. 更新 `projects.ts` 的共享事实。
3. 同时更新 `case-studies-localized.ts` 中的 `zh` 与 `en` 条目。
4. 检查图片路径确实存在，alt 与 caption 能描述画面。
5. 运行静态检查、构建与浏览器验收。

避免仅更新首页摘要而让详情页、英文页或截图说明继续保留旧说法。

## 4. 新增项目

新增案例至少需要完成：

1. 在 `src/data/projects.ts` 添加唯一的 `number`、`createdAt` 和基础数据。
2. 在 `src/data/case-studies-localized.ts` 的 `zh` 与 `en` 数组添加同一 `projectNumber` 的叙事。
3. 将公开素材放入 `public/projects/<slug>/` 或 `public/screenshots/<slug>/`。
4. 在 `src/app/sitemap.ts` 添加双语公开路径。
5. 检查动态案例页能够通过 slug 找到内容。
6. 将新路由加入 `scripts/verify-redesign.mjs`。
7. 更新 README 的项目表与路由表。

如果项目有独立体验页，还需增加或更新 `/[locale]/try` 下的入口，并明确是真实服务、稳定演示还是静态预设数据。

## 5. 删除项目或功能

删除不是只移除一个首页卡片。至少检查：

- `src/app/` 路由
- `src/components/` 专用组件
- `src/data/` 项目与案例数据
- `messages/` 双语文案
- `public/` 专用公开素材
- `src/app/sitemap.ts`
- `next.config.ts` 兼容跳转
- `scripts/verify-redesign.mjs` 的路由和文案断言
- README 与本指南

已经移除的 Notes 子系统不应重新出现在导航、sitemap 或项目描述中。若需要恢复，应作为新的产品决策单独评审，而不是从历史发布快照复制旧代码。

## 6. 替换截图与简历

截图要求：

- 不包含 Next.js 调试标记、错误浮层、浏览器扩展或操作系统通知。
- 不包含 API key、邮箱会话、真实访问日志、完整 IP 或其他私人数据。
- 桌面与移动端都检查裁切、重叠、空白图片、文字可读性和深色模式。
- 使用稳定文件名；若文件名包含日期，应同步更新所有引用。

替换简历时覆盖 `public/resume-jamie-zhang.pdf`，并检查首页下载入口和线上 URL 都能打开。

## 7. 修改公开链接

- GitHub、邮箱、站点域名和简历：`src/data/site-config.ts`
- 导航：`src/data/navigation.ts`
- Heard Sheep 线上入口：生产默认 `/sheep`；临时覆盖使用 `NEXT_PUBLIC_HEARD_SHEEP_URL`

`NEXT_PUBLIC_HEARD_SHEEP_URL` 会发送到浏览器，只能填写公开 URL，不能放任何密钥或认证信息。

## 8. 提交前检查

```bash
npm run lint
npx tsc --noEmit
npm run build
```

启动站点后再运行：

```powershell
$env:PORTFOLIO_BASE_URL="http://127.0.0.1:3000"
npm run test:e2e
```

文档还需要额外检查：

- README 中的相对链接能在 GitHub 打开。
- 所有文档提到的文件在当前分支真实存在。
- 路由、项目数量、脚本名和环境变量与代码一致。
- 没有把旧 commit、过期 release 路径或一次性任务状态写成当前事实。
- `git diff --check` 无空白错误。

## 9. 文档保留规则

仓库只长期保留：

- `README.md`：项目入口、运行方式与当前架构。
- `docs/MAINTENANCE.md`：内容维护方法。
- `docs/DEPLOYMENT.md`：生产部署、验证与回滚契约。
- `ops/*/README.md`：对应运维组件的口径和安装说明。
- `AGENTS.md`：本仓库的 Next.js 开发约束。

一次性任务断点、聊天交接、旧 release 副本、截图清单和历史部署流水不应继续放在当前源码树。需要追溯时使用 Git 历史、提交信息或正式发布记录。
