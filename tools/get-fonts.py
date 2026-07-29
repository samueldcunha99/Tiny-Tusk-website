"""Download the stand-in faces as woff2 for self-hosting (no runtime CDN calls)."""
import re, pathlib, urllib.request

DEST = pathlib.Path(r"c:\Users\HP\OneDrive\Desktop\My websites\Tiny Tusk website\public\fonts")
DEST.mkdir(parents=True, exist_ok=True)
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

SPECS = {
    # variable weight axis, latin subset
    "figtree": "https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap",
    "barlow": "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@400;600&display=swap",
}

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=30).read()

for name, url in SPECS.items():
    try:
        css = fetch(url).decode("utf-8")
    except Exception as e:
        print(f"{name}: CSS FAILED {e}")
        continue
    # keep only the latin subset blocks
    blocks = re.findall(r"/\*\s*([\w\-\[\]]+)\s*\*/\s*@font-face\s*{(.*?)}", css, re.S)
    got = []
    for subset, block in blocks:
        if subset not in ("latin",):
            continue
        m = re.search(r"url\((https://[^)]+\.woff2)\)", block)
        w = re.search(r"font-weight:\s*([^;]+);", block)
        if not m:
            continue
        weight = (w.group(1).strip() if w else "400").replace(" ", "-")
        fn = f"{name}-{weight}.woff2"
        try:
            data = fetch(m.group(1))
            (DEST / fn).write_bytes(data)
            got.append((fn, len(data)))
        except Exception as e:
            print(f"  {fn}: FAILED {e}")
    for fn, sz in got:
        print(f"{fn}: {sz/1024:.1f} KB")
    if not got:
        print(f"{name}: no latin woff2 found")
