import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site-config";
import { problemScenarios, productFlow, problemNote } from "@/data/content/heard-sheep";

const project = getProjectBySlug("heard-sheep")!;

/* ── 听到了咩 详情页配置 ───────────────────────────
 * 修改文案：编辑 src/data/projects.ts 中 heard-sheep 条目
 * 修改流程/场景：编辑 src/data/content/heard-sheep.ts
 * 修改截图：替换 public/projects/heard-sheep/ 下的图片文件
 * ─────────────────────────────────────────────── */

export default function HeardSheepPage() {
  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L3 12m0 0l4-5m-4 5h18" />
          </svg>
          返回作品集
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-12">
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-bold text-ink-faint/30" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              {project.number}
            </span>
            <div>
              <p className="label-caps">{project.englishSubtitle}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
                {project.title}
              </h1>
            </div>
          </div>
          <p className="text-lg text-ink-light max-w-3xl leading-relaxed mt-4">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6 animate-fade-in-delay-1">
          {project.tags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 text-sm font-medium text-ink-muted bg-paper-warm border border-line-light rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-6 animate-fade-in-delay-2">
          {siteConfig.heardSheepLiveUrl && (
            <a
              href={siteConfig.heardSheepLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
            >
              立即体验
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-line-light text-sm font-medium text-ink rounded-sm hover:bg-surface transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              源码
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-line-light text-sm font-medium text-ink rounded-sm hover:bg-surface transition-colors"
            >
              线上体验
            </a>
          )}
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Problem Scenarios */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              问题场景
            </h2>
            <p className="label-caps mt-1">Problem</p>
          </div>
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {problemScenarios.map((scenario, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="number-label mt-0.5">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-body text-sm">{scenario}</p>
                </div>
              ))}
            </div>
            <p className="text-body text-sm mt-6 text-ink-muted">
              {problemNote}
            </p>
          </div>
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Product Flow */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              核心流程
            </h2>
            <p className="label-caps mt-1">Flow</p>
          </div>
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {productFlow.map((item, index) => (
                <div key={item.step} className={`flex items-start gap-4 py-3 ${index < productFlow.length - 1 ? "border-b border-line-light" : ""}`}>
                  <span className="number-label mt-0.5">{item.step}</span>
                  <p className="text-body text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Screenshots */}
      {project.screenshots && project.screenshots.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              真实界面
            </h2>
            <span className="label-caps">Screenshots</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {project.screenshots.map((screenshot, index) => (
              <div key={screenshot.src} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <span className="number-label">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-ink-muted">{screenshot.caption}</p>
                </div>
                <div className="screenshot-frame overflow-hidden">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={390}
                    height={844}
                    className="w-full h-auto"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="flex items-baseline gap-4 mb-10">
          <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
            产品能力
          </h2>
          <span className="label-caps">Features</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.features.map((feature, index) => (
            <div key={feature.title} className="bg-surface border border-line-light rounded-sm p-6 hover:shadow-md transition-shadow">
              <span className="number-label mb-3 block">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-semibold text-ink mb-2">{feature.title}</h3>
              <p className="text-sm text-ink-light leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Technical Details */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              技术实现
            </h2>
            <p className="label-caps mt-1">Technical</p>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {/* Page Structure */}
            {project.pages.length > 0 && (
              <div>
                <h3 className="font-semibold text-ink mb-2">页面结构</h3>
                <div className="bg-surface border border-line-light rounded-sm p-4 font-mono text-sm text-ink-light">
                  {project.pages.map((page) => (
                    <p key={page.path}>{page.path} — {page.description}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h3 className="font-semibold text-ink mb-2">技术栈</h3>
              <div className="space-y-4">
                {project.techStack.map((category) => (
                  <div key={category.category}>
                    <p className="text-sm font-medium text-ink mb-1">{category.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item) => (
                        <span key={item} className="px-2.5 py-1 text-xs font-medium text-ink-muted bg-paper-warm border border-line-light rounded-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Current Status */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              当前状态
            </h2>
            <p className="label-caps mt-1">Status</p>
          </div>
          <div className="lg:col-span-8">
            <div className="bg-surface border border-line-light rounded-sm p-6">
              <p className="text-body text-sm leading-relaxed">{project.status}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-line-light">
        <div className="flex justify-between items-center">
          <span className="text-sm text-ink-faint">← 已是第一个项目</span>
          <Link href="/projects/proddoc-ai" className="text-sm text-accent hover:text-ink transition-colors">
            下一个：ProdDoc AI →
          </Link>
        </div>
      </section>
    </div>
  );
}
