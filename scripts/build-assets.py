"""Build pause/burst SVG variants from the editable, self-contained globe."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / "assets/globe-scene.svg").read_text()
for name, css in {
    "static": "* { animation: none !important; }",
    "burst": ".snow-flurry-1 { animation-duration: 1.1s; } .snow-flurry-2 { animation-duration: 1.6s; }",
}.items():
    result = source.replace("</svg>", f"<style>{css}</style></svg>")
    (ROOT / f"assets/globe-{name}.svg").write_text(result)
