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

function carouselMetrics(track: HTMLDivElement) {
  const cards = Array.from(track.children) as HTMLElement[];
  const cardStep = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  const maxIndex = cardStep > 0 ? Math.ceil(maxScroll / cardStep) : 0;
  const currentIndex = cardStep > 0
    ? Math.min(maxIndex, Math.max(0, Math.round(track.scrollLeft / cardStep)))
    : 0;

  return { cardStep, currentIndex, maxIndex, maxScroll };
}

export function ProjectCarousel({ items, labels }: { items: ProjectCarouselItem[]; labels: ProjectCarouselLabels }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [canMove, setCanMove] = useState({ previous: false, next: items.length > 1 });

  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { currentIndex, maxScroll } = carouselMetrics(track);
    setCurrent(currentIndex);
    setCanMove({
      previous: track.scrollLeft > 2,
      next: track.scrollLeft < maxScroll - 2,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollLeft = 0;
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

    const { cardStep, currentIndex, maxIndex, maxScroll } = carouselMetrics(track);
    const targetIndex = Math.min(maxIndex, Math.max(0, currentIndex + direction));
    const targetLeft = targetIndex === maxIndex ? maxScroll : targetIndex * cardStep;

    track.scrollTo({
      left: targetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div className="project-carousel">
      <div className="project-carousel-viewport">
        <button
          className="project-carousel-side-button is-previous"
          type="button"
          onClick={() => move(-1)}
          disabled={!canMove.previous}
          aria-label={labels.previous}
        >
          <ChevronLeft size={19} />
        </button>

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

        <button
          className="project-carousel-side-button is-next"
          type="button"
          onClick={() => move(1)}
          disabled={!canMove.next}
          aria-label={labels.next}
        >
          <ChevronRight size={19} />
        </button>
      </div>

      <div className="project-carousel-controls">
        <div className="project-carousel-progress" aria-hidden="true">
          <span style={{ width: `${((current + 1) / items.length) * 100}%` }} />
        </div>
        <span className="project-carousel-count" aria-live="polite">
          {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
