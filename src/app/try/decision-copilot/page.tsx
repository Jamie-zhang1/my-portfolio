"use client";

import { useState } from "react";
import Link from "next/link";
import { presetCases, type DecisionCase } from "@/data/demos/decision-copilot";

export default function DecisionCopilotDemoPage() {
  const [selected, setSelected] = useState<DecisionCase | null>(null);

  return (
    <div className="min-h-screen">
      <div className="site-shell pt-8">
        <Link href="/try" className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-ink">
          <span aria-hidden="true">←</span>
          返回体验入口
        </Link>
      </div>

      <section className="site-shell py-8 sm:py-12">
        <div className="dark-panel matrix-bg p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="status-pill coral">实验演示</span>
            <span className="route-pill border-white/15 bg-white/8 text-paper/70">采用预设案例，不调用外部 AI 服务</span>
          </div>
          <h1 className="heading-serif mt-6 text-4xl text-paper-clean sm:text-6xl">
            AI Decision Copilot — 决策分析实验
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-paper/72 sm:text-base">
            选择一个决策问题，查看结构化的多维度分析与推荐结论。
          </p>
        </div>
      </section>

      <section className="site-shell pb-16">
        {!selected ? (
          <div className="grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
            <div>
              <p className="eyebrow mb-3">Choose</p>
              <h2 className="heading-serif text-4xl text-ink">选择一个决策问题</h2>
              <p className="text-body mt-5 text-sm">
                这个 Demo 关注结构化表达，不追求真实 AI 推理；所有结果均来自预设案例。
              </p>
            </div>
            <div className="grid gap-4">
              {presetCases.map((c, index) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="surface-panel artifact-link w-full p-5 text-left"
                >
                  <div className="grid gap-4 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                    <span className="font-mono text-4xl font-black text-ink/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-bold text-ink">{c.question}</p>
                    <span className="text-sm font-bold text-accent">分析 →</span>
                  </div>
                </button>
              ))}
              <div className="grid gap-3 pt-3 sm:grid-cols-3">
                {["输入问题", "对比方案", "输出建议"].map((label, index) => (
                  <div key={label} className="rounded-[6px] border border-line bg-paper-clean p-4">
                    <span className="number-label">{String(index + 1).padStart(2, "0")}</span>
                    <p className="mt-3 text-sm font-bold text-ink">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="surface-panel p-6 sm:p-7">
              <button
                onClick={() => setSelected(null)}
                className="mb-6 text-sm font-bold text-ink-muted transition-colors hover:text-ink"
              >
                ← 选择其他问题
              </button>
              <p className="eyebrow mb-3">Decision Brief</p>
              <h2 className="heading-serif text-4xl text-ink">{selected.question}</h2>
              <p className="mt-5 text-sm leading-7 text-ink-muted">
                决策目标：{selected.goal}
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-[6px] border border-line bg-paper-clean p-4">
                  <p className="label-caps mb-2">方案 A</p>
                  <p className="font-bold text-ink">{selected.optionA}</p>
                </div>
                <div className="rounded-[6px] border border-line bg-paper-clean p-4">
                  <p className="label-caps mb-2">方案 B</p>
                  <p className="font-bold text-ink">{selected.optionB}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="surface-panel p-6 sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow mb-2">Analysis</p>
                    <h3 className="heading-serif text-3xl text-ink">多维度评估</h3>
                  </div>
                  <span className="status-pill">Structured</span>
                </div>
                <div className="grid gap-3">
                  {selected.dimensions.map((dim) => (
                    <div key={dim.name} className="rounded-[6px] border border-line bg-white p-4">
                      <p className="font-bold text-ink">{dim.name}</p>
                      <div className="mt-3 grid gap-3 text-sm leading-7 text-ink-light sm:grid-cols-2">
                        <p><span className="font-bold text-ink-muted">A：</span>{dim.analysisA}</p>
                        <p><span className="font-bold text-ink-muted">B：</span>{dim.analysisB}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="dark-panel p-6">
                  <p className="label-caps text-paper/55">推荐结论</p>
                  <p className="mt-3 text-sm leading-7 text-paper/76">{selected.recommendation}</p>
                </div>
                <div className="surface-panel border-accent-warm p-6">
                  <p className="label-caps">风险提示</p>
                  <p className="mt-3 text-sm leading-7 text-ink-light">{selected.riskNote}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="route-pill">实验 Demo：预设案例</span>
                <Link href="/projects/decision-copilot" className="action-secondary">
                  查看实验说明 →
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
