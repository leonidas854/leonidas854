"""Build the static fallback used when JavaScript or WebGL is unavailable."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / "assets/globe-scene.svg").read_text()
for name, css in {
    "static": "* { animation: none !important; }",
}.items():
    result = source.replace("</svg>", f"<style>{css}</style></svg>")
    (ROOT / f"assets/globe-{name}.svg").write_text(result)
