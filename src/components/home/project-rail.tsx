"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ProjectRailProps = {
  children: ReactNode;
  label: string;
};

export function ProjectRail({ children, label }: ProjectRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = 4;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      const cards = Array.from(rail.querySelectorAll<HTMLElement>(".ref-project-card"));
      const railLeft = rail.getBoundingClientRect().left;
      const next = cards.reduce((best, card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - railLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
      setActive(next);
    };

    rail.addEventListener("scroll", update, { passive: true });
    update();
    return () => rail.removeEventListener("scroll", update);
  }, []);

  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>(".ref-project-card"));
    const next = Math.max(0, Math.min(cards.length - 1, active + direction));
    cards[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActive(next);
  };

  return (
    <div className="ref-project-rail-shell">
      <div className="ref-project-grid" ref={railRef}>{children}</div>
      <div className="ref-project-rail-controls" aria-label={label}>
        <p><strong>{String(active + 1).padStart(2, "0")}</strong><span>/ {String(total).padStart(2, "0")}</span></p>
        <div className="ref-project-progress" aria-hidden="true"><i style={{ width: `${((active + 1) / total) * 100}%` }} /></div>
        <div>
          <button type="button" onClick={() => move(-1)} disabled={active === 0} aria-label="Previous project"><ArrowLeft size={16} /></button>
          <button type="button" onClick={() => move(1)} disabled={active === total - 1} aria-label="Next project"><ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}