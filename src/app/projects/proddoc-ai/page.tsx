import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";

const project = getProjectBySlug("proddoc-ai")!;

export default function ProddocAiPage() {
  return (
    <div className="min-h-screen">
      <div className="site-shell pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-ink">
          <span aria-hidden="true">←</span>
          返回作品集
        </Link>
      </div>

      <section className="site-shell py-8 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="surface-panel flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <span className="status-pill blue mb-6">{project.experienceTag}</span>
              <p className="font-mono text-7xl font-black text-ink/10">{project.number}</p>
              <p className="label-caps mt-4">{project.englishSubtitle}</p>
              <h1 className="heading-serif mt-2 text-5xl text-ink sm:text-6xl">{project.title}</h1>
              <p className="text-body mt-6 max-w-xl text-base">{project.description}</p>
            </div>
            <div className="mt-8">
              <div className="mb-6 flex flex-wrap gap-2">
                {project.tags.slice(0, 7).map((tag) => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {project.tryPath && (
                  <Link href={project.tryPath} className="action-primary">
                    {project.tryLabel}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-secondary"
                  >
                    源码
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <Link href="/try/proddoc-ai" className="artifact-link visual-stage block p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="status-pill">Demo Workbench</span>
              <span className="font-mono text-xs font-bold text-paper/55">local template generation</span>
            </div>
            <div className="screenshot-frame overflow-hidden rounded-[6px] bg-white">
              <Image
                src={project.homepageImages[0]?.src || project.screenshot || ""}
                alt={project.homepageImages[0]?.alt || project.screenshotAlt}
                width={1200}
                height={800}
                className="h-auto w-full"
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-paper-clean/78">
        <div className="site-shell grid gap-10 py-14 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow mb-3">Positioning</p>
            <h2 className="heading-serif text-4xl text-ink">项目定位</h2>
          </div>
          <div className="grid gap-5">
            {project.longDescription.map((paragraph) => (
              <p key={paragraph} className="text-body text-base">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {project.screenshots && (
        <section className="site-shell page-pad">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3">Screenshots</p>
              <h2 className="heading-serif text-4xl text-ink">界面展示</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ink-muted">
              以桌面工作台为主，展示文档生成、模板管理、历史记录和配置流程。
            </p>
          </div>

          <div className="grid gap-8">
            {project.screenshots.map((screenshot, index) => (
              <div key={screenshot.src}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="number-label">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm font-bold text-ink-muted">{screenshot.caption}</p>
                </div>
                <div className="screenshot-frame">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={1200}
                    height={800}
                    className="h-auto w-full"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="site-shell grid gap-10 border-t border-line py-14 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="eyebrow mb-3">Features</p>
          <h2 className="heading-serif text-4xl text-ink">核心功能</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {project.features.map((feature, index) => (
            <div key={feature.title} className="surface-panel p-5">
              <span className="number-label">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-bold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell grid gap-10 border-t border-line py-14 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="eyebrow mb-3">Technical</p>
          <h2 className="heading-serif text-4xl text-ink">技术实现</h2>
        </div>
        <div className="grid gap-6">
          <div className="surface-panel p-5">
            <h3 className="mb-4 font-bold text-ink">页面结构</h3>
            <div className="flex flex-wrap gap-2">
              {project.pages.map((page) => (
                <span key={page.path} className="route-pill">{page.path}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.techStack.map((category) => (
              <div key={category.category} className="surface-panel p-5">
                <h3 className="font-bold text-ink">{category.category}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span key={item} className="chip">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell flex items-center justify-between border-t border-line py-10">
        <Link href="/projects/heard-sheep" className="text-sm font-bold text-ink-muted hover:text-ink">
          ← 听到了咩
        </Link>
        <Link href="/projects/decision-copilot" className="text-sm font-bold text-accent hover:text-ink">
          下一个：AI Decision Copilot →
        </Link>
      </section>
    </div>
  );
}
