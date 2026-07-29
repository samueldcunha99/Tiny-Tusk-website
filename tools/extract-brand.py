"""Compile the guide's artwork into src/assets/brand/paths.ts."""
import fitz, json, pathlib, sys
import numpy as np
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ttgeom import *
from tt_assets import build_component, BRAND, snap, hexof
from ttskel import centrelines, mask_from_paths
from ttrender import render_svg, coverage_report, shutdown
from scipy.ndimage import distance_transform_edt

SC = pathlib.Path(__file__).parent
ROOT = pathlib.Path(r"c:\Users\HP\OneDrive\Desktop\My websites\Tiny Tusk website")
PDF = str(ROOT / "TINY_TUSK_Visual_Identity_Guide.pdf")
doc = fitz.open(PDF)

# name -> (page, [drawing indices], set of indices to treat as variable-width)
SPEC = {
    "doodleToothbrush": (30, [12, 13, 14], {14}),
    "doodleToothpaste": (30, [5, 6, 7], {7}),
    "doodleFace":       (30, [8, 9, 10, 11], set()),
    "doodleHeart":      (30, [15, 16], set()),
    "markLasso":        (31, [10], set()),
    "markDashes":       (31, [6, 7, 8], set()),
    "markArrow":        (31, [9], {9}),
    "markZigzag":       (31, [11, 12], set()),
    "ctaCanary":        (33, [4, 5], set()),
    "ctaPowder":        (33, [6, 7], set()),
    "ctaCoral":         (33, [8, 9], set()),
    "loopStroke":       (28, [1], set()),
    # p3 is a five-glyph progression that builds the logo one stroke at a time,
    # with the finished cobalt mark at the centre.
    "journeyDetection": (3,  [14, 13, 15], set()),
    "journeyTreatment": (3,  [17, 16, 18], set()),
    "journeyLogo":      (3,  [1, 0, 2], set()),
    "journeyCare":      (3,  [7, 23], set()),
    "journeySmile":     (3,  [4, 3, 10, 11, 12], set()),
}

report = []
assets = {}

for name, (pno, ids, varwidth) in SPEC.items():
    drs = doc[pno-1].get_drawings()
    box = drs[ids[0]]["rect"]
    for i in ids[1:]:
        box = box | drs[i]["rect"]

    parts, maxw = [], 0.0
    for i in ids:
        dr = drs[i]
        colour = snap(hexof(dr.get("fill")) or hexof(dr.get("color"))) or "cobalt"
        dstr = subpaths_to_d(items_to_subpaths(dr["items"]),
                             close=(dr["type"] != "s"))
        if i in varwidth:
            sub_box = dr["rect"]
            branches, _ = centrelines(dstr, sub_box, px=1000)
            mask, scale = mask_from_paths(dstr, sub_box, 1000)
            mw = 2 * float(distance_transform_edt(mask).max()) / scale * 1.3 + 4
            parts.append({"kind": "maskedFill", "d": dstr, "colour": colour,
                          "mask": branches, "maskWidth": round(mw, 2)})
            maxw = max(maxw, mw)
        else:
            c = build_component(dr)
            if not c:
                continue
            if c["kind"] == "stroke":
                parts.append({"kind": "stroke", "d": c["d"],
                              "width": round(c["width"], 2), "colour": colour})
                maxw = max(maxw, c["width"])
            else:
                parts.append({"kind": "fill", "d": c["d"], "colour": colour})

    pad = maxw / 2 + 2
    vb = f"{box.x0-pad:.2f} {box.y0-pad:.2f} {box.width+2*pad:.2f} {box.height+2*pad:.2f}"
    assets[name] = {"viewBox": vb, "parts": parts}

    # verify: does the emitted asset reproduce the guide's artwork?
    def render_parts(ps, mono=True):
        out = []
        for k, p in enumerate(ps):
            col = "#000" if mono else BRAND.get(p["colour"], "#000")
            if p["kind"] == "stroke":
                out.append(f'<path d="{p["d"]}" fill="none" stroke="{col}" '
                           f'stroke-width="{p["width"]}" stroke-linecap="round" '
                           f'stroke-linejoin="round"/>')
            elif p["kind"] == "maskedFill":
                mid = f"m{k}"
                strokes = "".join(f'<path d="{s}"/>' for s in p["mask"])
                out.append(
                    f'<defs><mask id="{mid}" maskUnits="userSpaceOnUse" '
                    f'x="{box.x0-pad:.2f}" y="{box.y0-pad:.2f}" '
                    f'width="{box.width+2*pad:.2f}" height="{box.height+2*pad:.2f}">'
                    f'<g fill="none" stroke="#fff" stroke-width="{p["maskWidth"]}" '
                    f'stroke-linecap="round" stroke-linejoin="round">{strokes}</g>'
                    f'</mask></defs>'
                    f'<path d="{p["d"]}" fill="{col}" mask="url(#{mid})"/>')
            else:
                out.append(f'<path d="{p["d"]}" fill="{col}" fill-rule="nonzero"/>')
        return "".join(out)

    ref_body = "".join(
        (f'<path d="{subpaths_to_d(items_to_subpaths(drs[i]["items"]), close=False)}" fill="none" '
         f'stroke="#000" stroke-width="{drs[i].get("width") or 1}" stroke-linecap="round" '
         f'stroke-linejoin="round"/>') if drs[i]["type"] == "s" else
        (f'<path d="{subpaths_to_d(items_to_subpaths(drs[i]["items"]))}" fill="#000" '
         f'fill-rule="nonzero"/>')
        for i in ids)

    w = 420
    h = max(40, int(round(w * (box.height + 2*pad) / (box.width + 2*pad))))
    ref = render_svg(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{ref_body}</svg>',
                     SC / "assets" / f"final-{name}.ref.png", w, h)
    tst = render_svg(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{render_parts(parts)}</svg>',
                     SC / "assets" / f"final-{name}.test.png", w, h)
    iou = coverage_report(ref, tst, f"{name:20}")
    report.append((name, round(iou, 2), [p["kind"] for p in parts]))

