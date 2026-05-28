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

/* ── ProdDoc AI 体验 Demo ──────────────────────────
 * 修改默认值 / 选项 / 模板：编辑 src/data/demos/proddoc-ai.ts
 * 本 Demo 使用本地模板生成，不调用 AI API。
 * ─────────────────────────────────────────────── */

export default function ProddocAiDemoPage() {
  const [form, setForm] = useState<ProddocFormData>({ ...defaultFormValues });
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = () => {
    const doc = generateDocument(form);
    setResult(doc);
  };

  const handleReset = () => {
    setResult(null);
  };

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
            交互演示
          </span>
          <span className="text-xs text-ink-faint">Demo 模式：未调用在线 AI 模型</span>
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-ink"
          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
        >
          ProdDoc AI — 文档生成体验
        </h1>
        <p className="text-body text-sm leading-relaxed mt-2 max-w-xl">
          填写基本产品信息，选择文档用途，即刻生成结构化文档预览。
        </p>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 左侧：表单 */}
          <div className="lg:col-span-5">
            <h2 className="text-lg font-bold text-ink mb-6" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
              产品信息
            </h2>
            <div className="space-y-5">
              <Field label="产品名称">
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-line-light rounded-sm bg-paper focus:outline-none focus:border-ink-muted"
                />
              </Field>
              <Field label="产品类型">
                <select
                  value={form.productType}
                  onChange={(e) => setForm({ ...form, productType: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-line-light rounded-sm bg-paper focus:outline-none focus:border-ink-muted"
                >
                  {productTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="目标用户">
                <input
                  type="text"
                  value={form.targetUsers}
                  onChange={(e) => setForm({ ...form, targetUsers: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-line-light rounded-sm bg-paper focus:outline-none focus:border-ink-muted"
                />
              </Field>
              <Field label="核心模块">
                <input
                  type="text"
                  value={form.coreModules}
                  onChange={(e) => setForm({ ...form, coreModules: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-line-light rounded-sm bg-paper focus:outline-none focus:border-ink-muted"
                />
              </Field>
              <Field label="文档用途">
                <select
                  value={form.docType}
                  onChange={(e) => setForm({ ...form, docType: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-line-light rounded-sm bg-paper focus:outline-none focus:border-ink-muted"
                >
                  {docTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <div className="flex gap-3 pt-2">
                {!result ? (
                  <button
                    onClick={handleGenerate}
                    className="px-5 py-2.5 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
                  >
                    生成示例文档
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleReset}
                      className="px-5 py-2.5 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
                    >
                      修改输入
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-5 py-2.5 border border-line-light text-sm font-medium text-ink rounded-sm hover:bg-surface transition-colors"
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
              <h2 className="text-lg font-bold text-ink" style={{ fontFamily: "var(--font-noto-serif-sc)" }}>
                文档预览
              </h2>
              {result && (
                <span className="text-xs text-ink-faint bg-surface px-2 py-1 rounded-sm">
                  Demo 模式 · 本地模板生成
                </span>
              )}
            </div>

            {result ? (
              <div className="bg-surface border border-line-light rounded-sm p-6 sm:p-8">
                <div className="prose prose-sm max-w-none text-ink-light leading-relaxed whitespace-pre-wrap text-sm">
                  {result}
                </div>
                <div className="mt-6 pt-4 border-t border-line-light flex flex-wrap gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="px-4 py-2 border border-line-light text-sm font-medium text-ink rounded-sm hover:bg-paper transition-colors"
                  >
                    复制内容
                  </button>
                  <span className="px-4 py-2 text-sm text-ink-faint border border-line-light rounded-sm">
                    导出功能见完整项目
                  </span>
                  <Link
                    href="/projects/proddoc-ai"
                    className="px-4 py-2 text-sm font-medium text-accent hover:text-ink transition-colors"
                  >
                    查看完整项目案例 →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-surface border border-line-light rounded-sm p-8 sm:p-12 text-center">
                <p className="text-sm text-ink-muted">
                  填写左侧产品信息后，点击「生成示例文档」查看结构化文档预览。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {children}
    </div>
  );
}
