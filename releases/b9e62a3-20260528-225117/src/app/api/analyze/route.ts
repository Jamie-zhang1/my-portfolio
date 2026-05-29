import { NextRequest, NextResponse } from "next/server";

const MIMO_BASE_URL = process.env.MIMO_BASE_URL || "https://api.xiaomimimo.com/v1";
const MIMO_API_KEY = process.env.MIMO_API_KEY || "";
const MIMO_MODEL = process.env.MIMO_MODEL || "mimo-v2-pro";

export async function POST(req: NextRequest) {
  if (!MIMO_API_KEY) {
    return NextResponse.json(
      { error: "MIMO_API_KEY 未配置" },
      { status: 500 }
    );
  }

  try {
    const { question, options, style } = await req.json();

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: "请提供问题和至少两个选项" },
        { status: 400 }
      );
    }

    const styleMap: Record<string, string> = {
      normal: "逻辑严密、专业理性",
      simple: "简洁直接、直击要点",
      funny: "轻松幽默、用比喻和段子说明白",
    };

    const optA = options[0];
    const optB = options[1];
    const extraOpts = options.length > 2 ? options.slice(2) : [];
    const extraSection =
      extraOpts.length > 0
        ? `\n补充选项供对比参考（不做深度分析，仅纳入最终建议考量）：\n${extraOpts.map((o: string, i: number) => `- 方案 ${String.fromCharCode(67 + i)}：${o}`).join("\n")}`
        : "";

    const prompt = `# Role
你是一位精通形式逻辑（Formal Logic）与战略规划的决策专家。回复风格：${styleMap[style] || styleMap.normal}。

# Input Data
- 待解决问题：${question}
- 方案 A：${optA}
- 方案 B：${optB}${extraSection}

# Analysis Framework (必须严格执行以下逻辑步骤)
1. **SWOT 态势分析**：对比 A 与 B 的内部优势/劣势，以及外部的机会/威胁。
2. **形式逻辑验证**：应用"逻辑三段论"进行推理。
   - 大前提：该决策场景下的核心成功要素。
   - 小前提：方案 A/B 是否符合该要素。
   - 结论：基于逻辑推演的必然结果。
3. **充分必要条件判断**：分析达成方案 A/B 成功的必要前提是什么。

# Output Format
请严格按以下格式输出：

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

    const response = await fetch(`${MIMO_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MIMO_API_KEY}`,
      },
      body: JSON.stringify({
        model: MIMO_MODEL,
        messages: [
          {
            role: "system",
            content:
              "你是一个逻辑严密的决策辅助系统，输出 Markdown 格式，使用 emoji 增加可读性。",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("MiMo API error:", err);
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
