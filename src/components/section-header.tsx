import type { ReactNode } from "react";

type SectionHeaderProps = {
  kicker: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function SectionHeader({ kicker, title, description, aside }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      <div className="section-header-copy">
        <p>{description}</p>
        {aside}
      </div>
    </header>
  );
}