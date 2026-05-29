"use client";

import { useState } from "react";
import Link from "next/link";
import { presetCases, type DecisionCase } from "@/data/demos/decision-copilot";

/* ── AI Decision Copilot — 优化版 Demo ─────────────
 * 设计理念：
 * - 步骤式流程：选择问题 → 查看分析
 * - 信息层级清晰：目标 → 方案 → 维度 → 推荐 → 风险
 * - 视觉丰富：渐变强调、卡片阴影、微动效
 * - 保持与作品集 editorial 风格的一致性
 * ─────────────────────────────────────────────── */

const dimensionIcons: Record<string, string> = {
  "部署难度": "⚙️",
  "访问速度": "🚀",
  "成本": "💰",
  "可控性": "🎛️",
  "开发周期": "📅",
  "用户反馈质量": "💬",
  "资源消耗": "📦",
  "风险": "⚠️",
  "使用场景": "🎯",
  "输入效率": "⚡",
  "技术复杂度": "🔧",
  "用户接受度": "👥",
};

const caseColors = [
  { from: "#5B6E8A", to: "#7A8F7A" },
  { from: "#8B6F5C", to: "#C4A882" },
  { from: "#6B7B8D", to: "#5B6E8A" },
];

export default function DecisionCopilotDemoPage() {
  const [selected, setSelected] = useState<DecisionCase | null>(null);
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-paper via-surface-alt to-paper">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link
          href="/try"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 17L3 12m0 0l4-5m-4 5h18"
            />
          </svg>
          返回体验入口
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-accent bg-accent/5 border border-accent/15 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            实验演示
          </span>
          <span className="text-xs text-ink-faint">预设案例 · 不调用外部 AI</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold text-ink tracking-tight"
          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
        >
          AI Decision Copilot
        </h1>
        <p className="text-ink-light text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
          选择一个决策问题，查看结构化的多维度分析与推荐结论。探索 AI 如何辅助复杂决策。
        </p>
      </section>

      {/* Step Indicator */}
      <div className="max-w-6xl mx-auto px-6 pb-4">
        <div className="flex items-center gap-3 text-xs">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
              !selected
                ? "bg-ink text-paper font-medium"
                : "bg-surface border border-line-light text-ink-muted"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-current/10 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            选择问题
          </div>
          <div className="w-8 h-px bg-line-light" />
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
              selected
                ? "bg-ink text-paper font-medium"
                : "bg-surface border border-line-light text-ink-faint"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-current/10 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            查看分析
          </div>
        </div>
      </div>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
        {!selected ? (
          /* ── 问题选择 ── */
          <div>
            <h2
              className="text-lg font-bold text-ink mb-2"
              style={{ fontFamily: "var(--font-noto-serif-sc)" }}
            >
              选择一个决策问题
            </h2>
            <p className="text-sm text-ink-muted mb-8">
              每个问题包含两个对比方案，AI 会从多个维度进行结构化分析。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
              {presetCases.map((c, index) => {
                const color = caseColors[index % caseColors.length];
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="group relative text-left bg-surface border border-line-light rounded-xl p-5 hover:border-ink-muted/30 transition-all duration-300 hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-0.5 overflow-hidden"
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
                      }}
                    />

                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="text-3xl font-bold text-ink-faint/20 leading-none"
                        style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <svg
                        className="w-4 h-4 text-ink-faint group-hover:text-accent transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors leading-relaxed line-clamp-3">
                      {c.question}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-ink-faint">
                      <span className="px-1.5 py-0.5 bg-paper-warm rounded text-ink-muted font-medium">
                        A: {c.optionA.slice(0, 8)}…
                      </span>
                      <span className="text-ink-faint">vs</span>
                      <span className="px-1.5 py-0.5 bg-paper-warm rounded text-ink-muted font-medium">
                        B: {c.optionB.slice(0, 8)}…
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── 分析结果 ── */
          <div className="max-w-4xl">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-8 group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 17L3 12m0 0l4-5m-4 5h18"
                />
              </svg>
              选择其他问题
            </button>

            {/* 问题标题 */}
            <div className="mb-8">
              <h2
                className="text-2xl sm:text-3xl font-bold text-ink mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-noto-serif-sc)" }}
              >
                {selected.question}
              </h2>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2.5 py-1 text-xs font-medium text-accent bg-accent/5 border border-accent/15 rounded-full">
                  决策目标
                </span>
                <span className="text-sm text-ink-light">
                  {selected.goal}
                </span>
              </div>
            </div>

            {/* 方案对比 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="relative bg-gradient-to-br from-surface to-surface-alt border border-line-light rounded-xl p-5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B6E8A] to-[#7A8F7A]" />
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#5B6E8A]/10 flex items-center justify-center text-xs font-bold text-[#5B6E8A]">
                    A
                  </span>
                  <span className="label-caps text-[10px]">方案 A</span>
                </div>
                <p className="text-sm font-semibold text-ink leading-relaxed">
                  {selected.optionA}
                </p>
              </div>
              <div className="relative bg-gradient-to-br from-surface to-surface-alt border border-line-light rounded-xl p-5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C4A882] to-[#8B6F5C]" />
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#C4A882]/15 flex items-center justify-center text-xs font-bold text-[#8B6F5C]">
                    B
                  </span>
                  <span className="label-caps text-[10px]">方案 B</span>
                </div>
                <p className="text-sm font-semibold text-ink leading-relaxed">
                  {selected.optionB}
                </p>
              </div>
            </div>

            {/* 评估维度 */}
            <div className="mb-10">
              <div className="flex items-baseline gap-3 mb-5">
                <h3
                  className="text-lg font-bold text-ink"
                  style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                >
                  多维度评估
                </h3>
                <span className="label-caps text-[10px]">Dimensions</span>
              </div>

              <div className="space-y-3">
                {selected.dimensions.map((dim, i) => {
                  const icon = dimensionIcons[dim.name] || "📊";
                  const isHovered = hoveredDim === dim.name;
                  return (
                    <div
                      key={dim.name}
                      className={`bg-surface border rounded-xl p-5 transition-all duration-300 ${
                        isHovered
                          ? "border-accent/30 shadow-md shadow-accent/5"
                          : "border-line-light"
                      }`}
                      onMouseEnter={() => setHoveredDim(dim.name)}
                      onMouseLeave={() => setHoveredDim(null)}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-base">{icon}</span>
                        <p className="text-sm font-semibold text-ink">
                          {dim.name}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gradient-to-r from-[#5B6E8A]/[0.03] to-transparent rounded-lg p-3 border border-[#5B6E8A]/[0.06]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#5B6E8A]/10 flex items-center justify-center text-[9px] font-bold text-[#5B6E8A]">
                              A
                            </span>
                            <span className="text-[10px] font-medium text-[#5B6E8A] uppercase tracking-wider">
                              方案 A
                            </span>
                          </div>
                          <p className="text-xs text-ink-light leading-relaxed">
                            {dim.analysisA}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-[#C4A882]/[0.04] to-transparent rounded-lg p-3 border border-[#C4A882]/[0.08]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#C4A882]/15 flex items-center justify-center text-[9px] font-bold text-[#8B6F5C]">
                              B
                            </span>
                            <span className="text-[10px] font-medium text-[#8B6F5C] uppercase tracking-wider">
                              方案 B
                            </span>
                          </div>
                          <p className="text-xs text-ink-light leading-relaxed">
                            {dim.analysisB}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 推荐结论 */}
            <div className="relative bg-gradient-to-br from-ink to-ink-light rounded-xl p-6 sm:p-8 mb-4 text-paper overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.02] rounded-full translate-y-12 -translate-x-12" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-accent-warm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="label-caps text-[10px] text-paper/60">
                    推荐结论
                  </p>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-paper/90">
                  {selected.recommendation}
                </p>
              </div>
            </div>

            {/* 风险提示 */}
            <div className="bg-surface border border-line-light rounded-xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-ink-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <p className="text-sm font-semibold text-ink">风险提示</p>
              </div>
              <p className="text-sm text-ink-light leading-relaxed">
                {selected.riskNote}
              </p>
            </div>

            <p className="text-xs text-ink-faint mb-6">
              实验 Demo：采用预设案例展示交互方式，不调用外部 AI 服务。
            </p>
            <Link
              href="/projects/decision-copilot"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-ink transition-colors group"
            >
              查看实验说明
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
