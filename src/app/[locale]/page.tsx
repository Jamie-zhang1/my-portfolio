import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CapabilityShowcase } from "@/components/home/capability-showcase";
import { PortfolioHero } from "@/components/home/portfolio-hero";
import { ProjectRail } from "@/components/home/project-rail";
import { ProjectArtwork } from "@/components/home/project-artwork";
import { FadeInSection } from "@/components/motion/fade-in-section";
import { getLocalizedCaseStudy } from "@/data/case-studies-localized";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type ProjectSlug = "heard-sheep" | "researchflow-agent" | "proddoc-ai" | "ai-decision-copilot";

type HomeCopy = {
  hero: { statement: string; description: string; workLabel: string };
  work: { title: string; all: string; view: string; notes: Record<ProjectSlug, string> };
  capability: { title: string; items: { eyebrow: string; title: string; note: string }[] };
  experience: { title: string; intro: string; items: { label: string; title: string; meta: string }[] };
  contact: { status: string; title: string; body: string; action: string };
};

const copy: Record<AppLocale, HomeCopy> = {
  zh: {
    hero: {
      statement: "AI 产品实验室",
      description: "设计清晰、可用，也能真正落地的 AI 产品与智能体工作流。",
      workLabel: "一起看看作品",
    },
    work: {
      title: "/ 精选作品",
      all: "查看全部 [04]",
      view: "查看项目",
      notes: {
        "heard-sheep": "把语音、图片和文字输入整理成可确认、可执行的任务。",
        "researchflow-agent": "把来源、证据、提纲和输出材料放进同一研究工作流。",
        "proddoc-ai": "将项目资料与结构化要求转化为可继续编辑的文档草稿。",
        "ai-decision-copilot": "在同一界面中澄清问题、比较选项、标准与风险。",
      },
    },
    capability: {
      title: "/ 能力与方法",
      items: [
        { eyebrow: "PRODUCT SYSTEM", title: "AI 产品与智能体工作流", note: "从问题定义、能力边界到可操作流程" },
        { eyebrow: "INFORMATION FLOW", title: "信息架构与交互设计", note: "把复杂信息整理成清晰、可扫描的界面" },
        { eyebrow: "INTERACTIVE PROOF", title: "原型设计与前端实现", note: "用真实交互验证想法，而不是只停留在效果图" },
        { eyebrow: "EVIDENCE DESIGN", title: "研究型产品表达", note: "连接来源、证据、判断与最终交付物" },
      ],
    },
    experience: {
      title: "/ 经历与背景",
      intro: "逻辑训练让我习惯先澄清问题、对象和约束，再决定页面应该长什么样。",
      items: [
        { label: "CURRENT", title: "AI 产品与 Agent 工作流", meta: "产品设计 / 原型实现" },
        { label: "MASTER'S", title: "中国政法大学 · 逻辑学", meta: "研究训练 / 论证分析" },
        { label: "PRACTICE", title: "Next.js 与 LLM 应用", meta: "可交互作品 / 持续迭代" },
      ],
    },
    contact: {
      status: "可参与新的项目",
      title: "有一个值得做的想法？",
      body: "如果你正在推进 AI 产品、智能体工作流或售前解决方案，我们可以聊聊。",
      action: "联系我",
    },
  },
  en: {
    hero: {
      statement: "AI Product Lab",
      description: "Designing clear, usable AI products and agent workflows that can actually ship.",
      workLabel: "Let’s explore the work",
    },
    work: {
      title: "/ SELECTED WORK",
      all: "VIEW ALL [04]",
      view: "View project",
      notes: {
        "heard-sheep": "Turns voice, image, and text input into tasks people can review and confirm.",
        "researchflow-agent": "Connects sources, evidence, outlines, and outputs in one research workflow.",
        "proddoc-ai": "Turns project material and structured requirements into editable document drafts.",
        "ai-decision-copilot": "Clarifies questions, options, criteria, and risks in one decision interface.",
      },
    },
    capability: {
      title: "/ CAPABILITY",
      items: [
        { eyebrow: "PRODUCT SYSTEM", title: "AI Product & Agent Workflow", note: "From problem framing and boundaries to usable flows" },
        { eyebrow: "INFORMATION FLOW", title: "Information Architecture & UX", note: "Making complex information clear and scannable" },
        { eyebrow: "INTERACTIVE PROOF", title: "Prototype & Front-end Build", note: "Testing ideas through real interaction, not static screens" },
        { eyebrow: "EVIDENCE DESIGN", title: "Research Product Communication", note: "Connecting sources, evidence, judgment, and delivery" },
      ],
    },
    experience: {
      title: "/ EXPERIENCE",
      intro: "Logic training taught me to clarify the problem, object, and constraints before deciding what the page should become.",
      items: [
        { label: "CURRENT", title: "AI Products & Agent Workflows", meta: "Product design / prototyping" },
        { label: "MASTER'S", title: "Logic · CUPL", meta: "Research / argument analysis" },
        { label: "PRACTICE", title: "Next.js & LLM Applications", meta: "Interactive work / iteration" },
      ],
    },
    contact: {
      status: "Available for new projects",
      title: "HAVE A PROJECT IN MIND?",
      body: "If you are building an AI product, agent workflow, or pre-sales solution, let’s talk.",
      action: "Get in touch",
    },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.home" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: localizedAlternates(locale),
    openGraph: { type: "website", locale: locale === "zh" ? "zh_CN" : "en_US", url: `/${locale}`, title: t("title"), description: t("description"), images: [siteConfig.ogImage] },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = copy[locale];
  const projectSlugs: ProjectSlug[] = ["heard-sheep", "researchflow-agent", "proddoc-ai", "ai-decision-copilot"];
  const capabilitySlugs: ProjectSlug[] = ["heard-sheep", "researchflow-agent", "proddoc-ai", "ai-decision-copilot"];
  const studies = projectSlugs
    .map((slug) => getLocalizedCaseStudy(locale, slug))
    .filter((study): study is NonNullable<typeof study> => Boolean(study));

  return (
    <div className="ref-portfolio">
      <PortfolioHero locale={locale} {...c.hero} />

      <FadeInSection id="work" className="ref-stage ref-section-stage">
        <div className="ref-canvas ref-work-canvas">
          <p className="ref-watermark" aria-hidden="true">PORTFOLIO</p>
          <header className="ref-section-head">
            <h2>{c.work.title}</h2>
            <a href="#contact">{c.work.all}<ArrowUpRight size={15} /></a>
          </header>
          <ProjectRail label={locale === "zh" ? "项目切换" : "Project navigation"}>
            {studies.map((study, index) => (
              <Link href={`/projects/${study.slug}`} className={`ref-project-card ${index === 0 ? "ref-project-card-featured" : ""}`} key={study.slug}>
                <div className="ref-project-preview"><ProjectArtwork slug={study.slug as ProjectSlug} /></div>
                <div className="ref-project-meta">
                  <div><span>0{index + 1}</span><h3>{study.title}</h3></div>
                  <ArrowUpRight size={20} />
                </div>
                <p>{c.work.notes[study.slug as ProjectSlug]}</p>
                <span className="ref-project-link">{c.work.view}</span>
              </Link>
            ))}
          </ProjectRail>
        </div>
      </FadeInSection>

      <FadeInSection id="about" className="ref-stage ref-section-stage">
        <div className="ref-canvas ref-capability-canvas">
          <p className="ref-watermark" aria-hidden="true">CAPABILITY</p>
          <header className="ref-section-head"><h2>{c.capability.title}</h2></header>
          <CapabilityShowcase
            items={c.capability.items.map((item, index) => ({ ...item, slug: capabilitySlugs[index] }))}
          />
        </div>
      </FadeInSection>

      <FadeInSection id="experience" className="ref-stage ref-section-stage">
        <div className="ref-canvas ref-experience-canvas">
          <p className="ref-watermark" aria-hidden="true">EXPERIENCE</p>
          <header className="ref-section-head"><h2>{c.experience.title}</h2><p>{c.experience.intro}</p></header>
          <div className="ref-experience-list">
            {c.experience.items.map((item) => (
              <article key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.meta}</p></article>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection id="contact" className="ref-stage ref-contact-stage">
        <div className="ref-canvas ref-contact-canvas">
          <p className="ref-contact-status"><i aria-hidden="true" />{c.contact.status}</p>
          <h2>{c.contact.title}</h2>
          <p>{c.contact.body}</p>
          <a href={`mailto:${siteConfig.email}`}>{c.contact.action}<ArrowUpRight size={17} /></a>
        </div>
      </FadeInSection>
    </div>
  );
}