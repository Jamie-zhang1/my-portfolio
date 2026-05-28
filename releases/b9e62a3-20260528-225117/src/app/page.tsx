import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/site-config";

/* ── 首页配置 ──────────────────────────────────────
 * 修改个人介绍：编辑 src/data/profile.ts
 * 修改项目顺序 / 首页摘要 / 首页图片：编辑 src/data/projects.ts
 * 修改工作方式 / 核心能力：直接编辑下方 workingMethod / capabilities
 * ─────────────────────────────────────────────── */

const workingMethod = [
  { step: "01", title: "发现问题", description: "从真实业务场景和用户痛点出发，识别值得用 AI 产品解决的问题。" },
  { step: "02", title: "设计流程", description: "梳理产品流程、交互逻辑和信息架构，形成可验证的产品假设。" },
  { step: "03", title: "AI 辅助构建", description: "使用 Vibe Coding 方式快速构建可体验的产品原型，验证核心交互。" },
  { step: "04", title: "验证迭代", description: "通过实际使用和反馈迭代产品，优化体验和功能。" },
  { step: "05", title: "部署展示", description: "完成部署、文档和展示，形成完整的产品实践案例。" },
];

const capabilities = [
  { number: "01", title: "AI 产品设计", description: "从需求洞察到产品原型，将 AI 能力转化为可体验的交互产品。" },
  { number: "02", title: "Vibe Coding", description: "快速原型构建，用最短时间验证产品假设和交互设计。" },
  { number: "03", title: "多模态能力接入", description: "集成语音、图像、文本等多种 AI 能力，构建完整的交互体验。" },
  { number: "04", title: "产品文档与交付", description: "从产品说明书到操作文档，构建可复用的文档生成工作流。" },
];

