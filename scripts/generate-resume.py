from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "resume-jamie-zhang.pdf"
PUBLIC.parent.mkdir(parents=True, exist_ok=True)

LINES = [
    "Jamie Zhang",
    "Vibe Coding / Project Notes",
    "zhangjiangmin0902@gmail.com | github.com/Jamie-zhang1 | heard-sheep.cloud",
    "",
    "Profile",
    "Graduate student in logic at China University of Political Science and Law.",
    "I use vibe coding to turn small ideas into live web pages and project notes.",
    "This resume is intentionally simple and will be refined with the portfolio.",
    "",
    "Selected project notes",
    "Heard Sheep - voice notes to editable task cards.",
    "ProdDoc AI - project context to editable document drafts.",
    "AI Decision Copilot - decision questions to options, reasons, and risk notes.",
    "",
    "Working method",
    "Clarify the problem, build a live page, revise the writing and layout, record the process.",
    "",
    "Stack",
    "Next.js, React, TypeScript, Tailwind CSS, AI APIs, PWA, Playwright.",
]


def esc(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_pdf(lines: list[str]) -> bytes:
    commands = ["BT", "/F1 24 Tf", "50 810 Td", f"({esc(lines[0])}) Tj", "/F1 10 Tf"]
    y = 780
    for line in lines[1:]:
        y -= 20
        commands.append(f"1 0 0 1 50 {y} Tm")
        commands.append(f"({esc(line)}) Tj")
    commands.append("ET")
    stream = "\n".join(commands)
    objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        f"<< /Length {len(stream.encode('latin-1'))} >>\nstream\n{stream}\nendstream",
    ]
    pdf = "%PDF-1.4\n"
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(pdf.encode("latin-1")))
        pdf += f"{index} 0 obj\n{obj}\nendobj\n"
    xref_offset = len(pdf.encode("latin-1"))
    pdf += f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n"
    for offset in offsets[1:]:
        pdf += f"{offset:010d} 00000 n \n"
    pdf += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n"
    return pdf.encode("latin-1")


PUBLIC.write_bytes(build_pdf(LINES))
print(f"public={PUBLIC}")