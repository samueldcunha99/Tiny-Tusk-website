"""Extract every artwork element from the identity guide as clean, animatable SVG."""
import fitz, math, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ttgeom import *

SC = pathlib.Path(__file__).parent
PDF = r"c:\Users\HP\OneDrive\Desktop\My websites\Tiny Tusk website\TINY_TUSK_Visual_Identity_Guide.pdf"
OUT = SC / "assets"
OUT.mkdir(exist_ok=True)

BRAND = {"cobalt": "#18528E", "coral": "#F16C59", "canary": "#FFE497",
         "powder": "#C1CBE7", "paper": "#F7F7F7", "white": "#FFFFFF"}

def hexof(c):
    if c is None: return None
    return "#" + "".join(f"{int(round(v*255)):02X}" for v in c)

def snap(hx):
    """Snap the guide's drifted artwork colours onto the authoritative palette."""
    if hx is None: return None
    r, g, b = int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16)
    best, bd = None, 1e9
    for name, v in BRAND.items():
        rr, gg, bb = int(v[1:3], 16), int(v[3:5], 16), int(v[5:7], 16)
        d = (r-rr)**2 + (g-gg)**2 + (b-bb)**2
        if d < bd: bd, best = d, name
    return best if bd <= 900 else None      # within ~30 per channel

# page chrome we never want in an asset
def is_chrome(dr):
    r = dr["rect"]
    if r.width >= 500 and r.height >= 500: return True          # colour fields
    if r.x1 <= 160 and r.y1 <= 140: return True                 # corner logo
    if r.width < 2.5 and r.height > 400: return True            # rules
    if r.height < 2.5 and r.width > 400: return True
    hx = hexof(dr.get("fill")) or hexof(dr.get("color"))
    if hx and hx.upper() in ("#A7A9AC", "#A6A8AB", "#081629", "#F1F2F2", "#020202"): return True
    return False


def group_drawings(drs, gap=26.0):
    """Union-find drawings whose bounding boxes nearly touch."""
    idx = [i for i, d in enumerate(drs) if not is_chrome(d)]
    parent = {i: i for i in idx}
    def find(a):
        while parent[a] != a: parent[a] = parent[parent[a]]; a = parent[a]
        return a
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb: parent[ra] = rb
    for a in idx:
        for b in idx:
            if a >= b: continue
            ra, rb = drs[a]["rect"], drs[b]["rect"]
            if (ra.x0 - gap < rb.x1 and rb.x0 - gap < ra.x1 and
                ra.y0 - gap < rb.y1 and rb.y0 - gap < ra.y1):
                union(a, b)
    groups = {}
    for i in idx:
        groups.setdefault(find(i), []).append(i)
    return list(groups.values())


def build_component(dr):
    """One drawing -> {kind, d, width, colour} ready for SVG emission."""
    subs = items_to_subpaths(dr["items"])
    polys = [flatten(s) for s in subs]
    colour = snap(hexof(dr.get("fill")) or hexof(dr.get("color")))

    if dr["type"] == "s":                       # already a live stroke
        return {"kind": "stroke", "d": subpaths_to_d(subs, close=False),
                "width": dr.get("width") or 1.0, "colour": colour, "cap": "round"}

    polys = [p for p in polys if polylen(p) > 4]
    if not polys:
        return None
    polys.sort(key=lambda p: abs(signed_area(p)), reverse=True)

    W0 = stroke_width_of(polys)
    if W0 <= 0.5:
        return {"kind": "fill", "d": subpaths_to_d(subs), "colour": colour}

    try:
        if len(polys) >= 2:                     # ring: hole contour carries joins
            seed, corners, _ = offset_collapse(polys[1], W0/2, sign=-1.0)
            W = 2 * refine_half_width(polys, seed)
            mid, corners, _ = offset_collapse(polys[1], W/2, sign=-1.0)
            if len(mid) < 8: raise ValueError
            d = spline_closed(mid, corners)
        else:                                   # open stroke with round caps
            seed, err = centreline_open(polys[0], W0/2)
            if not seed or err > 0.35: raise ValueError("not a simple open stroke")
            W = 2 * refine_half_width(polys, seed)
            mid, err = centreline_open(polys[0], W/2)
            if not mid or len(mid) < 4 or err > 0.35:
                raise ValueError("not a simple open stroke")
            d = spline_open(mid)
    except Exception as e:
        return {"kind": "fill", "d": subpaths_to_d(subs), "colour": colour,
                "note": f"centreline failed: {e}"}

    # a blob (dot) rather than a stroke
    xs = [p[0] for p in polys[0]]; ys = [p[1] for p in polys[0]]
    if W > 0.8 * min(max(xs)-min(xs), max(ys)-min(ys)):
        return {"kind": "fill", "d": subpaths_to_d(subs), "colour": colour}

    return {"kind": "stroke", "d": d, "width": W, "colour": colour, "cap": "round"}


