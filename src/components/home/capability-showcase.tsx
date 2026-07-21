"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/home/project-artwork";

type ProjectSlug = "heard-sheep" | "researchflow-agent" | "proddoc-ai" | "ai-decision-copilot";

type CapabilityItem = {
  title: string;
  note: string;
  eyebrow: string;
  slug: ProjectSlug;
};

export function CapabilityShowcase({ items }: { items: CapabilityItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="ref-capability-list">
      {items.map((item, index) => {
        const isActive = index === active;
        return (
          <article className={isActive ? "is-featured" : ""} key={item.title}>
            <button
              type="button"
              className="ref-capability-trigger"
              aria-expanded={isActive}
              onClick={() => setActive(index)}
            >
              <span>0{index + 1}</span>
              <span className="ref-capability-copy">
                <small>{item.eyebrow}</small>
                <strong>{item.title}</strong>
                <em>{item.note}</em>
              </span>
              <ArrowUpRight size={22} />
            </button>
            <div className="ref-capability-panel" aria-hidden={!isActive}>
              <ProjectArtwork slug={item.slug} />
            </div>
          </article>
        );
      })}
    </div>
  );
}