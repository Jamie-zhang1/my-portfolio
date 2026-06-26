"use client";

import { ArrowLeft, Copy, Download, FileText, Plus, Save, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NoteType = "idea" | "draft" | "review" | "learning";
type NoteFilter = "all" | NoteType;
type NoteStatus = "raw" | "drafting" | "reviewed" | "archived";
type Option = { value: string; label: string };
type NoteMode = {
  kicker: string;
  heading: string;
  description: string;
  position: string;
  titlePlaceholder: string;
  bodyPlaceholder: string;
  tagsPlaceholder: string;
  template: string;
};
type AttachmentInfo = { name: string; size: number; type: string };
type LocalNote = {
  id: string;
  locale: "zh" | "en";
  type: NoteType;
  title: string;
  relatedProject?: string;
  project?: string;
  relatedNoteId?: string;
  relatedNoteTitle?: string;
  status?: NoteStatus;
  body: string;
  tags: string[];
  attachments: AttachmentInfo[];
  createdAt: string;
  updatedAt: string;
};

type NotesCenterCopy = {
  kicker: string;
  heading: string;
  description: string;
  flowMain: string;
  flowSide: string;
  viewLabel: string;
  filterDescriptions: Record<NoteFilter, string>;
  emptyStates: Record<NoteFilter, string>;
  nextActions: Record<NoteType, string>;
  updatedAt: string;
  relatedProject: string;
  relatedRecord: string;
  nextStep: string;
  sourceLabel: string;
  sourceNames: Record<NoteType, string>;
  statusLabels: Record<NoteStatus, string>;
};

type NotesCopy = {
  common: Record<string, string>;
  new: Record<string, string>;
  center: NotesCenterCopy;
  modes: Record<NoteType, NoteMode>;
  types: Option[];
  projects: Option[];
};

type NotesProps = {
  locale: "zh" | "en";
  copy: NotesCopy;
};

const STORAGE_KEY = "jamie-local-notes-v1";
const NOTE_TYPES: NoteType[] = ["idea", "draft", "review", "learning"];

function normalizeType(value: string | null | undefined): NoteType {
  return NOTE_TYPES.includes(value as NoteType) ? (value as NoteType) : "idea";
}

function normalizeStatus(value: string | null | undefined, type: NoteType): NoteStatus {
  if (value === "raw" || value === "drafting" || value === "reviewed" || value === "archived") return value;
  if (type === "draft") return "drafting";
  if (type === "review") return "reviewed";
  return "raw";
}

function defaultStatus(type: NoteType): NoteStatus {
  if (type === "draft") return "drafting";
  if (type === "review") return "reviewed";
  return "raw";
}

function readNotes(): LocalNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((note) => {
      const type = normalizeType(note.type);
      const relatedProject = note.relatedProject ?? note.project ?? "none";
      return {
        ...note,
        locale: note.locale === "en" ? "en" : "zh",
        type,
        status: normalizeStatus(note.status, type),
        relatedProject,
        project: relatedProject,
        tags: Array.isArray(note.tags) ? note.tags : [],
        attachments: Array.isArray(note.attachments) ? note.attachments : [],
      };
    }) : [];
  } catch {
    return [];
  }
}

