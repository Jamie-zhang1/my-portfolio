"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { marked } from "marked";

/* ── AI Decision Copilot — Interactive Tool v2 ──────
 * Features:
 * - Two modes: 对比分析 (compare options) / AI 自主建议 (auto)
 * - Image upload + multimodal analysis
 * - Preset cases for quick start
 * - MiMo V2.5 (multimodal) backend
 * ─────────────────────────────────────────────── */

type Style = "normal" | "simple" | "funny";
type Mode = "compare" | "auto";

const STYLE_OPTIONS: { value: Style; label: string; icon: string }[] = [
  { value: "normal", label: "理性分析", icon: "🧠" },
  { value: "simple", label: "简洁直接", icon: "⚡" },
  { value: "funny", label: "幽默轻松", icon: "😄" },
];

const PRESET_CASES = [
  {
    question: "该不该从现在的公司跳槽去创业公司？",
    options: ["留在现公司", "去创业公司"],
    style: "normal" as Style,
  },
  {
    question: "产品该先做 Web 端还是移动端？",
    options: ["先做 Web 端", "先做移动端"],
    style: "normal" as Style,
  },
  {
    question: "技术方案选 React 还是 Vue？",
    options: ["React", "Vue"],
    style: "simple" as Style,
  },
];

export default function DecisionCopilotDemoPage() {
  const [mode, setMode] = useState<Mode>("compare");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [style, setStyle] = useState<Style>("normal");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, ""]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const handleImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("图片不能超过 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImage(dataUrl);
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const loadPreset = (preset: (typeof PRESET_CASES)[number]) => {
    setQuestion(preset.question);
    setOptions([...preset.options]);
    setStyle(preset.style);
    setMode("compare");
    setResult(null);
    setError(null);
    removeImage();
  };

  const runAnalysis = async () => {
    if (!question.trim()) {
      setError("请描述你的问题");
      return;
    }

    if (mode === "compare") {
      const filled = options.filter((o) => o.trim());
      if (filled.length < 2) {
        setError("对比模式下请至少填写两个选项");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, unknown> = {
        question: question.trim(),
        style,
        mode,
      };

      if (mode === "compare") {
        payload.options = options.filter((o) => o.trim());
      }

      if (image) {
        payload.image = image;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "分析失败");
      }

      const content =
        data.choices?.[0]?.message?.content || "未获取到分析结果";
      setResult(content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F5F1EC] to-[#FAF8F5]">
      {/* Back */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link
          href="/try"
          className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors group"
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

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-6 text-center">
        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-[#1a1a1a] mb-2">
          AI Decision Copilot
        </h1>
        <p className="text-[#6b7280] text-[15px]">
          输入问题，AI 帮你做结构化决策分析 · 支持图片识别
        </p>
      </div>

      {/* Quick presets */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280] mb-3">
          快速体验
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_CASES.map((preset, i) => (
            <button
              key={i}
              onClick={() => loadPreset(preset)}
              className="text-left p-4 rounded-2xl border border-[#e8e4df] bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-[13px] font-medium text-[#1a1a1a] line-clamp-2">
                {preset.question}
              </div>
              <div className="mt-2 text-xs text-[#6b7280]">
                {preset.options.join(" vs ")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main form */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-[#e8e4df] rounded-3xl p-8 shadow-sm">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("compare")}
              className={`flex-1 py-3 rounded-xl text-[14px] font-medium border-[1.5px] transition-all duration-200 ${
                mode === "compare"
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-[#1a1a1a] border-[#e8e4df] hover:border-[#5B6E8A]"
              }`}
            >
              ⚖️ 对比分析
            </button>
            <button
              onClick={() => setMode("auto")}
              className={`flex-1 py-3 rounded-xl text-[14px] font-medium border-[1.5px] transition-all duration-200 ${
                mode === "auto"
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-[#1a1a1a] border-[#e8e4df] hover:border-[#5B6E8A]"
              }`}
            >
              🤖 AI 自主建议
            </button>
          </div>

          {/* Question */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280] mb-3">
              <span className="w-[22px] h-[22px] bg-[#F5F1EC] rounded-md flex items-center justify-center text-[11px] font-bold text-[#1a1a1a]">
                1
              </span>
              {mode === "auto" ? "你在纠结什么？" : "描述你的问题"}
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                mode === "auto"
                  ? "例如：该不该从现在的工作跳槽去创业公司？\nAI 会自动帮你分析可行方案"
                  : "例如：该不该从现在的工作跳槽去创业公司？"
              }
              className="w-full p-4 border-[1.5px] border-[#e8e4df] rounded-2xl text-[15px] bg-[#F5F1EC] text-[#1a1a1a] outline-none focus:border-[#5B6E8A] focus:ring-2 focus:ring-[#5B6E8A]/10 resize-none transition-all"
              rows={3}
            />
          </div>

          {/* Options (compare mode only) */}
          {mode === "compare" && (
            <div className="mb-6">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280] mb-3">
                <span className="w-[22px] h-[22px] bg-[#F5F1EC] rounded-md flex items-center justify-center text-[11px] font-bold text-[#1a1a1a]">
                  2
                </span>
                选项对比
              </label>
              <div className="flex flex-col gap-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="w-8 h-8 bg-[#F0EBE3] rounded-lg flex items-center justify-center text-xs font-bold text-[#5B6E8A] flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`选项 ${String.fromCharCode(65 + i)}`}
                      className="flex-1 p-3 border-[1.5px] border-[#e8e4df] rounded-xl text-[15px] bg-[#F5F1EC] text-[#1a1a1a] outline-none focus:border-[#5B6E8A] focus:ring-2 focus:ring-[#5B6E8A]/10 transition-all"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="w-9 h-9 rounded-lg border border-[#e8e4df] bg-white text-[#6b7280] flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 6 && (
                <button
                  onClick={addOption}
                  className="mt-2 w-full py-2.5 border-[1.5px] border-dashed border-[#e8e4df] rounded-xl text-[13px] font-medium text-[#6b7280] hover:border-[#5B6E8A] hover:text-[#5B6E8A] transition-colors"
                >
                  + 添加选项
                </button>
              )}
            </div>
          )}

          {/* Image upload */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280] mb-3">
              <span className="w-[22px] h-[22px] bg-[#F5F1EC] rounded-md flex items-center justify-center text-[11px] font-bold text-[#1a1a1a]">
                {mode === "auto" ? "2" : "3"}
              </span>
              上传图片（可选）
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="上传的图片"
                  className="max-h-48 rounded-xl border border-[#e8e4df] object-contain"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-[1.5px] border-dashed border-[#e8e4df] rounded-2xl cursor-pointer hover:border-[#5B6E8A] hover:bg-[#F5F1EC] transition-all">
                <div className="text-3xl mb-2">🖼️</div>
                <div className="text-[13px] text-[#6b7280]">
                  点击上传或拖拽图片到此处
                </div>
                <div className="text-[11px] text-[#9ca3af] mt-1">
                  支持 JPG / PNG / WebP，最大 10MB
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImage(file);
                  }}
                />
              </label>
            )}
          </div>

          {/* Style */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280] mb-3">
              <span className="w-[22px] h-[22px] bg-[#F5F1EC] rounded-md flex items-center justify-center text-[11px] font-bold text-[#1a1a1a]">
                {mode === "auto" ? "3" : "4"}
              </span>
              分析风格
            </label>
            <div className="flex gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`flex-1 py-3 rounded-xl text-[14px] font-medium border-[1.5px] transition-all duration-200 ${
                    style === s.value
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white text-[#1a1a1a] border-[#e8e4df] hover:border-[#5B6E8A]"
                  }`}
                >
                  <span className="text-[18px] mr-1">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="w-full py-4 bg-[#1a1a1a] text-white rounded-2xl text-[15px] font-semibold hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {loading
              ? "分析中…"
              : mode === "auto"
                ? "🤖 AI 自主分析"
                : "开始分析"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 text-center py-12">
            <div className="w-12 h-12 border-3 border-[#e8e4df] border-t-[#5B6E8A] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6b7280] text-[14px]">
              {image
                ? "AI 正在分析图片和问题…"
                : "AI 正在深度分析你的决策问题…"}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-[14px] text-center">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                📝 分析结果
                {mode === "auto" && (
                  <span className="ml-2 px-2 py-0.5 bg-[#F0EBE3] rounded-md text-[#5B6E8A]">
                    AI 自主建议
                  </span>
                )}
              </span>
              <button
                onClick={() => {
                  const el = document.querySelector(".result-body");
                  if (el) navigator.clipboard.writeText(el.textContent || "");
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F5F1EC] border border-[#e8e4df] text-[12px] font-medium text-[#6b7280] hover:bg-white hover:shadow-sm transition-all"
              >
                复制
              </button>
            </div>
            <div
              className="result-body bg-[#F5F1EC] border border-[#e8e4df] rounded-3xl p-8 text-[15px] leading-[1.8] prose prose-slate max-w-none
                [&_h2]:font-['Playfair_Display',serif] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-[#1a1a1a]
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:mb-3 [&_ul]:my-2 [&_ul]:ml-5 [&_ol]:my-2 [&_ol]:ml-5
                [&_li]:mb-1.5 [&_strong]:text-[#5B6E8A]
                [&_code]:bg-[#F0EBE3] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px]"
              dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-xs text-[#9ca3af]">
          Powered by{" "}
          <span className="font-medium text-[#6b7280]">Xiaomi MiMo V2.5</span>{" "}
          · 多模态决策分析 · 决策仅供参考
        </p>
      </div>
    </div>
  );
}