export default function Home() {
  const featuredProject = projects.find((p) => p.displayMode === "featured");
  const secondaryProjects = projects.filter((p) => p.displayMode === "secondary");
  const experimentProjects = projects.filter((p) => p.displayMode === "experiment");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
        <div className="animate-fade-in">
          <p className="label-caps mb-8 tracking-widest">AI Product · Vibe Coding</p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-ink leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
          >
            {profile.name}
          </h1>
          <p
            className="mt-3 text-lg sm:text-xl text-ink-muted"
            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
          >
            {profile.role}
          </p>
          <div className="mt-8 max-w-2xl">
            <p className="text-body text-base sm:text-lg leading-relaxed">
              {profile.bio[0]}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-5 animate-fade-in-delay-1">
          <a
            href="https://github.com/Jamie-zhang1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <span className="text-ink-faint text-sm tracking-wide">
            jamie-zhang1
          </span>
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Selected Works */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="flex items-baseline gap-4 mb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold text-ink"
            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
          >
            精选作品
          </h2>
          <span className="label-caps">Selected Works</span>
        </div>

        <div className="space-y-24">
          {/* ── 01 / Featured 主项目：横向布局 ── */}
          {featuredProject && (
            <div className="animate-fade-in-delay-1">
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* 左侧：文字 */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <Link href={featuredProject.href} className="group block">
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className="text-6xl sm:text-7xl font-bold text-ink-faint/30 leading-none"
                        style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                      >
                        {featuredProject.number}
                      </span>
                      <div>
                        <p className="label-caps text-xs">{featuredProject.englishSubtitle}</p>
                        <h3
                          className="text-2xl sm:text-3xl font-bold text-ink mt-1 group-hover:text-accent transition-colors"
                          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                        >
                          {featuredProject.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-body text-sm sm:text-base leading-relaxed mb-4">
                      {featuredProject.homepageSummary}
                    </p>
                    <p className="text-xs text-ink-muted mb-5">
                      从信息接收、AI 分析到任务管理，验证多模态能力进入真实工作流的产品闭环。
                    </p>
                  </Link>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProject.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium text-ink-muted bg-paper-warm border border-line-light rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {siteConfig.heardSheepLiveUrl && (
                      <a
                        href={siteConfig.heardSheepLiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
                      >
                        立即体验
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                    <Link
                      href={featuredProject.href}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-line-light text-sm font-medium text-ink rounded-sm hover:bg-surface transition-colors"
                    >
                      查看案例
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* 右侧：手机截图组合 */}
                <div className="lg:col-span-7">
                  <div className="relative flex items-end gap-3 justify-center lg:justify-start">
                    {/* 主图 */}
                    <div className="relative w-[180px] sm:w-[200px] lg:w-[220px] flex-shrink-0 rounded-xl overflow-hidden border border-line-light shadow-sm bg-surface-alt">
                      <Image
                        src={featuredProject.homepageImages[0].src}
                        alt={featuredProject.homepageImages[0].alt}
                        width={220}
                        height={480}
                        className="w-full h-auto"
                        sizes="(max-width: 1024px) 200px, 220px"
                      />
                    </div>
                    {/* 辅助图 1 */}
                    {featuredProject.homepageImages[1] && (
                      <div className="relative w-[140px] sm:w-[160px] lg:w-[180px] flex-shrink-0 rounded-xl overflow-hidden border border-line-light shadow-sm bg-surface-alt -mb-4 lg:-mb-8">
                        <Image
                          src={featuredProject.homepageImages[1].src}
                          alt={featuredProject.homepageImages[1].alt}
                          width={180}
                          height={390}
                          className="w-full h-auto"
                          sizes="(max-width: 1024px) 160px, 180px"
                        />
                      </div>
                    )}
                    {/* 辅助图 2 */}
                    {featuredProject.homepageImages[2] && (
                      <div className="hidden sm:block relative w-[120px] lg:w-[140px] flex-shrink-0 rounded-xl overflow-hidden border border-line-light shadow-sm bg-surface-alt -mb-8 lg:-mb-12">
                        <Image
                          src={featuredProject.homepageImages[2].src}
                          alt={featuredProject.homepageImages[2].alt}
                          width={140}
                          height={305}
                          className="w-full h-auto"
                          sizes="(max-width: 1024px) 120px, 140px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* ── 分隔线 ── */}
          {featuredProject && secondaryProjects.length > 0 && (
            <hr className="line-editorial" />
          )}

          {/* ── 02 / Secondary 项目：反向横向布局 ── */}
          {secondaryProjects.map((project) => (
            <div key={project.number} className="animate-fade-in-delay-2">
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* 左侧：单张截图 */}
                <Link href={project.href} className="lg:col-span-7 group block">
                  <div className="screenshot-frame aspect-[16/9] relative overflow-hidden bg-surface-alt rounded-sm">
                    <Image
                      src={project.homepageImages[0]?.src || project.screenshot || ""}
                      alt={project.homepageImages[0]?.alt || project.screenshotAlt}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  </div>
                </Link>

                {/* 右侧：文字 */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <Link href={project.href} className="group block">
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className="text-5xl sm:text-6xl font-bold text-ink-faint/25 leading-none"
                        style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                      >
                        {project.number}
                      </span>
                      <div>
                        <p className="label-caps text-xs">{project.englishSubtitle}</p>
                        <h3
                          className="text-xl sm:text-2xl font-bold text-ink mt-1 group-hover:text-accent transition-colors"
                          style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                        >
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-body text-sm leading-relaxed mb-5">
                      {project.homepageSummary}
                    </p>
                  </Link>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium text-ink-muted bg-paper-warm border border-line-light rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {project.tryPath && (
                      <a
                        href={project.tryPath}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
                      >
                        {project.tryLabel}
                      </a>
                    )}
                    <Link
                      href={project.href}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-line-light text-sm font-medium text-ink rounded-sm hover:bg-surface transition-colors"
                    >
                      查看案例
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}

          {/* ── 分隔线 ── */}
          {experimentProjects.length > 0 && (
            <hr className="line-editorial" />
          )}

          {/* ── 03 / Experiment 项目：轻量条目 ── */}
          {experimentProjects.map((project) => (
            <article key={project.number} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 animate-fade-in-delay-3">
                <Link href={project.href} className="group flex items-center gap-4 flex-shrink-0">
                  <span
                    className="text-3xl font-bold text-ink-faint/20 leading-none"
                    style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                  >
                    {project.number}
                  </span>
                  <h3
                    className="text-lg font-bold text-ink group-hover:text-accent transition-colors"
                    style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                  >
                    {project.title}
                  </h3>
                </Link>
                <p className="text-sm text-ink-light flex-1">
                  {project.homepageSummary}
                </p>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium text-ink-muted bg-paper-warm border border-line-light rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.tryPath && (
                    <a
                      href={project.tryPath}
                      className="text-sm text-ink-muted hover:text-ink transition-colors whitespace-nowrap"
                    >
                      体验实验
                    </a>
                  )}
                  <Link href={project.href} className="flex items-center gap-1 text-sm text-accent hover:text-ink transition-colors whitespace-nowrap">
                    <span>详情</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Working Method */}
      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="flex items-baseline gap-4 mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold text-ink"
            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
          >
            工作方式
          </h2>
          <span className="label-caps">Working Method</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          {workingMethod.map((item, index) => (
            <div
              key={item.step}
              className={`py-5 lg:py-0 lg:px-6 ${
                index < workingMethod.length - 1
                  ? "border-b lg:border-b-0 lg:border-r border-line-light"
                  : ""
              }`}
            >
              <span className="number-label block mb-3">{item.step}</span>
              <h3 className="font-semibold text-ink mb-2 text-sm">{item.title}</h3>
              <p className="text-sm text-ink-light leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* Capabilities */}
      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="flex items-baseline gap-4 mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold text-ink"
            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
          >
            核心能力
          </h2>
          <span className="label-caps">Capabilities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.title} className="bg-surface border border-line-light rounded-sm p-6">
              <span className="number-label mb-3 block">{cap.number}</span>
              <h3 className="font-semibold text-ink mb-2">{cap.title}</h3>
              <p className="text-sm text-ink-light leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="line-editorial max-w-6xl mx-auto" />

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2
              className="text-2xl font-bold text-ink"
              style={{ fontFamily: "var(--font-noto-serif-sc)" }}
            >
              关于我
            </h2>
            <p className="label-caps mt-1">About</p>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {profile.bio.map((paragraph, index) => (
              <p key={index} className="text-body text-base sm:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-4">
              {profile.techStack.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm font-medium text-ink-light bg-surface border border-line-light rounded-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-surface border border-line-light rounded-sm p-8 sm:p-10 text-center">
          <p className="label-caps mb-3">Get In Touch</p>
          <h3
            className="text-xl sm:text-2xl font-bold text-ink mb-3"
            style={{ fontFamily: "var(--font-noto-serif-sc)" }}
          >
            期待交流
          </h3>
          <p className="text-body max-w-md mx-auto mb-6 text-sm">
            如果你对我的作品感兴趣，或有 AI
            产品方向的合作想法，欢迎联系。
          </p>
          <a
            href="https://github.com/Jamie-zhang1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper text-sm font-medium rounded-sm hover:bg-ink-light transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
