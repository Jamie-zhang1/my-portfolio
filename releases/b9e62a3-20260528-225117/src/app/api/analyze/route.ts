import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.MIMO_BASE_URL || "https://token-plan-cn.xiaomimimo.com/v1";
const API_KEY = process.env.MIMO_API_KEY || "";
const MODEL = process.env.MIMO_MODEL || "mimo-v2.5";

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "MIMO_API_KEY 未配置" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { question, options, style, mode, image } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: "请描述你的问题" }, { status: 400 });
    }

    // Style mapping
    const styleMap: Record<string, string> = {
      normal: "逻辑严密、专业理性",
      simple: "简洁直接、直击要点",
      funny: "轻松幽默、用比喻和段子说明白",
    };
    const styleDesc = styleMap[style] || styleMap.normal;

    // Build user message content (supports multimodal)
    const userContent: (
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    )[] = [];

    // Image support
    if (image && typeof image === "string") {
      const dataUrl = image.startsWith("data:")
        ? image
        : `data:image/jpeg;base64,${image}`;
      userContent.push({ type: "image_url", image_url: { url: dataUrl } });
    }

    let prompt: string;

    if (mode === "auto" || !options || options.length === 0) {
      // AI Auto-suggest mode: user only provides question, AI generates options and analysis
      prompt = `# Role
你是一位精通形式逻辑（Formal Logic）与战略规划的决策专家。回复风格：${styleDesc}。

# Input
待解决问题：${question.trim()}
${image ? "用户上传了一张相关图片，请结合图片内容分析。" : ""}

# Task
用户没有提供具体选项，请你：
1. 根据问题情境，自行判断 2-4 个最合理的备选方案
2. 对每个方案进行分析
3. 给出最终建议

# Output Format
## 🎯 问题洞察
（简要分析这个问题的核心矛盾和关键考量因素）

## 📋 推荐方案
（列出你推导出的 2-4 个方案，每个方案一句话概括）

## 📊 方案对比分析
（对每个方案进行 SWOT 或优劣势分析）

## 🔍 逻辑推演
- 大前提：
- 小前提：
- 结论：

## ✅ 最终建议
（给出首选方案及执行理由）`;
    } else {
      // Standard comparison mode
      const optA = options[0];
      const optB = options[1];
      const extraOpts = options.length > 2 ? options.slice(2) : [];
      const extraSection =
        extraOpts.length > 0
          ? `\n补充选项供对比参考（不做深度分析，仅纳入最终建议考量）：\n${extraOpts.map((o: string, i: number) => `- 方案 ${String.fromCharCode(67 + i)}：${o}`).join("\n")}`
          : "";

      prompt = `# Role
你是一位精通形式逻辑（Formal Logic）与战略规划的决策专家。回复风格：${styleDesc}。

# Input Data
- 待解决问题：${question.trim()}
- 方案 A：${optA}
- 方案 B：${optB}${extraSection}
${image ? "- 用户上传了一张相关图片，请结合图片内容分析。" : ""}

# Analysis Framework
1. **SWOT 态势分析**：对比各方案的内部优势/劣势，以及外部的机会/威胁。
2. **形式逻辑验证**：应用"逻辑三段论"进行推理。
3. **充分必要条件判断**：分析达成各方案成功的必要前提。

# Output Format
## 🧠 决策逻辑建模
（用逻辑代数语言简述）

## 📊 方案 A 深度剖析
- 优势 (S)：
- 劣势 (W)：
- 机会 (O)：
- 威胁 (T)：

## 📊 方案 B 深度剖析
- 优势 (S)：
- 劣势 (W)：
- 机会 (O)：
- 威胁 (T)：

## 🔍 三段论逻辑推演
- 大前提：
- 小前提：
- 结论：

## ✅ 最终决策建议
（给出确定性选择偏好及执行理由）`;
    }

    userContent.push({ type: "text", text: prompt });

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "你是一个逻辑严密的决策辅助系统，输出 Markdown 格式，使用 emoji 增加可读性。分析要有深度，不要泛泛而谈。",
          },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("MiMo API error:", response.status, err);
      return NextResponse.json(
        { error: `AI 服务异常 (${response.status})` },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Analyze error:", e);
    return NextResponse.json({ error: "服务内部错误" }, { status: 500 });
  }
}
