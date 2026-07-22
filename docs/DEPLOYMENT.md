# 生产部署手册

本文档记录可重复执行的生产契约，不保存某一次发布的完整流水。历史 commit、旧 release 目录和当时的验收输出应由 Git、服务器发布目录或外部运维记录追溯。

## 1. 架构边界

```text
Nginx 80/443
├── /sheep      → Heard Sheep, 127.0.0.1:3003
├── /analytics/ → 受认证保护的静态访问分析页
└── /           → Portfolio, 127.0.0.1:3004
```

作品集部署只能影响 Portfolio 服务。以下是不可破坏的约束：

- 不停止或重建 Heard Sheep 容器。
- 不改变 Heard Sheep 的 3003 端口和 `/sheep` 前缀。
- 不把 `/analytics/` 暴露为无认证公开页面。
- 不在发布包、命令、文档或日志中写入密钥、密码或 `.env` 内容。
- Nginx 变更前先备份配置，重载前必须通过 `nginx -t`。

## 2. 发布前检查

本地或 CI 使用与 `package-lock.json` 一致的依赖：

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run build
```

再启动构建产物并运行浏览器验收：

```powershell
npm run start
# 在另一个终端：
$env:PORTFOLIO_BASE_URL="http://127.0.0.1:3000"
npm run test:e2e
```

至少人工查看中文首页、英文首页、四个案例页和 390px 移动端深色模式。自动化通过不能替代对真实截图中的裁切、对比度和人像显示检查。

## 3. 发布目录

生产机使用不可变 release 目录和 `current` 软链接：

```text
/home/ubuntu/apps/my-portfolio/
├── current -> releases/<release-id>
└── releases/
    ├── <previous-release>
    └── <release-id>
```

`<release-id>` 建议使用短 commit SHA 加时间戳。不要把服务器生成的 release 副本提交回源码仓库。

一个 release 应来自已确认的 Git commit，并至少包含：

- 当前源码与 `package-lock.json`
- 生产构建所需的公开资源
- 与锁文件一致的依赖
- 成功生成的 `.next` 构建结果

优先在 release 内执行 `npm ci`。如果服务器策略要求复用上一版本的 `node_modules`，必须确认 Node.js 版本和 lockfile 没有变化，再重新执行 `npm run build`，不能直接复用旧 `.next`。

## 4. 切换流程

1. 获取准备发布的 commit，创建新的 release 目录。
2. 在新目录安装依赖并执行 `npm run build`。
3. 在独立端口或临时方式确认应用可启动。
4. 记录切换前 `current` 指向的完整路径，作为回滚目标。
5. 原子更新 `current` 软链接。
6. 重启 `my-portfolio.service`。
7. 检查服务状态、日志和公开路由。
8. 只有全部验证通过后，才把新 release 视为当前稳定版本。

常用只读检查：

```bash
readlink -f /home/ubuntu/apps/my-portfolio/current
systemctl is-active my-portfolio.service
systemctl status my-portfolio.service --no-pager
journalctl -u my-portfolio.service -n 100 --no-pager
```

## 5. 线上验收

必须检查：

```text
https://heard-sheep.cloud/                         → 307，Location: /zh
https://heard-sheep.cloud/zh                       → 200
https://heard-sheep.cloud/en                       → 200
https://heard-sheep.cloud/zh/projects/heard-sheep → 200
https://heard-sheep.cloud/zh/projects/researchflow-agent → 200
https://heard-sheep.cloud/zh/projects/proddoc-ai   → 200
https://heard-sheep.cloud/zh/projects/ai-decision-copilot → 200
https://heard-sheep.cloud/sheep                    → 200
https://heard-sheep.cloud/sitemap.xml              → 200
https://heard-sheep.cloud/resume-jamie-zhang.pdf   → 200
```

还需确认：

- 中英文页面的 `lang`、canonical 与 hreflang 正确。
- 首页联系、GitHub、简历、语言切换和四个项目入口可用。
- 桌面端无异常横向滚动；移动端浅色与深色均无文字或人像对比度问题。
- 页面没有 Next.js 错误浮层、控制台关键错误或 `????` 编码损坏。
- `/zh/notes` 等已移除路径保持 404。
- `/sheep` 的静态资源仍带 `/sheep` 前缀，不被作品集路由接管。

生产浏览器验收可以复用现有脚本：

```powershell
$env:PORTFOLIO_BASE_URL="https://heard-sheep.cloud"
$env:PORTFOLIO_QA_OUTPUT="output/production-qa"
npm run test:e2e
```

## 6. 回滚

出现以下任一情况应立即回滚：核心路由非 2xx/3xx、应用无法启动、页面出现错误浮层、移动端严重不可读，或 `/sheep` 被破坏。

回滚步骤：

1. 将 `current` 原子切回发布前记录的 release。
2. 重启 `my-portfolio.service`。
3. 检查服务为 `active`。
4. 重新验证 `/zh`、`/en`、一个案例页、简历和 `/sheep`。
5. 保留失败 release 与日志，完成原因定位前不要覆盖它。

回滚作品集通常不需要修改 Nginx。如果故障来自 Nginx，先恢复变更前备份，再执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

不要通过停止 Heard Sheep 来“简化排查”。

## 7. 私有访问分析

`ops/analytics/` 保存 dashboard 生成器、systemd unit、timer 和 logrotate 配置。它与作品集发布解耦，不应因普通前端发布而自动覆盖服务器配置。

部署或修改 analytics 时：

- 保持 Basic Auth、`noindex`、`no-store`、禁止嵌入和严格安全响应头。
- 原始日志、完整 IP、GeoIP 数据库和 `.htpasswd` 只留在服务器。
- 先在临时输出目录生成 HTML，再替换正式文件。
- 重启 timer 前检查 unit；修改 Nginx 后先执行 `nginx -t`。
- 统计值只能描述为基于日志规则的保守估计，不能写成精确人数。

具体路径与统计口径见 [`ops/analytics/README.md`](../ops/analytics/README.md)。

## 8. 发布完成条件

一次发布只有同时满足以下条件才算完成：

- 本地 lint、类型检查、构建通过。
- 新 release 可独立启动。
- `current` 指向预期 release，服务为 `active`。
- 作品集公开路由、简历、sitemap 与 `/sheep` 全部正常。
- 桌面和移动端视觉检查完成。
- 回滚目标仍然存在且路径已记录。
- 没有提交或输出任何秘密信息。
