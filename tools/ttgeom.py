"""Geometry toolkit: recover stroke centrelines from expanded-outline artwork."""
import math

# ---------- basic vector helpers ----------
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def add(a, b): return (a[0] + b[0], a[1] + b[1])
def mul(a, s): return (a[0] * s, a[1] * s)
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def norm(a): return math.hypot(a[0], a[1])
def dist(a, b): return math.hypot(a[0] - b[0], a[1] - b[1])


def bez(p0, p1, p2, p3, t):
    u = 1 - t
    return (u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
            u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1])


def items_to_subpaths(items):
    """PyMuPDF drawing items -> list of subpaths; each subpath is a list of segments."""
    subs, cur, last = [], [], None
    for it in items:
        op = it[0]
        if op == "l":
            p0, p1 = (it[1].x, it[1].y), (it[2].x, it[2].y)
            seg = ("l", p0, p1)
        elif op == "c":
            p0 = (it[1].x, it[1].y); p1 = (it[2].x, it[2].y)
            p2 = (it[3].x, it[3].y); p3 = (it[4].x, it[4].y)
            seg = ("c", p0, p1, p2, p3)
        elif op == "re":
            r = it[1]
            pts = [(r.x0, r.y0), (r.x1, r.y0), (r.x1, r.y1), (r.x0, r.y1), (r.x0, r.y0)]
            if cur: subs.append(cur); cur = []
            subs.append([("l", pts[i], pts[i+1]) for i in range(4)])
            last = None
            continue
        else:
            continue
        start = seg[1]
        if last is not None and dist(start, last) > 0.05:
            subs.append(cur); cur = []
        cur.append(seg)
        last = seg[-1]
    if cur: subs.append(cur)
    return subs


def subpaths_to_d(subs, close=True):
    """Subpaths -> SVG path data, preserving the original curves exactly."""
    out = []
    for sub in subs:
        p0 = sub[0][1]
        out.append(f"M {p0[0]:.3f} {p0[1]:.3f}")
        for seg in sub:
            if seg[0] == "l":
                out.append(f"L {seg[2][0]:.3f} {seg[2][1]:.3f}")
            else:
                _, _, c1, c2, p3 = seg
                out.append(f"C {c1[0]:.3f} {c1[1]:.3f} {c2[0]:.3f} {c2[1]:.3f} {p3[0]:.3f} {p3[1]:.3f}")
        if close:
            out.append("Z")
    return " ".join(out)


def items_to_d(items, close=True):
    return subpaths_to_d(items_to_subpaths(items), close=close)


def flatten(sub, step=0.75):
    """Subpath -> dense polyline."""
    pts = []
    for seg in sub:
        if seg[0] == "l":
            p0, p1 = seg[1], seg[2]
            n = max(2, int(dist(p0, p1) / step))
            for i in range(n):
                pts.append((p0[0] + (p1[0]-p0[0])*i/n, p0[1] + (p1[1]-p0[1])*i/n))
        else:
            p0, p1, p2, p3 = seg[1], seg[2], seg[3], seg[4]
            approx = dist(p0, p1) + dist(p1, p2) + dist(p2, p3)
            n = max(4, int(approx / step))
            for i in range(n):
                pts.append(bez(p0, p1, p2, p3, i / n))
    pts.append(sub[-1][-1])
    return pts


def polylen(pts):
    return sum(dist(pts[i], pts[i+1]) for i in range(len(pts)-1))


def resample(pts, n, closed=False):
    """Uniform arc-length resampling."""
    p = list(pts)
    if closed and dist(p[0], p[-1]) > 1e-6:
        p.append(p[0])
    cum = [0.0]
    for i in range(len(p)-1):
        cum.append(cum[-1] + dist(p[i], p[i+1]))
    total = cum[-1]
    out, j = [], 0
    count = n if closed else n
    for i in range(count):
        target = total * i / (count if closed else (count - 1))
        while j < len(cum)-2 and cum[j+1] < target:
            j += 1
        span = cum[j+1] - cum[j]
        t = 0 if span < 1e-12 else (target - cum[j]) / span
        out.append((p[j][0] + (p[j+1][0]-p[j][0])*t,
                    p[j][1] + (p[j+1][1]-p[j][1])*t))
    return out


