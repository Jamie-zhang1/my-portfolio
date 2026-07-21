"use client";

import { useLocale } from "next-intl";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  section: string;
  children: ReactNode;
};

export function SectionLink({ section, children, onClick, ...props }: SectionLinkProps) {
  const locale = useLocale();
  const href = `/${locale}#${section}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const normalizedPath = window.location.pathname.replace(/\/$/, "");
    if (normalizedPath !== `/${locale}`) return;

    const target = document.getElementById(section);
    if (!target) return;

    event.preventDefault();
    const header = document.querySelector<HTMLElement>(".site-header");
    const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
    const offset = Math.max(18, headerBottom + 14);
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.history.replaceState(null, "", href);
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return <a href={href} onClick={handleClick} {...props}>{children}</a>;
}