function writeNotes(notes: LocalNote[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function optionLabel(options: Option[], value: string | undefined) {
  return options.find((item) => item.value === value)?.label ?? value ?? "";
}

function projectValue(note: LocalNote) {
  return note.relatedProject ?? note.project ?? "none";
}

function isZh(copy: NotesCopy) {
  return copy.common.title === "标题";
}

function sourceLine(source: LocalNote, copy: NotesCopy) {
  const type = normalizeType(source.type);
  const colon = isZh(copy) ? "：" : ":";
  return `${copy.center.sourceNames[type]}${colon}${source.title}`;
}

function nextAction(note: LocalNote, locale: "zh" | "en", copy: NotesCopy) {
  const type = normalizeType(note.type);
  const nextType: NoteType = type === "idea" ? "draft" : type === "draft" ? "review" : type === "review" ? "review" : "learning";
  return {
    label: copy.center.nextActions[type],
    href: `/${locale}/notes/new?type=${nextType}&from=${note.id}`,
  };
}

function noteExcerpt(note: LocalNote, fallback: string) {
  const text = note.body.replace(/^#+\s*/gm, "").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > 180 ? `${text.slice(0, 180)}…` : text;
}

function markdownFor(note: LocalNote, copy: NotesCopy) {
  const title = note.title || (copy.common.untitled ?? "Untitled");
  const type = optionLabel(copy.types, note.type);
  const project = optionLabel(copy.projects, projectValue(note));
  const related = note.relatedNoteTitle ?? "-";
  const tags = note.tags.length ? note.tags.join(", ") : "-";
  const attachments = note.attachments.length ? note.attachments.map((file) => `- ${file.name}`).join("\n") : "-";

  if (isZh(copy)) {
    return `# ${title}\n\n类型：${type}\n关联项目：${project}\n关联记录：${related}\n标签：${tags}\n创建时间：${note.createdAt}\n更新时间：${note.updatedAt}\n\n${note.body}\n\n## 附件\n\n${attachments}\n`;
  }

  return `# ${title}\n\nType: ${type}\nRelated project: ${project}\nRelated record: ${related}\nTags: ${tags}\nCreated at: ${note.createdAt}\nUpdated at: ${note.updatedAt}\n\n${note.body}\n\n## Attachments\n\n${attachments}\n`;
}

function downloadMarkdown(note: LocalNote, copy: NotesCopy) {
  const blob = new Blob([markdownFor(note, copy)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const filename = `${(note.title || "local-note").replace(/[\\/:*?"<>|]/g, "-").slice(0, 60)}.md`;
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function NewLocalNote({ locale, copy }: NotesProps) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const sourceId = searchParams.get("from");
  const requestedType = normalizeType(searchParams.get("type"));
  const [title, setTitle] = useState("");
  const [type, setType] = useState<NoteType>(requestedType);
  const [project, setProject] = useState("none");
  const [relatedNoteId, setRelatedNoteId] = useState("");
  const [relatedNoteTitle, setRelatedNoteTitle] = useState("");
  const [body, setBody] = useState(() => copy.modes[requestedType].template);
  const [tags, setTags] = useState("");
  const [attachments, setAttachments] = useState<AttachmentInfo[]>([]);
  const [existing, setExisting] = useState<LocalNote | null>(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (editId) {
        const found = readNotes().find((note) => note.id === editId);
        if (!found) return;
        const foundType = normalizeType(found.type);
        setExisting(found);
        setTitle(found.title);
        setType(foundType);
        setProject(projectValue(found));
        setRelatedNoteId(found.relatedNoteId ?? "");
        setRelatedNoteTitle(found.relatedNoteTitle ?? "");
        setBody(found.body || copy.modes[foundType].template);
        setTags(found.tags.join(", "));
        setAttachments(found.attachments);
        return;
      }

      if (sourceId) {
        const source = readNotes().find((note) => note.id === sourceId);
        if (!source) return;
        setRelatedNoteId(source.id);
        setRelatedNoteTitle(source.title);
        setProject(projectValue(source));
        setBody(`${sourceLine(source, copy)}\n\n${copy.modes[requestedType].template}`);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [copy, editId, requestedType, sourceId]);

  const mode = copy.modes[type];
  const listHref = `/${locale}/notes`;
  const homeHref = `/${locale}`;

  const changeType = (nextType: NoteType) => {
    const previousTemplate = copy.modes[type].template.trim();
    const shouldReplaceTemplate = !existing && !relatedNoteId && (!body.trim() || body.trim() === previousTemplate);
    setType(nextType);
    if (shouldReplaceTemplate) setBody(copy.modes[nextType].template);
  };

  const saveNote = () => {
    const now = new Date().toISOString();
    const cleanTags = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    const nextNote: LocalNote = {
      id: existing?.id ?? makeId(),
      locale,
      type,
      title: title.trim() || (locale === "zh" ? "未命名记录" : "Untitled note"),
      relatedProject: project,
      project,
      relatedNoteId: relatedNoteId || undefined,
      relatedNoteTitle: relatedNoteTitle || undefined,
      status: existing?.status ?? defaultStatus(type),
      body,
      tags: cleanTags,
      attachments,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const rest = readNotes().filter((note) => note.id !== nextNote.id);
    writeNotes([nextNote, ...rest]);
    setExisting(nextNote);
    setSaveStatus(copy.common.saved);
  };

  return (
    <section className="notes-page site-shell" data-note-type={type}>
      <div className="notes-topbar">
        <a className="text-link" href={homeHref}><ArrowLeft size={14} />{copy.common.backHome}</a>
        <a className="button button-secondary" href={listHref}><FileText size={15} />{copy.common.backList}</a>
      </div>

      <header className="notes-hero">
        <p className="section-kicker">{mode.kicker}</p>
        <h1>{existing ? copy.common.editNote : mode.heading}</h1>
        <p>{mode.description}</p>
        <p className="note-position">{mode.position}</p>
      </header>

      <div className="note-mode-tabs" role="group" aria-label={copy.common.filterLabel}>
        {copy.types.map((item) => {
          const value = normalizeType(item.value);
          return <button key={item.value} type="button" className={value === type ? "is-active" : ""} onClick={() => changeType(value)}>{item.label}</button>;
        })}
      </div>

      <div className="note-editor-shell">
        {relatedNoteTitle ? (
          <div className="note-source-box">
            <span>{copy.center.relatedRecord}</span>
            <strong>{relatedNoteTitle}</strong>
          </div>
        ) : null}

        <label className="note-field note-title-field">
          <span>{copy.common.title}</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={mode.titlePlaceholder} />
        </label>

        <div className="note-field-grid">
          <label className="note-field">
            <span>{copy.common.type}</span>
            <select value={type} onChange={(event) => changeType(normalizeType(event.target.value))}>
              {copy.types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="note-field">
            <span>{copy.common.project}</span>
            <select value={project} onChange={(event) => setProject(event.target.value)}>
              {copy.projects.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>

        <label className="note-field">
          <span>{copy.common.body}</span>
          <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder={mode.bodyPlaceholder} rows={12} />
        </label>

        <div className="note-upload-box">
          <label>
            <span>{copy.common.attachments}</span>
            <input type="file" multiple accept="image/*,.pdf,.md,.markdown,.txt,text/plain,application/pdf" onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setAttachments(files.map((file) => ({ name: file.name, size: file.size, type: file.type || "unknown" })));
            }} />
          </label>
          <p>{copy.common.attachHint}</p>
          {attachments.length > 0 ? (
            <ul className="note-file-list">
              {attachments.map((file) => <li key={`${file.name}-${file.size}`}>{file.name}<small>{formatBytes(file.size)} · {file.type}</small></li>)}
            </ul>
          ) : null}
        </div>

        <label className="note-field">
          <span>{copy.common.tags}</span>
          <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={mode.tagsPlaceholder} />
          <small>{copy.common.tagHint}</small>
        </label>

        <div className="note-actions-row">
          <button className="button button-primary" type="button" onClick={saveNote}><Save size={15} />{existing ? copy.common.update : copy.common.save}</button>
          {existing ? <a className="button button-secondary" href={nextAction(existing, locale, copy).href}>{nextAction(existing, locale, copy).label}</a> : null}
          <a className="button button-secondary" href={listHref}>{copy.common.backList}</a>
        </div>
        {saveStatus ? <p className="note-save-message" role="status">{saveStatus}</p> : null}
        <p className="note-local-warning">{copy.common.localOnly}</p>
      </div>
    </section>
  );
}

export function LocalNotesList({ locale, copy }: NotesProps) {
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState<NoteFilter>("all");

  useEffect(() => {
    const timer = window.setTimeout(() => setNotes(readNotes()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleNotes = useMemo(() => {
    return notes
      .filter((note) => !note.locale || note.locale === locale)
      .filter((note) => filter === "all" || normalizeType(note.type) === filter)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filter, locale, notes]);

  const deleteNote = (id: string) => {
    const next = notes.filter((note) => note.id !== id);
    setNotes(next);
    writeNotes(next);
  };

  const copyMarkdown = async (note: LocalNote) => {
    await navigator.clipboard.writeText(markdownFor(note, copy));
    setStatus(copy.common.copied);
  };

  return (
    <section className="notes-page site-shell">
      <div className="notes-topbar">
        <a className="text-link" href={`/${locale}`}><ArrowLeft size={14} />{copy.common.backHome}</a>
        <a className="button button-primary" href={`/${locale}/notes/new?type=idea`}><Plus size={15} />{copy.common.newNote}</a>
      </div>
      <header className="notes-hero notes-list-hero">
        <p className="section-kicker">{copy.center.kicker}</p>
        <h1>{copy.center.heading}</h1>
        <p>{copy.center.description}</p>
      </header>

      <div className="notes-flow-card" aria-label={copy.center.flowMain}>
        <strong>{copy.center.flowMain}</strong>
        <span>{copy.center.flowSide}</span>
      </div>

      <div className="note-filter-area">
        <p className="note-filter-intro">{copy.center.viewLabel}</p>
        <div className="note-filter-tabs" role="group" aria-label={copy.common.filterLabel}>
          <button type="button" className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>{copy.common.all}</button>
          {copy.types.map((item) => {
            const value = normalizeType(item.value);
            return <button type="button" key={item.value} className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{item.label}</button>;
          })}
        </div>
        <p className="note-filter-description">{copy.center.filterDescriptions[filter]}</p>
      </div>

      {status ? <p className="note-save-message" role="status">{status}</p> : null}
      {visibleNotes.length === 0 ? (
        <div className="notes-empty">
          <p>{copy.center.emptyStates[filter]}</p>
          <a className="button button-secondary" href={`/${locale}/notes/new?type=${filter === "all" ? "idea" : filter}`}>{copy.common.newNote}</a>
        </div>
      ) : (
        <div className="notes-list">
          {visibleNotes.map((note) => {
            const noteType = normalizeType(note.type);
            const action = nextAction(note, locale, copy);
            const selectedProject = projectValue(note);
            return (
              <article className="note-list-card" data-note-type={noteType} key={note.id}>
                <div>
                  <p className="note-type-line"><span>{optionLabel(copy.types, noteType)}</span>{copy.center.statusLabels[normalizeStatus(note.status, noteType)]}</p>
                  <h2>{note.title}</h2>
                  <p>{noteExcerpt(note, copy.common.empty)}</p>
                  <div className="note-card-relations">
                    <span>{copy.center.updatedAt}: {note.updatedAt}</span>
                    {selectedProject !== "none" ? <span>{copy.center.relatedProject}: {optionLabel(copy.projects, selectedProject)}</span> : null}
                    {note.relatedNoteTitle ? <span>{copy.center.relatedRecord}: {note.relatedNoteTitle}</span> : null}
                  </div>
                  <div className="note-meta-line">{note.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>
                  {note.attachments.length ? <ul className="note-file-list compact">{note.attachments.map((file) => <li key={`${note.id}-${file.name}`}>{file.name}</li>)}</ul> : null}
                </div>
                <div className="note-card-actions">
                  <a className="note-next-action" href={action.href}><span>{copy.center.nextStep}</span>{action.label}</a>
                  <a className="button button-secondary" href={`/${locale}/notes/new?edit=${note.id}`}>{copy.common.edit}</a>
                  <button className="button button-secondary" type="button" onClick={() => copyMarkdown(note)}><Copy size={14} />{copy.common.copyMarkdown}</button>
                  <button className="button button-secondary" type="button" onClick={() => { downloadMarkdown(note, copy); setStatus(copy.common.exported); }}><Download size={14} />{copy.common.exportMarkdown}</button>
                  <button className="text-link danger-link" type="button" onClick={() => deleteNote(note.id)}><Trash2 size={14} />{copy.common.delete}</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="note-local-warning">{copy.common.localOnly} {copy.common.noUpload}</p>
    </section>
  );
}