def centreline_ring(outer_pts, inner_pts, samples=900):
    """Average an outer contour against its inner counterpart -> centreline."""
    O = resample(outer_pts, samples, closed=True)
    I = resample(inner_pts, max(samples, 1200), closed=True)
    mids = []
    for o in O:
        best, bd = None, 1e18
        for q in I:
            d = (o[0]-q[0])**2 + (o[1]-q[1])**2
            if d < bd:
                bd, best = d, q
        mids.append(((o[0]+best[0])/2, (o[1]+best[1])/2))
    return mids


def signed_area(pts):
    s = 0.0
    n = len(pts)
    for i in range(n):
        a, b = pts[i], pts[(i+1) % n]
        s += a[0]*b[1] - b[0]*a[1]
    return s / 2


def offset_collapse(pts, half, sign=1.0, samples=2400, merge=0.6):
    """Offset a stroke-boundary contour by `half` toward the centreline.

    Every point of a round-cap/round-join stroke boundary lies exactly `half`
    from the centreline, and *join arcs collapse onto the exact corner vertex*.
    Feed it the boundary whose corners are round joins (smooth apexes), not the
    one where the offset lines self-cross -- cusps there produce swallowtails.
    `sign=+1` offsets into the contour's own enclosed region, -1 away from it.
    """
    P = resample(pts, samples, closed=True)
    inward = (1.0 if signed_area(P) > 0 else -1.0) * sign
    n = len(P)
    raw = []
    for i in range(n):
        a, b = P[(i-1) % n], P[(i+1) % n]
        t = sub(b, a)
        L = norm(t)
        if L < 1e-9:
            continue
        t = (t[0]/L, t[1]/L)
        nv = (-t[1]*inward, t[0]*inward)
        raw.append((P[i][0] + nv[0]*half, P[i][1] + nv[1]*half))

    # turning contributed by each boundary sample (arc sweep of joins and caps)
    turns = []
    m = len(raw)
    for i in range(m):
        a, b, c = P[(i-1) % n], P[i], P[(i+1) % n]
        v1, v2 = sub(b, a), sub(c, b)
        if norm(v1) < 1e-9 or norm(v2) < 1e-9:
            turns.append(0.0); continue
        cosv = max(-1, min(1, dot(v1, v2)/(norm(v1)*norm(v2))))
        turns.append(math.degrees(math.acos(cosv)))

    # collapse the clusters produced by join/cap arcs into single vertices
    out, weight, sweep = [], [], []
    for p, tw in zip(raw, turns):
        if out and dist(p, out[-1]) < merge:
            k = weight[-1]
            out[-1] = ((out[-1][0]*k + p[0])/(k+1), (out[-1][1]*k + p[1])/(k+1))
            weight[-1] = k + 1
            sweep[-1] += tw
        else:
            out.append(p); weight.append(1); sweep.append(tw)
    while len(out) > 1 and dist(out[0], out[-1]) < merge:
        out.pop(); weight.pop(); sweep.pop()
    corners = {i for i, k in enumerate(weight) if k >= 6}
    return out, corners, sweep


