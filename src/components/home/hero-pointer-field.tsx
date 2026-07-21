"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type HeroStyle = CSSProperties & {
  "--pointer-x": number;
  "--pointer-y": number;
  "--portrait-reveal-x": string;
  "--portrait-reveal-y": string;
};

export function HeroPointerField({ children, className }: { children: ReactNode; className: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const frameId = useRef<number | null>(null);

  useEffect(() => () => {
    if (frameId.current !== null) cancelAnimationFrame(frameId.current);
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !frame.current) return;
    const { left, top, width, height } = frame.current.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - left) / width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - top) / height - 0.5) * 2));
    const portraitRect = frame.current.querySelector<HTMLElement>(".editorial-portrait")?.getBoundingClientRect();
    const isOverPortrait = Boolean(
      portraitRect
      && event.clientX >= portraitRect.left
      && event.clientX <= portraitRect.right
      && event.clientY >= portraitRect.top
      && event.clientY <= portraitRect.bottom,
    );

    if (frameId.current !== null) cancelAnimationFrame(frameId.current);
    frameId.current = requestAnimationFrame(() => {
      const element = frame.current;
      if (!element) return;
      element.style.setProperty("--pointer-x", x.toFixed(3));
      element.style.setProperty("--pointer-y", y.toFixed(3));
      element.toggleAttribute("data-portrait-hover", isOverPortrait);
      if (isOverPortrait && portraitRect) {
        const revealX = Math.max(5, Math.min(95, ((event.clientX - portraitRect.left) / portraitRect.width) * 100));
        const revealY = Math.max(5, Math.min(95, ((event.clientY - portraitRect.top) / portraitRect.height) * 100));
        element.style.setProperty("--portrait-reveal-x", `${revealX.toFixed(2)}%`);
        element.style.setProperty("--portrait-reveal-y", `${revealY.toFixed(2)}%`);
      }
    });
  };

  const reset = () => {
    const element = frame.current;
    if (!element) return;
    element.style.setProperty("--pointer-x", "0");
    element.style.setProperty("--pointer-y", "0");
    element.removeAttribute("data-portrait-hover");
  };

  return (
    <div
      ref={frame}
      className={className}
      style={{ "--pointer-x": 0, "--pointer-y": 0, "--portrait-reveal-x": "50%", "--portrait-reveal-y": "38%" } as HeroStyle}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}