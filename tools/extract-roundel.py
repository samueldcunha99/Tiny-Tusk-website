"""Compile the brand book's tagline roundel into src/assets/roundelPaths.ts.

Source: TINY_TUSK_Visual_Identity_Guide.pdf, page 1 -- the cover, where the
guide sets its tagline unit in white on cobalt: curved tagline, the mark, the
smile and its two tabs. The site recolours it with `fill`.

History: the first extraction came from the client's indoor lollipop board
(TINY_TUSK_Indoor_Lollipop_Board_2_Aug'26.pdf), which draws the mark about
40% larger inside the ring -- 60% of the smile's width against the cover's
42%. The user rejected that as the wrong logo (2026-09-23) and pointed at the
cover, so the guide is the source now, and it ships in the repo.

The tagline is live text in the PDF (Avenir Next Condensed), so it is taken
from PyMuPDF's text-as-path SVG and baked to outlines: the site must not depend
on the guide's font being installed. Only glyphs placed inside the roundel are
kept -- the cover also sets "Pediatric Dental Clinic" and the spine text.

Run: python tools/extract-roundel.py
"""
import pathlib
import re

import fitz

ROOT = pathlib.Path(__file__).parent.parent
PDF = ROOT / "TINY_TUSK_Visual_Identity_Guide.pdf"
OUT = ROOT / "src" / "assets" / "roundelPaths.ts"

# Drawing indices on the cover, in paint order (0 is the cobalt page itself).
ARTWORK = {"smile": [1], "tabs": [2, 3], "mark": [4, 5, 6]}
# Where the tagline's glyphs are placed on the 1920x1080 cover.
TAGLINE_REGION = fitz.Rect(760, 270, 1140, 470)
# The unit is fitted, centred, into a 600-unit square with this margin -- the
# footprint the lollipop geometry had, so existing call sites keep their size.
BOX, MARGIN = 600, 54

TOKENS = re.compile(r"([MLCHVZmlchvz])|(-?\d*\.?\d+(?:e-?\d+)?)")


def f(v: float) -> str:
    return f"{v:.4f}"


def drawing_path(drawing) -> str:
    """PDF drawing items -> SVG path data, in page coordinates.

    Items arrive as consecutive segments. A segment that does not start where
    the last one ended begins a new contour, which is how the outlines carry
    their holes (the eye, the gap inside the trunk).
    """
    out: list[str] = []
    cur = None
    for item in drawing["items"]:
        kind = item[0]
        if kind == "l":
            start, end = item[1], item[2]
            rest = f"L{f(end.x)} {f(end.y)}"
        elif kind == "c":
            start, b, c, end = item[1], item[2], item[3], item[4]
            rest = f"C{f(b.x)} {f(b.y)} {f(c.x)} {f(c.y)} {f(end.x)} {f(end.y)}"
        elif kind in ("re", "qu"):
            pts = (
                [item[1].tl, item[1].tr, item[1].br, item[1].bl]
                if kind == "re"
                else [item[1].ul, item[1].ur, item[1].lr, item[1].ll]
            )
            if cur is not None:
                out.append("Z")
            out.append("M" + "L".join(f"{f(p.x)} {f(p.y)}" for p in pts) + "Z")
            cur = None
            continue
        else:
            raise SystemExit(f"unhandled draw item {kind!r}")

        if cur is None or abs(cur.x - start.x) > 1e-3 or abs(cur.y - start.y) > 1e-3:
            if cur is not None:
                out.append("Z")
            out.append(f"M{f(start.x)} {f(start.y)}")
        out.append(rest)
        cur = end
    return "".join(out) + ("Z" if cur is not None else "")


