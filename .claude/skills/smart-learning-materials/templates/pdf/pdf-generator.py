#!/usr/bin/env python3
"""
PDF Generator for Smart Learning Materials
===========================================
Reads module data (JSON), fills LaTeX template, compiles to PDF via xelatex.
Fallback: uses Playwright to render web version and export as PDF.

Usage:
    python pdf-generator.py --input data.json --output output.pdf
    python pdf-generator.py --input data.json --output output.pdf --method latex
    python pdf-generator.py --input data.json --output output.pdf --method playwright
"""

import json
import os
import sys
import argparse
import subprocess
import tempfile
import shutil
from pathlib import Path
from datetime import datetime


TEMPLATE_DIR = Path(__file__).parent
TEMPLATE_FILE = TEMPLATE_DIR / "template.tex"


def load_data(input_path):
    with open(input_path, "r", encoding="utf-8") as f:
        return json.load(f)


def escape_latex(text):
    if not text:
        return ""
    special_chars = {
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\^{}",
    }
    for char, escaped in special_chars.items():
        text = text.replace(char, escaped)
    return text


def module_to_latex(module):
    lines = []
    title = escape_latex(module.get("module_title", module.get("module_id", "")))
    tag = escape_latex(module.get("module_tag", ""))

    lines.append(r"\section{" + title + "}")
    if module.get("key_takeaway"):
        lines.append(r"\marginnote{" + escape_latex(module["key_takeaway"]) + "}")

    if module.get("hook"):
        lines.append("")
        lines.append(r"\begin{center}")
        lines.append(r"\large\textit{\textcolor{textMid}{" + escape_latex(module["hook"]) + r"}}")
        lines.append(r"\end{center}")
        lines.append("")

    if module.get("content"):
        for paragraph in module["content"].split("\n\n"):
            p = paragraph.strip()
            if not p:
                continue
            if p.startswith("- "):
                items = [escape_latex(item[2:]) for item in p.split("\n- ")]
                lines.append(r"\begin{itemize}")
                for item in items:
                    lines.append(r"  \item " + item)
                lines.append(r"\end{itemize}")
            elif p.startswith("1. "):
                items = []
                for item in p.split("\n"):
                    stripped = item.strip()
                    if stripped and stripped[0].isdigit() and ". " in stripped:
                        items.append(escape_latex(stripped.split(". ", 1)[1]))
                lines.append(r"\begin{enumerate}")
                for item in items:
                    lines.append(r"  \item " + item)
                lines.append(r"\end{enumerate}")
            else:
                lines.append(escape_latex(p))
        lines.append("")

    # Formulas
    if module.get("formulas"):
        for formula in module["formulas"]:
            latex = formula.get("latex", "").replace("$$", "")
            lines.append(r"\begin{formulabox}")
            lines.append(r"\[" + latex + r"\]")
            if formula.get("caption"):
                lines.append(r"\begin{center}\small\textcolor{textLight}{" + escape_latex(formula["caption"]) + r"}\end{center}")
            if formula.get("expandable") and formula.get("derivation"):
                lines.append(r"\medskip")
                lines.append(r"\textit{推导过程：}" + escape_latex(formula["derivation"]))
            lines.append(r"\end{formulabox}")
            lines.append("")

    # Tables
    if module.get("tables"):
        for table in module["tables"]:
            headers = table.get("headers", [])
            rows = table.get("rows", [])
            if not headers:
                continue
            col_spec = "|" + "|".join(["l"] * len(headers)) + "|"
            lines.append(r"\begin{table}[H]")
            lines.append(r"\centering")
            lines.append(r"\small")
            lines.append(r"\begin{tabular}{" + col_spec + "}")
            lines.append(r"\hline")
            lines.append(" & ".join(r"\textbf{" + escape_latex(h) + "}" for h in headers) + r" \\ \hline")
            for row in rows:
                lines.append(" & ".join(escape_latex(str(c)) for c in row) + r" \\ \hline")
            lines.append(r"\end{tabular}")
            if table.get("caption"):
                lines.append(r"\caption{" + escape_latex(table["caption"]) + "}")
            lines.append(r"\end{table}")
            lines.append("")

    # References
    if module.get("references") and module["references"]:
        lines.append(r"\medskip")
        lines.append(r"\textbf{\small 参考文献}")
        lines.append(r"\begin{itemize}\small")
        for ref in module["references"]:
            ref_line = f"{ref.get('authors', '')} ({ref.get('year', '')}). {ref.get('title', '')}."
            if ref.get("doi"):
                ref_line += f" DOI: {ref['doi']}"
            lines.append(r"\item " + escape_latex(ref_line))
        lines.append(r"\end{itemize}")
        lines.append("")

    # Key takeaway box
    if module.get("key_takeaway") and tag in ("核心概念", "核心工具"):
        lines.append(r"\begin{knowledgebox}")
        lines.append(escape_latex(module["key_takeaway"]))
        lines.append(r"\end{knowledgebox}")
        lines.append("")

    return "\n".join(lines)


