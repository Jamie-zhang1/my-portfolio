from pathlib import Path
import shutil

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "jamie-zhang-resume.pdf"
PUBLIC = ROOT / "public" / "resume-jamie-zhang.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

INK = HexColor("#11121A")
MUTED = HexColor("#5F6474")
LINE = HexColor("#D9DDE8")
VIOLET = HexColor("#6659F5")
PALE = HexColor("#F1F0FF")

body = ParagraphStyle("body", fontName="Helvetica", fontSize=8.25, leading=11.2, textColor=MUTED, alignment=TA_LEFT)
small = ParagraphStyle("small", fontName="Helvetica", fontSize=7.7, leading=10.4, textColor=MUTED)
project_title = ParagraphStyle("project", fontName="Helvetica-Bold", fontSize=10.7, leading=12, textColor=INK)
project_meta = ParagraphStyle("meta", fontName="Helvetica-Bold", fontSize=7.1, leading=9, textColor=VIOLET)
bullet = ParagraphStyle("bullet", fontName="Helvetica", fontSize=7.7, leading=10.1, textColor=MUTED, leftIndent=7, firstLineIndent=-5)


def para(c, text, style, x, y, width, gap=0):
    item = Paragraph(text, style)
    _, height = item.wrap(width, 1000)
    item.drawOn(c, x, y - height)
    return y - height - gap


def section(c, text, x, y):
    c.setFillColor(VIOLET)
    c.setFont("Helvetica-Bold", 8.3)
    c.drawString(x, y, text.upper())
    c.setStrokeColor(LINE)
    c.setLineWidth(.55)
    c.line(x, y - 4, x + 50 * mm, y - 4)
    return y - 15


def draw_project(c, x, y, width, title, meta, summary, bullets):
    y = para(c, title, project_title, x, y, width, 1)
    y = para(c, meta, project_meta, x, y, width, 3)
    y = para(c, summary, body, x, y, width, 2)
    for item in bullets:
        y = para(c, f"- {item}", bullet, x, y, width, 1)
    return y


width, height = A4
c = canvas.Canvas(str(OUTPUT), pagesize=A4)
c.setTitle("Jamie Zhang Resume")
c.setAuthor("Jamie Zhang")

margin = 16 * mm
left_w = 116 * mm
gutter = 9 * mm
right_x = margin + left_w + gutter
right_w = width - margin - right_x

c.setFillColor(INK)
c.setFont("Helvetica-Bold", 29)
c.drawString(margin, height - 21 * mm, "JAMIE ZHANG")
c.setFillColor(VIOLET)
c.setFont("Helvetica-Bold", 10.5)
c.drawString(margin, height - 28 * mm, "AI PRODUCT BUILDER  /  VIBE CODING")
c.setFillColor(MUTED)
c.setFont("Helvetica", 8.3)
c.drawString(margin, height - 34 * mm, "zhangjiangmin0902@gmail.com  |  github.com/Jamie-zhang1  |  heard-sheep.cloud")
c.setStrokeColor(LINE)
c.line(margin, height - 38 * mm, width - margin, height - 38 * mm)

y = height - 46 * mm
y = section(c, "Profile", margin, y)
y = para(c,
    "Logic-trained AI product practitioner who turns messy real-world requirements into clear, testable product flows. "
    "Builds working prototypes with Next.js, TypeScript and AI APIs, focusing on multimodal input, human confirmation, "
    "safe fallback behavior and delivery-ready product documentation.", body, margin, y, left_w, 8)
y = section(c, "Selected products", margin, y)
y = draw_project(c, margin, y, left_w, "Heard Sheep", "MULTIMODAL AI TASK ASSISTANT  /  LIVE MVP",
    "Turns voice, audio, images and text into user-confirmed tasks and action plans.",
    ["Designed capture -> transcript confirmation -> AI analysis -> candidate task confirmation.",
     "Built a mobile-first PWA, task management loop, history and model-failure fallback."])
y -= 8
y = draw_project(c, margin, y, left_w, "ProdDoc AI", "AI PRODUCT DOCUMENTATION WORKSPACE  /  INTERACTIVE DEMO",
    "Organizes product inputs, references and reusable templates into editable document drafts.",
    ["Designed prompt, API and Mock modes for real use, offline work and stable demonstrations.",
     "Built template extraction, multi-format parsing, local history and Word export workflow."])
y -= 8
y = draw_project(c, margin, y, left_w, "AI Decision Copilot", "STRUCTURED DECISION ASSISTANT  /  EXPERIMENT",
    "Transforms open questions into comparable options, evidence, recommendations and risk notes.",
    ["Designed dual-path analysis for existing options or AI-suggested alternatives.",
     "Created a no-key preset demo while retaining MiMo multimodal capability in the full project."])

c.setStrokeColor(LINE)
c.line(right_x - gutter / 2, height - 43 * mm, right_x - gutter / 2, 15 * mm)

ry = height - 46 * mm
ry = section(c, "Capabilities", right_x, ry)
skills = ["AI product design", "Vibe Coding", "Product flow design", "Multimodal UX", "Requirements structuring", "Product documentation", "Logic modeling", "Prototype delivery"]
for skill in skills:
    c.setFillColor(PALE)
    c.roundRect(right_x, ry - 15, right_w, 13, 4, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 7.6)
    c.drawString(right_x + 6, ry - 10, skill)
    ry -= 18

ry -= 3
ry = section(c, "Technology", right_x, ry)
ry = para(c, "Next.js / React / TypeScript / Tailwind CSS / shadcn/ui / AI APIs / PWA / Playwright", small, right_x, ry, right_w, 8)
ry = section(c, "Product approach", right_x, ry)
ry = para(c, "1. Find real workflow friction<br/>2. Structure inputs and decisions<br/>3. Build a usable prototype<br/>4. Validate failure states and responsive behavior<br/>5. Ship the story and working entry point", small, right_x, ry, right_w, 8)
ry = section(c, "Education", right_x, ry)
ry = para(c, "China University of Political Science and Law<br/><b>Master's student in Logic</b><br/>Legal logic, mathematical logic and rule modeling.", small, right_x, ry, right_w, 8)
ry = section(c, "Background", right_x, ry)
ry = para(c, "Experience in hotel management and enterprise services, including customer needs, order workflows, training materials and service records.", small, right_x, ry, right_w, 8)
ry = section(c, "Languages", right_x, ry)
para(c, "Chinese (native)<br/>English (working proficiency)", small, right_x, ry, right_w)

c.setFillColor(MUTED)
c.setFont("Helvetica", 6.8)
c.drawString(margin, 10 * mm, "PORTFOLIO RESUME  /  UPDATED JUNE 2026")
c.drawRightString(width - margin, 10 * mm, "Jamie Zhang  /  AI Product Builder")
c.save()

shutil.copyfile(OUTPUT, PUBLIC)
print(f"generated={OUTPUT}")
print(f"public={PUBLIC}")
