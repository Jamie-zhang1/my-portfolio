# DESIGN.md — Jamie Zhang AI Portfolio

## 1. Visual Theme And Atmosphere

The site should feel like an AI product field lab: editorial enough for a portfolio, but more kinetic and product-led than a beige template page. The visitor should understand within the first viewport that this is a hands-on AI product portfolio with real demos and live product access, while the homepage itself stays focused on clear project icons.

Core attributes:

- Precise, technical, direct.
- High contrast: heard-sheep cream, ink, soft lavender, and a focused violet brand accent.
- Project icons are the homepage entry points; product screenshots are reserved for detail pages.
- Layout should feel composed through grids, rails, panels, and status strips.
- Motion should be small and purposeful: reveal, scan, hover lift, subtle grid motion.

Anti-references:

- Purple-blue gradient landing pages.
- Nested card stacks.
- Generic startup hero with centered headline and abstract blobs.
- Beige-only editorial pages.
- Oversized empty whitespace without product evidence.

## 2. Color Palette And Roles

- `ink`: `#1a1916` for primary text.
- `ink-soft`: `#5c574f` for secondary text on light surfaces.
- `muted`: `#9c9489` for metadata.
- `paper`: `#faf8f5` for base background, matching heard-sheep.
- `paper-clean`: `#ffffff` for raised sections.
- `surface-2`: `#f0ede8` for quiet bands.
- `line`: `#e8e4df` for separators.
- `violet`: `#7c6ff7` for live/product states and primary emphasis.
- `violet-soft`: `#eee9ff` for subtle fills.
- `blue`: `#6f8ef6` for tooling/demo marks.
- `coral`: `#ff8a6a` for experiment/caution marks.

Rules:

- Never let one hue dominate the entire page.
- Do not use gradient text.
- Do not use decorative orb backgrounds.
- Use color as a system: violet = live/product, blue = demo/tooling, coral = experiment/caution.
- Prefer soft-tinted chips and borders over saturated filled pills.
- Avoid muddy tan, brown, olive, espresso, or heavy beige dominance; the cream base must read clean and airy.

## 3. Typography Rules

- Chinese display: Noto Serif SC for the few large editorial headings.
- Chinese UI/body: Noto Sans SC for dense reading and controls.
- Monospace: system monospace for routes, counters, status, and technical labels.
- Letter spacing stays at `0`; uppercase labels may use modest positive tracking only.
- Headings inside compact panels must stay compact, not hero-sized.
- Body copy should be scannable: 1.65 line height, short blocks, visible section labels.

## 4. Component Styling

Buttons:

- Primary actions use dark ink fill with lime/coral accent on hover.
- Secondary actions are outlined, not pale filled rectangles.
- External links include an arrow glyph or icon.
- Minimum touch target height: 40px.

Panels:

- Use single-level panels only. Do not place cards inside cards.
- Panels use 1px borders and small radius (`6px` max).
- Important panels may use dark backgrounds with bright status chips.

Project previews:

- The homepage project section should use icon cards only: icon, project name, short role, and detail entry.
- Product screenshots are framed like inspected artifacts on detail pages: rails, index markers, live labels.
- Featured heard-sheep remains first and uses the user-provided sheep icon.
- ProdDoc AI remains second and uses the generated document icon.
- Decision Copilot remains third and uses the generated decision icon.

Forms:

- Inputs should feel like product tooling: clear labels, strong focus ring, consistent height.
- Demo output should look like a generated document/workbench, not a blank card.

## 5. Layout Principles

- Use a 12-column desktop grid and full-width section bands.
- Keep page sections unframed; use panels only for actual items, tools, demos, and status surfaces.
- First viewport must show brand/person, project icons, and at least one real action.
- Mobile layout should prioritize readable icon entries and direct navigation into project detail pages.
- Avoid text overlap by using explicit responsive grid gaps and stable image frames.

## 6. Motion And Interaction

- Use CSS-only motion unless there is a clear product reason for heavier animation.
- Allowed patterns:
  - slow grid drift in hero backgrounds;
  - scanline movement on screenshot stages;
  - hover lift of 2-4px on clickable artifacts;
  - staggered fade-in.
- Respect `prefers-reduced-motion`.
- Motion must not affect text legibility.

## 7. Responsive Behavior

- Desktop: split hero with copy on the left and a compact project icon launcher on the right.
- Tablet: icon grids collapse without changing card proportions.
- Mobile: navigation wraps cleanly, action buttons use full width when needed, icon entries remain tappable and legible.
- Avoid viewport-scaled typography; use breakpoint-specific fixed sizes.

## 8. Agent Prompt Guide

When changing the UI, preserve:

- Project order: heard-sheep, ProdDoc AI, AI Decision Copilot.
- Live product route: `/sheep`.
- The fact that ProdDoc AI and Decision Copilot demos do not call external AI APIs.
- The production deployment documentation and screenshot hygiene.

Before shipping:

- Run `npx tsc --noEmit`, `npm run build`, and `npm run lint`.
- Verify desktop and mobile screenshots for overlap, blank images, debug marks, and generic AI UI patterns.