def generate_latex_pdf(data, output_path):
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        template = f.read()

    topic = data.get("topic", "Knowledge Topic")
    domain = data.get("domain", "common")
    domain_name = data.get("domain_name", "General")
    level = data.get("level", "intermediate")
    level_name = data.get("level_name", "Intermediate")
    level_icons = {"beginner": "🟢", "intermediate": "🟡", "expert": "🔴"}
    level_icon = level_icons.get(level, "🟡")

    # Build content
    content_parts = []
    for module in data.get("modules", []):
        content_parts.append(module_to_latex(module))
    content = "\n\n".join(content_parts)

    # Replace placeholders
    latex_doc = template.replace("TITLE_PLACEHOLDER", escape_latex(topic))
    latex_doc = latex_doc.replace("DOMAIN_NAME_PLACEHOLDER", escape_latex(domain_name))
    latex_doc = latex_doc.replace("LEVEL_NAME_PLACEHOLDER", escape_latex(level_name))
    latex_doc = latex_doc.replace("LEVEL_ICON_PLACEHOLDER", level_icon)
    latex_doc = latex_doc.replace("CONTENT_PLACEHOLDER", content)
    latex_doc = latex_doc.replace("DOMAIN_PLACEHOLDER", escape_latex(domain))
    latex_doc = latex_doc.replace("LEVEL_PLACEHOLDER", escape_latex(level))
    latex_doc = latex_doc.replace("KEYWORDS_PLACEHOLDER", escape_latex(f"{topic}, {domain_name}, {level_name}"))

    # Write to temp dir and compile
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_file = os.path.join(tmpdir, "output.tex")
        with open(tex_file, "w", encoding="utf-8") as f:
            f.write(latex_doc)

        # Copy resources/fonts if they exist
        fonts_dir = TEMPLATE_DIR.parent.parent / "resources" / "fonts"
        if fonts_dir.exists():
            shutil.copytree(fonts_dir, os.path.join(tmpdir, "resources", "fonts"), dirs_exist_ok=True)

        # Compile with xelatex (two passes for TOC)
        for _ in range(2):
            result = subprocess.run(
                ["xelatex", "-interaction=nonstopmode", "-output-directory", tmpdir, tex_file],
                capture_output=True, text=True
            )

        pdf_file = os.path.join(tmpdir, "output.pdf")
        if os.path.exists(pdf_file):
            shutil.copy(pdf_file, output_path)
            return True
        else:
            # Check for errors
            log_file = os.path.join(tmpdir, "output.log")
            if os.path.exists(log_file):
                with open(log_file, "r") as f:
                    print("LaTeX compilation log (last 50 lines):")
                    lines = f.readlines()
                    for line in lines[-50:]:
                        if "Error" in line or "Warning" in line or "!" in line:
                            print(line.strip())
            return False


def generate_playwright_pdf(data, output_path):
    print("Playwright PDF generation requires a running web server and playwright.")
    print("Alternative: Open the web version (mode-a/index.html) and use Ctrl+P to print as PDF.")
    print("")
    print("To implement automated PDF via Playwright, install:")
    print("  pip install playwright")
    print("  playwright install chromium")
    print("")
    print("Then use the following script pattern to render mode-a HTML and export PDF:")
    print("""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('file:///path/to/mode-a/index.html', wait_until='networkidle')
    page.pdf(path='output.pdf', format='A4', print_background=True)
    browser.close()
""")
    return False


def main():
    parser = argparse.ArgumentParser(description="Generate PDF from Smart Learning Materials data")
    parser.add_argument("--input", "-i", required=True, help="Input JSON data file")
    parser.add_argument("--output", "-o", default="output.pdf", help="Output PDF file path")
    parser.add_argument("--method", "-m", choices=["latex", "playwright", "auto"], default="auto",
                        help="PDF generation method (default: auto)")

    args = parser.parse_args()

    data = load_data(args.input)

    success = False

    if args.method in ("latex", "auto"):
        print(f"Attempting LaTeX PDF generation for: {data.get('topic', 'Unknown Topic')}")
        success = generate_latex_pdf(data, args.output)
        if success:
            print(f"PDF generated successfully: {args.output}")
        elif args.method == "auto":
            print("LaTeX compilation failed. Falling back to Playwright method...")
        else:
            print("LaTeX compilation failed.")
            return 1

    if not success and args.method in ("playwright", "auto"):
        print("Trying Playwright fallback...")
        success = generate_playwright_pdf(data, args.output)

    if not success:
        print("PDF generation failed. Please check errors above.")
        print("Fallback: Open web template and use browser Print > Save as PDF.")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
