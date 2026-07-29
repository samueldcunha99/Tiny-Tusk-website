def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def lum(hx):
    r, g, b = int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

C = {
    "cobalt": "#18528E", "coral": "#F16C59", "canary": "#FFE497",
    "powder": "#C1CBE7", "paper": "#F7F7F7", "white": "#FFFFFF",
    "cobalt-60": "#7498B5",
}

PAIRS = [
    ("cobalt", "canary", "high", "display + body"),
    ("cobalt", "white", "official", "body"),
    ("cobalt", "cobalt-60", "official", "decorative only"),
    ("coral", "canary", "high", "BRAND-SANCTIONED, display only"),
    ("coral", "white", "-", "proposed body colour on coral"),
    ("coral", "cobalt", "-", "proposed body colour on coral"),
    ("powder", "cobalt", "high", "display + body"),
    ("powder", "white", "low", "decorative only"),
    ("canary", "cobalt", "high", "display + body"),
    ("canary", "white", "low", "decorative only"),
    ("paper", "cobalt", "official", "body"),
    ("paper", "powder", "official", "decorative only"),
    ("paper", "canary", "low", "decorative only"),
    ("white", "cobalt", "official", "body"),
]

print(f"{'surface':10} {'element':10} {'ratio':>6}  {'AA body':8} {'AA large':9}  register / use")
print("-" * 86)
rows = []
for bg, el, reg, use in PAIRS:
    r = ratio(C[bg], C[el])
    body = "PASS" if r >= 4.5 else "fail"
    large = "PASS" if r >= 3.0 else "fail"
    print(f"{bg:10} {el:10} {r:6.2f}  {body:8} {large:9}  {reg} / {use}")
    rows.append((bg, el, round(r, 2), body, large, reg, use))
