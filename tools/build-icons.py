"""Build the site icon set from one definition of the mark.

    python tools/build-icons.py

The mark: the sidebar's solid black square, carrying a three-node system
diagram in white -- one service fanning out to two. Square nodes and
right-angle connectors only: the system's square corners, and shapes that stay
crisp at 16px, where diagonals turn to mush.

Drawn on a 32-unit grid with integer edges, so it is pixel-exact at 32px -- a
16px tab at 2x density, which is most screens now. At 1x some edges fall on
half pixels and soften slightly; it stays legible.

Writes, into assets/brand/:
    favicon.svg            modern browsers
    apple-touch-icon.png   180px, iOS home screen
and favicon.ico (16 / 32 / 48) at the site root, where browsers look for one
unasked, and which covers browsers without SVG icons.

Colours are the brand ink (#000, --hf-ink) and --hf-on-primary (#fff). They
are literal here because an icon file cannot read CSS custom properties.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "brand"
GRID = 32
INK, PAPER = "#000000", "#ffffff"

# (x, y, w, h) on the 32-unit grid.
NODES = [(13, 5, 6, 6),               # the service
         (5, 21, 6, 6), (21, 21, 6, 6)]   # what it calls
LINKS = [(15, 11, 2, 5),              # stem
         (7, 15, 18, 2),              # bus
         (7, 17, 2, 4), (23, 17, 2, 4)]   # drops


def svg() -> str:
    rects = "".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}"/>' for x, y, w, h in NODES + LINKS)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {GRID} {GRID}">'
            f'<title>System design katas</title>'
            f'<rect width="{GRID}" height="{GRID}" fill="{INK}"/>'
            f'<g fill="{PAPER}">{rects}</g></svg>\n')


def raster(size: int) -> Image.Image:
    """Supersample, then downscale: the same anti-aliasing a browser applies."""
    big = size * 16
    k = big / GRID
    img = Image.new("RGB", (big, big), INK)
    draw = ImageDraw.Draw(img)
    for x, y, w, h in NODES + LINKS:
        draw.rectangle([x * k, y * k, (x + w) * k - 1, (y + h) * k - 1], fill=PAPER)
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "favicon.svg").write_text(svg(), encoding="utf-8", newline="\n")
    raster(180).save(OUT / "apple-touch-icon.png", optimize=True)
    raster(48).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    for p in (OUT / "favicon.svg", OUT / "apple-touch-icon.png", ROOT / "favicon.ico"):
        print(f"{p.relative_to(ROOT).as_posix():32} {p.stat().st_size:>6} bytes")


if __name__ == "__main__":
    main()
