import { ArrowUpRight, BriefcaseBusiness, Code2, FileText, Mail } from "lucide-react";
import Image from "next/image";
import { HeroPointerField } from "@/components/home/hero-pointer-field";
import { siteConfig } from "@/data/site-config";
import { Link } from "@/i18n/navigation";

type PortfolioHeroProps = {
  locale: "zh" | "en";
  statement: string;
  description: string;
  workLabel: string;
};

export function PortfolioHero({ locale, statement, description, workLabel }: PortfolioHeroProps) {
  const social = locale === "zh"
    ? [
        { label: "GitHub", href: siteConfig.github, icon: Code2 },
        { label: "Heard Sheep", href: siteConfig.heardSheepLiveUrl, icon: BriefcaseBusiness },
        { label: "简历", href: siteConfig.resume, icon: FileText },
        { label: "邮箱", href: `mailto:${siteConfig.email}`, icon: Mail },
      ]
    : [
        { label: "GitHub", href: siteConfig.github, icon: Code2 },
        { label: "Heard Sheep", href: siteConfig.heardSheepLiveUrl, icon: BriefcaseBusiness },
        { label: "Resume", href: siteConfig.resume, icon: FileText },
        { label: "Email", href: `mailto:${siteConfig.email}`, icon: Mail },
      ];

  return (
    <section className="ref-stage ref-hero-stage" aria-labelledby="portfolio-title">
      <HeroPointerField className="ref-canvas ref-hero-canvas">
        <h1 id="portfolio-title" className="editorial-name" aria-label="Jamie Zhang">
          <span className="editorial-name-word editorial-name-outline">JAMIE</span>
          <span className="editorial-name-word editorial-name-solid">ZHANG</span>
        </h1>

        <div className="editorial-portrait">
          <Image
            className="portrait-mono"
            src="/images/portfolio/jamie-hero-cutout.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 92vw, 720px"
          />
          <Image
            className="portrait-color"
            src="/images/portfolio/jamie-hero-cutout.png"
            alt="Jamie Zhang portrait"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 92vw, 720px"
          />          <Image
            className="portrait-hover-color"
            src="/images/portfolio/jamie-hero-cutout.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 92vw, 720px"
          />          <Image
            className="portrait-hair-tone"
            src="/images/portfolio/jamie-hero-cutout.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 92vw, 720px"
          />
        </div>

        <div className="editorial-profile">
          <h2>{statement}</h2>
          <p>{description}</p>
          <Link href="/#work" className="hero-collaborate">
            {workLabel}<ArrowUpRight size={15} />
          </Link>
        </div>

        <nav className="editorial-socials" aria-label={locale === "zh" ? "个人链接" : "Profile links"}>
          {social.map((item) => {
            const Icon = item.icon;
            const external = item.href.startsWith("http");
            return (
              <a href={item.href} key={item.label} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                <Icon size={14} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </HeroPointerField>
    </section>
  );
}