def glyph_path(d: str, m: tuple[float, ...]) -> str:
    """Glyph outline -> page-space path data under the <use> matrix."""
    a, b, c, dd, e, ff = m
    tx = lambda x, y: (a * x + c * y + e, b * x + dd * y + ff)  # noqa: E731

    nums, cmds = [], []
    for tok in TOKENS.finditer(d):
        (cmds if tok.group(1) else nums).append(tok.group(1) or float(tok.group(2)))
        if tok.group(1):
            cmds[-1] = (tok.group(1), len(nums))

    out, cur = [], (0.0, 0.0)
    for idx, (cmd, start) in enumerate(cmds):
        end = cmds[idx + 1][1] if idx + 1 < len(cmds) else len(nums)
        args = nums[start:end]
        if cmd == "Z":
            out.append("Z")
            continue
        step = {"M": 2, "L": 2, "C": 6, "H": 1, "V": 1}[cmd]
        # A repeated command (e.g. "C" with 12 numbers) is an implicit sequence.
        for k in range(0, len(args), step):
            chunk = args[k : k + step]
            if cmd == "H":
                chunk = [chunk[0], cur[1]]
            elif cmd == "V":
                chunk = [cur[0], chunk[0]]
            pts = [tx(chunk[j], chunk[j + 1]) for j in range(0, len(chunk), 2)]
            cur = (chunk[-2], chunk[-1])
            letter = {"M": "M", "L": "L", "H": "L", "V": "L", "C": "C"}[cmd]
            if k and cmd == "M":
                letter = "L"
            out.append(letter + " ".join(f"{f(x)} {f(y)}" for x, y in pts))
    return "".join(out)


def pairs(path: str):
    """Every coordinate pair in a path this script emitted (absolute M/L/C only)."""
    nums = [float(t.group(2)) for t in TOKENS.finditer(path) if t.group(2)]
    return list(zip(nums[0::2], nums[1::2]))


def main() -> None:
    page = fitz.open(PDF)[0]
    drawings = page.get_drawings()
    for idx in sum(ARTWORK.values(), []):
        if tuple(drawings[idx]["fill"] or ()) != (1.0, 1.0, 1.0):
            raise SystemExit(f"drawing {idx} is not the white roundel -- has the cover changed?")

    parts = {key: [drawing_path(drawings[i]) for i in idx] for key, idx in ARTWORK.items()}

    # Tagline: glyph symbols live in <defs>, each placed by a <use> matrix.
    svg = page.get_svg_image(text_as_path=True)
    symbols = dict(re.findall(r'<path id="(font_[^"]+)" d="([^"]*)"/>', svg))
    uses = re.findall(
        r'<use[^>]*xlink:href="#(font_[^"]+)"[^>]*transform="matrix\(([^)]*)\)"', svg
    )
    glyphs = []
    for ref, mat in uses:
        m = tuple(float(v) for v in mat.split(","))
        if symbols.get(ref) and TAGLINE_REGION.contains(fitz.Point(m[4], m[5])):
            glyphs.append(glyph_path(symbols[ref], m))
    if len(glyphs) != len("GentleCareforGrowingSmiles"):
        raise SystemExit(f"expected 26 tagline glyphs, found {len(glyphs)}")
    tagline = "".join(glyphs)

    # Fit the whole unit, centred, into the square.
    everything = [tagline] + sum(parts.values(), [])
    pts = [p for path in everything for p in pairs(path)]
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
    y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
    s = (BOX - 2 * MARGIN) / max(x1 - x0, y1 - y0)
    ox, oy = BOX / 2 - (x0 + x1) / 2 * s, BOX / 2 - (y0 + y1) / 2 * s

    def fit(path: str) -> str:
        it = iter(TOKENS.finditer(path))
        out, axis = [], 0
        for t in it:
            if t.group(1):
                out.append(t.group(1))
                continue
            v = float(t.group(2))
            v = v * s + (ox if axis == 0 else oy)
            axis ^= 1
            out.append(f"{round(v, 2):g}")
            out.append(" ")
        return re.sub(r" (?=[MLCZ])|\s+$", "", "".join(out))

    body = "\n".join(
        f"export const ROUNDEL_{k.upper()}: readonly string[] = [\n"
        + "".join(f"  '{fit(p)}',\n" for p in v)
        + "] as const\n"
        for k, v in parts.items()
    )
    OUT.write_text(
        "/**\n"
        " * Roundel geometry, generated by tools/extract-roundel.py from the cover\n"
        " * of TINY_TUSK_Visual_Identity_Guide.pdf. Do not hand-edit: rerun the\n"
        " * script. Coordinates are a 600-unit square, tagline already outlined so\n"
        " * no font is involved.\n"
        " */\n\n"
        f"export const ROUNDEL_VIEWBOX = '0 0 {BOX} {BOX}'\n\n"
        f"export const ROUNDEL_TAGLINE = '{fit(tagline)}'\n\n" + body,
        encoding="utf-8",
    )
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes), scale {s:.4f}")


if __name__ == "__main__":
    main()
