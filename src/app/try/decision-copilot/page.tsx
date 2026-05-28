"use client";

import { useState } from "react";
import Link from "next/link";
import { presetCases, type DecisionCase } from "@/data/demos/decision-copilot";

/* ── AI Decision Copilot 实验 Demo ─────────────────
 * 修改预设案例：编辑 src/data/demos/decision-copilot.ts
 * 本 Demo 只使用预设案例，不调用外部 AI 服务。
 * ─────────────────────────────────────────────── */

export default function DecisionCopilotDemoPage() {
  const [selected, setSelected] = useState<DecisionCase | null>(null);

  return (
    <div className="min-h-screen">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link
          href="/try"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L3 12m0 0l4-5m-4 5h18" />
          </svg>
          返回体验入口
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-medium text-accent bg-surface border border-line-light rounded-sm">
            实验演示
          </span>
          <span className="text-xs text-ink-faint">采用预设案例，不调用外部 AI 服务</span>
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-ink"
          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
        >
          AI Decision Copilot — 决策分析实验
        </h1>
        <p className="text-body text-sm leading-relaxed mt-2 max-w-xl">
          选择一个决策问题，查看结构化的多维度分析与推荐结论。
        </p>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
        {!selected ? (
          /* 问题选择 */
          <div>
            <h2 className="text-lg font-bold text-ink mb-6" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              选择一个决策问题
            </h2>
            <div className="space-y-4 max-w-2xl">
              {presetCases.map((c, index) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="w-full text-left bg-surface border border-line-light rounded-sm p-5 hover:border-ink-muted transition-colors group"
                >
                  <span className="number-label mb-2 block">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors">
                    {c.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 分析结果 */
          <div className="max-w-3xl">
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-ink-muted hover:text-ink transition-colors mb-6"
            >
              ← 选择其他问题
            </button>

            <h2
              className="text-xl font-bold text-ink mb-2"
              style={{ fontFamily: "var(--font-noto-serif-sc)" }}
            >
              {selected.question}
            </h2>
            <p className="text-sm text-ink-muted mb-8">
              决策目标：{selected.goal}
            </p>

            {/* 方案对比 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-surface border border-line-light rounded-sm p-4">
                <p className="label-caps text-xs mb-1">方案 A</p>
                <p className="text-sm font-medium text-ink">{selected.optionA}</p>
              </div>
              <div className="bg-surface border border-line-light rounded-sm p-4">
                <p className="label-caps text-xs mb-1">方案 B</p>
                <p className="text-sm font-medium text-ink">{selected.optionB}</p>
              </div>
            </div>

            {/* 评估维度 */}
            <h3 className="text-base font-bold text-ink mb-4" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              多维度评估
            </h3>
            <div className="space-y-3 mb-8">
              {selected.dimensions.map((dim) => (
                <div key={dim.name} className="bg-surface border border-line-light rounded-sm p-4">
                  <p className="text-sm font-medium text-ink mb-2">{dim.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-light">
                    <p><span className="font-medium text-ink-muted">A：</span>{dim.analysisA}</p>
                    <p><span className="font-medium text-ink-muted">B：</span>{dim.analysisB}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 推荐 */}
            <div className="bg-surface border border-line-light rounded-sm p-5 mb-4">
              <p className="label-caps text-xs mb-2">推荐结论</p>
              <p className="text-sm text-ink leading-relaxed">{selected.recommendation}</p>
            </div>
            <div className="bg-surface border border-line-light rounded-sm p-5 mb-8">
              <p className="label-caps text-xs mb-2">风险提示</p>
              <p className="text-sm text-ink-light leading-relaxed">{selected.riskNote}</p>
            </div>

            <p className="text-xs text-ink-faint mb-6">
              实验 Demo：采用预设案例展示交互方式，不调用外部 AI 服务。
            </p>
            <Link
              href="/projects/decision-copilot"
              className="text-sm text-accent hover:text-ink transition-colors"
            >
              查看实验说明 →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
