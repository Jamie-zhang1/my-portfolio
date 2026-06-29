"use client";

import { forwardRef, type ComponentProps, type CSSProperties, type MouseEventHandler, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { motionTokens } from "@/lib/motion";

const LocaleLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function LocaleLink(props, ref) {
  return <Link {...props} ref={ref} />;
});
const MotionLink = motion.create(LocaleLink);

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLDivElement>;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement | HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement | HTMLDivElement>;
};

function isLocalizedHref(href: string) {
  return /^\/(zh|en)(?=\/|$|#|\?)/.test(href);
}
function cardMotion(reduceMotion: boolean | null, clickable: boolean) {
  if (reduceMotion || !clickable) return {};
  return {
    whileHover: { y: motionTokens.distance.lift },
    whileTap: { scale: 0.992 },
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.standard },
  };
}

export function MotionCard({ children, className, href, target, rel, style, onClick, onMouseEnter, onMouseLeave, ...rest }: MotionCardProps) {
  const reduceMotion = useReducedMotion();
  const motionProps = cardMotion(reduceMotion, Boolean(href || onClick));

  if (href) {
    const isInternal = href.startsWith("/") && !target && !isLocalizedHref(href);
    if (isInternal) {
      return (
        <MotionLink className={className} href={href} style={style} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...motionProps} {...rest}>
          {children}
        </MotionLink>
      );
    }

    return (
      <motion.a className={className} href={href} target={target} rel={rel} style={style} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...motionProps} {...rest}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div className={className} style={style} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...motionProps} {...rest}>
      {children}
    </motion.div>
  );
}
