"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ProjectRailProps = {
  children: ReactNode;
  label: string;
};

export function ProjectRail({ children, label }: ProjectRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const autoCenterLockRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const total = 4;

  const centerCard = (card: HTMLElement, index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2;
    autoCenterLockRef.current = true;
    if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current);
    rail.scrollTo({
      left: Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth)),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    unlockTimerRef.current = window.setTimeout(() => { autoCenterLockRef.current = false; }, prefersReducedMotion ? 0 : 760);
    setActive(index);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = () => Array.from(rail.querySelectorAll<HTMLElement>(".ref-project-card"));
    const update = () => {
      const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      const next = cards().reduce((best, card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
      setActive(next);
    };
    const autoCenter = (event: Event) => {
      if (autoCenterLockRef.current) return;
      if (!window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)").matches) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".ref-project-card") : null;
      if (!target || !rail.contains(target)) return;
      const index = cards().indexOf(target);
      if (index >= 0) centerCard(target, index);
    };
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".ref-project-card") : null;
      if (target && event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
      autoCenter(event);
    };

    rail.addEventListener("scroll", update, { passive: true });
    rail.addEventListener("mouseover", handleMouseOver);
    rail.addEventListener("focusin", autoCenter);
    update();
    return () => {
      rail.removeEventListener("scroll", update);
      rail.removeEventListener("mouseover", handleMouseOver);
      rail.removeEventListener("focusin", autoCenter);
      if (unlockTimerRef.current !== null) window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>(".ref-project-card"));
    const next = Math.max(0, Math.min(cards.length - 1, active + direction));
    const card = cards[next];
    if (card) centerCard(card, next);
  };

  return (
    <div className="ref-project-rail-shell" id="project-list">
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