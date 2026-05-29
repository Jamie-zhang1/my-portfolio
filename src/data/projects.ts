/* ============================================================
 * 项目数据配置
 * ----------------------------------------------------------
 * 修改项目顺序：调整数组中对象的先后位置即可。
 * 修改项目文案：直接编辑对应字段。
 * 修改截图路径：更新 screenshot / screenshots 字段。
 * ============================================================ */

export interface Project {
  number: string;
  title: string;
  subtitle: string;
  englishSubtitle: string;
  description: string;
  longDescription: string[];
  tags: string[];
  href: string;
  github: string;
  demoUrl: string | null; // 线上演示地址，为空则不显示
  screenshot: string | null;
  screenshotAlt: string;
  screenshots?: { src: string; alt: string; caption: string }[];
  features: { title: string; description: string }[];
  techStack: { category: string; items: string[] }[];
  pages: { path: string; description: string }[];
  status: string; // 当前项目状态说明

  /* ── 首页展示配置 ── */
  displayMode: "featured" | "secondary" | "experiment"; // 首页展示模式
  homepageSummary: string; // 首页简短摘要（1-2 句）
  homepageImages: { src: string; alt: string }[]; // 首页展示图片（featured 模式 2-3 张，secondary 1 张）
  icon: { src: string; alt: string }; // 首页项目图标

  /* ── 体验入口配置 ── */
  tryPath: string | null; // 体验 Demo 路径，如 "/try/proddoc-ai"，为空则不显示体验按钮
  tryLabel: string; // 体验按钮文案，如 "体验 Demo"、"立即体验"
  experienceTag: string; // 体验入口标记，如 "真实产品体验"、"交互演示"、"实验演示"
  experienceDescription: string; // /try 页面中的体验说明
}

