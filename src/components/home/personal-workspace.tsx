import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

type WorkspaceArea = { title: string; description: string };

export async function PersonalWorkspace({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Home.workspace" });
  const areas = t.raw("areas") as WorkspaceArea[];
  const desk = t.raw("desk.items") as string[];

  return (
    <section id="workspace" className="home-section workspace-section site-shell">
      <div className="section-header workspace-header">
        <div>
          <p className="section-kicker">{t("kicker")}</p>
          <h2>{t("title")}</h2>
        </div>
        <div className="section-header-copy">
          <p>{t("description")}</p>
          <span className="status-marker" data-state="ready"><i aria-hidden="true" />{t("status")}</span>
        </div>
      </div>
      <div className="workspace-layout">
        <div className="workspace-card-grid">
          {areas.map((area, index) => (
            <article className="workspace-card task-sheet" key={area.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
        <aside className="prototype-window workspace-desk" aria-label={t("desk.title")}>
          <div className="prototype-window-bar"><span>{t("desk.title")}</span><span>JAMIE / DESK</span></div>
          <div className="workspace-desk-body">
            {desk.map((item, index) => (
              <div className="desk-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