def spline_closed(mid, corners, eps=0.7):
    n = len(mid)
    cs = sorted(corners)
    if not cs:
        return catmull_to_cubic(rdp(mid + [mid[0]], eps)[:-1], closed=True)
    rot = cs[0]
    order = [(i + rot) % n for i in range(n)]
    marks = sorted({(c - rot) % n for c in cs})
    red, rc = [], set()
    for k, m in enumerate(marks):
        nxt = marks[k+1] if k + 1 < len(marks) else n
        run = ([mid[order[j]] for j in range(m, nxt + 1)] if nxt < n
               else [mid[order[j]] for j in range(m, n)] + [mid[order[0]]])
        rc.add(len(red)); red.extend(rdp(run, eps)[:-1])
    return emit_closed(red, rc)


def spline_open(mid, eps=0.7):
    return catmull_to_cubic(rdp(mid, eps), closed=False)


# --------------------------------------------------------------------------
def emit_asset(comps, box, pad=6.0):
    x0, y0, x1, y1 = box.x0 - pad, box.y0 - pad, box.x1 + pad, box.y1 + pad
    vb = f"{x0:.2f} {y0:.2f} {x1-x0:.2f} {y1-y0:.2f}"
    body = []
    for c in comps:
        col = BRAND.get(c["colour"], "currentColor") if c["colour"] else "currentColor"
        if c["kind"] == "stroke":
            body.append(f'<path d="{c["d"]}" fill="none" stroke="{col}" '
                        f'stroke-width="{c["width"]:.2f}" stroke-linecap="round" '
                        f'stroke-linejoin="round"/>')
        else:
            body.append(f'<path d="{c["d"]}" fill="{col}" fill-rule="nonzero"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">\n  '
            + "\n  ".join(body) + "\n</svg>"), vb


def reference_svg(drs, ids, vb):
    body = []
    for i in ids:
        dr = drs[i]
        subs = items_to_subpaths(dr["items"])
        if dr["type"] == "s":
            body.append(f'<path d="{subpaths_to_d(subs, close=False)}" fill="none" '
                        f'stroke="#000" stroke-width="{dr.get("width") or 1}" '
                        f'stroke-linecap="round" stroke-linejoin="round"/>')
        else:
            body.append(f'<path d="{subpaths_to_d(subs)}" fill="#000" fill-rule="nonzero"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">' + "".join(body) + "</svg>"


if __name__ == "__main__":
    from ttrender import render_svg, coverage_report
    import re
    doc = fitz.open(PDF)
    pages = [int(a) for a in sys.argv[1:]] or [3, 28, 29, 30, 31, 33, 36]
    report = []
    for pno in pages:
        page = doc[pno-1]
        drs = page.get_drawings()
        for gi, ids in enumerate(sorted(group_drawings(drs), key=lambda g: (
                round(min(drs[i]["rect"].y0 for i in g) / 200),
                min(drs[i]["rect"].x0 for i in g)))):
            box = drs[ids[0]]["rect"]
            for i in ids[1:]: box = box | drs[i]["rect"]
            if box.width < 12 or box.height < 12: continue
            comps = [c for c in (build_component(drs[i]) for i in ids) if c]
            if not comps: continue
            svg, vb = emit_asset(comps, box)
            name = f"p{pno:02d}-{gi:02d}"
            (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")

            w = 300; h = max(40, int(round(300 * (box.height + 12) / (box.width + 12))))
            ref = render_svg(reference_svg(drs, ids, vb), OUT / f"{name}.ref.png", w, h)
            mono = re.sub(r'stroke="#[0-9A-Fa-f]{6}"', 'stroke="#000"', svg)
            mono = re.sub(r'fill="#[0-9A-Fa-f]{6}"', 'fill="#000"', mono)
            mono = mono.replace("currentColor", "#000")
            tst = render_svg(mono, OUT / f"{name}.test.png", w, h)
            iou = coverage_report(ref, tst, f"{name} [{len(comps)} comp]")
            report.append({"name": name, "page": pno, "iou": round(iou, 2),
                           "kinds": [c["kind"] for c in comps],
                           "widths": [round(c.get("width", 0), 2) for c in comps],
                           "colours": [c["colour"] for c in comps],
                           "notes": [c["note"] for c in comps if c.get("note")],
                           "box": [round(v, 1) for v in (box.x0, box.y0, box.x1, box.y1)]})
    (OUT / "report.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
    bad = [r for r in report if r["iou"] < 97]
    fallback = [r for r in report if r.get("notes")]
    print(f"\n{len(report)} assets | {len(bad)} below 97% IoU | "
          f"{len(fallback)} with a non-animatable fallback component")
    for r in bad: print("  LOW IoU:", r["name"], r["iou"], r["kinds"], r["widths"])
    for r in fallback: print("  FALLBACK:", r["name"], r["notes"])
    from ttrender import shutdown; shutdown()
