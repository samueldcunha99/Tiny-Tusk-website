"""Centrelines for self-intersecting strokes, via raster skeletonisation.

Contour offsetting cannot decompose a stroke that crosses itself (the
toothbrush bristles, the toothpaste squiggle, the curved arrow). Thinning the
filled mask recovers the medial axis regardless of self-overlap; we then trace
the skeleton graph into branches and fit each one.
"""
import pathlib, sys
import numpy as np
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ttgeom import rdp, catmull_to_cubic, dist
from ttrender import render_svg

SC = pathlib.Path(__file__).parent


def mask_from_paths(d_str, box, px=900):
    """Rasterise filled path data into a boolean mask + the unit->pixel scale."""
    w = px
    h = max(8, int(round(px * box.height / box.width)))
    vb = f"{box.x0:.3f} {box.y0:.3f} {box.width:.3f} {box.height:.3f}"
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">'
           f'<path d="{d_str}" fill="#000" fill-rule="nonzero"/></svg>')
    img = render_svg(svg, SC / "_skel.png", w, h)
    arr = np.asarray(img.convert("L"), dtype=int) < 128
    return arr, w / box.width


def _neighbour_count(sk):
    p = np.pad(sk.astype(np.uint8), 1)
    tot = np.zeros_like(p, dtype=np.uint8)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            tot += np.roll(np.roll(p, dy, 0), dx, 1)
    return (tot[1:-1, 1:-1]) * sk


def trace_branches(sk):
    """Skeleton -> list of pixel polylines between endpoints/junctions."""
    deg = _neighbour_count(sk)
    nodes = set(zip(*np.where((deg == 1) | (deg >= 3))))
    visited = set()
    branches = []

    def nbrs(y, x):
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                yy, xx = y + dy, x + dx
                if 0 <= yy < sk.shape[0] and 0 <= xx < sk.shape[1] and sk[yy, xx]:
                    yield yy, xx

    for node in list(nodes):
        for start in nbrs(*node):
            if (node, start) in visited:
                continue
            path = [node, start]
            visited.add((node, start))
            visited.add((start, node))
            prev, cur = node, start
            while cur not in nodes:
                nxt = [p for p in nbrs(*cur) if p != prev]
                if not nxt:
                    break
                prev, cur = cur, nxt[0]
                visited.add((prev, cur))
                visited.add((cur, prev))
                path.append(cur)
            branches.append(path)

    if not branches and sk.any():          # a closed loop with no nodes
        ys, xs = np.where(sk)
        start = (int(ys[0]), int(xs[0]))
        path, prev, cur = [start], None, start
        while True:
            nxt = [p for p in nbrs(*cur) if p != prev and p not in path[-3:]]
            if not nxt:
                break
            prev, cur = cur, nxt[0]
            path.append(cur)
            if cur == start or len(path) > sk.sum() + 5:
                break
        branches.append(path)
    return branches


def centrelines(d_str, box, px=900, prune_ratio=1.2, eps_units=1.0):
    """Filled path data -> (list of SVG subpath strings, stroke width in units)."""
    from skimage.morphology import skeletonize
    from scipy.ndimage import distance_transform_edt

    mask, scale = mask_from_paths(d_str, box, px)
    if mask.sum() < 20:
        return [], 0.0
    dt = distance_transform_edt(mask)
    sk = skeletonize(mask)
    if not sk.any():
        return [], 0.0

    half_px = float(np.median(dt[sk][dt[sk] > 0.5]))
    width = 2 * half_px / scale

    out = []
    for br in trace_branches(sk):
        if len(br) < 3:
            continue
        length_px = sum(dist(br[i], br[i + 1]) for i in range(len(br) - 1))
        if length_px < prune_ratio * half_px * 2:      # spur
            continue
        pts = [(box.x0 + x / scale, box.y0 + y / scale) for (y, x) in br]
        simp = rdp(pts, eps_units)
        if len(simp) < 2:
            continue
        closed = dist(simp[0], simp[-1]) < eps_units * 2 and len(simp) > 6
        out.append(catmull_to_cubic(simp[:-1] if closed else simp, closed=closed))
    return out, width
