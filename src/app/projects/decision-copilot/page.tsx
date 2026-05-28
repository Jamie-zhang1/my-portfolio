import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";

const project = getProjectBySlug("decision-copilot")!;

export default function DecisionCopilotPage() {
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
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Project Overview */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              项目说明
            </h2>
            <p className="label-caps mt-1">About</p>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {project.longDescription.map((paragraph, index) => (
              <p key={index} className="text-body text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
            <div className="bg-surface-alt border border-line-light rounded-sm p-6 mt-6">
              <p className="text-sm text-ink-muted italic">
                注：此项目为早期实验探索，展示 AI 决策分析的交互思路。前端曾包含明文 API 调用，已移除。如需运行，需自行配置服务端 API 代理。
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="flex items-baseline gap-4 mb-10">
          <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
            交互设计
          </h2>
          <span className="label-caps">Interaction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {project.features.map((feature, index) => (
            <div key={feature.title} className="bg-surface border border-line-light rounded-sm p-6">
              <span className="number-label mb-3 block">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-semibold text-ink mb-2">{feature.title}</h3>
              <p className="text-sm text-ink-light leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Reflection */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              实验收获
            </h2>
            <p className="label-caps mt-1">Reflection</p>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <p className="text-body text-base leading-relaxed">
              这个原型帮助验证了几个关键假设：大模型能否进行结构化的多维度决策分析；用户是否接受 AI 给出的决策建议；以及如何设计输入界面让用户准确描述决策场景。
            </p>
            <p className="text-body text-base leading-relaxed">
              实验过程中也发现了局限性：AI 缺乏用户个人背景和价值观信息，分析结果可能过于通用；决策问题的描述质量直接影响分析效果。这些发现为后续的 AI 产品设计提供了重要参考。
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-line-light">
        <div className="flex justify-between items-center">
          <Link href="/projects/proddoc-ai" className="text-sm text-ink-muted hover:text-ink transition-colors">
            ← ProdDoc AI
          </Link>
          <Link href="/" className="text-sm text-accent hover:text-ink transition-colors">
            返回作品集 →
          </Link>
        </div>
      </section>
    </div>
  );
}
