import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site-config";
import { problemScenarios, productFlow, problemNote } from "@/data/content/heard-sheep";

const project = getProjectBySlug("heard-sheep")!;

export default function HeardSheepPage() {
  return (
    <div className="min-h-screen">
      <div className="site-shell pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-ink">
          <span aria-hidden="true">←</span>
          返回作品集
        </Link>
      </div>

      <section className="site-shell py-8 sm:py-12">
        <div className="grid gap-8 overflow-hidden rounded-[8px] border border-[var(--signal-lime-border)] bg-[var(--signal-lime-soft)] p-5 shadow-sm sm:p-8 lg:grid-cols-[0.86fr_1.14fr] lg:p-10">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="status-pill">LIVE PRODUCT</span>
                <span className="route-pill bg-white/72">/sheep</span>
              </div>
              <p className="font-mono text-7xl font-black text-ink/10">{project.number}</p>
              <p className="label-caps mt-4">{project.englishSubtitle}</p>
              <h1 className="heading-serif mt-2 text-5xl text-ink sm:text-6xl">{project.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-ink-light">
                {project.description}
              </p>
            </div>

            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="chip bg-white/78">
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
                    className="action-primary"
                  >
                    立即体验
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-secondary bg-white/72"
                  >
                    源码
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-center gap-3">
            {project.homepageImages.slice(0, 3).map((image, index) => (
              <div
                key={image.src}
                className={`device-frame ${
                  index === 0
                    ? "w-[178px] sm:w-[210px] lg:w-[240px]"
                    : index === 1
                      ? "w-[142px] translate-y-5 sm:w-[178px] lg:w-[205px]"
                      : "hidden w-[130px] translate-y-10 sm:block lg:w-[170px]"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={390}
                  height={844}
                  className="h-auto w-full"
                  priority={index === 0}
                  sizes="(max-width: 640px) 46vw, 240px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell grid gap-6 pb-12 lg:grid-cols-3">
        <div className="surface-panel p-6">
          <p className="eyebrow mb-4">Problem</p>
          <h2 className="heading-serif text-3xl text-ink">问题场景</h2>
          <p className="text-body mt-4 text-sm">{problemNote}</p>
        </div>
        <div className="surface-panel p-6 lg:col-span-2">
          <div className="grid gap-4">
            {problemScenarios.map((scenario, index) => (
              <div key={scenario} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[60px_1fr]">
                <span className="number-label">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-7 text-ink-light">{scenario}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-clean/78">
        <div className="site-shell grid gap-10 py-14 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow mb-3">Flow</p>
            <h2 className="heading-serif text-4xl text-ink">核心流程</h2>
            <p className="text-body mt-5 max-w-sm text-sm">
              从输入到确认再到任务管理，每一步都先让用户可校对，再进入 AI 处理。
            </p>
          </div>
          <div className="grid gap-3">
            {productFlow.map((item) => (
              <div key={item.step} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[72px_1fr]">
                <span className="route-pill justify-center">{item.step}</span>
                <p className="text-sm leading-7 text-ink-light">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {project.screenshots && project.screenshots.length > 0 && (
        <section className="site-shell page-pad">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3">Screenshots</p>
              <h2 className="heading-serif text-4xl text-ink">真实界面</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ink-muted">
              所有图片均来自真实 heard-sheep production preview 或正式线上环境，不使用伪造界面。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {project.screenshots.map((screenshot, index) => (
              <div key={screenshot.src}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="number-label">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-right text-xs font-bold text-ink-muted">{screenshot.caption}</p>
                </div>
                <div className="screenshot-frame bg-paper-clean p-2">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={390}
                    height={844}
                    className="h-auto w-full rounded-[12px]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="site-shell grid gap-10 border-t border-line py-14 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="eyebrow mb-3">Features</p>
          <h2 className="heading-serif text-4xl text-ink">产品能力</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {project.features.map((feature, index) => (
            <div key={feature.title} className="surface-panel p-5">
              <span className="number-label">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-bold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell grid gap-10 border-t border-line py-14 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="eyebrow mb-3">Technical</p>
          <h2 className="heading-serif text-4xl text-ink">技术实现</h2>
        </div>
        <div className="grid gap-6">
          {project.pages.length > 0 && (
            <div className="surface-panel p-5">
              <h3 className="mb-4 font-bold text-ink">页面结构</h3>
              <div className="flex flex-wrap gap-2">
                {project.pages.map((page) => (
                  <span key={page.path} className="route-pill">
                    {page.path}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {project.techStack.map((category) => (
              <div key={category.category} className="surface-panel p-5">
                <h3 className="font-bold text-ink">{category.category}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span key={item} className="chip">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="dark-panel p-6">
            <p className="label-caps text-paper/55">Status</p>
            <p className="mt-3 text-sm leading-7 text-paper/76">{project.status}</p>
          </div>
        </div>
      </section>

      <section className="site-shell flex items-center justify-between border-t border-line py-10">
        <span className="text-sm font-bold text-ink-faint">← 已是第一个项目</span>
        <Link href="/projects/proddoc-ai" className="text-sm font-bold text-accent hover:text-ink">
          下一个：ProdDoc AI →
        </Link>
      </section>
    </div>
  );
}
