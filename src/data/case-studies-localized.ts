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
  homepageSummary: string;
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
      projectNumber: "01", slug: "heard-sheep", accent: "violet", title: "Heard Sheep / 听到了咩", subtitle: "多模态 AI 任务助手", eyebrow: "语音转行动系统", experienceTag: "在线产品 MVP",
      homepageSummary: "以录音、音频、图片和文本为入口，把零散交代转化为可确认、可编辑、可追踪的任务计划。",
      overview: "Heard Sheep 面向需要处理会议、语音和临时交代的职场个人。它不是把内容再转写一遍，而是把非结构化信息组织成可确认的候选任务、执行方案和持续可追踪的清单。",
      outcome: "把一句口头交代，转成可确认、可编辑、可追踪的行动。",
      problem: "会议、语音和聊天里最重要的要求往往是非结构化的。用户需要的不是另一份转写稿，而是一个不会擅自替人做决定、又能显著降低整理成本的任务入口。",
      solution: "以录音、音频、图片和文本作为统一入口。AI 先理解内容，再输出整理文本、候选任务与执行方案；所有任务都经过用户确认后才进入正式清单。",
      role: ["产品定义与范围控制", "端到端用户流程设计", "移动端交互与品牌视觉", "AI 输出结构与降级策略", "Next.js MVP 构建与部署"],
      userFlow: ["捕捉语音 / 图片 / 文本", "确认转写内容", "MiMo 结构化分析", "编辑并选择候选任务", "进入任务清单持续跟踪"],
      keyInteractions: [{title:"录音优先入口",description:"把高频动作放在单手可达区域，并保留暂停、继续和重点标记。"},{title:"候选态，而非自动写入",description:"AI 结果先进入可编辑候选区，用户保留最终控制权。"},{title:"失败仍可继续",description:"转写或模型不可用时回退到手动输入与 Mock，演示和工作流不断裂。"}],
      aiCapability: "使用 Xiaomi MiMo 处理文本任务分析、图片文字理解与音频理解；以固定输出结构、输入确认和 Mock fallback 约束不稳定性。",
      techStack: [{category:"前端框架",items:["Next.js App Router","React","TypeScript"]},{category:"交互与界面",items:["Tailwind CSS","PWA","lucide-react"]},{category:"AI 能力",items:["Xiaomi MiMo","图片理解","音频理解","Web Speech API"]},{category:"数据校验",items:["Zod"]},{category:"存储",items:["本地 JSON（单用户 MVP）"]},{category:"部署",items:["Docker","Nginx","basePath=/sheep"]}],
      whatIBuilt: ["移动端优先 PWA", "多模态输入与转写确认", "结构化任务分析", "候选任务批量确认", "任务管理与历史回看", "同域 /sheep 部署"],
      reflection: "最重要的产品决定不是让 AI 自动创建任务，而是把结果保留在“候选态”。这一步增加了一次确认，却换来了可解释性和用户控制。下一阶段会优先验证真实转写准确率、多人数据模型和跨设备同步。",
      screenCaptions: ["首页：录音主入口与小羊品牌视觉","输入确认：粘贴转写稿或上传内容","AI 分析：整理文本、关键要求与时间信息","候选任务：选择、编辑并确认加入清单","任务页：按状态与优先级持续跟踪"]
    },
    {
      projectNumber: "02", slug: "proddoc-ai", accent: "cyan", title: "ProdDoc AI", subtitle: "AI 产品文档工作台", eyebrow: "产品文档生成工作台", experienceTag: "交互式 Demo",
      homepageSummary: "把零散产品资料、旧文档与模板规则组织成可继续编辑、保存和导出的产品说明文档初稿。",
      overview: "ProdDoc AI 面向产品经理、产品运营、售前和实施交付人员，把产品信息、参考资料、截图、参考写法与模板结构汇入同一个本地优先工作台。",
      outcome: "把零散产品资料，变成能继续编辑与交付的说明文档初稿。",
      problem: "产品文档写作的瓶颈通常不在输入一句提示词，而在资料收集、结构对齐、模板复用、反复编辑与最终交付之间存在大量断点。",
      solution: "将资料解析、模板提取、生成模式、全文编辑、历史保存与 Word 导出组合成一个本地优先工作台，让 AI 生成成为文档生产流程中的一环。",
      role: ["产品工作台信息架构", "生成流程与模式设计", "本地优先数据策略", "模板与资料解析设计", "交互原型与验收脚本"],
      userFlow: ["输入产品信息", "选择或提取模板", "添加参考资料", "生成结构化初稿", "编辑、保存与导出"],
      keyInteractions: [{title:"三种生成模式",description:"提示词、在线 API 与 Mock 并存，适应真实使用、离线演示与作品展示。"},{title:"旧文件变成模板",description:"从既有文档提取标题层级、字段规则与写作语气，降低迁移成本。"},{title:"生成后仍可工作",description:"结果可继续全文编辑、局部改写、保存历史并导出 Word。"}],
      aiCapability: "通过服务端 OpenAI-compatible API 生成和改写文档，前端不接触真实密钥；同时提供 Prompt Builder 与 Mock 结果作为可控降级。",
      techStack: [{category:"前端框架",items:["Next.js 16","React 19","TypeScript"]},{category:"组件与样式",items:["Tailwind CSS","shadcn/ui","Radix UI"]},{category:"AI 能力",items:["OpenAI-compatible API","API Route","Prompt Builder"]},{category:"文档处理",items:["docx","mammoth","pdfjs-dist","tesseract.js"]},{category:"本地数据",items:["localStorage","草稿","历史记录","自定义模板"]},{category:"测试",items:["Playwright","Smoke Test","截图脚本"]}],
      whatIBuilt: ["文档生成工作台", "模板提取流程", "多格式资料解析", "全文编辑与局部改写", "本地历史与草稿", "Word 导出"],
      reflection: "生成文档只是中间环节。真正决定产品价值的是生成前能否组织输入、生成后能否继续编辑和交付。因此工作台同时保留 Prompt、API 与 Mock 三条路径，用更低的依赖成本支持不同使用场景。",
      screenCaptions: ["Dashboard：定位、模板入口与示例项目","Workspace：模块选择、内容配置与生成结果","Templates：系统模板与旧文件模板提取","History：本地文档管理与继续编辑"]
    },
    {
      projectNumber: "03", slug: "ai-decision-copilot", accent: "coral", title: "AI Decision Copilot", subtitle: "结构化 AI 决策助手", eyebrow: "结构化决策助手", experienceTag: "实验性 Demo",
      homepageSummary: "把开放问题整理成可比较的方案、判断依据、推荐结论与风险提示，而不是只给出一句答案。",
      overview: "AI Decision Copilot 面向需要快速比较方案、判断取舍和梳理风险的场景。它会根据用户是否已有选项，选择方案对比或方案推荐路径。",
      outcome: "把模糊的两难问题，整理成可比较的方案、依据与风险。",
      problem: "面对开放问题，用户常常既没有完整选项，也不知道应按什么标准比较。直接给出一个答案会掩盖不确定性，也难以支持真正的判断。",
      solution: "先识别用户是否已有备选方案；有选项时进行结构化对比，没有选项时先生成候选方案，再输出多维分析、推荐结论与风险提示。",
      role: ["决策场景与输出框架", "分析模式与分支逻辑", "提示词和结构化结果设计", "前后端原型构建", "安全演示方案"],
      userFlow: ["输入决策问题", "补充可选方案或图片", "选择分析风格", "AI 建立比较框架", "查看建议与风险"],
      keyInteractions: [{title:"自动选择分析路径",description:"根据是否存在备选项，进入方案对比或方案推荐流程。"},{title:"结论与依据并列",description:"推荐结论与多维分析、风险提示同时呈现，避免只有一句答案。"},{title:"稳定作品集 Demo",description:"预设案例不调用外部服务，保护密钥并保证求职展示稳定。"}],
      aiCapability: "项目本体接入 Xiaomi MiMo V2.5，支持文本与图片输入；作品集演示使用预设案例，明确区分真实模型能力与稳定展示层。",
      techStack: [{category:"前端",items:["HTML","CSS","JavaScript"]},{category:"后端",items:["Express.js","Node.js"]},{category:"AI 能力",items:["Xiaomi MiMo V2.5","OpenAI-compatible API","多模态输入"]},{category:"分析框架",items:["方案对比","SWOT","逻辑三段论"]},{category:"部署",items:["Nginx","systemd","Node.js"]},{category:"演示",items:["预设案例","无外部密钥"]}],
      whatIBuilt: ["双路径决策流程", "多维方案对比", "SWOT 与逻辑框架", "图片辅助输入", "三种分析风格", "无密钥稳定 Demo"],
      reflection: "决策产品不应该制造“唯一正确答案”的错觉。当前版本把结论、依据和风险并列呈现，并通过预设案例保证展示稳定。下一步需要增加评分权重透明度与用户对评价维度的编辑能力。",
      screenCaptions: []
    }
  ],
  en: [
    {
      projectNumber: "01", slug: "heard-sheep", accent: "violet", title: "Heard Sheep", subtitle: "Multimodal AI Task Assistant", eyebrow: "VOICE TO ACTION SYSTEM", experienceTag: "Live Product MVP",
      homepageSummary: "A voice-first assistant that turns audio, images and text into editable, user-confirmed tasks and action plans.",
      overview: "Heard Sheep is designed for people handling meeting notes, voice messages and last-minute requests at work. It does more than transcribe: it shapes unstructured information into candidate tasks, action plans and a trackable task system.",
      outcome: "Turn a spoken request into an action people can review, edit and track.",
      problem: "The most important requirements in meetings, voice messages and chat are often unstructured. People do not need another transcript; they need a task entry point that reduces organization work without quietly making decisions for them.",
      solution: "Voice, audio, images and text enter one capture flow. AI first interprets the content, then produces a clean summary, candidate tasks and an execution plan. Nothing enters the real task list until the user confirms it.",
      role: ["Product definition and scope", "End-to-end user flow", "Mobile interaction and brand system", "AI output structure and fallback", "Next.js MVP and deployment"],
      userFlow: ["Capture voice, image or text", "Confirm the transcript", "Run structured MiMo analysis", "Edit and select candidate tasks", "Track confirmed work"],
      keyInteractions: [{title:"Recording-first entry",description:"The primary action stays within one-hand reach, with pause, resume and highlight controls."},{title:"Candidate state by default",description:"AI output remains editable and provisional until the user confirms it."},{title:"A flow that survives failure",description:"Manual input and Mock fallback keep the workflow usable when transcription or model calls fail."}],
      aiCapability: "Xiaomi MiMo supports text task analysis, image understanding and audio understanding. Fixed output contracts, transcript confirmation and Mock fallback constrain model uncertainty.",
      techStack: [{category:"Frontend",items:["Next.js App Router","React","TypeScript"]},{category:"Interaction",items:["Tailwind CSS","PWA","lucide-react"]},{category:"AI",items:["Xiaomi MiMo","Image understanding","Audio understanding","Web Speech API"]},{category:"Validation",items:["Zod"]},{category:"Storage",items:["Local JSON for a single-user MVP"]},{category:"Deployment",items:["Docker","Nginx","basePath=/sheep"]}],
      whatIBuilt: ["Mobile-first PWA", "Multimodal capture and confirmation", "Structured task analysis", "Candidate task review", "Task management and history", "Same-domain /sheep deployment"],
      reflection: "The most important choice was not to let AI create tasks automatically. Keeping output in a candidate state adds one confirmation step but preserves control and explainability. The next validation focus is real transcription quality, a multi-user data model and cross-device sync.",
      screenCaptions: ["Home: recording-first entry and mascot system","Input confirmation: review a transcript or uploaded content","AI analysis: clean text, requirements and time signals","Candidate tasks: select, edit and confirm","Task list: track work by status and priority"]
    },
    {
      projectNumber: "02", slug: "proddoc-ai", accent: "cyan", title: "ProdDoc AI", subtitle: "AI Product Documentation Workspace", eyebrow: "DOCUMENT GENERATION WORKSPACE", experienceTag: "Interactive Demo",
      homepageSummary: "A workspace that turns scattered product inputs, legacy files and template rules into editable, export-ready documentation drafts.",
      overview: "ProdDoc AI serves product managers, operations teams, pre-sales and implementation roles by bringing product inputs, references, screenshots, writing examples and template structure into one local-first workspace.",
      outcome: "Turn scattered product material into a draft people can keep editing and deliver.",
      problem: "The bottleneck in product documentation is rarely one prompt. It is the friction between collecting evidence, aligning structure, reusing templates, editing the draft and delivering a usable file.",
      solution: "Reference parsing, template extraction, generation modes, full-text editing, local history and Word export live in one local-first workspace. AI generation becomes one step in a larger documentation workflow.",
      role: ["Workspace information architecture", "Generation modes and flow", "Local-first data strategy", "Template and reference parsing", "Interactive prototype and QA scripts"],
      userFlow: ["Enter product context", "Choose or extract a template", "Add reference material", "Generate a structured draft", "Edit, save and export"],
      keyInteractions: [{title:"Three generation modes",description:"Prompt, live API and Mock modes support real work, offline use and stable portfolio demos."},{title:"Legacy files become templates",description:"Existing documents can provide heading levels, field rules and tone instead of becoming dead references."},{title:"Work continues after generation",description:"The result remains editable, supports local rewrites, keeps history and exports to Word."}],
      aiCapability: "A server-side OpenAI-compatible API handles generation and rewriting without exposing keys to the client. Prompt Builder and Mock output provide controlled alternatives.",
      techStack: [{category:"Frontend",items:["Next.js 16","React 19","TypeScript"]},{category:"UI",items:["Tailwind CSS","shadcn/ui","Radix UI"]},{category:"AI",items:["OpenAI-compatible API","API Route","Prompt Builder"]},{category:"Document processing",items:["docx","mammoth","pdfjs-dist","tesseract.js"]},{category:"Local data",items:["localStorage","Drafts","History","Custom templates"]},{category:"Testing",items:["Playwright","Smoke tests","Screenshot scripts"]}],
      whatIBuilt: ["Documentation workspace", "Template extraction flow", "Multi-format reference parsing", "Full-text editing and rewriting", "Local drafts and history", "Word export"],
      reflection: "Generation is only the middle of the workflow. The product earns its value by organizing inputs before generation and supporting editing and delivery afterward. Keeping Prompt, API and Mock paths reduces dependency risk across real use and demonstration contexts.",
      screenCaptions: ["Dashboard: positioning, templates and sample projects","Workspace: module selection, content setup and generated output","Templates: system templates and legacy-file extraction","History: local document management and continued editing"]
    },
    {
      projectNumber: "03", slug: "ai-decision-copilot", accent: "coral", title: "AI Decision Copilot", subtitle: "Structured AI Decision Assistant", eyebrow: "STRUCTURED DECISION ASSISTANT", experienceTag: "Experimental Demo",
      homepageSummary: "A decision assistant that turns an open question into comparable options, reasoning, a recommendation and explicit risks—not a one-line answer.",
      overview: "AI Decision Copilot supports situations where someone needs to compare options, make a trade-off or map risk quickly. It selects a comparison path when options already exist and a recommendation path when they do not.",
      outcome: "Turn an ambiguous trade-off into comparable options, reasoning and risk.",
      problem: "With an open decision, people may lack both complete options and a useful comparison frame. A direct answer hides uncertainty and does little to support an accountable choice.",
      solution: "The product first checks whether options already exist. It compares them when they do, or proposes viable alternatives when they do not, then delivers multidimensional reasoning, a recommendation and risk notes.",
      role: ["Decision scenario and output framework", "Analysis branches and logic", "Prompt and structured result design", "Frontend and backend prototype", "Safe demonstration strategy"],
      userFlow: ["Enter a decision question", "Add options or an image", "Choose an analysis tone", "Build a comparison frame", "Review recommendation and risk"],
      keyInteractions: [{title:"Automatic analysis path",description:"The flow moves into option comparison or option generation based on what the user provides."},{title:"Recommendation beside evidence",description:"Multidimensional reasoning and risk stay visible next to the recommendation."},{title:"A stable portfolio demo",description:"Preset cases protect API keys and keep the demonstration reliable."}],
      aiCapability: "The full project uses Xiaomi MiMo V2.5 for text and image input. The portfolio demo uses preset cases and clearly separates model capability from the stable presentation layer.",
      techStack: [{category:"Frontend",items:["HTML","CSS","JavaScript"]},{category:"Backend",items:["Express.js","Node.js"]},{category:"AI",items:["Xiaomi MiMo V2.5","OpenAI-compatible API","Multimodal input"]},{category:"Analysis",items:["Option comparison","SWOT","Logical syllogism"]},{category:"Deployment",items:["Nginx","systemd","Node.js"]},{category:"Demo",items:["Preset cases","No client-side key"]}],
      whatIBuilt: ["Dual-path decision flow", "Multidimensional comparison", "SWOT and logic framework", "Image-assisted input", "Three analysis tones", "No-key stable demo"],
      reflection: "A decision product should not pretend there is one objectively correct answer. This version keeps conclusions, reasoning and risk together. The next improvement is to make scoring weights transparent and let users edit the comparison dimensions.",
      screenCaptions: []
    }
  ]
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
