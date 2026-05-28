export const siteConfig = {
  name: "Jamie Zhang",
  title: "Jamie Zhang — AI 产品实践者",
  description: "个人 AI 产品作品集：展示听到了咩、ProdDoc AI 与 AI Decision Copilot 从需求到可运行原型的实践过程。",
  url: "https://heard-sheep.cloud",
  ogImage: "/screenshots/portfolio/home-desktop.png",
  author: "Jamie Zhang",
  email: null as string | null,
  github: "https://github.com/Jamie-zhang1",
  keywords: ["AI 产品", "Vibe Coding", "产品原型", "Next.js", "TypeScript"] as string[],

  /* ── 体验入口配置 ── */
  // 听到了咩真实产品地址。
  // 开发环境默认指向 localhost:3001/sheep（独立服务）；
  // 部署后使用环境变量 NEXT_PUBLIC_HEARD_SHEEP_URL 或默认 /sheep。
  heardSheepLiveUrl:
    process.env.NEXT_PUBLIC_HEARD_SHEEP_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001/sheep"
      : "/sheep"),
};
