"use client";

import { useState } from "react";
import Link from "next/link";
import {
  defaultFormValues,
  productTypes,
  docTypes,
  generateDocument,
  type ProddocFormData,
} from "@/data/demos/proddoc-ai";

/* ── ProdDoc AI — 优化版 Demo ──────────────────────
 * 设计理念：
 * - 左右分栏：表单 + 实时预览
 * - 表单分组：基本信息 / 文档配置
 * - 生成过渡动画
 * - Markdown 渲染预览
 * - 保持与作品集 editorial 风格一致
 * ─────────────────────────────────────────────── */

const docTypeIcons: Record<string, string> = {
  "产品说明书": "📋",
  "操作手册": "📖",
  "售前演示材料": "🎯",
};

export default function ProddocAiDemoPage() {
  const [form, setForm] = useState<ProddocFormData>({ ...defaultFormValues });
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay for visual effect
    setTimeout(() => {
      const doc = generateDocument(form);
      setResult(doc);
      setIsGenerating(false);
    }, 600);
  };

  const handleReset = () => {
    setResult(null);
  };

  const updateField = (key: keyof ProddocFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-paper via-surface-alt to-paper">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
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
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-accent-sage bg-accent-sage/5 border border-accent-sage/15 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sage" />
            交互演示
          </span>
          <span className="text-xs text-ink-faint">Demo 模式 · 本地模板生成</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold text-ink tracking-tight"
          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
        >
          ProdDoc AI
        </h1>
        <p className="text-ink-light text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
          填写产品信息，选择文档用途，即刻生成结构化文档预览。
        </p>
      </section>

      <hr className="line-editorial max-w-7xl mx-auto" />

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 左侧：表单 */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              {/* 基本信息 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-ink/5 flex items-center justify-center text-[10px] font-bold text-ink-muted">
                    1
                  </span>
                  <h2
                    className="text-base font-bold text-ink"
                    style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                  >
                    基本信息
                  </h2>
                </div>

                <div className="space-y-4">
                  <Field label="产品名称" icon="🏷️">
                    <input
                      type="text"
                      value={form.productName}
                      onChange={(e) => updateField("productName", e.target.value)}
                      placeholder="例如：智能客户线索管理平台"
                      className="w-full px-3.5 py-2.5 text-sm border border-line-light rounded-lg bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-ink-faint"
                    />
                  </Field>

                  <Field label="产品类型" icon="📦">
                    <div className="grid grid-cols-3 gap-2">
                      {productTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => updateField("productType", t)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                            form.productType === t
                              ? "bg-ink text-paper border-ink"
                              : "bg-surface text-ink-muted border-line-light hover:border-ink-muted/30"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="目标用户" icon="👥">
                    <input
                      type="text"
                      value={form.targetUsers}
                      onChange={(e) => updateField("targetUsers", e.target.value)}
                      placeholder="例如：客户经理与运营人员"
                      className="w-full px-3.5 py-2.5 text-sm border border-line-light rounded-lg bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-ink-faint"
                    />
                  </Field>

                  <Field label="核心模块" icon="🧩">
                    <input
                      type="text"
                      value={form.coreModules}
                      onChange={(e) => updateField("coreModules", e.target.value)}
                      placeholder="用顿号分隔，例如：线索筛选、客户画像、跟进记录"
                      className="w-full px-3.5 py-2.5 text-sm border border-line-light rounded-lg bg-surface focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-ink-faint"
                    />
                  </Field>
                </div>
              </div>

              {/* 文档配置 */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-ink/5 flex items-center justify-center text-[10px] font-bold text-ink-muted">
                    2
                  </span>
                  <h2
                    className="text-base font-bold text-ink"
                    style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                  >
                    文档配置
                  </h2>
                </div>

                <div className="space-y-4">
                  <Field label="文档用途" icon="📄">
                    <div className="grid grid-cols-3 gap-2">
                      {docTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => updateField("docType", t)}
                          className={`flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium rounded-lg border transition-all ${
                            form.docType === t
                              ? "bg-ink text-paper border-ink"
                              : "bg-surface text-ink-muted border-line-light hover:border-ink-muted/30"
                          }`}
                        >
                          <span className="text-base">{docTypeIcons[t] || "📄"}</span>
                          <span>{t}</span>
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {!result ? (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink-light transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        生成中…
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                          />
                        </svg>
                        生成示例文档
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleReset}
                      className="px-5 py-3 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink-light transition-all"
                    >
                      修改输入
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-5 py-3 border border-line-light text-sm font-medium text-ink rounded-lg hover:bg-surface transition-all"
                    >
                      重新生成
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：预览 */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg font-bold text-ink"
                  style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                >
                  文档预览
                </h2>
                {result && (
                  <span className="text-[10px] text-ink-faint bg-paper-warm px-2 py-0.5 rounded-full">
                    已生成
                  </span>
                )}
              </div>
            </div>

            {result ? (
              <div className="bg-surface border border-line-light rounded-xl overflow-hidden shadow-sm">
                {/* Preview header bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-line-light bg-surface-alt">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-sage/60" />
                    <span className="text-xs text-ink-muted font-medium">
                      {form.docType} · {form.productName}
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-faint">
                    Demo 模式 · 本地模板
                  </span>
                </div>

                {/* Document content */}
                <div className="p-6 sm:p-8">
                  <div className="prose prose-sm max-w-none text-ink-light leading-relaxed whitespace-pre-wrap text-sm font-[var(--font-sans)]">
                    {result.split("\n").map((line, i) => {
                      if (line.startsWith("# ")) {
                        return (
                          <h1
                            key={i}
                            className="text-xl font-bold text-ink mt-0 mb-4"
                            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                          >
                            {line.slice(2)}
                          </h1>
                        );
                      }
                      if (line.startsWith("## ")) {
                        return (
                          <h2
                            key={i}
                            className="text-base font-bold text-ink mt-6 mb-3 pb-2 border-b border-line-light"
                            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                          >
                            {line.slice(3)}
                          </h2>
                        );
                      }
                      if (line.startsWith("- **")) {
                        const match = line.match(/^- \*\*(.+?)\*\*[：:](.*)$/);
                        if (match) {
                          return (
                            <div key={i} className="flex gap-2 mb-1.5 ml-4">
                              <span className="text-ink font-semibold text-sm">
                                {match[1]}：
                              </span>
                              <span className="text-sm">{match[2]}</span>
                            </div>
                          );
                        }
                      }
                      if (line.startsWith("- ")) {
                        return (
                          <div key={i} className="flex gap-2 mb-1.5 ml-4">
                            <span className="text-accent-sage mt-0.5">•</span>
                            <span className="text-sm">{line.slice(2)}</span>
                          </div>
                        );
                      }
                      if (/^\d+\./.test(line)) {
                        return (
                          <div key={i} className="flex gap-2 mb-1.5 ml-4">
                            <span className="text-ink-muted font-medium text-sm min-w-[1.2rem]">
                              {line.match(/^\d+/)?.[0]}.
                            </span>
                            <span className="text-sm">
                              {line.replace(/^\d+\.\s*/, "")}
                            </span>
                          </div>
                        );
                      }
                      if (line.trim() === "") {
                        return <div key={i} className="h-2" />;
                      }
                      return (
                        <p key={i} className="text-sm mb-2">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Actions bar */}
                <div className="px-6 py-4 border-t border-line-light bg-surface-alt flex flex-wrap gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-line-light text-sm font-medium text-ink rounded-lg hover:bg-surface transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                      />
                    </svg>
                    复制内容
                  </button>
                  <span className="inline-flex items-center px-4 py-2 text-sm text-ink-faint border border-line-light rounded-lg">
                    导出功能见完整项目
                  </span>
                  <Link
                    href="/projects/proddoc-ai"
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-accent hover:text-ink transition-colors"
                  >
                    查看完整项目
                    <svg
                      className="w-3.5 h-3.5"
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
              </div>
            ) : (
              <div className="bg-surface border border-line-light border-dashed rounded-xl p-12 sm:p-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-paper-warm flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-ink-faint"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-ink-muted mb-1">
                  填写左侧产品信息后
                </p>
                <p className="text-sm text-ink-muted">
                  点击「生成示例文档」查看结构化文档预览
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-2">
        {icon && <span className="text-xs">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
