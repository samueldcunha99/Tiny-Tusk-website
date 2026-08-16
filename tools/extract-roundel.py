"""Compile the lollipop-board roundel into src/assets/roundelPaths.ts.

Source: TINY_TUSK_Indoor_Lollipop_Board_2_Aug'26.pdf (client artwork, Aug 2026).
Page 1 is the white-on-cobalt badge: curved tagline, the mark, the smile and
its two tabs. Page 2 is the same geometry in canary, so one extraction covers
both -- the site recolours it with `currentColor`.

The page carries an earlier draft underneath a second cobalt disc; everything
before that disc is hidden and is dropped here. The tagline is live text in the
PDF, so it is taken from PyMuPDF's text-as-path SVG and baked to outlines: the
site must not depend on the board's font being installed.

Run: python tools/extract-roundel.py
"""
import pathlib
import re

import fitz

PDF = pathlib.Path.home() / "Downloads" / "TINY_TUSK_Indoor_Lollipop_Board_2_Aug'26.pdf"
OUT = pathlib.Path(__file__).parent.parent / "src" / "assets" / "roundelPaths.ts"

# The board is 1728pt square; the site works in a 600-unit viewBox.
SCALE = 600 / 1728
# Drawing indices on page 1, in paint order, after the covering cobalt disc.
ARTWORK = {"smile": [5], "tabs": [6, 7], "mark": [8, 9, 10]}


def n(v: float) -> str:
    """Two decimals at 600 units is ~0.05pt on the board: below print tolerance."""
    return f"{round(v * SCALE, 2):g}"


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
            start, rest = item[1], f"L{n(item[2].x)} {n(item[2].y)}"
            end = item[2]
        elif kind == "c":
            a, b, c, d = item[1], item[2], item[3], item[4]
            start, end = a, d
            rest = f"C{n(b.x)} {n(b.y)} {n(c.x)} {n(c.y)} {n(d.x)} {n(d.y)}"
        elif kind in ("re", "qu"):
            pts = (
                [item[1].tl, item[1].tr, item[1].br, item[1].bl]
                if kind == "re"
                else [item[1].ul, item[1].ur, item[1].lr, item[1].ll]
            )
            if cur is not None:
                out.append("Z")
            out.append("M" + "L".join(f"{n(p.x)} {n(p.y)}" for p in pts) + "Z")
            cur = None
            continue
        else:
            raise SystemExit(f"unhandled draw item {kind!r}")

        if cur is None or abs(cur.x - start.x) > 1e-3 or abs(cur.y - start.y) > 1e-3:
            if cur is not None:
                out.append("Z")
            out.append(f"M{n(start.x)} {n(start.y)}")
        out.append(rest)
        cur = end
    return "".join(out) + ("Z" if cur is not None else "")


TOKENS = re.compile(r"([MLCHVZmlchvz])|(-?\d*\.?\d+(?:e-?\d+)?)")


def glyph_path(d: str, m: tuple[float, ...]) -> str:
    """Glyph outline -> page-space path data under the <use> matrix."""
    a, b, c, dd, e, f = m
    tx = lambda x, y: (a * x + c * y + e, b * x + dd * y + f)  # noqa: E731

    nums, cmds = [], []
    for tok in TOKENS.finditer(d):
        (cmds if tok.group(1) else nums).append(tok.group(1) or float(tok.group(2)))
        if tok.group(1):
            cmds[-1] = (tok.group(1), len(nums))

    out, i, cur = [], 0, ("", 0)
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
            out.append(letter + " ".join(f"{n(x)} {n(y)}" for x, y in pts))
    return "".join(out)


def main() -> None:
    doc = fitz.open(PDF)
    page = doc[0]
    drawings = page.get_drawings()

    parts = {
        key: [drawing_path(drawings[i]) for i in idx] for key, idx in ARTWORK.items()
    }

    # Tagline: glyph symbols live in <defs>, each placed by a <use> matrix.
    svg = page.get_svg_image(text_as_path=True)
    symbols = dict(re.findall(r'<path id="(font_[^"]+)" d="([^"]*)"/>', svg))
    uses = re.findall(
        r'<use[^>]*xlink:href="#(font_[^"]+)"[^>]*transform="matrix\(([^)]*)\)"', svg
    )
    tagline = "".join(
        glyph_path(symbols[ref], tuple(float(v) for v in mat.split(",")))
        for ref, mat in uses
        if symbols[ref]
    )

    body = "\n".join(
        f"export const ROUNDEL_{k.upper()}: readonly string[] = [\n"
        + "".join(f"  '{p}',\n" for p in v)
        + "] as const\n"
        for k, v in parts.items()
    )
    OUT.write_text(
        "/**\n"
        " * Roundel geometry, generated by tools/extract-roundel.py from\n"
        " * TINY_TUSK_Indoor_Lollipop_Board_2_Aug'26.pdf. Do not hand-edit: rerun\n"
        " * the script. Coordinates are a 600-unit square, tagline already\n"
        " * outlined so no font is involved.\n"
        " */\n\n"
        f"export const ROUNDEL_VIEWBOX = '0 0 600 600'\n\n"
        f"export const ROUNDEL_TAGLINE = '{tagline}'\n\n" + body,
        encoding="utf-8",
    )
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