def refine_half_width(polys, seeds, samples=40):
    """Max inscribed radius via local hill-climb from centreline seeds.

    Uses the median of the per-seed maxima so overlapping strokes (scribbles)
    don't inflate the estimate the way a global max would.
    """
    import numpy as np
    pts = [p for poly in polys for p in poly]
    if not seeds or not pts:
        return 0.0
    B = np.asarray(pts, dtype=float)
    S = np.asarray(seeds[::max(1, len(seeds)//samples)], dtype=float)

    def mindist(C):                       # C: (k,2) -> (k,)
        return np.sqrt(((C[:, None, :] - B[None, :, :])**2).sum(-1)).min(1)

    cur = S.copy()
    dcur = mindist(cur)
    step = np.full(len(cur), 3.0)
    for _ in range(60):
        moved = np.zeros(len(cur), dtype=bool)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            cand = cur + np.stack([step*dx, step*dy], axis=1)
            dc = mindist(cand)
            better = dc > dcur
            cur[better] = cand[better]
            dcur[better] = dc[better]
            moved |= better
        step[~moved] /= 2
        if (step < 0.02).all():
            break
    return float(np.median(dcur))


def _mean_nn(A, B):
    import numpy as np
    if len(A) < 2 or len(B) < 2:
        return 1e9
    P, Q = np.asarray(A, float), np.asarray(B, float)
    D = np.sqrt(((P[:, None, :] - Q[None, :, :])**2).sum(-1))
    return float(max(D.min(1).mean(), D.min(0).mean()))


def centreline_open(contour, half, samples=2400, merge=None, cap_min=90.0):
    """Centreline of an *open* stroke whose boundary is one closed contour.

    The boundary runs down one side, sweeps ~180 degrees round a cap, back up
    the other side, and round the second cap. Offsetting inward collapses both
    caps to the endpoints, so we split there and keep one side.

    Which clusters are the caps is decided by a symmetry test, not by sweep
    alone -- sharp joins also produce big sweeps. Returns (centreline, error);
    a large error means the stroke self-intersects and cannot be recovered
    this way, and the caller should fall back rather than emit nonsense.
    """
    if merge is None:
        merge = max(0.25, half * 0.03)
    pts, _, sweep = offset_collapse(contour, half, sign=1.0,
                                    samples=samples, merge=merge)
    n = len(pts)
    if n < 6:
        return None, 1e9
    cands = [i for i in sorted(range(n), key=lambda i: sweep[i], reverse=True)
             if sweep[i] >= cap_min][:6]
    best, best_err = None, 1e9
    for x in range(len(cands)):
        for y in range(x + 1, len(cands)):
            a, b = sorted((cands[x], cands[y]))
            if b - a < 2 or (n - (b - a)) < 2:
                continue
            s1 = pts[a:b+1]
            s2 = list(reversed(pts[b:] + pts[:a+1]))
            err = _mean_nn(s1, s2)
            if err < best_err:
                best_err, best = err, (s1 if len(s1) >= len(s2) else s2)
    if best is None:
        return None, 1e9
    return best, best_err / max(half, 1e-6)


def stroke_width_of(polys):
    """Recover a uniform stroke's width from its outline's area and perimeter.

    Open stroke, round caps:  A = WL + pi W^2/4,  P = 2L + pi W
                              => W = (P - sqrt(P^2 - 4 pi A)) / pi
    Closed ring:              A = WL,             P = 2L   => W = 2A/P
    Both are exact for a uniform stroke; self-overlapping art breaks them, which
    the per-asset IoU check is there to catch.
    """
    per = sum(polylen(p if dist(p[0], p[-1]) < 1e-9 else p + [p[0]]) for p in polys)
    area = abs(sum(signed_area(p) for p in polys))
    if len(polys) >= 2:
        return 2 * area / per if per else 0.0
    disc = per*per - 4*math.pi*area
    if disc < 0:
        return 2 * area / per if per else 0.0
    return (per - math.sqrt(disc)) / math.pi


def detect_corners(pts, window=14, thresh=22.0):
    """Corner vertices of a dense closed polyline, by windowed turning angle."""
    n = len(pts)
    ang = []
    for i in range(n):
        a, b, c = pts[(i-window) % n], pts[i], pts[(i+window) % n]
        v1, v2 = sub(b, a), sub(c, b)
        if norm(v1) < 1e-9 or norm(v2) < 1e-9:
            ang.append(0.0); continue
        cosv = max(-1, min(1, dot(v1, v2)/(norm(v1)*norm(v2))))
        ang.append(math.degrees(math.acos(cosv)))
    peaks = []
    for i in range(n):
        if ang[i] < thresh:
            continue
        if all(ang[i] >= ang[(i+j) % n] for j in range(-window, window+1)):
            peaks.append(i)
    # collapse plateaus into one representative index
    out = []
    for i in peaks:
        if out and min((i - out[-1]) % n, (out[-1] - i) % n) <= window:
            continue
        out.append(i)
    return set(out), ang


def smooth_closed(pts, passes=2, w=0.25):
    p = list(pts)
    for _ in range(passes):
        q = []
        n = len(p)
        for i in range(n):
            a, b, c = p[(i-1) % n], p[i], p[(i+1) % n]
            q.append((b[0]*(1-2*w) + w*(a[0]+c[0]),
                      b[1]*(1-2*w) + w*(a[1]+c[1])))
        p = q
    return p


def turning(pts, i):
    n = len(pts)
    a, b, c = pts[(i-1) % n], pts[i], pts[(i+1) % n]
    v1, v2 = sub(b, a), sub(c, b)
    if norm(v1) < 1e-9 or norm(v2) < 1e-9: return 0.0
    cosv = max(-1, min(1, dot(v1, v2)/(norm(v1)*norm(v2))))
    return math.degrees(math.acos(cosv))


def rdp(pts, eps):
    if len(pts) < 3: return list(pts)
    a, b = pts[0], pts[-1]
    ab = sub(b, a); L = norm(ab)
    idx, dmax = 0, -1
    for i in range(1, len(pts)-1):
        if L < 1e-9:
            d = dist(pts[i], a)
        else:
            d = abs(ab[0]*(a[1]-pts[i][1]) - (a[0]-pts[i][0])*ab[1]) / L
        if d > dmax: idx, dmax = i, d
    if dmax > eps:
        return rdp(pts[:idx+1], eps)[:-1] + rdp(pts[idx:], eps)
    return [a, b]


def catmull_to_cubic(pts, closed=True, tension=1.0):
    """Interpolating spline through pts -> SVG cubic path data."""
    n = len(pts)
    def P(i):
        if closed: return pts[i % n]
        return pts[max(0, min(n-1, i))]
    d = [f"M {pts[0][0]:.2f} {pts[0][1]:.2f}"]
    last = n if closed else n - 1
    for i in range(last):
        p0, p1, p2, p3 = P(i-1), P(i), P(i+1), P(i+2)
        c1 = (p1[0] + (p2[0]-p0[0])/(6*tension), p1[1] + (p2[1]-p0[1])/(6*tension))
        c2 = (p2[0] - (p3[0]-p1[0])/(6*tension), p2[1] - (p3[1]-p1[1])/(6*tension))
        d.append(f"C {c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p2[0]:.2f} {p2[1]:.2f}")
    if closed: d.append("Z")
    return " ".join(d)


def emit_closed(pts, corners, tension=1.0):
    """Closed interpolating spline that keeps flagged vertices sharp."""
    if not corners:
        return catmull_to_cubic(pts, closed=True, tension=tension)
    cs = sorted(corners)
    n = len(pts)
    rot = cs[0]
    order = [(i + rot) % n for i in range(n)]
    marks = sorted({(c - rot) % n for c in cs})
    parts, first = [], True
    for k, m in enumerate(marks):
        nxt = marks[k+1] if k + 1 < len(marks) else n
        run = [pts[order[j]] for j in range(m, nxt + 1)] if nxt < n else \
              [pts[order[j]] for j in range(m, n)] + [pts[order[0]]]
        seg = catmull_to_cubic(run, closed=False, tension=tension)
        if first:
            parts.append(seg); first = False
        else:
            parts.append(seg.split(" ", 3)[3])
    return " ".join(parts) + " Z"
