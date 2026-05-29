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
      <div className="site-shell pt-8">
        <Link href="/try" className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-ink">
          <span aria-hidden="true">←</span>
          返回体验入口
        </Link>
      </div>

      <section className="site-shell py-8 sm:py-12">
        <div className="dark-panel matrix-bg p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="status-pill blue">交互演示</span>
            <span className="route-pill border-white/15 bg-white/8 text-paper/70">Demo 模式：未调用在线 AI 模型</span>
          </div>
          <h1 className="heading-serif mt-6 text-4xl text-paper-clean sm:text-6xl">
            ProdDoc AI — 文档生成体验
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-paper/72 sm:text-base">
            填写基本产品信息，选择文档用途，即刻生成结构化文档预览。
          </p>
        </div>
      </section>

      <section className="site-shell pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="surface-panel p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow mb-2">Input</p>
                <h2 className="heading-serif text-3xl text-ink">产品信息</h2>
              </div>
              <span className="font-mono text-xs font-bold text-ink-faint">LOCAL</span>
            </div>

            <div className="space-y-5">
              <Field label="产品名称">
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="field-input"
                />
              </Field>
              <Field label="产品类型">
                <select
                  value={form.productType}
                  onChange={(e) => setForm({ ...form, productType: e.target.value })}
                  className="field-input"
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
                  className="field-input"
                />
              </Field>
              <Field label="核心模块">
                <input
                  type="text"
                  value={form.coreModules}
                  onChange={(e) => setForm({ ...form, coreModules: e.target.value })}
                  className="field-input"
                />
              </Field>
              <Field label="文档用途">
                <select
                  value={form.docType}
                  onChange={(e) => setForm({ ...form, docType: e.target.value })}
                  className="field-input"
                >
                  {docTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <div className="flex flex-wrap gap-3 pt-2">
                {!result ? (
                  <button onClick={handleGenerate} className="action-primary">
                    生成示例文档
                  </button>
                ) : (
                  <>
                    <button onClick={handleReset} className="action-primary">
                      修改输入
                    </button>
                    <button onClick={handleGenerate} className="action-secondary">
                      重新生成
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="surface-panel overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-paper-clean px-6 py-5">
              <div>
                <p className="eyebrow mb-2">Output</p>
                <h2 className="heading-serif text-3xl text-ink">文档预览</h2>
              </div>
              {result && <span className="status-pill">Generated</span>}
            </div>

            {result ? (
              <div className="p-6 sm:p-8">
                <div className="rounded-[6px] border border-line bg-white p-5 shadow-sm sm:p-7">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-ink-light">
                    {result}
                  </pre>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="action-secondary"
                  >
                    复制内容
                  </button>
                  <span className="route-pill">导出功能见完整项目</span>
                  <Link href="/projects/proddoc-ai" className="action-secondary">
                    查看完整项目案例 →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center p-8 text-center">
                <div>
                  <p className="font-mono text-6xl font-black text-ink/10">DOC</p>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-ink-muted">
                    填写左侧产品信息后，点击「生成示例文档」查看结构化文档预览。
                  </p>
                </div>
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
      <label className="mb-1.5 block text-sm font-bold text-ink">{label}</label>
      {children}
    </div>
  );
}
