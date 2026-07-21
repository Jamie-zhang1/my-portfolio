import Image from "next/image";

type ArtworkSlug = "researchflow-agent" | "proddoc-ai" | "ai-decision-copilot";
type ProjectSlug = ArtworkSlug | "heard-sheep";

const artwork: Record<ArtworkSlug, { label: string; screens: { src: string; alt: string }[] }> = {
  "researchflow-agent": {
    label: "SOURCE / EVIDENCE / OUTLINE",
    screens: [{ src: "/projects/researchflow-agent/workspace.png", alt: "ResearchFlow Agent live workspace" }],
  },
  "proddoc-ai": {
    label: "INPUT / STRUCTURE / DOCUMENT",
    screens: [
      { src: "/screenshots/portfolio/proddoc-demo-before.png", alt: "ProdDoc AI project input" },
      { src: "/screenshots/portfolio/proddoc-demo-after.png", alt: "ProdDoc AI generated document" },
    ],
  },
  "ai-decision-copilot": {
    label: "QUESTION / OPTIONS / RISKS",
    screens: [
      { src: "/screenshots/portfolio/copilot-demo-select.png", alt: "AI Decision Copilot option input" },
      { src: "/screenshots/portfolio/copilot-demo-result.png", alt: "AI Decision Copilot analysis result" },
    ],
  },
};

export function ProjectArtwork({ slug }: { slug: ProjectSlug }) {
  if (slug === "heard-sheep") {
    return (
      <div className="project-artwork project-artwork-heard-sheep" aria-label="VOICE / PLAN / ACTION">
        <div className="heard-sheep-art-brand" aria-hidden="true">
          <Image src="/project-icons/heard-sheep.svg" alt="" width={34} height={34} />
          <span>HEARD SHEEP</span>
        </div>
        <p className="project-artwork-label" aria-hidden="true">VOICE / PLAN / ACTION</p>
        <figure className="heard-sheep-art-screen heard-sheep-art-screen-main">
          <Image src="/projects/heard-sheep/showcase-20260721-home.png" alt="Heard Sheep redesigned home screen" fill quality={95} sizes="(max-width: 700px) 54vw, 320px" />
        </figure>
        <div className="heard-sheep-art-support">
          <figure className="heard-sheep-art-screen heard-sheep-art-screen-analysis">
            <Image src="/projects/heard-sheep/showcase-20260721-analysis.png" alt="Heard Sheep redesigned analysis screen" fill quality={95} sizes="(max-width: 700px) 38vw, 240px" />
          </figure>
          <figure className="heard-sheep-art-screen heard-sheep-art-screen-tasks">
            <Image src="/projects/heard-sheep/showcase-20260721-tasks.png" alt="Heard Sheep redesigned task list" fill quality={95} sizes="(max-width: 700px) 38vw, 240px" />
          </figure>
        </div>
        <div className="heard-sheep-art-flow" aria-hidden="true"><span>VOICE</span><i /><span>PLAN</span><i /><span>ACTION</span></div>
      </div>
    );
  }

  const item = artwork[slug];
  return (
    <div className={`project-artwork project-artwork-${slug}`} aria-label={item.label}>
      <p className="project-artwork-label" aria-hidden="true">{item.label}</p>
      <div className="project-artwork-grid" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="project-artwork-screens">
        {item.screens.map((screen, index) => (
          <figure className={`project-artwork-screen project-artwork-screen-${index + 1}`} key={screen.src}>
            <span>0{index + 1}</span>
            <div><Image src={screen.src} alt={screen.alt} fill quality={95} sizes="(max-width: 700px) 88vw, 560px" /></div>
          </figure>
        ))}
      </div>
      {slug === "researchflow-agent" ? <div className="researchflow-art-cards" aria-hidden="true"><span>01 SOURCE</span><span>02 EVIDENCE</span><span>03 OUTLINE</span></div> : null}
    </div>
  );
}