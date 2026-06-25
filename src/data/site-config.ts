export const siteConfig = {
  name: "Jamie Zhang",
  title: "Jamie Zhang — 个人项目记录",
  description: "Jamie Zhang 的个人主页：记录 AI 工具尝试、网页搭建和学习实践。",
  url: "https://heard-sheep.cloud",
  ogImage: "/screenshots/portfolio/home-desktop.png",
  author: "Jamie Zhang",
  email: "zhangjiangmin0902@gmail.com",
  github: "https://github.com/Jamie-zhang1",
  resume: "/resume-jamie-zhang.pdf",
  keywords: ["Vibe Coding", "AI 工具", "项目记录", "Next.js", "TypeScript"] as string[],

  /* ── Heard Sheep 入口配置 ── */
  // 听到了咩页面地址。
  // 开发环境默认指向 localhost:3001/sheep（独立服务）；
  // 部署后使用环境变量 NEXT_PUBLIC_HEARD_SHEEP_URL 或默认 /sheep。
  heardSheepLiveUrl:
    process.env.NEXT_PUBLIC_HEARD_SHEEP_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001/sheep"
      : "/sheep"),
};