export const projects: Project[] = [
  /* ─────────────── 01 / 听到了咩 ─────────────── */
  {
    number: "01",
    title: "听到了咩",
    subtitle: "AI 语音任务助手",
    englishSubtitle: "HEARD SHEEP — AI VOICE TASK ASSISTANT",
    description:
      "以录音、音频、图片和文本为入口的 AI 任务助手，将零散交代转化为可确认、可编辑、可追踪的任务计划。",
    longDescription: [
      "听到了咩面向职场个人，帮助用户把领导、同事、会议中的口头交代，以及图片、音频或文本中的零散信息，转化为可执行、可确认、可追踪的任务计划。",
      "核心流程：录音 / 上传音频 / 粘贴转写稿 / 上传图片 → 转写或文字确认 → DeepSeek V4 分析 → 整理文本 / 候选任务 / 执行方案 → 多选、编辑并确认加入任务清单 → 任务详情与编辑 → 历史回看。",
      "项目采用移动端优先设计，375px 手机容器，小羊品牌视觉，奶油紫 + 黑白轻工具风，支持 PWA 安装到手机桌面。当前为可运行 Web MVP，采用本地 JSON 存储，单用户模式。",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "DeepSeek", "PWA", "Zod", "多模态"],
    href: "/projects/heard-sheep",
    github: "https://github.com/Jamie-zhang1/heard-sheep",
    demoUrl: null, // 如有线上演示地址可填写，为空则隐藏
    screenshot: "/projects/heard-sheep/home-mobile.png",
    screenshotAlt: "听到了咩 — 首页录音入口",
    screenshots: [
      { src: "/projects/heard-sheep/home-mobile.png", alt: "首页", caption: "首页 — 录音主入口与小羊品牌视觉" },
      { src: "/projects/heard-sheep/input-mobile.png", alt: "粘贴转写稿", caption: "输入确认 — 粘贴转写稿或上传内容" },
      { src: "/projects/heard-sheep/analysis-result-mobile.png", alt: "AI 分析结果", caption: "AI 分析 — 整理文本、关键要求与时间信息" },
      { src: "/projects/heard-sheep/candidate-tasks-mobile.png", alt: "候选任务", caption: "候选任务 — 选择、编辑并确认加入任务清单" },
      { src: "/projects/heard-sheep/tasks-with-data-mobile.png", alt: "任务列表", caption: "任务页 — 已加入的任务分组展示" },
      { src: "/projects/heard-sheep/me-mobile.png", alt: "我的", caption: "个人中心 — PWA 安装、偏好设置与数据管理" },
    ],
    features: [
      { title: "录音与多模态输入", description: "支持录音、暂停/继续、录音重点标记；上传 mp3 / wav / m4a / webm 音频；上传多张图片并提取文字；也可直接粘贴转写稿。" },
      { title: "转写与确认", description: "浏览器端优先尝试 Web Speech API，服务端保留 Xiaomi MiMo 音频理解、OpenAI-compatible ASR 和 mock fallback；进入分析前可校对文本。" },
      { title: "DeepSeek V4 任务分析", description: "默认通过 DeepSeek V4 OpenAI-compatible Chat Completions 输出整理文本、候选任务、执行方案、缺失信息和风险提示。" },
      { title: "候选任务确认", description: "AI 生成内容先作为候选任务保留，用户可编辑、多选、全选、批量加入或单条加入任务清单，避免自动写入正式任务。" },
      { title: "任务管理闭环", description: "支持任务详情、任务编辑、状态更新、优先级筛选、历史搜索，以及在选择模式下批量删除任务。" },
      { title: "图片文字提取", description: "通过 Xiaomi MiMo 图片理解提取图片文字，预填确认页；识别失败时仍可手动粘贴，保证流程不中断。" },
      { title: "移动端优先与 PWA", description: "375px 手机容器优先设计，底部安全区、弹层安全区、触控目标和安装引导均围绕手机自测场景优化。" },
      { title: "Mock 降级", description: "未配置 API 密钥或模型调用失败时自动回退到 Mock 模式，保证演示、截图和本地开发流程不断裂。" },
    ],
    techStack: [
      { category: "前端框架", items: ["Next.js App Router", "React", "TypeScript"] },
      { category: "UI 组件", items: ["Tailwind CSS", "PWA", "lucide-react"] },
      { category: "AI 能力", items: ["DeepSeek V4", "Xiaomi MiMo 图片理解", "Xiaomi MiMo 音频理解", "Web Speech API"] },
      { category: "数据校验", items: ["Zod"] },
      { category: "存储", items: ["本地 JSON 文件（单用户 MVP）"] },
      { category: "部署", items: ["Docker", "Nginx", "basePath=/sheep"] },
    ],
    pages: [
      { path: "/", description: "首页（录音入口）" },
      { path: "/result/[id]", description: "AI 分析结果页（整理文本 / 候选任务 / 执行方案）" },
      { path: "/tasks", description: "任务清单（筛选、选择模式、批量删除）" },
      { path: "/task/[id]", description: "任务详情与编辑" },
      { path: "/history", description: "历史记录" },
      { path: "/me", description: "个人中心" },
    ],
    status: "可运行 Web MVP，移动端优先设计，已支持 /sheep 路径部署；当前默认 DeepSeek V4 分析，保留 MiMo 多模态能力和 Mock 降级。",
    displayMode: "featured",
    homepageSummary: "以录音、音频、图片和文本为入口的 AI 任务助手，将零散交代转化为可确认、可编辑、可追踪的任务计划。",
    homepageImages: [
      { src: "/projects/heard-sheep/home-mobile.png", alt: "首页录音入口" },
      { src: "/projects/heard-sheep/analysis-result-mobile.png", alt: "AI 分析结果" },
      { src: "/projects/heard-sheep/tasks-with-data-mobile.png", alt: "任务列表" },
    ],
    icon: { src: "/project-icons/heard-sheep.png", alt: "听到了咩小羊图标" },
    tryPath: null, // 听到了咩使用真实产品入口，由 site-config heardSheepLiveUrl 控制
    tryLabel: "立即体验",
    experienceTag: "真实产品体验",
    experienceDescription: "通过录音、图片、音频或文本输入，体验从信息接收、DeepSeek V4 分析到任务确认和任务管理的流程。",
  },

  /* ─────────────── 02 / ProdDoc AI ─────────────── */
  {
    number: "02",
    title: "ProdDoc AI",
    subtitle: "产品说明书生成工作台",
    englishSubtitle: "PRODUCT DOCUMENTATION GENERATOR",
    description:
      "通用型软件产品说明书与操作文档生成工作台。支持 AI 流式生成、模板复用、批量模块管理、活动日志、多格式导出和离线演示。",
    longDescription: [
      "ProdDoc AI 面向产品经理、产品运营、售前顾问、实施交付人员和培训人员，帮助他们基于通用软件产品的模块信息、关键词、参考写法和模板结构，快速形成可编辑、可保存、可导出的产品文档初稿。",
      "项目支持 AI 流式生成、提示词辅助和 Mock 文档三种模式；配置模型服务后，通过服务端 API Route 逐 token 输出正文，未配置时仍可生成提示词或离线初稿。",
      "最新版本加入 localStorage + IndexedDB 双存储、活动日志、深色模式、离线支持、首次引导、键盘快捷键、Rate Limiting、输入校验和单元测试，更接近可持续演进的产品工作台。",
    ],
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "shadcn/ui", "IndexedDB", "docx", "Vitest", "Playwright", "AI Streaming"],
    href: "/projects/proddoc-ai",
    github: "https://github.com/Jamie-zhang1/proddoc-ai",
    demoUrl: null,
    screenshot: "/screenshots/proddoc-ai/dashboard.png",
    screenshotAlt: "ProdDoc AI Dashboard",
    screenshots: [
      { src: "/screenshots/proddoc-ai/dashboard.png", alt: "ProdDoc AI Dashboard", caption: "Dashboard 首页 — 产品定位与核心能力展示" },
      { src: "/screenshots/proddoc-ai/workspace.png", alt: "ProdDoc AI Workspace", caption: "Workspace 工作台 — 文档生成核心交互" },
      { src: "/screenshots/proddoc-ai/templates.png", alt: "ProdDoc AI Templates", caption: "Templates 模板页 — 可复用文档模板管理" },
      { src: "/screenshots/proddoc-ai/history.png", alt: "ProdDoc AI History", caption: "History 历史记录 — 本地文档管理" },
      { src: "/screenshots/proddoc-ai/settings.png", alt: "ProdDoc AI Settings", caption: "Settings 设置页 — API 环境配置与连接测试" },
    ],
    features: [
      { title: "三种生成模式", description: "支持 AI 流式生成、提示词辅助和 Mock 文档。配置模型服务后逐 token 输出正文；未配置时仍可完成演示和初稿生成。" },
      { title: "模块与模板工作流", description: "支持手动添加、批量粘贴导入、Demo 快速填充；内置 6 种模板，并支持从旧文档提取自定义模板。" },
      { title: "服务端 API 安全", description: "API Key 仅在服务端 API Route 中读取，并加入 Rate Limiting、输入校验和错误边界，前端不会接触真实密钥。" },
      { title: "多格式导出", description: "支持正式文档、简洁报告、带页眉页脚等 Word 导出，并扩展 PDF、Markdown 与批量 ZIP 导出能力。" },
      { title: "双存储与活动日志", description: "使用 localStorage 保存轻量配置，IndexedDB 保存截图和大文档；生成、提示词和 API 调用进入活动日志，可筛选搜索。" },
      { title: "体验与质量", description: "已加入深色模式、离线指示、首次引导、键盘快捷键、骨架屏加载和单元测试，提升真实工作台可用性。" },
    ],
    techStack: [
      { category: "前端框架", items: ["Next.js 16 App Router", "React", "TypeScript"] },
      { category: "UI 组件", items: ["Tailwind CSS", "shadcn/ui", "Dark Mode", "Tour"] },
      { category: "AI 能力", items: ["OpenAI-compatible API", "Streaming API Route", "Rate Limiting"] },
      { category: "文档处理", items: ["docx 库", "PDF / Markdown / ZIP 导出"] },
      { category: "存储", items: ["localStorage", "IndexedDB", "Service Worker"] },
      { category: "测试", items: ["Vitest", "Playwright", "端到端测试"] },
    ],
    pages: [
      { path: "/", description: "Dashboard 首页" },
      { path: "/workspace", description: "文档生成工作台" },
      { path: "/templates", description: "模板管理" },
      { path: "/history", description: "活动日志与历史记录" },
      { path: "/settings", description: "环境配置、模型参数与数据管理" },
      { path: "/editor", description: "全文编辑器" },
    ],
    status: "GitHub main 已升级为流式生成、多格式导出、双存储、离线支持和单元测试版本；作品集内保留轻量交互 Demo。",
    displayMode: "secondary",
    homepageSummary: "通用型产品说明书与操作文档生成工作台，支持 AI 流式生成、模板复用、批量模块管理、活动日志与多格式导出。",
    homepageImages: [
      { src: "/screenshots/proddoc-ai/dashboard.png", alt: "ProdDoc AI Dashboard" },
    ],
    icon: { src: "/project-icons/proddoc-ai.png", alt: "ProdDoc AI 文档图标" },
    tryPath: "/try/proddoc-ai",
    tryLabel: "体验 Demo",
    experienceTag: "交互演示",
    experienceDescription: "体验从产品信息输入、模块整理到结构化说明文档预览的核心流程；完整仓库版本支持流式生成和多格式导出。",
  },

  /* ─────────────── 03 / AI Decision Copilot ─────────────── */
  {
    number: "03",
    title: "AI Decision Copilot",
    subtitle: "AI 决策分析原型",
    englishSubtitle: "STRUCTURED DECISION ANALYSIS LAB",
    description:
      "AI 决策分析交互原型。围绕问题输入、方案对比、多维度分析和风险提示，验证人机协作决策的表达方式。",
    longDescription: [
      "AI Decision Copilot 用于探索大模型在结构化决策场景中的应用方式，重点验证用户如何描述决策问题、如何比较多个方案，以及如何接收模型给出的建议。",
      "当前作品集保留安全的预设案例 Demo，不调用外部 AI 服务；项目方向已扩展到一个问题输入、AI 自动补全选项、多维度分析、SWOT/逻辑推理、风险提示与图片辅助理解。",
      "这个项目更偏实验室形态，价值在于沉淀决策分析信息架构、输出结构和人机协作边界，而不是追求完整商业化流程。",
    ],
    tags: ["Next.js", "TypeScript", "MiMo V2.5", "多模态", "结构化分析", "原型实验"],
    href: "/projects/decision-copilot",
    github: "",
    demoUrl: null,
    screenshot: null,
    screenshotAlt: "AI Decision Copilot",
    features: [
      { title: "结构化输入", description: "围绕一个决策问题组织目标、选项、背景和约束；无选项时可按 AI 自动推荐方案的方向继续扩展。" },
      { title: "多维度分析", description: "输出方案对比、SWOT、逻辑推理、推荐结论和风险提示，让建议不只停留在一句答案。" },
      { title: "多模态方向", description: "项目方向已覆盖图片上传与截图辅助理解，适合用在产品选型、方案比较和个人决策场景。" },
      { title: "安全演示", description: "作品集内 Demo 采用预设案例，不调用外部 AI 服务，便于稳定展示结构化决策输出。" },
    ],
    techStack: [
      { category: "前端", items: ["Next.js", "React", "TypeScript"] },
      { category: "AI 能力", items: ["MiMo V2.5", "多模态输入", "结构化分析"] },
      { category: "演示", items: ["预设案例", "不调用外部 AI 服务"] },
    ],
    pages: [],
    status: "结构化决策实验项目；作品集内为稳定预设案例 Demo，外部 AI 调用和密钥逻辑不放在前端。",
    displayMode: "experiment",
    homepageSummary: "AI 决策分析交互原型，用于探索问题输入、方案对比、多维度分析和风险提示的呈现方式。",
    homepageImages: [],
    icon: { src: "/project-icons/decision-copilot.png", alt: "AI Decision Copilot 决策图标" },
    tryPath: "/try/decision-copilot",
    tryLabel: "体验实验",
    experienceTag: "实验演示",
    experienceDescription: "查看结构化决策输入、方案对比、多维度分析、推荐结论和风险提示的稳定演示版。",
  },
];

export const getProjectByNumber = (number: string) => projects.find((p) => p.number === number);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.href.includes(slug));
