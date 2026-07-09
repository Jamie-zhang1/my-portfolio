import type { AppLocale } from "@/i18n/routing";
import { projects, type Project } from "@/data/projects";

export type LocalizedCaseStudy = {
  slug: "heard-sheep" | "researchflow-agent" | "proddoc-ai" | "ai-decision-copilot";
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
      projectNumber: "04",
      slug: "researchflow-agent",
      accent: "cyan",
      title: "ResearchFlow Agent",
      subtitle: "研究工作流原型",
      eyebrow: "AI RESEARCH WORKFLOW",
      experienceTag: "个人 AI Agent 实践",
      homepagePositioning: "面向论文、课题报告、行业研究和竞品分析的资料整理与证据追踪 Agent。",
      homepageProblem: "研究资料经常分散在 PDF、Word、网页文本、Markdown 和临时笔记中。",
      homepageOutcome: "需求拆解、信息架构、页面结构规划、Agent 产品流程和线上部署实践。",
      homepageStack: ["AI Agent", "Research Workflow", "Evidence Management", "Next.js", "Vibe Coding", "Product Design"],
      overview: "ResearchFlow Agent 是我围绕论文、课题报告和行业研究场景做的一次 AI Agent 产品实践。它尝试把分散资料、证据卡片、研究大纲和导出素材拆开管理，让研究过程从资料堆积变成一条更清晰、可追踪的工作流。",
      outcome: "把资料整理、证据追踪和研究大纲放进同一个可访问的工作流原型。",
      problem: "研究材料通常散落在 PDF、Word、网页文本、Markdown 和临时笔记中。资料、证据、结构和导出素材混在一起时，后续复查和继续写作都会变得困难。",
      solution: "我把页面拆成项目管理、资料库、证据库、研究大纲、导出中心和使用指引，让资料来源、证据卡片、结构草稿和输出素材分别管理。",
      role: ["需求拆解", "信息架构设计", "页面结构规划", "UI 分层优化", "Agent 产品流程设计", "与 Codex/OpenClaw 等 AI 编程工具协作", "前端原型迭代与线上部署"],
      userFlow: ["创建项目", "上传资料", "解析资料", "生成证据", "形成大纲", "导出素材"],
      keyInteractions: [
        { title: "资料和证据分开", description: "资料先进入资料库，关键内容再整理成证据卡片，方便后续回看来源。" },
        { title: "大纲不是终稿", description: "研究大纲承担结构整理作用，不把自动生成内容包装成成熟论文。" },
        { title: "导出素材", description: "输出的是可继续使用的素材和结构，而不是宣称完成全部研究工作。" }
      ],
      aiCapability: "这个项目更像研究工作流原型：AI 和 Agent 流程帮助整理资料、生成候选证据和梳理大纲，最终判断、引用和写作仍需要人工核验。",
      techStack: [
        { category: "产品流程", items: ["AI Agent", "Research Workflow", "Evidence Management", "Prompt Engineering"] },
        { category: "页面", items: ["Next.js", "React", "TypeScript", "Responsive UI"] },
        { category: "协作方式", items: ["Codex", "OpenClaw", "Vibe Coding", "Frontend iteration"] },
        { category: "部署", items: ["Live prototype", "Nginx", "Project review", "Smoke checks"] }
      ],
      whatIBuilt: ["项目管理", "资料库", "证据库", "研究大纲", "导出中心", "使用指引", "线上访问入口"],
      reflection: "ResearchFlow 让我把 AI Agent 项目从单个页面效果推进到工作流组织：关键不是把它说成成熟系统，而是把资料、证据、结构和输出的边界拆清楚。",
      screenCaptions: ["工作流：创建项目", "资料库：管理来源材料", "证据库：沉淀证据卡片", "大纲：整理研究结构"]
    },
    {
      projectNumber: "01",
      slug: "heard-sheep",
      accent: "violet",
      title: "Heard Sheep / 听到了咩",
      subtitle: "语音任务整理",
      eyebrow: "VOICE NOTE",
      experienceTag: "可访问页面",
      homepagePositioning: "一个把语音想法整理成任务卡片的小工具。",
      homepageProblem: "口头交代和会议记录里经常藏着待办事项。",
      homepageOutcome: "语音输入、任务拆分和网页端交互呈现。",
      homepageStack: ["Next.js", "TypeScript", "Xiaomi MiMo", "PWA"],
      overview: "Heard Sheep 是我围绕语音记录做的一次网页尝试。它把一段语音或临时文字整理成候选任务，让用户先看清楚内容，再决定是否加入清单。",
      outcome: "把口头想法整理成可以继续修改的任务卡片。",
      problem: "很多待办不是一开始就写在清单里，而是出现在聊天、会议和临时提醒里。直接记录原话不够清楚，直接让系统替人决定也容易出错。",
      solution: "页面先保留输入确认，再展示候选任务。用户可以修改、选择或放弃，确认后再进入任务清单。这样多了一步检查，但也让错误更容易被发现。",
      role: ["整理使用场景和页面结构", "搭建移动端页面", "接入语音、图片和文字输入", "设计候选任务的展示方式", "把页面部署到 /sheep 入口"],
      userFlow: ["录音或输入", "检查文字", "生成候选任务", "编辑任务卡片", "加入清单"],
      keyInteractions: [
        { title: "先确认输入", description: "语音转成文字后先给用户检查，避免后面步骤建立在错误内容上。" },
        { title: "候选任务", description: "整理结果先作为草稿出现，不会直接写入正式清单。" },
        { title: "手动补充", description: "语音识别或整理失败时，仍然可以回到手动输入继续使用。" }
      ],
      aiCapability: "这个项目尝试把语音、图片和文字输入整理成固定字段。AI 负责给出候选结果，最后是否采用仍由用户确认。",
      techStack: [
        { category: "页面", items: ["Next.js App Router", "React", "TypeScript", "Tailwind CSS"] },
        { category: "输入", items: ["Web Speech API", "Audio", "Image", "Text"] },
        { category: "AI", items: ["Xiaomi MiMo", "OpenAI-compatible API", "Structured JSON"] },
        { category: "部署", items: ["Docker", "Nginx", "basePath=/sheep", "local JSON"] }
      ],
      whatIBuilt: ["移动端页面", "语音和文字输入", "输入确认页", "任务卡片列表", "本地历史记录", "/sheep 同域入口"],
      reflection: "这次尝试让我意识到，语音整理的难点不只是识别准确率，还包括用户是否愿意信任整理结果。候选状态虽然多一步，但更适合处理容易出错的输入。",
      screenCaptions: ["首页：录音入口", "输入确认：检查文字或上传内容", "分析中：整理候选事项", "候选任务：选择和编辑", "任务清单：追踪确认后的事项"]
    },
    {
      projectNumber: "02",
      slug: "proddoc-ai",
      accent: "cyan",
      title: "ProdDoc AI",
      subtitle: "文档整理尝试",
      eyebrow: "DOC NOTE",
      experienceTag: "本地演示页",
      homepagePositioning: "一个尝试把项目想法整理成文档的工具。",
      homepageProblem: "项目说明经常散落在输入框、旧文档和临时笔记里。",
      homepageOutcome: "结构化提问、文档生成和页面组织。",
      homepageStack: ["Next.js", "React", "shadcn/ui", "docx"],
      overview: "ProdDoc AI 是一次围绕文档整理的网页尝试。页面把项目信息、参考资料和生成结果放在同一个空间里，方便继续修改和导出。",
      outcome: "把零散项目信息整理成可以继续编辑的文档草稿。",
      problem: "写项目说明时，真正耗时的部分不只是生成文字，还包括补齐背景、整理资料、统一结构和后续修改。",
      solution: "我把信息填写、模板选择、资料补充、生成预览、继续编辑和导出放到同一页里，减少在多个工具之间来回切换。",
      role: ["整理页面信息结构", "搭建文档生成页面", "实现本地草稿和历史记录", "尝试模板提取和导出", "补充稳定演示数据"],
      userFlow: ["填写项目信息", "选择文档用途", "添加参考资料", "生成草稿", "编辑并导出"],
      keyInteractions: [
        { title: "先问清楚", description: "用几个固定问题让项目背景、对象和模块先变清楚。" },
        { title: "生成后继续改", description: "结果不是终稿，而是可以继续编辑、保存和导出的草稿。" },
        { title: "稳定演示", description: "本地数据保证页面随时可以打开，不依赖临时密钥。" }
      ],
      aiCapability: "页面尝试用服务端接口生成和改写文档内容，同时保留本地示例，方便在没有模型调用时继续展示页面结构。",
      techStack: [
        { category: "页面", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"] },
        { category: "界面", items: ["shadcn/ui", "Radix UI", "lucide-react"] },
        { category: "文档", items: ["docx", "mammoth", "pdfjs-dist", "tesseract.js"] },
        { category: "检查", items: ["localStorage", "Playwright", "截图脚本"] }
      ],
      whatIBuilt: ["文档整理页面", "表单输入", "模板和资料解析尝试", "草稿编辑", "本地历史", "Word 导出"],
      reflection: "这次尝试让我看到，文档工具的重点不只是生成一段文字，而是让输入、修改和导出连在一起。后续还需要继续检查复杂文档结构是否能稳定保留。",
      screenCaptions: ["首页：项目和模板入口", "工作区：资料配置和结果预览", "模板：系统模板和旧文件提取", "历史：本地草稿和继续编辑"]
    },
    {
      projectNumber: "03",
      slug: "ai-decision-copilot",
      accent: "coral",
      title: "AI Decision Copilot",
      subtitle: "决策整理页面",
      eyebrow: "DECISION NOTE",
      experienceTag: "实验页面",
      homepagePositioning: "一个围绕决策辅助场景做的网页实验。",
      homepageProblem: "做选择时，选项、比较标准和风险经常没有放在一起。",
      homepageOutcome: "信息整理、选项比较和辅助判断展示。",
      homepageStack: ["JavaScript", "Express.js", "Xiaomi MiMo", "Nginx"],
      overview: "AI Decision Copilot 是一个把开放问题整理成选项、比较维度和风险提示的网页实验。它不追求给出唯一答案，而是让比较过程更容易查看。",
      outcome: "把一个开放问题整理成可比较的选项、依据和风险。",
      problem: "很多决策问题一开始并不清楚：有哪些选项、按什么标准比较、推荐结果有什么风险，都需要先整理出来。",
      solution: "页面根据用户输入展示两条路径：已有选项时做比较，没有明确选项时先生成备选方向。最后把依据、推荐和风险放在同一屏里。",
      role: ["整理决策页面结构", "搭建前后端演示", "尝试文本和图片输入", "设计比较结果展示", "制作稳定的预设案例"],
      userFlow: ["输入问题", "补充选项", "选择分析方式", "查看比较", "阅读风险提示"],
      keyInteractions: [
        { title: "选项先整理", description: "先确认有哪些可比较对象，再展示后续分析。" },
        { title: "依据和风险并列", description: "把推荐、比较维度和风险放在一起，方便用户检查。" },
        { title: "预设案例", description: "作品页使用稳定案例，避免现场访问受密钥或接口影响。" }
      ],
      aiCapability: "完整项目尝试接入 Xiaomi MiMo 处理文字和图片。当前展示页使用预设数据，区分真实调用和稳定展示。",
      techStack: [
        { category: "页面", items: ["HTML", "CSS", "JavaScript"] },
        { category: "服务", items: ["Express.js", "Node.js"] },
        { category: "AI", items: ["Xiaomi MiMo V2.5", "OpenAI-compatible API", "Image input"] },
        { category: "部署", items: ["Nginx", "systemd", "Node.js", "preset cases"] }
      ],
      whatIBuilt: ["两种决策路径", "选项比较页面", "SWOT 展示", "图片输入尝试", "三种分析方式", "稳定演示版本"],
      reflection: "这次尝试提醒我，决策辅助页面不应该把一个推荐说成最终答案。更有用的做法是让比较标准、风险和可修改空间保留下来。",
      screenCaptions: ["输入：选择问题和备选方案", "结果：比较维度、推荐和风险"]
    }
  ],
  en: [
    {
      projectNumber: "04",
      slug: "researchflow-agent",
      accent: "cyan",
      title: "ResearchFlow Agent",
      subtitle: "Research workflow prototype",
      eyebrow: "AI RESEARCH WORKFLOW",
      experienceTag: "Personal AI Agent practice",
      homepagePositioning: "A material organization and evidence-tracking Agent for papers, reports, market research, and competitor analysis.",
      homepageProblem: "Research material often lives across PDFs, Word files, web text, Markdown, and temporary notes.",
      homepageOutcome: "Requirements breakdown, information architecture, page planning, Agent workflow design, and live prototype deployment.",
      homepageStack: ["AI Agent", "Research Workflow", "Evidence Management", "Next.js", "Vibe Coding", "Product Design"],
      overview: "ResearchFlow Agent is a personal AI Agent product practice around papers, project reports, and industry research. It separates source material, evidence cards, outlines, and export material so the research process becomes clearer and easier to trace.",
      outcome: "Put material organization, evidence tracking, and research outlining into one accessible workflow prototype.",
      problem: "Research material tends to scatter across PDFs, Word files, web pages, Markdown, and quick notes. When sources, evidence, structure, and export material are mixed together, later review becomes harder.",
      solution: "I split the page into project management, source library, evidence library, research outline, export center, and usage guidance so each part has a clearer role.",
      role: ["Requirements breakdown", "Information architecture", "Page structure planning", "UI hierarchy refinement", "Agent workflow design", "Collaboration with Codex/OpenClaw and AI coding tools", "Front-end prototype iteration and live deployment"],
      userFlow: ["Create project", "Upload sources", "Parse material", "Create evidence", "Shape outline", "Export material"],
      keyInteractions: [
        { title: "Sources and evidence stay separate", description: "Material enters the source library first; key points become evidence cards that keep source context visible." },
        { title: "Outlines are not final papers", description: "The outline organizes structure without presenting generated text as finished research." },
        { title: "Export material", description: "The export center prepares reusable material instead of claiming to finish the whole research task." }
      ],
      aiCapability: "This is a research workflow prototype: AI and Agent steps help organize sources, draft candidate evidence, and shape outlines, while citation judgment and final writing still require human review.",
      techStack: [
        { category: "Product flow", items: ["AI Agent", "Research Workflow", "Evidence Management", "Prompt Engineering"] },
        { category: "Page", items: ["Next.js", "React", "TypeScript", "Responsive UI"] },
        { category: "Collaboration", items: ["Codex", "OpenClaw", "Vibe Coding", "Frontend iteration"] },
        { category: "Deploy", items: ["Live prototype", "Nginx", "Project review", "Smoke checks"] }
      ],
      whatIBuilt: ["Project management", "Source library", "Evidence library", "Research outline", "Export center", "Usage guide", "Live access"],
      reflection: "ResearchFlow moved the work from page-level polish toward workflow organization. The important part is not to oversell it as a mature system, but to keep the boundaries between sources, evidence, structure, and output clear.",
      screenCaptions: ["Workflow: create project", "Library: manage source material", "Evidence: keep traceable cards", "Outline: organize research structure"]
    },
    {
      projectNumber: "01",
      slug: "heard-sheep",
      accent: "violet",
      title: "Heard Sheep",
      subtitle: "Voice note to task card",
      eyebrow: "VOICE NOTE",
      experienceTag: "Live page",
      homepagePositioning: "A small tool that turns voice notes into task cards.",
      homepageProblem: "Tasks are often hidden in conversations, meetings, and quick reminders.",
      homepageOutcome: "Voice input, task extraction, and a simple web interaction for review.",
      homepageStack: ["Next.js", "TypeScript", "Xiaomi MiMo", "PWA"],
      overview: "Heard Sheep is a web page experiment around voice notes. It turns a short recording or text note into draft task cards, so the user can review the content before adding it to a list.",
      outcome: "Turn spoken notes into editable task cards.",
      problem: "Many tasks do not start as clean checklist items. They appear in chats, meetings, and quick reminders. Saving the raw note is not enough, but letting a system decide everything can also be risky.",
      solution: "The page confirms the input first, then shows draft tasks. The user can edit, select, or discard them before adding anything to the task list.",
      role: ["Organized the use case and page structure", "Built the mobile page", "Added voice, image, and text input", "Designed the draft-task display", "Deployed the page under /sheep"],
      userFlow: ["Record or type", "Review text", "Generate draft tasks", "Edit cards", "Add to list"],
      keyInteractions: [
        { title: "Review input first", description: "The transcript is shown before later steps depend on it." },
        { title: "Draft tasks", description: "The result appears as an editable draft, not an automatic change to the list." },
        { title: "Manual fallback", description: "Manual input keeps the page usable when recording or analysis fails." }
      ],
      aiCapability: "This project tries to turn voice, image, and text input into structured fields. AI suggests draft results, while the user keeps the final decision.",
      techStack: [
        { category: "Page", items: ["Next.js App Router", "React", "TypeScript", "Tailwind CSS"] },
        { category: "Input", items: ["Web Speech API", "Audio", "Image", "Text"] },
        { category: "AI", items: ["Xiaomi MiMo", "OpenAI-compatible API", "Structured JSON"] },
        { category: "Deploy", items: ["Docker", "Nginx", "basePath=/sheep", "local JSON"] }
      ],
      whatIBuilt: ["Mobile page", "Voice and text input", "Input review", "Task cards", "Local history", "/sheep route"],
      reflection: "The hard part is not only recognition quality. It is also whether the user can trust the organized result. Keeping results as drafts adds a step, but makes mistakes easier to catch.",
      screenCaptions: ["Home: recording entry", "Input review: check text or upload content", "Processing: organize draft items", "Draft tasks: select and edit", "Task list: track confirmed items"]
    },
    {
      projectNumber: "02",
      slug: "proddoc-ai",
      accent: "cyan",
      title: "ProdDoc AI",
      subtitle: "Documentation experiment",
      eyebrow: "DOC NOTE",
      experienceTag: "Local demo page",
      homepagePositioning: "A tool experiment for turning project ideas into structured documents.",
      homepageProblem: "Project notes often live across forms, old files, and loose drafts.",
      homepageOutcome: "Structured questions, generated drafts, and a cleaner page layout for editing.",
      homepageStack: ["Next.js", "React", "shadcn/ui", "docx"],
      overview: "ProdDoc AI is a web page experiment around documentation. It keeps project context, source material, and generated drafts in one place so the result can still be revised and exported.",
      outcome: "Turn scattered project material into an editable draft.",
      problem: "Writing a project note takes more than generating paragraphs. The slow parts are clarifying context, organizing sources, keeping structure, and revising the output.",
      solution: "I placed context input, template choice, source material, generated preview, editing, and export in one flow to reduce switching between tools.",
      role: ["Organized the page structure", "Built the documentation page", "Added local drafts and history", "Tried template extraction and export", "Prepared stable demo data"],
      userFlow: ["Add project context", "Choose document purpose", "Add sources", "Generate a draft", "Edit and export"],
      keyInteractions: [
        { title: "Ask first", description: "A few fixed questions make the context, audience, and modules clearer before generation." },
        { title: "Keep editing", description: "The result is a draft that can still be edited, saved, and exported." },
        { title: "Stable demo", description: "Local data keeps the page available without temporary credentials." }
      ],
      aiCapability: "The page tries server-side generation and rewriting while keeping local sample output available when no model call is used.",
      techStack: [
        { category: "Page", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"] },
        { category: "UI", items: ["shadcn/ui", "Radix UI", "lucide-react"] },
        { category: "Docs", items: ["docx", "mammoth", "pdfjs-dist", "tesseract.js"] },
        { category: "Checks", items: ["localStorage", "Playwright", "Screenshot scripts"] }
      ],
      whatIBuilt: ["Documentation page", "Input form", "Template and source parsing attempts", "Draft editing", "Local history", "Word export"],
      reflection: "This experiment made it clear that documentation helpers are useful only when input, revision, and export stay connected. The next thing to test is whether complex document structure can be preserved more reliably.",
      screenCaptions: ["Home: project and template entry", "Workspace: source setup and result preview", "Templates: system and extracted templates", "History: local drafts and continued editing"]
    },
    {
      projectNumber: "03",
      slug: "ai-decision-copilot",
      accent: "coral",
      title: "AI Decision Copilot",
      subtitle: "Decision support page",
      eyebrow: "DECISION NOTE",
      experienceTag: "Experiment page",
      homepagePositioning: "A web experiment around decision support and comparison.",
      homepageProblem: "Options, comparison criteria, and risks are often not shown together.",
      homepageOutcome: "Information organization, option comparison, and a clearer display for assisted decisions.",
      homepageStack: ["JavaScript", "Express.js", "Xiaomi MiMo", "Nginx"],
      overview: "AI Decision Copilot is a web experiment that organizes an open question into options, criteria, and risks. It does not aim to produce a single final answer; it makes the comparison easier to inspect.",
      outcome: "Turn an open question into comparable options, reasons, and risk notes.",
      problem: "Many decisions begin without clear options or comparison criteria. The useful first step is often to make the frame visible before choosing.",
      solution: "The page shows two paths: compare existing options, or create possible directions first. Both paths keep the reasons, recommendation, and risk notes on the same screen.",
      role: ["Organized the decision page structure", "Built the front-end and back-end demo", "Tried text and image input", "Designed the comparison display", "Prepared stable preset cases"],
      userFlow: ["Enter a question", "Add options", "Choose a mode", "View comparison", "Read risk notes"],
      keyInteractions: [
        { title: "Options first", description: "The page makes the comparable objects visible before showing analysis." },
        { title: "Reasons and risks together", description: "Recommendation, criteria, and risk stay close enough to review." },
        { title: "Preset cases", description: "The portfolio page uses stable cases so access is not blocked by credentials or API issues." }
      ],
      aiCapability: "The full project tried Xiaomi MiMo for text and image input. This page uses preset data to keep the displayed experience stable.",
      techStack: [
        { category: "Page", items: ["HTML", "CSS", "JavaScript"] },
        { category: "Service", items: ["Express.js", "Node.js"] },
        { category: "AI", items: ["Xiaomi MiMo V2.5", "OpenAI-compatible API", "Image input"] },
        { category: "Deploy", items: ["Nginx", "systemd", "Node.js", "preset cases"] }
      ],
      whatIBuilt: ["Two decision paths", "Option comparison page", "SWOT display", "Image-input attempt", "Three analysis modes", "Stable demo version"],
      reflection: "A decision-support page should not make one recommendation look like the only answer. The comparison criteria, risk, and room for revision need to stay visible.",
      screenCaptions: ["Input: question and available options", "Result: criteria, recommendation, and risk"]
    }
  ]
};

export function getLocalizedCaseStudies(locale: AppLocale): LocalizedCaseStudy[] {
  return localized[locale]
    .map((narrative) => {
      const project = projects.find((item) => item.number === narrative.projectNumber);
      if (!project) throw new Error(`Missing project data: ${narrative.projectNumber}`);
      return { ...narrative, project };
    })
    .sort((a, b) => b.project.createdAt.localeCompare(a.project.createdAt));
}

export function getLocalizedCaseStudy(locale: AppLocale, slug: string) {
  return getLocalizedCaseStudies(locale).find((item) => item.slug === slug);
}
