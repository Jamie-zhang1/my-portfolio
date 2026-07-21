const publicEmail = "zhangjiangmin0902@gmail.com";

export const siteConfig = {
  name: "Jamie Zhang",
  title: "Jamie Zhang｜AI 产品个人作品集",
  description: "Jamie Zhang 的个人作品集：展示 AI 产品、Agent 工作流和可交互原型实践。",
  url: "https://heard-sheep.cloud",
  ogImage: "/screenshots/portfolio/home-desktop.png",
  author: "Jamie Zhang",
  email: publicEmail,
  gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(publicEmail)}`,
  github: "https://github.com/Jamie-zhang1",
  resume: "/resume-jamie-zhang.pdf",
  keywords: ["AI 产品", "Agent 工作流", "Vibe Coding", "Next.js", "TypeScript"] as string[],

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
