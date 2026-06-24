"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type Form = { productName: string; productType: string; targetUsers: string; modules: string; docType: string };

export default function ProddocDemoPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Try.proddoc");
  const common = useTranslations("Try.common");
  const types = t.raw("types") as string[];
  const docs = t.raw("docs") as string[];
  const [form, setForm] = useState<Form>({ productName: locale === "zh" ? "智能客户工作台" : "Smart Customer Workspace", productType: types[0], targetUsers: locale === "zh" ? "客户成功与产品运营团队" : "Customer success and product operations teams", modules: locale === "zh" ? "客户档案、任务协作、数据看板" : "Customer profiles, task collaboration, analytics", docType: docs[0] });
  const [result, setResult] = useState<string | null>(null);
  const generate = () => setResult(locale === "zh" ? `${form.productName}\n\n一、产品概览\n${form.productName} 是一款面向${form.targetUsers}的${form.productType}。\n\n二、核心模块\n${form.modules}\n\n三、使用流程\n1. 完成基础配置\n2. 进入核心工作区\n3. 检查并导出${form.docType}\n\n四、验收建议\n确认权限、异常状态与关键任务均有明确反馈。` : `${form.productName}\n\n1. Product overview\n${form.productName} is a ${form.productType} for ${form.targetUsers}.\n\n2. Core modules\n${form.modules}\n\n3. Primary workflow\n1) Complete the initial setup\n2) Enter the core workspace\n3) Review and export the ${form.docType}\n\n4. Acceptance guidance\nVerify permissions, failure states and feedback for each critical task.`);
  const field = (label: string, key: keyof Form, control?: "select") => <label><span>{label}</span>{control === "select" ? <select value={form[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})}>{(key === "productType" ? types : docs).map((value)=><option key={value}>{value}</option>)}</select> : <input value={form[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})}/>}</label>;
  return <div className="demo-page site-shell page-pad"><Link href="/try" className="case-back">← {common("back")}</Link><header className="demo-header"><span>{common("local")}</span><h1>{t("title")}</h1><p>{t("description")}</p></header><div className="demo-workspace"><section><p className="section-kicker">{common("input")}</p>{field(t("productName"),"productName")}{field(t("productType"),"productType","select")}{field(t("targetUsers"),"targetUsers")}{field(t("modules"),"modules")}{field(t("docType"),"docType","select")}<button className="button button-primary" onClick={generate}>{result ? t("regenerate") : t("generate")}</button></section><section><p className="section-kicker">{common("output")}</p><h2>{t("preview")}</h2>{result ? <><pre>{result}</pre><div className="demo-actions"><button className="button button-ghost" onClick={()=>navigator.clipboard.writeText(result)}>{t("copy")}</button><Link href="/projects/proddoc-ai" className="button button-ghost">{common("viewCase")}</Link></div></> : <div className="demo-empty">{t("empty")}</div>}</section></div></div>;
}