# ---------------------------------------------------------------- logo ----
# Recovered centreline of the guide's single-stroke construction (p6).
page6 = doc[5]
d6 = page6.get_drawings()
W_LOGO = 43.70
body_polys = [flatten(s) for s in items_to_subpaths(d6[6]["items"])]
body_polys.sort(key=lambda p: abs(signed_area(p)), reverse=True)
mid, corner_idx, _ = offset_collapse(body_polys[1], W_LOGO/2, sign=-1.0, samples=2400, merge=0.6)
cs = sorted(corner_idx); n = len(mid)
rot = cs[0]; order = [(i + rot) % n for i in range(n)]
marks = sorted({(c - rot) % n for c in cs})
red, rc = [], set()
for k, m in enumerate(marks):
    nxt = marks[k+1] if k + 1 < len(marks) else n
    run = ([mid[order[j]] for j in range(m, nxt + 1)] if nxt < n
           else [mid[order[j]] for j in range(m, n)] + [mid[order[0]]])
    rc.add(len(red)); red.extend(rdp(run, 0.9)[:-1])
body_d = emit_closed(red, rc)

import math
CX, CY, R = 1440.21, 473.08, 113.93
polar = lambda t: (CX + R*math.cos(math.radians(t)), CY + R*math.sin(math.radians(t)))
a0, a1, a2 = polar(0), polar(-135), polar(-270)
trunk_d = (f"M {a0[0]:.2f} {a0[1]:.2f} A {R:.2f} {R:.2f} 0 0 0 {a1[0]:.2f} {a1[1]:.2f} "
           f"A {R:.2f} {R:.2f} 0 0 0 {a2[0]:.2f} {a2[1]:.2f} L 1616.21 {a2[1]:.2f}")

lbox = d6[6]["rect"] | d6[7]["rect"] | d6[8]["rect"]
assets["logo"] = {
    "viewBox": f"{lbox.x0:.2f} {lbox.y0:.2f} {lbox.width:.2f} {lbox.height:.2f}",
    "strokeWidth": W_LOGO,
    "body": body_d,
    "trunk": trunk_d,
    "eye": {"cx": 1443.54, "cy": 478.44, "r": 27.70},
}
logo_svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{assets["logo"]["viewBox"]}">'
            f'<g fill="none" stroke="#000" stroke-width="{W_LOGO}" stroke-linecap="round" '
            f'stroke-linejoin="round"><path d="{body_d}"/><path d="{trunk_d}"/></g>'
            f'<circle cx="1443.54" cy="478.44" r="27.70" fill="#000"/></svg>')
logo_ref = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{assets["logo"]["viewBox"]}" fill="#000">'
            + "".join(f'<path d="{items_to_d(d6[i]["items"])}" fill-rule="nonzero"/>' for i in (6, 8, 7))
            + "</svg>")
rf = render_svg(logo_ref, SC / "assets" / "final-logo.ref.png", 500, 395)
tf = render_svg(logo_svg, SC / "assets" / "final-logo.test.png", 500, 395)
report.append(("logo", round(coverage_report(rf, tf, f"{'logo':20}"), 2), ["stroke"]))

# ------------------------------------------------------------ wordmark ----
# Outlined artwork, extracted verbatim -- never re-set as type.
p9 = doc[8]
wm = [dr for dr in p9.get_drawings()
      if dr["type"] == "f" and 1000 <= dr["rect"].x0 and dr["rect"].x1 <= 1800
      and 380 <= dr["rect"].y0 and dr["rect"].y1 <= 700 and dr["rect"].width > 1]
wbox = wm[0]["rect"]
for p in wm[1:]: wbox = wbox | p["rect"]
assets["wordmark"] = {
    "viewBox": f"{wbox.x0:.2f} {wbox.y0:.2f} {wbox.width:.2f} {wbox.height:.2f}",
    "paths": [items_to_d(p["items"]) for p in wm],
}
report.append(("wordmark", 100.0, ["fill"] * len(wm)))

(SC / "assets" / "emit-report.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
(SC / "assets" / "assets.json").write_text(json.dumps(assets, indent=1), encoding="utf-8")
print("\nlow:", [r for r in report if r[1] < 97])
shutdown()
