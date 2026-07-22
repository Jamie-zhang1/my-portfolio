import { ArrowUpRight, BriefcaseBusiness, Code2, FileText, Mail } from "lucide-react";
import Image from "next/image";
import { HeroPointerField } from "@/components/home/hero-pointer-field";
import { SectionLink } from "@/components/interaction/section-link";
import { siteConfig } from "@/data/site-config";

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
        { label: "邮箱", href: siteConfig.gmailComposeUrl, icon: Mail },
      ]
    : [
        { label: "GitHub", href: siteConfig.github, icon: Code2 },
        { label: "Heard Sheep", href: siteConfig.heardSheepLiveUrl, icon: BriefcaseBusiness },
        { label: "Resume", href: siteConfig.resume, icon: FileText },
        { label: "Email", href: siteConfig.gmailComposeUrl, icon: Mail },
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
            src="/images/portfolio/jamie-hero-cutout-v9.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 104vw, (max-width: 900px) 82vw, 820px"
          />
          <Image
            className="portrait-color"
            src="/images/portfolio/jamie-hero-cutout-v9.png"
            alt="Jamie Zhang portrait"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 104vw, (max-width: 900px) 82vw, 820px"
          />          <Image
            className="portrait-hover-color"
            src="/images/portfolio/jamie-hero-cutout-v9.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 104vw, (max-width: 900px) 82vw, 820px"
          />          <Image
            className="portrait-hair-tone"
            src="/images/portfolio/jamie-hero-cutout-v9.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={95}
            sizes="(max-width: 600px) 104vw, (max-width: 900px) 82vw, 820px"
          />
        </div>

        <div className="editorial-profile">
          <h2>{statement}</h2>
          <p>{description}</p>
          <SectionLink section="work" className="hero-collaborate">
            {workLabel}<ArrowUpRight size={15} />
          </SectionLink>
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