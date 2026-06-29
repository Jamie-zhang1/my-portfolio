"use client";

import { forwardRef, type ComponentProps, type MouseEventHandler, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { motionTokens } from "@/lib/motion";

const LocaleLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function LocaleLink(props, ref) {
  return <Link {...props} ref={ref} />;
});
const MotionLink = motion.create(LocaleLink);

type MotionButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

function isLocalizedHref(href: string) {
  return /^\/(zh|en)(?=\/|$|#|\?)/.test(href);
}

function hoverProps(disabled: boolean | undefined, reduceMotion: boolean | null) {
  if (disabled || reduceMotion) return {};
  return {
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: motionTokens.duration.fast, ease: [0.22, 1, 0.36, 1] as const },
  };
}

export function MotionButton({
  children,
  className = "button",
  href,
  target,
  rel,
  download,
  type = "button",
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: MotionButtonProps) {
  const reduceMotion = useReducedMotion();
  const props = hoverProps(disabled, reduceMotion);

  if (href) {
    const isInternal = href.startsWith("/") && !download && !target && !isLocalizedHref(href);
    if (isInternal) {
      return (
        <MotionLink className={className} href={href} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...props} {...rest}>
          {children}
        </MotionLink>
      );
    }

    return (
      <motion.a className={className} href={href} target={target} rel={rel} download={download} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...props} {...rest}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button className={className} type={type} disabled={disabled} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...props} {...rest}>
      {children}
    </motion.button>
  );
}
