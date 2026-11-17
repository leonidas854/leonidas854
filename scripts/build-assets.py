"""Build the static fallback used when JavaScript or WebGL is unavailable."""
from pathlib import Path
import subprocess
import sys
import xml.etree.ElementTree as ET
from readme.seal import add_seal

ROOT = Path(__file__).resolve().parent.parent
ET.register_namespace('', 'http://www.w3.org/2000/svg')
scene = ET.parse(ROOT / "assets/globe-scene.svg").getroot()
add_seal(scene)
source = ET.tostring(scene, encoding='unicode')
for name, css in {
    "static": "* { animation: none !important; }",
}.items():
    result = source.replace("</svg>", f"<style>{css}</style></svg>")
    (ROOT / f"assets/globe-{name}.svg").write_text(result)

subprocess.run([sys.executable, str(ROOT / "scripts/readme/world.py")], check=True)
subprocess.run(["node", str(ROOT / "scripts/readme/finish.mjs")], check=True)
