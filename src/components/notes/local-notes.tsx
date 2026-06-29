"use client";

import { ArrowLeft, Copy, Download, FileText, Plus, Save, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NoteBuddy, type NoteBuddyState } from "@/components/mascot/note-buddy";
import { AnimatedSegmentedControl, type SegmentedOption } from "@/components/motion/animated-segmented-control";
import { MotionButton } from "@/components/motion/motion-button";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { ToastFeedback } from "@/components/motion/toast-feedback";
import { motionTokens } from "@/lib/motion";

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

type NewNoteProps = NotesProps & {
  initialType?: NoteType;
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

function shortFeedback(message: string, locale: "zh" | "en") {
  const marker = locale === "zh" ? "。" : ".";
  const index = message.indexOf(marker);
  return index >= 0 ? message.slice(0, index + marker.length) : message;
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
    href: `/${locale}/notes/${nextType}/new?from=${note.id}`,
  };
}

function noteExcerpt(note: LocalNote, fallback: string) {
  const text = note.body.replace(/^#+\s*/gm, "").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
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

function buddyStateForType(type: NoteType): NoteBuddyState {
  if (type === "draft" || type === "review") return "thinking";
  if (type === "learning") return "idle";
  return "idle";
}

export function NewLocalNote({ locale, copy, initialType = "idea" }: NewNoteProps) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const sourceId = searchParams.get("from");
  const requestedType = normalizeType(searchParams.get("type") ?? initialType);
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
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [buddyState, setBuddyState] = useState<NoteBuddyState>(buddyStateForType(requestedType));

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
        setBuddyState(buddyStateForType(foundType));
        return;
      }

      if (sourceId) {
        const source = readNotes().find((note) => note.id === sourceId);
        if (!source) return;
        setRelatedNoteId(source.id);
        setRelatedNoteTitle(source.title);
        setProject(projectValue(source));
        setBody(`${sourceLine(source, copy)}\n\n${copy.modes[requestedType].template}`);
        setBuddyState(buddyStateForType(requestedType));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [copy, editId, requestedType, sourceId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const mode = copy.modes[type];
  const listHref = `/${locale}/notes`;
  const homeHref = `/${locale}`;
  const typeOptions = copy.types.map((item) => ({ value: normalizeType(item.value), label: item.label })) as SegmentedOption<NoteType>[];

  const changeType = (nextType: NoteType) => {
    const previousTemplate = copy.modes[type].template.trim();
    const shouldReplaceTemplate = !existing && !relatedNoteId && (!body.trim() || body.trim() === previousTemplate);
    setType(nextType);
    setBuddyState(buddyStateForType(nextType));
    if (shouldReplaceTemplate) setBody(copy.modes[nextType].template);
  };

  const saveNote = () => {
    if (saving) return;
    setSaving(true);
    window.setTimeout(() => {
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
      setToast(shortFeedback(copy.common.saved, locale));
      setBuddyState("saved");
      setSaving(false);
      window.setTimeout(() => setBuddyState(buddyStateForType(type)), 1500);
    }, 260);
  };

  return (
    <section className="notes-page site-shell" data-note-type={type}>
      <ToastFeedback message={toast} />
      <div className="notes-topbar">
        <MotionButton className="text-link" href={homeHref}><ArrowLeft size={14} />{copy.common.backHome}</MotionButton>
        <MotionButton className="button button-secondary" href={listHref}><FileText size={15} />{copy.common.backList}</MotionButton>
      </div>

      <header className="notes-hero notes-editor-hero">
        <div>
          <p className="section-kicker">{mode.kicker}</p>
          <h1>{existing ? copy.common.editNote : mode.heading}</h1>
          <p>{mode.description}</p>
          <p className="note-position">{mode.position}</p>
        </div>
        <NoteBuddy state={buddyState} size="sm" label={locale === "zh" ? "小记" : "Note Buddy"} />
      </header>

      <AnimatedSegmentedControl ariaLabel={copy.common.filterLabel} options={typeOptions} value={type} onChange={changeType} className="note-mode-tabs" />

      <div className="note-editor-shell">
        {relatedNoteTitle ? (
          <div className="note-source-box">
            <span>{copy.center.relatedRecord}</span>
            <strong>{relatedNoteTitle}</strong>
          </div>
        ) : null}

        <label className="note-field note-title-field">
          <span>{copy.common.title}</span>
          <input value={title} onChange={(event) => { setTitle(event.target.value); setBuddyState("writing"); }} placeholder={mode.titlePlaceholder} />
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
          <textarea value={body} onChange={(event) => { setBody(event.target.value); setBuddyState("writing"); }} placeholder={mode.bodyPlaceholder} rows={12} />
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
          <input value={tags} onChange={(event) => { setTags(event.target.value); setBuddyState("writing"); }} placeholder={mode.tagsPlaceholder} />
          <small>{copy.common.tagHint}</small>
        </label>

        <div className="note-actions-row">
          <MotionButton className="button button-primary" type="button" onClick={saveNote} disabled={saving}>
            <Save size={15} />{saving ? (locale === "zh" ? "保存中..." : "Saving...") : existing ? copy.common.update : copy.common.save}
          </MotionButton>
          {existing ? <MotionButton className="button button-secondary" href={nextAction(existing, locale, copy).href}>{nextAction(existing, locale, copy).label}</MotionButton> : null}
          <MotionButton className="button button-secondary" href={listHref}>{copy.common.backList}</MotionButton>
        </div>
        {saveStatus ? <p className="note-save-message" role="status">{saveStatus}</p> : null}
        <p className="note-local-warning">{copy.common.localOnly}</p>
      </div>
    </section>
  );
}

export function LocalNotesList({ locale, copy }: NotesProps) {
  const reduceMotion = useReducedMotion();
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState<NoteFilter>("all");
  const [buttonFeedback, setButtonFeedback] = useState<Record<string, "copied" | "exported">>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setNotes(readNotes()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleNotes = useMemo(() => {
    return notes
      .filter((note) => !note.locale || note.locale === locale)
      .filter((note) => filter === "all" || normalizeType(note.type) === filter)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filter, locale, notes]);

  const filterOptions = useMemo(() => ([
    { value: "all" as const, label: copy.common.all },
    ...copy.types.map((item) => ({ value: normalizeType(item.value), label: item.label })),
  ]), [copy.common.all, copy.types]);

  const markButton = (id: string, next: "copied" | "exported") => {
    setButtonFeedback((current) => ({ ...current, [id]: next }));
    window.setTimeout(() => {
      setButtonFeedback((current) => {
        const clone = { ...current };
        delete clone[id];
        return clone;
      });
    }, 1500);
  };

  const deleteNote = (id: string) => {
    const ok = window.confirm(locale === "zh" ? "确定删除这条记录吗？" : "Delete this note?");
    if (!ok) return;
    const next = notes.filter((note) => note.id !== id);
    setNotes(next);
    writeNotes(next);
    setToast(locale === "zh" ? "记录已删除。" : "Note deleted.");
  };

  const copyMarkdown = async (note: LocalNote) => {
    await navigator.clipboard.writeText(markdownFor(note, copy));
    markButton(note.id, "copied");
    setToast(copy.common.copied);
  };

  return (
    <section className="notes-page site-shell">
      <ToastFeedback message={toast} />
      <div className="notes-topbar">
        <MotionButton className="text-link" href={`/${locale}`}><ArrowLeft size={14} />{copy.common.backHome}</MotionButton>
        <MotionButton className="button button-primary" href={`/${locale}/notes/idea/new`}><Plus size={15} />{copy.common.newNote}</MotionButton>
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
        <AnimatedSegmentedControl ariaLabel={copy.common.filterLabel} options={filterOptions} value={filter} onChange={setFilter} className="note-filter-tabs" />
        <AnimatePresence mode="wait">
          <motion.p
            key={filter}
            className="note-filter-description"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.gentle }}
          >
            {copy.center.filterDescriptions[filter]}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {visibleNotes.length === 0 ? (
          <motion.div className="notes-empty notes-empty-with-buddy" key="empty" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <NoteBuddy state="empty" size="sm" label={locale === "zh" ? "小记" : "Note Buddy"} />
            <div>
              <p>{copy.center.emptyStates[filter]}</p>
              <MotionButton className="button button-secondary" href={`/${locale}/notes/${filter === "all" ? "idea" : filter}/new`}>{copy.common.newNote}</MotionButton>
            </div>
          </motion.div>
        ) : (
          <StaggerList className="notes-list" key={filter}>
            {visibleNotes.map((note) => {
              const noteType = normalizeType(note.type);
              const action = nextAction(note, locale, copy);
              const selectedProject = projectValue(note);
              const feedback = buttonFeedback[note.id];
              return (
                <StaggerItem key={note.id}>
                  <motion.article
                    className="note-list-card motion-note-card"
                    data-note-type={noteType}
                    layout
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.standard }}
                  >
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
                      {note.attachments.length ? <ul className="note-file-list compact">{note.attachments.map((file) => <li key={`${note.id}-${file.name}`}>{file.name}<small>{formatBytes(file.size)} · {file.type}</small></li>)}</ul> : null}
                    </div>
                    <div className="note-card-actions">
                      <MotionButton className="note-next-action" href={action.href}><span>{copy.center.nextStep}</span>{action.label}</MotionButton>
                      <MotionButton className="button button-secondary" href={`/${locale}/notes/new?edit=${note.id}`}>{copy.common.edit}</MotionButton>
                      <MotionButton className="button button-secondary" type="button" onClick={() => copyMarkdown(note)}><Copy size={14} />{feedback === "copied" ? (locale === "zh" ? "已复制" : "Copied") : copy.common.copyMarkdown}</MotionButton>
                      <MotionButton className="button button-secondary" type="button" onClick={() => { downloadMarkdown(note, copy); markButton(note.id, "exported"); setToast(copy.common.exported); }}><Download size={14} />{feedback === "exported" ? (locale === "zh" ? "已导出" : "Exported") : copy.common.exportMarkdown}</MotionButton>
                      <MotionButton className="text-link danger-link" type="button" onClick={() => deleteNote(note.id)}><Trash2 size={14} />{copy.common.delete}</MotionButton>
                    </div>
                  </motion.article>
                </StaggerItem>
              );
            })}
          </StaggerList>
        )}
      </AnimatePresence>
      <p className="note-local-warning">{copy.common.localOnly} {copy.common.noUpload}</p>
    </section>
  );
}
