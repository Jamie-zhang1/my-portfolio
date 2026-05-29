"use client";

import Link from "next/link";

/* ── AI Decision Copilot — 跳转入口 ────────────── */

const FEATURES = [
  { icon: "🧠", title: "一个问题搞定", desc: "输入问题，可选填选项，AI 自动判断最优分析方式" },
  { icon: "🖼️", title: "图片识别", desc: "上传截图或照片，AI 结合图片内容一起分析" },
  { icon: "📊", title: "深度分析", desc: "SWOT + 逻辑三段论 + 决策建议，一次出齐" },
  { icon: "⚡", title: "三种风格", desc: "理性分析 / 简洁直接 / 幽默轻松，随你选" },
];

export default function DecisionCopilotPage() {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F5F1EC] to-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link href="/try" className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L3 12m0 0l4-5m-4 5h18" />
          </svg>
          返回体验入口
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#5B6E8A] rounded-2xl flex items-center justify-center text-4xl shadow-lg">⚖️</div>
        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] mb-4">AI Decision Copilot</h1>
        <p className="text-[#6b7280] text-lg max-w-xl mx-auto mb-8">
          输入问题，AI 帮你做结构化决策分析。有选项就对比，没选项 AI 自动推荐。
        </p>
        <a href="/decision-copilot/" className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white rounded-2xl text-[16px] font-semibold hover:bg-[#333] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          打开 Decision Copilot
          <svg className={`w-5 h-5 transition-transform duration-200 ${hovering ? "translate-x-1" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 bg-white border border-[#e8e4df] rounded-2xl hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-[#1a1a1a] mb-1">{f.title}</div>
              <div className="text-[13px] text-[#6b7280]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useState<T>(initial: T): [T, (v: T) => void] {
  const { useState: ReactUseState } = require("react");
  return ReactUseState(initial);
}
