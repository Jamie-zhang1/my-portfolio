import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

const workingMethod = [
  { step: "01", title: "发现问题", description: "从真实业务场景和用户痛点出发，识别值得用 AI 产品解决的问题。" },
  { step: "02", title: "设计流程", description: "梳理产品流程、交互逻辑和信息架构，形成可验证的产品假设。" },
  { step: "03", title: "AI 辅助构建", description: "使用 Vibe Coding 方式快速构建可体验的产品原型，验证核心交互。" },
  { step: "04", title: "验证迭代", description: "通过实际使用和反馈迭代产品，优化体验和功能。" },
  { step: "05", title: "部署展示", description: "完成部署、文档和展示，形成完整的产品实践案例。" },
];

const capabilities = [
  { number: "01", title: "AI 产品设计", description: "从需求洞察到产品原型，将 AI 能力转化为可体验的交互产品。" },
  { number: "02", title: "Vibe Coding", description: "快速原型构建，用最短时间验证产品假设和交互设计。" },
  { number: "03", title: "多模态能力接入", description: "集成语音、图像、文本等多种 AI 能力，构建完整的交互体验。" },
  { number: "04", title: "产品文档与交付", description: "从产品说明书到操作文档，构建可复用的文档生成工作流。" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
          <div className="flex flex-col justify-between gap-10 rounded-[8px] border border-line bg-paper-clean/82 p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="animate-fade-in">
              <p className="eyebrow mb-8">AI Product · Vibe Coding · Live Demos</p>
              <h1 className="display-title text-ink">{profile.name}</h1>
              <p className="mt-5 max-w-xl text-xl font-semibold text-ink-light">
                {profile.role}
              </p>
              <p className="text-body mt-6 max-w-2xl text-base sm:text-lg">
                {profile.bio[0]}
              </p>
            </div>

            <div className="animate-fade-in-delay-1 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/Jamie-zhang1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-primary"
                >
                  GitHub
                  <span aria-hidden="true">↗</span>
                </a>
                <Link href="/try" className="action-secondary">
                  体验项目
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="grid grid-cols-3 overflow-hidden rounded-[6px] border border-line bg-surface text-center">
                {[
                  ["03", "Projects"],
                  ["02", "Demos"],
                  ["01", "Live App"],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-line px-3 py-3 last:border-r-0">
                    <p className="font-mono text-xl font-black text-ink">{value}</p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase text-ink-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[8px] border border-[var(--signal-lime-border)] bg-[var(--signal-lime-soft)] p-5 shadow-sm sm:p-7 lg:p-8">
            <div className="mb-8 flex items-center justify-between gap-3">
              <span className="status-pill">Project Icons</span>
              <span className="font-mono text-xs font-bold uppercase text-ink-muted">
                Detail pages hold the product story
              </span>
            </div>

            <div className="mb-7">
              <p className="label-caps">Portfolio entry</p>
              <h2 className="heading-serif mt-3 max-w-md text-4xl text-ink sm:text-5xl">
                首页只做项目入口
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-ink-light">
                每个项目以独立图标呈现；截图、功能流程和真实体验入口全部进入详情页后展开。
              </p>
            </div>

            <div className="grid gap-3">
              {projects.map((project, index) => (
                <Link
                  key={project.number}
                  href={project.href}
                  className="group grid grid-cols-[86px_1fr_auto] items-center gap-4 rounded-[8px] border border-white/72 bg-white/74 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--signal-lime-border)] hover:bg-white hover:shadow-md sm:grid-cols-[104px_1fr_auto] sm:p-4"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[22px] border border-line bg-paper-clean shadow-sm">
                    <Image
                      src={project.icon.src}
                      alt={project.icon.alt}
                      fill
                      className={`object-cover ${index === 0 ? "p-0" : "p-0"}`}
                      priority={index === 0}
                      sizes="104px"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-black text-ink-muted">{project.number}</p>
                    <h3 className="mt-1 truncate text-lg font-black text-ink sm:text-xl">{project.title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs font-bold text-ink-light sm:text-sm">
                      {project.subtitle}
                    </p>
                  </div>
                  <span className="hidden rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-xs font-bold uppercase text-ink-muted transition group-hover:border-[var(--signal-lime-border)] group-hover:text-accent sm:inline-flex">
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell page-pad">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Project Icons</p>
            <h2 className="heading-serif text-4xl text-ink sm:text-5xl">项目入口</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink-muted">
            主界面只保留项目图标和入口，详细截图、功能结构、技术栈和体验按钮放到各自详情页中。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.number}
              href={project.href}
              className={`group flex min-h-[360px] flex-col justify-between rounded-[8px] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6 ${
                index === 0
                  ? "border-[var(--signal-lime-border)] bg-[var(--signal-lime-soft)]"
                  : index === 1
                    ? "border-[var(--signal-blue-border)] bg-[var(--signal-blue-soft)]"
                    : "border-[var(--signal-coral-border)] bg-[var(--signal-coral-soft)]"
              }`}
            >
              <div>
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-ink-muted">{project.number}</span>
                  <span className="route-pill bg-white/70">
                    {index === 0 ? "/sheep" : project.tryPath ?? project.href}
                  </span>
                </div>
                <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[34px] border border-white/76 bg-white shadow-sm transition group-hover:scale-[1.02] sm:max-w-[250px]">
                  <Image
                    src={project.icon.src}
                    alt={project.icon.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 70vw, 250px"
                    unoptimized
                  />
                </div>
              </div>

              <div className="mt-8">
                <p className="label-caps">{project.englishSubtitle}</p>
                <h3 className="heading-serif mt-3 text-3xl text-ink">{project.title}</h3>
                <p className="mt-3 text-sm font-bold text-ink-light">{project.subtitle}</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/70 pt-4">
                  <span className="text-xs font-bold text-ink-muted">{project.experienceTag}</span>
                  <span className="font-mono text-xs font-black uppercase text-accent transition group-hover:translate-x-1">
                    Detail →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-clean/80">
        <div className="site-shell grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow mb-3">Working Method</p>
            <h2 className="heading-serif text-4xl text-ink">工作方式</h2>
            <p className="text-body mt-5 max-w-md text-sm">
              我把作品集当成真实产品交付：从问题发现到部署记录，每一步都能回到可验证的界面和代码。
            </p>
          </div>
          <div className="grid gap-3">
            {workingMethod.map((item) => (
              <div key={item.step} className="grid gap-4 border-t border-line pt-4 sm:grid-cols-[80px_170px_1fr]">
                <span className="number-label">{item.step}</span>
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className="text-sm leading-7 text-ink-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell page-pad">
        <div className="mb-10">
          <p className="eyebrow mb-3">Capabilities</p>
          <h2 className="heading-serif text-4xl text-ink">核心能力</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, index) => (
            <div
              key={cap.title}
              className={`surface-panel p-6 ${index === 1 ? "border-accent-sage" : ""}`}
            >
              <span className="number-label">{cap.number}</span>
              <h3 className="mt-5 font-bold text-ink">{cap.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-light">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell pb-16">
        <div className="dark-panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
          <div>
            <p className="eyebrow mb-3 text-paper/55">About</p>
            <h2 className="heading-serif text-4xl text-paper-clean">关于我</h2>
          </div>
          <div>
            <div className="space-y-5">
              {profile.bio.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-8 text-paper/76">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.techStack.map((skill) => (
                <span key={skill} className="rounded-full border border-white/12 px-3 py-1.5 text-xs font-bold text-paper/70">
                  {skill}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/Jamie-zhang1"
              target="_blank"
              rel="noopener noreferrer"
              className="action-primary mt-8"
            >
              联系交流
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
