"use client";

import { ArrowLeft } from "lucide-react";
import { MotionButton } from "@/components/motion/motion-button";

type ProjectBackButtonProps = {
  locale: "zh" | "en";
  fallbackHref: string;
  label: string;
  shortLabel: string;
  projectTitle?: string;
};

export function ProjectBackButton({ locale, fallbackHref, label, shortLabel, projectTitle }: ProjectBackButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    const referrer = document.referrer;
    const sameOrigin = referrer.startsWith(window.location.origin);
    let sameLocale = false;

    if (sameOrigin) {
      try {
        const referrerUrl = new URL(referrer);
        sameLocale = referrerUrl.pathname === `/${locale}` || referrerUrl.pathname.startsWith(`/${locale}/`);
      } catch {
        sameLocale = false;
      }
    }

    if (sameOrigin && sameLocale && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  };

  return (
    <>
      <div className="project-back-fixed" aria-label={label}>
        <MotionButton href={fallbackHref} onClick={handleClick} className="project-back-pill">
          <ArrowLeft size={15} aria-hidden="true" />
          <span>{label}</span>
        </MotionButton>
      </div>
      <div className="project-back-mobile" aria-label={label}>
        <MotionButton href={fallbackHref} onClick={handleClick} className="project-back-mobile-link">
          <ArrowLeft size={15} aria-hidden="true" />
          <span>{shortLabel}</span>
        </MotionButton>
        {projectTitle ? <strong>{projectTitle}</strong> : null}
      </div>
    </>
  );
}
