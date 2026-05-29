import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";

const project = getProjectBySlug("decision-copilot")!;

export default function DecisionCopilotPage() {
  return (
    <div className="min-h-screen">
      <div className="site-shell pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-ink">
          <span aria-hidden="true">←</span>
          返回作品集
        </Link>
      </div>

      <section className="site-shell py-8 sm:py-12">
        <div className="dark-panel matrix-bg grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <span className="status-pill coral mb-6">{project.experienceTag}</span>
            <p className="font-mono text-7xl font-black text-white/12">{project.number}</p>
            <p className="label-caps mt-4 text-paper/55">{project.englishSubtitle}</p>
            <h1 className="heading-serif mt-2 text-5xl text-paper-clean sm:text-6xl">{project.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-paper/75">
              {project.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {project.tryPath && (
                <Link href={project.tryPath} className="action-primary">
                  {project.tryLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
              <Link href="/" className="action-secondary border-white/20 bg-white/5 text-paper-clean hover:bg-white/10 hover:text-paper-clean">
                返回作品集
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.features.map((feature, index) => (
              <div key={feature.title} className="rounded-[6px] border border-white/12 bg-white/[0.06] p-5 backdrop-blur">
                <span className="font-mono text-xs font-black text-accent-warm">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-bold text-paper-clean">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-paper/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell grid gap-10 border-y border-line bg-paper-clean/70 py-14 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="eyebrow mb-3">About</p>
          <h2 className="heading-serif text-4xl text-ink">项目说明</h2>
        </div>
        <div className="space-y-5">
          {project.longDescription.map((paragraph) => (
            <p key={paragraph} className="text-body text-base">{paragraph}</p>
          ))}
          <div className="surface-panel border-accent-warm p-5">
            <p className="text-sm leading-7 text-ink-muted">
              注：此项目为早期实验探索，展示 AI 决策分析的交互思路。前端曾包含明文 API 调用，已移除。如需运行，需自行配置服务端 API 代理。
            </p>
          </div>
        </div>
      </section>

      <section className="site-shell grid gap-10 py-14 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="eyebrow mb-3">Reflection</p>
          <h2 className="heading-serif text-4xl text-ink">实验收获</h2>
        </div>
        <div className="grid gap-4">
          <div className="surface-panel p-6">
            <p className="text-body text-base">
              这个原型帮助验证了几个关键假设：大模型能否进行结构化的多维度决策分析；用户是否接受 AI 给出的决策建议；以及如何设计输入界面让用户准确描述决策场景。
            </p>
          </div>
          <div className="surface-panel p-6">
            <p className="text-body text-base">
              实验过程中也发现了局限性：AI 缺乏用户个人背景和价值观信息，分析结果可能过于通用；决策问题的描述质量直接影响分析效果。这些发现为后续的 AI 产品设计提供了重要参考。
            </p>
          </div>
        </div>
      </section>

      <section className="site-shell flex items-center justify-between border-t border-line py-10">
        <Link href="/projects/proddoc-ai" className="text-sm font-bold text-ink-muted hover:text-ink">
          ← ProdDoc AI
        </Link>
        <Link href="/" className="text-sm font-bold text-accent hover:text-ink">
          返回作品集 →
        </Link>
      </section>
    </div>
  );
}
