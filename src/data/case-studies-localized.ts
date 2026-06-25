import type { AppLocale } from "@/i18n/routing";
import { projects, type Project } from "@/data/projects";

export type LocalizedCaseStudy = {
  slug: "heard-sheep" | "proddoc-ai" | "ai-decision-copilot";
  accent: "violet" | "cyan" | "coral";
  project: Project;
  title: string;
  subtitle: string;
  eyebrow: string;
  experienceTag: string;
  homepagePositioning: string;
  homepageProblem: string;
  homepageOutcome: string;
  homepageStack: string[];
  overview: string;
  outcome: string;
  problem: string;
  solution: string;
  role: string[];
  userFlow: string[];
  keyInteractions: { title: string; description: string }[];
  aiCapability: string;
  techStack: { category: string; items: string[] }[];
  whatIBuilt: string[];
  reflection: string;
  screenCaptions: string[];
};

type LocalizedNarrative = Omit<LocalizedCaseStudy, "project"> & { projectNumber: string };

const localized: Record<AppLocale, LocalizedNarrative[]> = {
  zh: [
    {
      projectNumber: "01",
      slug: "heard-sheep",
      accent: "violet",
      title: "Heard Sheep / 听到了咩",
      subtitle: "语音任务整理工具",
      eyebrow: "VOICE TO TASK",
      experienceTag: "在线产品 MVP",
      homepagePositioning: "把语音、图片和文本整理成可编辑任务。",
      homepageProblem: "重要任务经常藏在口头交代和会议记录里。",
      homepageOutcome: "已完成可运行的移动端 PWA，任务经用户确认后才进入正式清单。",
      homepageStack: ["Next.js", "TypeScript", "Xiaomi MiMo", "PWA"],
      overview: "Heard Sheep 是一个以语音输入为入口的任务整理工具。它把口头交代、会议内容、图片和临时记录转成可编辑的候选任务，帮助用户从“记下来”继续走到“安排下一步”。",
      outcome: "把一句口头交代，整理成用户可以确认、编辑和追踪的任务。",
      problem: "语音和会议记录通常只能解决“记下来”，不能直接回答“接下来做什么”。用户仍要重新找出行动项、截止时间和优先级；如果让 AI 直接写入任务清单，又容易造成误解和失控。",
      solution: "产品先让用户确认输入内容，再提取任务、时间和待补信息。结果保持在候选状态，用户可以修改、选择或放弃，确认后才进入正式任务清单。",
      role: ["产品范围与核心场景", "移动端用户流程", "AI 输出字段与确认机制", "前端原型与 PWA", "测试、部署与同域上线"],
      userFlow: ["录音或上传内容", "确认文字", "AI 提取任务", "编辑候选任务", "加入清单并追踪"],
      keyInteractions: [
        { title: "录音优先入口", description: "高频操作放在单手可达位置，并保留暂停、继续和输入确认。" },
        { title: "候选任务状态", description: "AI 结果默认可编辑，不会在用户确认前修改正式任务清单。" },
        { title: "可继续的失败路径", description: "转写或模型调用失败时回到手动输入，核心流程仍然可用。" },
      ],
      aiCapability: "Xiaomi MiMo 用于文本、图片和音频理解。固定输出字段负责约束结果结构，文字确认和候选任务状态负责把最终决定留给用户。",
      techStack: [
        { category: "Frontend", items: ["Next.js App Router", "React", "TypeScript", "Tailwind CSS"] },
        { category: "AI", items: ["Xiaomi MiMo", "音频理解", "图片理解", "Web Speech API"] },
        { category: "Product", items: ["PWA", "Zod", "候选任务确认", "手动输入回退"] },
        { category: "Deployment", items: ["Docker", "Nginx", "basePath=/sheep", "本地 JSON"] },
      ],
      whatIBuilt: ["移动端 PWA", "多模态输入", "文字确认", "结构化任务提取", "候选任务管理", "历史记录与同域部署"],
      reflection: "这个项目最重要的决定，是没有让 AI 自动创建正式任务。候选状态增加了一次确认，却让错误更容易被发现和修改。下一步需要用更多真实录音验证转写质量，并补齐多人数据和跨设备同步。",
      screenCaptions: ["首页：录音主入口", "输入确认：检查文字或上传内容", "AI 分析：提取行动项与时间", "候选任务：选择和编辑", "任务清单：追踪已确认工作"],
    },
    {
      projectNumber: "02",
      slug: "proddoc-ai",
      accent: "cyan",
      title: "ProdDoc AI",
      subtitle: "AI 产品文档工作台",
      eyebrow: "DOCUMENT WORKSPACE",
      experienceTag: "交互式 Demo",
      homepagePositioning: "把零散资料整理成可编辑、可导出的产品文档。",
      homepageProblem: "资料、旧模板、编辑和导出分散在不同工具中。",
      homepageOutcome: "完成本地优先工作台，支持模板提取、全文编辑与 Word 导出。",
      homepageStack: ["Next.js", "React", "shadcn/ui", "docx"],
      overview: "ProdDoc AI 是一个产品文档工作台，用来整理产品资料、复用旧模板，并生成可继续修改和交付的文档初稿。目标不是替用户写完一切，而是减少资料整理和重复排版。",
      outcome: "把分散的产品资料，整理成可以继续编辑和导出的文档初稿。",
      problem: "产品文档的耗时不只来自写作。资料收集、模板对齐、版本修改和最终导出分散在不同步骤，生成工具往往只覆盖中间的一次输出。",
      solution: "工作台把资料解析、模板提取、文档生成、全文编辑、历史记录和 Word 导出放在同一流程里。用户可以选择真实 API、提示词或 Mock 模式，不依赖单一路径完成工作。",
      role: ["工作台信息架构", "文档生成流程", "本地数据与历史记录", "模板和资料解析", "交互原型与自动化测试"],
      userFlow: ["填写产品信息", "选择或提取模板", "添加参考资料", "生成文档初稿", "编辑、保存与导出"],
      keyInteractions: [
        { title: "三种生成模式", description: "API、Prompt 和 Mock 分别服务于真实使用、手动协作和稳定演示。" },
        { title: "旧文档转成模板", description: "提取标题层级、字段规则和写作方式，减少重新配置。" },
        { title: "生成后继续工作", description: "文档可以全文编辑、局部改写、保存历史并导出 Word。" },
      ],
      aiCapability: "服务端通过 OpenAI-compatible API 完成生成和改写，浏览器不接触模型密钥。Prompt Builder 和 Mock 输出提供清晰的备用路径。",
      techStack: [
        { category: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"] },
        { category: "UI", items: ["shadcn/ui", "Radix UI", "lucide-react"] },
        { category: "Documents", items: ["docx", "mammoth", "pdfjs-dist", "tesseract.js"] },
        { category: "Quality", items: ["localStorage", "Playwright", "Smoke tests", "截图脚本"] },
      ],
      whatIBuilt: ["文档生成工作台", "模板提取", "多格式资料解析", "全文编辑与改写", "本地草稿和历史", "Word 导出"],
      reflection: "AI 生成只是文档生产的中间一步。真正影响使用价值的是生成前能否整理输入，生成后能否继续修改和交付。下一步会验证复杂模板下的结构保持能力和多人协作需求。",
      screenCaptions: ["Dashboard：项目与模板入口", "Workspace：资料配置和生成结果", "Templates：系统模板与旧文件提取", "History：本地文档与继续编辑"],
    },
    {
      projectNumber: "03",
      slug: "ai-decision-copilot",
      accent: "coral",
      title: "AI Decision Copilot",
      subtitle: "结构化决策助手",
      eyebrow: "DECISION WORKFLOW",
      experienceTag: "实验性 Demo",
      homepagePositioning: "把开放问题整理成可比较的方案、依据和风险。",
      homepageProblem: "用户经常既缺少明确选项，也缺少比较标准。",
      homepageOutcome: "完成方案对比与方案推荐双路径 Demo，并让依据和风险始终可见。",
      homepageStack: ["JavaScript", "Express.js", "Xiaomi MiMo", "Nginx"],
      overview: "AI Decision Copilot 是一个结构化决策工具。它帮助用户补齐选项和比较维度，并把推荐结论放在依据与风险旁边，而不是只给出一句答案。",
      outcome: "把一个开放问题，整理成可比较的方案、判断依据和风险提示。",
      problem: "开放问题经常缺少明确选项和比较标准。直接生成一个答案会隐藏判断过程，也让用户难以检查推荐是否适合自己的条件。",
      solution: "系统先判断用户是否已有备选方案。有选项时进入方案对比，没有选项时先生成可行路径；两种流程最后都展示比较依据、推荐结论和风险。",
      role: ["决策框架与输出结构", "双路径流程设计", "提示词与模型接口", "前后端原型", "无密钥作品集 Demo"],
      userFlow: ["输入决策问题", "补充选项或图片", "选择分析方式", "建立比较框架", "查看结论与风险"],
      keyInteractions: [
        { title: "自动选择分析路径", description: "根据输入内容进入方案对比或方案推荐，不把流程选择负担交给用户。" },
        { title: "依据和结论并列", description: "比较维度、推荐和风险同时可见，用户可以检查判断过程。" },
        { title: "稳定演示模式", description: "作品集版本使用预设案例，保护密钥并确保面试现场可用。" },
      ],
      aiCapability: "完整项目使用 Xiaomi MiMo V2.5 处理文本和图片输入。作品集 Demo 使用预设数据，明确区分模型能力与稳定演示层。",
      techStack: [
        { category: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
        { category: "Backend", items: ["Express.js", "Node.js"] },
        { category: "AI", items: ["Xiaomi MiMo V2.5", "OpenAI-compatible API", "图片输入"] },
        { category: "Deployment", items: ["Nginx", "systemd", "Node.js", "预设案例"] },
      ],
      whatIBuilt: ["双路径决策流程", "多维方案对比", "SWOT 分析", "图片辅助输入", "三种分析方式", "稳定演示版本"],
      reflection: "决策工具不应该制造唯一正确答案。下一步应允许用户编辑比较维度和评分权重，让推荐如何形成变得更透明。",
      screenCaptions: ["输入：选择问题和备选方案", "结果：比较维度、推荐和风险"],
    },
  ],
  en: [
    {
      projectNumber: "01",
      slug: "heard-sheep",
      accent: "violet",
      title: "Heard Sheep",
      subtitle: "Voice-first task organizer",
      eyebrow: "VOICE TO TASK",
      experienceTag: "Live Product MVP",
      homepagePositioning: "Turn voice notes, images, and text into editable tasks.",
      homepageProblem: "Important actions are often buried in conversations and meeting notes.",
      homepageOutcome: "Shipped as a mobile-first PWA with user review before tasks enter the list.",
      homepageStack: ["Next.js", "TypeScript", "Xiaomi MiMo", "PWA"],
      overview: "Heard Sheep is a voice-first task organizer for spoken requests, meeting notes, images, and quick text capture. It moves beyond transcription by preparing draft tasks that people can review and track.",
      outcome: "Turn a spoken request into tasks people can review, edit, and track.",
      problem: "Transcription records what was said but still leaves people to identify actions, deadlines, and priorities. Automatically writing AI output into a task list would create a different problem: loss of control.",
      solution: "The product confirms the input first, then extracts tasks, dates, and missing details. Every result stays editable and provisional until the user chooses to add it to the task list.",
      role: ["Product scope and use case", "Mobile product flow", "AI output contract and review states", "Frontend prototype and PWA", "Testing and deployment"],
      userFlow: ["Capture voice or content", "Review the transcript", "Extract draft tasks", "Edit and select", "Add and track"],
      keyInteractions: [
        { title: "Recording-first capture", description: "The primary action stays within easy reach, with pause, resume, and transcript review." },
        { title: "Draft tasks by default", description: "AI output remains editable and never enters the task list without confirmation." },
        { title: "A usable fallback", description: "Manual input keeps the workflow moving when transcription or a model call fails." },
      ],
      aiCapability: "Xiaomi MiMo handles text, image, and audio understanding. A fixed output contract provides structure; transcript review and draft states keep final control with the user.",
      techStack: [
        { category: "Frontend", items: ["Next.js App Router", "React", "TypeScript", "Tailwind CSS"] },
        { category: "AI", items: ["Xiaomi MiMo", "Audio understanding", "Image understanding", "Web Speech API"] },
        { category: "Product", items: ["PWA", "Zod", "Draft-task review", "Manual fallback"] },
        { category: "Deployment", items: ["Docker", "Nginx", "basePath=/sheep", "Local JSON"] },
      ],
      whatIBuilt: ["Mobile-first PWA", "Multimodal capture", "Transcript review", "Structured task extraction", "Draft-task management", "History and deployment"],
      reflection: "The key product decision was not to automate task creation. Keeping output in a draft state adds one review step, but makes errors visible and correctable. The next focus is testing transcription with more real recordings and designing multi-user sync.",
      screenCaptions: ["Home: recording-first entry", "Input review: confirm text or upload content", "AI analysis: extract actions and dates", "Draft tasks: select and edit", "Task list: track confirmed work"],
    },
    {
      projectNumber: "02",
      slug: "proddoc-ai",
      accent: "cyan",
      title: "ProdDoc AI",
      subtitle: "AI documentation workspace",
      eyebrow: "DOCUMENT WORKSPACE",
      experienceTag: "Interactive Demo",
      homepagePositioning: "Build editable product documents from scattered source material.",
      homepageProblem: "References, templates, editing, and export are split across separate tools.",
      homepageOutcome: "Built a local-first workspace with template extraction, editing, and Word export.",
      homepageStack: ["Next.js", "React", "shadcn/ui", "docx"],
      overview: "ProdDoc AI is a documentation workspace for organizing product inputs, reusing existing templates, and producing drafts that remain editable through delivery.",
      outcome: "Turn scattered product material into a draft that can still be edited and delivered.",
      problem: "Documentation work is slowed down by fragmented source material, inconsistent templates, revision loops, and export requirements. Most generation tools cover only a single step in the middle.",
      solution: "The workspace combines source parsing, template extraction, generation, full-text editing, history, and Word export. API, Prompt, and Mock modes keep the workflow useful across real and demonstration contexts.",
      role: ["Workspace information architecture", "Generation flow", "Local data and history", "Template and source parsing", "Prototype and automated QA"],
      userFlow: ["Add product context", "Choose or extract a template", "Add sources", "Generate a draft", "Edit, save, and export"],
      keyInteractions: [
        { title: "Three generation modes", description: "API, Prompt, and Mock paths support live work, assisted handoff, and stable demos." },
        { title: "Legacy files become templates", description: "Heading structure, fields, and writing patterns can be reused instead of rebuilt." },
        { title: "Work continues after generation", description: "The draft remains editable, keeps history, and exports to Word." },
      ],
      aiCapability: "A server-side OpenAI-compatible API handles generation and rewriting without exposing credentials. Prompt Builder and Mock output provide explicit fallback paths.",
      techStack: [
        { category: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"] },
        { category: "UI", items: ["shadcn/ui", "Radix UI", "lucide-react"] },
        { category: "Documents", items: ["docx", "mammoth", "pdfjs-dist", "tesseract.js"] },
        { category: "Quality", items: ["localStorage", "Playwright", "Smoke tests", "Screenshot scripts"] },
      ],
      whatIBuilt: ["Documentation workspace", "Template extraction", "Multi-format source parsing", "Editing and rewriting", "Local drafts and history", "Word export"],
      reflection: "Generation is only the middle of the job. The product becomes useful by organizing inputs before generation and keeping the result editable afterward. The next test is preserving more complex document structures and supporting collaboration.",
      screenCaptions: ["Dashboard: projects and template entry", "Workspace: sources and generated output", "Templates: system and extracted templates", "History: local documents and continued editing"],
    },
    {
      projectNumber: "03",
      slug: "ai-decision-copilot",
      accent: "coral",
      title: "AI Decision Copilot",
      subtitle: "Structured decision assistant",
      eyebrow: "DECISION WORKFLOW",
      experienceTag: "Experimental Demo",
      homepagePositioning: "Structure an open decision into options, reasoning, and risk.",
      homepageProblem: "People often lack both clear options and useful comparison criteria.",
      homepageOutcome: "Built a two-path demo for option comparison and option generation, with reasoning kept visible.",
      homepageStack: ["JavaScript", "Express.js", "Xiaomi MiMo", "Nginx"],
      overview: "AI Decision Copilot structures an open decision into options, criteria, reasoning, recommendation, and risk. It is designed to expose the decision frame rather than return a one-line answer.",
      outcome: "Turn an open question into comparable options, reasoning, and risk.",
      problem: "Open decisions often begin without complete options or a useful comparison frame. A direct answer hides uncertainty and makes the recommendation difficult to inspect.",
      solution: "The product chooses between option comparison and option generation based on the input. Both paths end with visible criteria, a recommendation, and risk notes.",
      role: ["Decision framework and output structure", "Two-path product flow", "Prompt and model integration", "Full-stack prototype", "Credential-safe portfolio demo"],
      userFlow: ["Enter a decision", "Add options or an image", "Choose an analysis mode", "Build a comparison", "Review recommendation and risk"],
      keyInteractions: [
        { title: "Automatic path selection", description: "The product chooses comparison or option generation without asking users to understand the system." },
        { title: "Reasoning stays visible", description: "Criteria, recommendation, and risk remain together so the judgment can be inspected." },
        { title: "Stable demo mode", description: "Preset cases protect credentials and keep the portfolio experience reliable." },
      ],
      aiCapability: "The full project uses Xiaomi MiMo V2.5 for text and image input. The portfolio demo uses preset data so the page stays reliable without exposing credentials.",
      techStack: [
        { category: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
        { category: "Backend", items: ["Express.js", "Node.js"] },
        { category: "AI", items: ["Xiaomi MiMo V2.5", "OpenAI-compatible API", "Image input"] },
        { category: "Deployment", items: ["Nginx", "systemd", "Node.js", "Preset cases"] },
      ],
      whatIBuilt: ["Two-path decision flow", "Multidimensional comparison", "SWOT analysis", "Image-assisted input", "Three analysis modes", "Stable demo experience"],
      reflection: "A decision tool should not imply that one answer is objectively correct. The next version should let users edit criteria and weights so the recommendation is easier to understand and challenge.",
      screenCaptions: ["Input: question and available options", "Result: criteria, recommendation, and risk"],
    },
  ],
};

export function getLocalizedCaseStudies(locale: AppLocale): LocalizedCaseStudy[] {
  return localized[locale].map((narrative) => {
    const project = projects.find((item) => item.number === narrative.projectNumber);
    if (!project) throw new Error(`Missing project data: ${narrative.projectNumber}`);
    return { ...narrative, project };
  });
}

export function getLocalizedCaseStudy(locale: AppLocale, slug: string) {
  return getLocalizedCaseStudies(locale).find((item) => item.slug === slug);
}