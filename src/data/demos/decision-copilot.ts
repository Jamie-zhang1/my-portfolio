/* ============================================================
 * AI Decision Copilot — 实验 Demo 数据
 * ----------------------------------------------------------
 * 修改预设案例：编辑 presetCases 数组
 * 修改评估维度：编辑各案例中的 dimensions
 * ============================================================ */

export interface DecisionCase {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  goal: string;
  dimensions: { name: string; analysisA: string; analysisB: string }[];
  recommendation: string;
  riskNote: string;
}

export const presetCases: DecisionCase[] = [
  {
    id: "deploy",
    question: "作品集网站应优先部署到 Vercel 还是自有服务器？",
    optionA: "部署到 Vercel",
    optionB: "部署到自有服务器",
    goal: "选择一个稳定、可控且适合个人作品集的部署方案",
    dimensions: [
      { name: "部署难度", analysisA: "零配置，Git push 即部署", analysisB: "需要自行配置 Nginx、SSL、CI/CD" },
      { name: "访问速度", analysisA: "全球 CDN，海外访问快", analysisB: "取决于服务器位置和带宽" },
      { name: "成本", analysisA: "免费额度足够个人使用", analysisB: "服务器有固定月费" },
      { name: "可控性", analysisA: "平台规则限制，不能完全自定义", analysisB: "完全可控，可部署任意服务" },
    ],
    recommendation: "如主要面向海外招聘方展示，优先 Vercel；如需要自定义后端或国内访问优化，选自有服务器。",
    riskNote: "Vercel 免费版有用量限制；自有服务器需要持续维护。",
  },
  {
    id: "mvp-scope",
    question: "新产品首版应优先实现完整功能还是验证核心流程？",
    optionA: "实现完整功能",
    optionB: "验证核心流程",
    goal: "以最低成本确认产品方向是否值得继续投入",
    dimensions: [
      { name: "开发周期", analysisA: "数月，需要完整设计与开发", analysisB: "1-4 周，聚焦核心交互" },
      { name: "用户反馈质量", analysisA: "功能多但可能分散注意力", analysisB: "聚焦核心场景，反馈更精准" },
      { name: "资源消耗", analysisA: "高，前端后端测试运维全面投入", analysisB: "低，可用 Mock 和简化方案" },
      { name: "风险", analysisA: "方向错了浪费大量工作", analysisB: "快速验证，及时调整" },
    ],
    recommendation: "首版优先验证核心流程。用最小可用版本确认用户是否真正需要这个功能，再逐步扩展。",
    riskNote: "核心流程过于简化可能导致用户无法体验真实价值；需要找到平衡点。",
  },
  {
    id: "input-mode",
    question: "移动端产品应优先采用录音入口还是文本入口？",
    optionA: "录音入口优先",
    optionB: "文本入口优先",
    goal: "选择最符合目标用户使用场景的主要输入方式",
    dimensions: [
      { name: "使用场景", analysisA: "适合会议、行走、开车等双手不便的场景", analysisB: "适合安静环境、需要精确表达的场景" },
      { name: "输入效率", analysisA: "说话速度快，但需要转写处理", analysisB: "打字慢，但内容更精确" },
      { name: "技术复杂度", analysisA: "需要语音识别、降噪等额外能力", analysisB: "纯文本处理，技术简单" },
      { name: "用户接受度", analysisA: "新颖，但部分用户不习惯对着手机说话", analysisB: "传统，所有用户都能使用" },
    ],
    recommendation: "如果目标用户以职场人士为主，录音入口更贴合「口头交代」场景；但应同时支持文本作为降级方案。",
    riskNote: "语音识别准确率受环境噪音影响；部分用户对录音功能有隐私顾虑。",
  },
];
