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

## 4. 待解决问题

- 清理并复核最终展示截图，避免粉色悬浮控件、黑色开发标记或浏览器插件污染
- 完成 README、SEO、环境变量说明与上线记录
- 完成 TypeScript、build、lint 和页面验收
- 合并功能分支到 `main`
- 审计服务器并部署作品集到根路径
- 保持 `/sheep` 真实产品不受影响
- 完成 HTTPS 与线上体验入口验收

---

## 5. 阶段提交记录

| 阶段 | Commit | 状态 |
| --- | --- | --- |
| 阶段 1：内容、入口、文档与 SEO 基础修复 | `dbf7ede` | 已推送 |
| 阶段 2：截图替换与视觉复核 | `77a5295` | 已推送 |
| 阶段 3：README/SEO/部署记录最终化 | `cadcfee`, `f9c9bcc` | 已推送 |
| 阶段 4：合并 `main` | 待提交 | 未开始 |
| 阶段 10：生产部署记录 | 待提交 | 未开始 |

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

## 6. 部署计划

服务器：

```text
ubuntu@62.234.90.78
```

部署原则：

- 不覆盖 heard-sheep 目录或进程
- 作品集使用独立部署目录，例如 `~/apps/my-portfolio`
- 作品集使用独立本地端口，例如未占用的 `3002`
- Nginx 最高优先级保留 `/sheep` 转发到原 heard-sheep 服务
- 根路径 `/` 转发到新作品集服务
- 修改 Nginx 前备份当前启用配置

---

## 7. 服务器审计结果

待执行。

需要记录：

- 主机名、系统版本、Node/npm/PM2 版本
- 当前 Nginx 配置文件路径
- 当前 `/sheep` 服务名称与端口
- 当前 80/443 监听状态
- 当前证书状态
- 上线前 `http` 与 `https` 访问结果

---

## 8. Nginx 配置备份

待执行。

需要记录：

- 备份文件路径
- 修改后的站点配置路径
- `sudo nginx -t` 结果
- `sudo systemctl reload nginx` 时间

不得在本文档中粘贴证书私钥、服务器私钥、Token 或完整敏感配置。

---

## 9. 线上验证结果

待执行。

| URL | 预期 | 结果 |
| --- | --- | --- |
| `https://heard-sheep.cloud/` | 作品集首页 | 待验证 |
| `https://heard-sheep.cloud/try` | 体验汇总页 | 待验证 |
| `https://heard-sheep.cloud/try/proddoc-ai` | ProdDoc AI Demo | 待验证 |
| `https://heard-sheep.cloud/try/decision-copilot` | Decision Copilot Demo | 待验证 |
| `https://heard-sheep.cloud/projects/heard-sheep` | heard-sheep 案例页 | 待验证 |
| `https://heard-sheep.cloud/projects/proddoc-ai` | ProdDoc AI 案例页 | 待验证 |
| `https://heard-sheep.cloud/projects/decision-copilot` | Decision Copilot 案例页 | 待验证 |
| `https://heard-sheep.cloud/sheep` | heard-sheep 真实产品 | 待验证 |

---

## 10. 回滚方式

待服务器审计后补齐具体路径。

通用回滚原则：

1. 如 `/sheep` 在 Nginx 切流后异常，立即恢复站点配置备份并 reload Nginx
2. 停止或下线新作品集服务，不触碰 heard-sheep 原服务
3. 重新验证 `https://heard-sheep.cloud/sheep`

需要补齐：

- Nginx 配置备份路径
- 作品集服务名和停止命令
- 作品集本地端口
- heard-sheep 原服务名和端口
