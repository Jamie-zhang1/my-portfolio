import Link from "next/link";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site-config";

export default function TryPage() {
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
          <div className="surface-panel p-6 sm:p-8 lg:p-10">
            <p className="eyebrow mb-6">Interactive Playground</p>
            <h1 className="heading-serif text-5xl text-ink sm:text-6xl">体验我的项目</h1>
            <p className="text-body mt-6 max-w-2xl text-base sm:text-lg">
              从真实产品入口与轻量交互演示中，快速了解这些 AI 应用如何回应具体问题。
            </p>
          </div>
          <div className="dark-panel matrix-bg grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            {[
              ["01", "Live Product", "/sheep"],
              ["02", "Template Demo", "/try/proddoc-ai"],
              ["03", "Decision Lab", "/try/decision-copilot"],
            ].map(([number, label, route]) => (
              <div key={route} className="rounded-[6px] border border-white/12 bg-white/[0.06] p-5">
                <p className="font-mono text-4xl font-black text-white/14">{number}</p>
                <p className="mt-4 text-sm font-bold text-paper-clean">{label}</p>
                <p className="mt-2 font-mono text-xs text-paper/50">{route}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell pb-16">
        <div className="grid gap-5">
          {projects.map((project, index) => {
            const liveUrl = project.tryPath === null ? siteConfig.heardSheepLiveUrl : null;
            const mainHref = liveUrl || project.tryPath || project.href;
            const isLive = Boolean(liveUrl);

            return (
              <article key={project.number} className="surface-panel artifact-link overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
                    <div className="mb-5 flex items-center gap-4">
                      <span className="font-mono text-6xl font-black text-ink/10">{project.number}</span>
                      <div>
                        <span className={`status-pill ${index === 0 ? "" : index === 1 ? "blue" : "coral"}`}>
                          {project.experienceTag}
                        </span>
                        <h2 className="heading-serif mt-3 text-3xl text-ink">{project.title}</h2>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-ink-light">{project.experienceDescription}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {mainHref && (
                        <a
                          href={mainHref}
                          target={isLive ? "_blank" : undefined}
                          rel={isLive ? "noopener noreferrer" : undefined}
                          className="action-primary"
                        >
                          {isLive ? "进入听到了咩" : project.tryLabel}
                          <span aria-hidden="true">{isLive ? "↗" : "→"}</span>
                        </a>
                      )}
                      <Link href={project.href} className="action-secondary">
                        查看项目案例
                      </Link>
                    </div>
                  </div>

                  <div className="bg-paper-clean/80 p-6 sm:p-8">
                    <p className="text-sm leading-7 text-ink-light">{project.homepageSummary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.slice(0, 6).map((tag) => (
                        <span key={tag} className="chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
