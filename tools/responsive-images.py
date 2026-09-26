"""Smaller WebP copies of the clinic concept images, for `srcset`.

The concept tiles are 1536px images shown a few hundred pixels wide, so a
browser downloading the full file wasted most of it (Lighthouse's "improve
image delivery"). These give it sizes to choose from; `InsideClinic.tsx` lists
them. Made from the lossless PNG originals, not the existing WebP, so nothing
is compressed twice.

usage: python tools/responsive-images.py
"""
from pathlib import Path

from PIL import Image

IMAGES = Path(__file__).resolve().parent.parent / "public" / "images"
WIDTHS = (640, 1024)

for src in sorted(IMAGES.glob("clinic-*.png")):
    image = Image.open(src).convert("RGB")
    for width in WIDTHS:
        height = round(image.height * width / image.width)
        out = src.with_name(f"{src.stem}-{width}.webp")
        image.resize((width, height), Image.LANCZOS).save(out, "WEBP", quality=80, method=6)
        print(f"{out.name:36} {out.stat().st_size / 1024:6.1f} KiB")
