"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

export type ProjectCarouselItem = {
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  positioning: string;
  problem: string;
  outcome: string;
  capabilities: string[];
};

type ProjectCarouselLabels = {
  problem: string;
  built: string;
  viewCase: string;
  previous: string;
  next: string;
  progress: string;
};

export function ProjectCarousel({ items, labels }: { items: ProjectCarouselItem[]; labels: ProjectCarouselLabels }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [canMove, setCanMove] = useState({ previous: false, next: items.length > 1 });

  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    const nearest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft - track.scrollLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });

    setCurrent(nearest.index);
    setCanMove({
      previous: track.scrollLeft > 4,
      next: track.scrollLeft < track.scrollWidth - track.clientWidth - 4,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(track);
    track.addEventListener("scroll", updatePosition, { passive: true });

    return () => {
      resizeObserver.disconnect();
      track.removeEventListener("scroll", updatePosition);
    };
  }, [updatePosition]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    const target = cards[Math.min(Math.max(current + direction, 0), cards.length - 1)];
    if (!target) return;

    track.scrollTo({
      left: target.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div className="project-carousel">
      <div ref={trackRef} className="project-carousel-track" aria-label={labels.progress} tabIndex={0}>
        {items.map((item, index) => (
          <Link
            className="project-carousel-card"
            href={`/projects/${item.slug}`}
            key={item.slug}
            aria-label={`${labels.viewCase}: ${item.title}`}
          >
            <article className="project-carousel-card-body">
              <div className="project-carousel-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.eyebrow}</span>
              </div>
              <div className="project-carousel-title">
                <p>{item.subtitle}</p>
                <h3>{item.title}</h3>
                <p>{item.positioning}</p>
              </div>
              <dl className="project-carousel-facts">
                <div><dt>{labels.problem}</dt><dd>{item.problem}</dd></div>
                <div><dt>{labels.built}</dt><dd>{item.outcome}</dd></div>
              </dl>
              <div className="project-carousel-tags">
                {item.capabilities.map((capability) => <span key={capability}>{capability}</span>)}
              </div>
              <span className="project-carousel-link">{labels.viewCase}<ArrowUpRight size={15} /></span>
            </article>
          </Link>
        ))}
      </div>

      <div className="project-carousel-controls">
        <div className="project-carousel-progress" aria-hidden="true">
          <span style={{ width: `${((current + 1) / items.length) * 100}%` }} />
        </div>
        <span className="project-carousel-count" aria-live="polite">
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <div className="project-carousel-buttons">
          <button type="button" onClick={() => move(-1)} disabled={!canMove.previous} aria-label={labels.previous}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => move(1)} disabled={!canMove.next} aria-label={labels.next}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
