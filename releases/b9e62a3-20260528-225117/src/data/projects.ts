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
  icon: string | null; // 项目图标路径（SVG/PNG）
  status: string; // 当前项目状态说明

  /* ── 首页展示配置 ── */
  displayMode: "featured" | "secondary" | "experiment"; // 首页展示模式
  homepageSummary: string; // 首页简短摘要（1-2 句）
  homepageImages: { src: string; alt: string }[]; // 首页展示图片（featured 模式 2-3 张，secondary 1 张）

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
      "以录音为主入口的 AI 任务助手，将口头交代、图片和文本中的零散信息，转化为可确认、可编辑、可追踪的任务计划。",
    longDescription: [
      "听到了咩面向职场个人，帮助用户把领导、同事、会议中的口头交代，以及图片或文本中的零散信息，转化为可执行、可确认、可追踪的任务计划。",
      "核心流程：录音 / 上传音频 / 粘贴转写稿 / 上传图片 → 转写确认 → AI 分析 → 整理文本 / 候选任务 / 执行方案 → 选择、编辑并确认加入任务清单 → 任务详情 → 历史回看。",
      "项目采用移动端优先设计，375px 手机容器，小羊品牌视觉，奶油紫 + 黑白轻工具风，支持 PWA 安装到桌面。当前为可运行 Web MVP，采用本地 JSON 存储，单用户模式。",
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
      { title: "录音与多模态输入", description: "支持开始录音、暂停/继续、录音重点标记；上传音频；上传图片并提取文字；粘贴转写稿。覆盖会议、即时通讯、白板拍照等多种职场场景。" },
      { title: "转写确认", description: "录音或上传后进入转写确认环节，用户可校对和编辑转写文本，确保 AI 分析的输入质量。" },
      { title: "AI 任务分析", description: "基于 DeepSeek 进行语义分析，从非结构化对话中输出整理文本、候选任务、执行方案和缺失信息，生成结构化结果。" },
      { title: "候选任务选择与编辑", description: "AI 生成的内容先停在候选区，用户可逐条选择、编辑任务标题和描述，确认后才加入正式任务清单。" },
      { title: "任务管理闭环", description: "从录音到任务生成、编辑、确认、完成的完整闭环。支持优先级筛选、状态管理、历史回看。" },
      { title: "图片文字提取", description: "支持多图上传，通过图片理解模型自动提取图片中的文字，预填到确认页，再交给 AI 生成任务。" },
      { title: "移动端优先与 PWA", description: "375px 手机容器优先设计，奶油紫 + 黑白轻工具风，小羊品牌视觉，支持 PWA 安装到桌面。" },
      { title: "Mock 降级", description: "未配置 API 密钥或调用失败时自动回退到 Mock 模式，保证演示流程不断裂，适合离线展示。" },
    ],
    techStack: [
      { category: "前端框架", items: ["Next.js App Router", "React", "TypeScript"] },
      { category: "UI 组件", items: ["Tailwind CSS", "PWA", "lucide-react"] },
      { category: "AI 能力", items: ["DeepSeek", "MiMo 图片理解", "Web Speech API"] },
      { category: "数据校验", items: ["Zod"] },
      { category: "存储", items: ["本地 JSON 文件（单用户 MVP）"] },
      { category: "部署", items: ["Docker", "Nginx", "basePath=/sheep"] },
    ],
    pages: [
      { path: "/", description: "首页（录音入口）" },
      { path: "/result/[id]", description: "AI 分析结果页（整理文本 / 候选任务 / 执行方案）" },
      { path: "/tasks", description: "任务清单" },
      { path: "/task/[id]", description: "任务详情" },
      { path: "/history", description: "历史记录" },
      { path: "/me", description: "个人中心" },
    ],
    icon: null,
    status: "可运行 Web MVP，移动端优先设计，已支持 /sheep 路径部署，当前为单用户本地 MVP。",
    displayMode: "featured",
    homepageSummary: "以录音为主入口的 AI 任务助手，将口头交代、图片和文本中的零散信息，转化为可确认、可编辑、可追踪的任务计划。",
    homepageImages: [
      { src: "/projects/heard-sheep/home-mobile.png", alt: "首页录音入口" },
      { src: "/projects/heard-sheep/analysis-result-mobile.png", alt: "AI 分析结果" },
      { src: "/projects/heard-sheep/tasks-with-data-mobile.png", alt: "任务列表" },
    ],
    tryPath: null, // 听到了咩使用真实产品入口，由 site-config heardSheepLiveUrl 控制
    tryLabel: "立即体验",
    experienceTag: "真实产品体验",
    experienceDescription: "通过录音、图片或文本输入，体验从信息接收、AI 分析到任务管理的流程。",
  },

  /* ─────────────── 02 / ProdDoc AI ─────────────── */
  {
    number: "02",
    title: "ProdDoc AI",
    subtitle: "产品说明书生成工作台",
    englishSubtitle: "PRODUCT DOCUMENTATION GENERATOR",
    description:
      "通用型软件产品说明书与操作文档生成工作台。支持提示词生成、API 自动生成、模板提取与复用、Word 导出，从真实需求到可运行产品原型的完整实践。",
    longDescription: [
      "ProdDoc AI 面向产品经理、产品运营、售前顾问、实施交付人员和培训人员，帮助他们基于通用软件产品的模块信息、关键词、参考写法和模板结构，快速形成可编辑、可保存、可导出的产品文档初稿。",
      "项目不依赖登录和数据库，文档草稿、历史记录和默认生成偏好使用浏览器 localStorage 保存，适合作为前端作品集、交互原型和轻量演示工具。",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "docx", "Playwright", "AI API", "localStorage"],
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
      { title: "双模式文档生成", description: "支持「提示词辅助 + API 自动生成」双模式。未配置模型服务时可继续生成提示词和 Mock 文档；配置后可通过服务端 API 自动生成正文。" },
      { title: "模板提取与复用", description: "内置多套文档模板，启用后自动影响工作台的默认文档类型、输出风格和提示词方向，实现模板驱动的文档生成。" },
      { title: "服务端 API 安全", description: "API Key 仅在服务端 API Route 中读取，前端只请求本项目的服务端接口，不会接触或展示真实密钥。" },
      { title: "Word 导出", description: "支持将生成的文档导出为 Word 格式，基于 docx 库实现，可直接用于产品交付和内部分享。" },
      { title: "历史记录管理", description: "使用 localStorage 保存文档草稿和生成记录，支持查看、搜索、筛选、复制和删除，无需登录和数据库。" },
      { title: "截图辅助与预览", description: "支持多图上传、缩略图预览，文档实时预览与编辑，所见即所得的文档生成体验。" },
    ],
    techStack: [
      { category: "前端框架", items: ["Next.js App Router", "React", "TypeScript"] },
      { category: "UI 组件", items: ["Tailwind CSS", "shadcn/ui"] },
      { category: "AI 能力", items: ["OpenAI-compatible API", "服务端 API Route"] },
      { category: "文档处理", items: ["docx 库", "Word 导出"] },
      { category: "测试", items: ["Playwright", "端到端测试"] },
    ],
    pages: [
      { path: "/", description: "Dashboard 首页" },
      { path: "/workspace", description: "文档生成工作台" },
      { path: "/templates", description: "模板管理" },
      { path: "/history", description: "历史记录" },
      { path: "/settings", description: "环境配置" },
    ],
    icon: "/icons/proddoc-ai.svg",
    status: "可运行 Web 应用，无需登录和数据库，适合前端作品集和轻量演示。",
    displayMode: "secondary",
    homepageSummary: "通用型产品说明书与操作文档生成工作台，支持提示词辅助、API 自动生成、模板复用与 Word 导出。",
    homepageImages: [
      { src: "/screenshots/proddoc-ai/dashboard.png", alt: "ProdDoc AI Dashboard" },
    ],
    tryPath: "/try/proddoc-ai",
    tryLabel: "体验 Demo",
    experienceTag: "交互演示",
    experienceDescription: "体验从产品信息输入到结构化说明文档预览的核心流程。",
  },

  /* ─────────────── 03 / AI Decision Copilot ─────────────── */
  {
    number: "03",
    title: "AI Decision Copilot",
    subtitle: "AI 决策分析原型",
    englishSubtitle: "DECISION ANALYSIS PROTOTYPE",
    description:
      "早期 AI 决策分析交互原型。探索大模型在结构化决策场景中的应用，验证人机协作决策的交互模式。",
    longDescription: [
      "AI Decision Copilot 是一个早期的 AI 决策分析交互原型，用于探索大模型在结构化决策场景中的应用方式。",
      "用户输入决策问题和两个选项，系统通过大模型进行结构化对比分析，输出最终建议、详细对比、适合人群和决策依据。",
    ],
    tags: ["HTML", "JavaScript", "大模型 API", "原型实验"],
    href: "/projects/decision-copilot",
    github: "",
    demoUrl: null,
    screenshot: null,
    screenshotAlt: "AI Decision Copilot",
    features: [
      { title: "结构化输入", description: "用户输入决策问题和两个选项，系统进行结构化对比分析。" },
      { title: "多维度分析", description: "输出最终建议、详细对比、适合人群和决策依据。" },
      { title: "交互验证", description: "验证人机协作决策的交互模式和用户接受度。" },
    ],
    techStack: [
      { category: "前端", items: ["HTML", "JavaScript"] },
      { category: "AI 能力", items: ["大模型 API"] },
    ],
    pages: [],
    icon: "/icons/decision-copilot.svg",
    status: "早期实验项目，前端曾包含明文 API 调用，已移除。",
    displayMode: "experiment",
    homepageSummary: "早期 AI 决策分析交互原型，用于探索结构化输入与模型输出呈现方式。",
    homepageImages: [],
    tryPath: "/try/decision-copilot",
    tryLabel: "体验实验",
    experienceTag: "实验演示",
    experienceDescription: "查看结构化决策输入与分析结果展示方式的早期实验。",
  },
];

export const getProjectByNumber = (number: string) => projects.find((p) => p.number === number);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.href.includes(slug));
