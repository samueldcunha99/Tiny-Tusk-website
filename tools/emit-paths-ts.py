import json, pathlib

SC = pathlib.Path(__file__).parent
ROOT = pathlib.Path(r"c:\Users\HP\OneDrive\Desktop\My websites\Tiny Tusk website")
data = json.loads((SC / "assets" / "assets.json").read_text(encoding="utf-8"))
rep = {r[0]: r[1] for r in json.loads((SC / "assets" / "emit-report.json").read_text(encoding="utf-8"))}

logo = data.pop("logo")
wordmark = data.pop("wordmark")

def j(v):
    return json.dumps(v, ensure_ascii=False)

lines = [
    "/**",
    " * Brand artwork, extracted from TINY_TUSK_Visual_Identity_Guide.pdf.",
    " *",
    " * GENERATED FILE -- do not hand-edit. Regenerate with tools/extract-brand.py.",
    " *",
    " * Every asset here was recovered from the guide's vector artwork and then",
    " * verified by rendering it in a real browser and pixel-diffing it against the",
    " * PDF's own drawing. The measured agreement (IoU) is noted on each entry.",
    " *",
    " * Three kinds of part:",
    " *   stroke      - a true single stroke recovered from expanded outlines, so it",
    " *                 can be drawn on with stroke-dasharray.",
    " *   fill        - solid artwork (dots, letterforms, the CTA ellipse fill).",
    " *   maskedFill  - variable-width brush artwork. The guide draws these with a",
    " *                 tapering stroke, which no constant-width path can reproduce,",
    " *                 so we keep the exact fill and reveal it with a skeleton mask",
    " *                 that animates by stroke-dasharray. Exact art, real draw-on.",
    " */",
    "",
    "import type { BrandColour } from '@/design/pairings'",
    "",
    "export interface StrokePart {",
    "  kind: 'stroke'",
    "  d: string",
    "  width: number",
    "  colour: BrandColour",
    "}",
    "",
    "export interface FillPart {",
    "  kind: 'fill'",
    "  d: string",
    "  colour: BrandColour",
    "}",
    "",
    "export interface MaskedFillPart {",
    "  kind: 'maskedFill'",
    "  d: string",
    "  /** skeleton subpaths used as the reveal mask */",
    "  mask: string[]",
    "  maskWidth: number",
    "  colour: BrandColour",
    "}",
    "",
    "export type BrandPart = StrokePart | FillPart | MaskedFillPart",
    "",
    "export interface BrandArt {",
    "  viewBox: string",
    "  parts: BrandPart[]",
    "}",
    "",
    "/**",
    " * The mark itself (guide p6): one continuous stroke that loops in on itself to",
    " * make an elephant out of a tooth. Recovered as a true centreline, so the",
    f" * preloader can literally draw it. Verified at {rep.get('logo', 0)}% IoU.",
    " */",
    "export const LOGO = {",
    f"  viewBox: {j(logo['viewBox'])},",
    f"  strokeWidth: {logo['strokeWidth']},",
    f"  body: {j(logo['body'])},",
    f"  trunk: {j(logo['trunk'])},",
    f"  eye: {j(logo['eye'])},",
    "} as const",
    "",
    "/**",
    " * The wordmark (guide p9) is outlined artwork, not type -- note the heart",
    " * shaped tittle on the 'i'. It is extracted verbatim and must never be re-set",
    " * in a substitute typeface, which would change the mark itself.",
    " */",
    "export const WORDMARK = {",
    f"  viewBox: {j(wordmark['viewBox'])},",
    "  paths: [",
]
for p in wordmark["paths"]:
    lines.append(f"    {j(p)},")
lines += ["  ],", "} as const", ""]

lines.append("export const ART = {")
for name, a in data.items():
    lines.append(f"  /* verified {rep.get(name, 0)}% IoU */")
    lines.append(f"  {name}: {{")
    lines.append(f"    viewBox: {j(a['viewBox'])},")
    lines.append("    parts: [")
    for p in a["parts"]:
        if p["kind"] == "stroke":
            lines.append(f"      {{ kind: 'stroke', width: {p['width']}, colour: {j(p['colour'])}, d: {j(p['d'])} }},")
        elif p["kind"] == "fill":
            lines.append(f"      {{ kind: 'fill', colour: {j(p['colour'])}, d: {j(p['d'])} }},")
        else:
            lines.append(f"      {{ kind: 'maskedFill', colour: {j(p['colour'])}, maskWidth: {p['maskWidth']},")
            lines.append(f"        mask: {j(p['mask'])},")
            lines.append(f"        d: {j(p['d'])} }},")
    lines.append("    ],")
    lines.append("  },")
lines += [
    "} satisfies Record<string, BrandArt>",
    "",
    "export type ArtName = keyof typeof ART",
    "",
]

dest = ROOT / "src" / "assets" / "brand"
dest.mkdir(parents=True, exist_ok=True)
out = dest / "paths.ts"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {out}  {out.stat().st_size/1024:.1f} KB  ({len(data)+2} assets)")
