"""Share the Podman seal drawing between the README and the WebGL fallback."""
from copy import deepcopy
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
NS = '{http://www.w3.org/2000/svg}'

def add_seal(scene):
    artwork = ET.parse(ROOT / 'src/readme/artwork/podman-seal.svg').getroot()
    inside = next(node for node in scene.iter() if node.get('clip-path') == 'url(#dome-clip)')
    placement = ET.Element(f'{NS}g', {'transform': 'translate(143, 181) scale(.6)'})
    placement.append(deepcopy(artwork.find(f'{NS}style')))
    placement.append(deepcopy(artwork.find(f'{NS}g')))
    # Draw the mascot in front of the village, behind the falling snow.
    index = next(i for i, child in enumerate(inside) if 'snow-flurry' in child.get('class', ''))
    inside.insert(index, placement)
