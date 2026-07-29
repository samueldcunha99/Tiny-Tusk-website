"""Render SVG markup with a real browser and diff it against the PDF artwork."""
import pathlib
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops

SC = pathlib.Path(__file__).parent


_PW = {"pw": None, "browser": None}


def _browser():
    if _PW["browser"] is None:
        _PW["pw"] = sync_playwright().start()
        _PW["browser"] = _PW["pw"].chromium.launch()
    return _PW["browser"]


def shutdown():
    if _PW["browser"] is not None:
        _PW["browser"].close(); _PW["pw"].stop()
        _PW["browser"] = _PW["pw"] = None


def render_svg(svg, out_png, w, h, bg="#ffffff"):
    html = f"""<!doctype html><meta charset="utf-8">
<style>html,body{{margin:0;padding:0;background:{bg}}}
svg{{display:block;width:{w}px;height:{h}px}}</style>{svg}"""
    p = SC / "_render.html"
    p.write_text(html, encoding="utf-8")
    pg = _browser().new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
    try:
        pg.goto(p.as_uri())
        pg.screenshot(path=str(out_png))
    finally:
        pg.close()
    return Image.open(out_png).convert("RGB")


def _ink(img):
    import numpy as np
    return np.asarray(img.convert("L"), dtype=int) < 200


def coverage_report(ref_img, test_img, label=""):
    """ref/test are RGB; ink = non-white. Report mismatch in ink pixels."""
    a, b = _ink(ref_img), _ink(test_img)
    both = int((a & b).sum())
    only_ref = int((a & ~b).sum())
    only_test = int((b & ~a).sum())
    total = both + only_ref + only_test
    if total == 0:
        print(f"{label}: no ink"); return 0.0
    iou = both / total * 100
    print(f"{label}: IoU={iou:.2f}%  missing={only_ref} ({only_ref/max(1,both+only_ref)*100:.2f}%)  "
          f"extra={only_test} ({only_test/max(1,both+only_test)*100:.2f}%)")
    return iou


def diff_image(ref_img, test_img, out_png):
    """Red = in PDF only, green = in reconstruction only, grey = agreement."""
    import numpy as np
    a, b = _ink(ref_img), _ink(test_img)
    out = np.full(a.shape + (3,), 255, dtype=np.uint8)
    out[a & b] = (205, 205, 210)
    out[a & ~b] = (230, 30, 40)
    out[b & ~a] = (0, 170, 70)
    img = Image.fromarray(out)
    img.save(out_png)
    return img
