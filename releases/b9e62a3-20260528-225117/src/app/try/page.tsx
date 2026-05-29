import Link from "next/link";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site-config";

/* ── /try 汇总页 ──────────────────────────────────
 * 修改体验说明：编辑 src/data/projects.ts 中各项目的 experienceTag / experienceDescription
 * 修改听到了咩真实入口：编辑 src/data/site-config.ts 中 heardSheepLiveUrl
 * ─────────────────────────────────────────────── */

export default function TryPage() {
  return (
    <div className="min-h-screen">
      {/* Back */}
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

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-12">
        <p className="label-caps mb-4">Interactive Playground</p>
        <h1
          className="text-3xl sm:text-4xl font-bold text-ink"
          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
        >
          体验我的项目
        </h1>
        <p className="text-body text-base sm:text-lg leading-relaxed mt-4 max-w-2xl">
          从真实产品入口与轻量交互演示中，快速了解这些 AI 应用如何回应具体问题。
        </p>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Experience Entries */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="space-y-16">
          {projects.map((project, index) => {
            // 听到了咩使用真实产品入口
            const liveUrl = project.tryPath === null ? siteConfig.heardSheepLiveUrl : null;
            const mainHref = liveUrl || project.tryPath || project.href;

            return (
              <div key={project.number}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* 左侧 */}
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-4xl font-bold text-ink-faint/25 leading-none"
                        style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                      >
                        {project.number}
                      </span>
                      <div>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium text-accent bg-surface border border-line-light rounded-sm mb-1">
                          {project.experienceTag}
                        </span>
                        <h2
                          className="text-xl font-bold text-ink"
                          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                        >
                          {project.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-ink-light leading-relaxed mb-6">
                      {project.experienceDescription}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {mainHref && (
                        <a
                          href={mainHref}
                          target={liveUrl ? "_blank" : undefined}
                          rel={liveUrl ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
                        >
                          {liveUrl ? "进入听到了咩" : project.tryLabel}
                        </a>
                      )}
                      <Link
                        href={project.href}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-line-light text-sm font-medium text-ink rounded-sm hover:bg-surface transition-colors"
                      >
                        查看项目案例
                      </Link>
                    </div>
                  </div>

                  {/* 右侧：项目摘要 */}
                  <div className="lg:col-span-7">
                    <div className="bg-surface border border-line-light rounded-sm p-6">
                      <p className="text-sm text-ink-light leading-relaxed mb-4">
                        {project.homepageSummary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs font-medium text-ink-muted bg-paper-warm border border-line-light rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {index < projects.length - 1 && <hr className="line-editorial mt-16" />}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
