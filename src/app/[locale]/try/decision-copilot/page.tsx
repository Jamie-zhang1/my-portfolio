"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type Case = { question: string; goal: string; a: string; b: string; dimensions: { name: string; a: string; b: string }[]; recommendation: string; risk: string };

const cases: Record<AppLocale, Case[]> = {
  zh: [{question:"先做语音输入还是图片识别？",goal:"用有限开发资源提高首次使用价值",a:"优先完成语音输入",b:"优先完成图片识别",dimensions:[{name:"使用频率",a:"口头交代高频，入口更自然",b:"报表与截图场景明确但频次较低"},{name:"实现风险",a:"受浏览器录音与转写质量影响",b:"OCR 边界更清晰，测试样本更稳定"}],recommendation:"先做语音输入的最小闭环，同时保留文本确认作为风险缓冲。",risk:"必须验证真实环境中的转写准确率，否则高频入口会放大错误。"},{question:"先增加新功能还是完善交付文档？",goal:"提高 Demo 转化与团队复用效率",a:"继续增加 AI 功能",b:"完善文档与体验路径",dimensions:[{name:"短期价值",a:"展示面更宽，但理解成本上升",b:"现有价值更容易被看懂和验证"},{name:"长期成本",a:"维护面继续扩大",b:"为后续迭代建立交付基线"}],recommendation:"优先完善交付文档，再用真实反馈决定下一项功能。",risk:"文档优化不能替代对核心流程可用性的验证。"}],
  en: [{question:"Build voice input or image recognition first?",goal:"Maximize first-use value with limited engineering capacity",a:"Prioritize voice input",b:"Prioritize image recognition",dimensions:[{name:"Usage frequency",a:"Spoken requests are frequent and natural",b:"Screenshot use cases are clear but less frequent"},{name:"Implementation risk",a:"Depends on recording and transcription quality",b:"OCR boundaries and test samples are more predictable"}],recommendation:"Build the smallest voice-input loop first and keep transcript confirmation as the risk buffer.",risk:"Validate transcription in real environments; a high-frequency entry point will amplify recognition errors."},{question:"Add another feature or improve product delivery?",goal:"Improve demo conversion and team reuse",a:"Add more AI features",b:"Improve documentation and experience",dimensions:[{name:"Short-term value",a:"Broader feature surface with higher cognitive load",b:"Existing value becomes easier to understand and verify"},{name:"Long-term cost",a:"The maintenance surface keeps growing",b:"Creates a delivery baseline for future iterations"}],recommendation:"Improve delivery first, then use real feedback to choose the next feature.",risk:"Better documentation cannot replace validation of the core workflow."}]
};

export default function DecisionDemoPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Try.decision");
  const common = useTranslations("Try.common");
  const [selected, setSelected] = useState<Case | null>(null);
  return <div className="demo-page site-shell page-pad"><Link href="/try" className="case-back">← {common("back")}</Link><header className="demo-header"><span>{common("local")}</span><h1>{t("title")}</h1><p>{t("description")}</p></header>{!selected ? <div className="decision-choices"><div><p className="section-kicker">{t("choose")}</p><h2>{t("note")}</h2></div><div>{cases[locale].map((item,index)=><button key={item.question} onClick={()=>setSelected(item)}><span>0{index+1}</span><strong>{item.question}</strong><i>{t("analyze")} →</i></button>)}</div></div> : <div className="decision-result"><aside><button onClick={()=>setSelected(null)}>← {t("other")}</button><p className="section-kicker">{t("brief")}</p><h2>{selected.question}</h2><p>{selected.goal}</p><div><span>{t("optionA")}<b>{selected.a}</b></span><span>{t("optionB")}<b>{selected.b}</b></span></div></aside><main><p className="section-kicker">{t("analysis")}</p>{selected.dimensions.map((dimension)=><article key={dimension.name}><h3>{dimension.name}</h3><p><b>A</b>{dimension.a}</p><p><b>B</b>{dimension.b}</p></article>)}<div className="decision-conclusion"><p><b>{t("recommendation")}</b>{selected.recommendation}</p><p><b>{t("risk")}</b>{selected.risk}</p></div><Link href="/projects/ai-decision-copilot" className="button button-ghost">{common("viewCase")}</Link></main></div>}</div>;
}
