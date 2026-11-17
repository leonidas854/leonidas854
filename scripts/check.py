"""Check local navigation, SVG validity and README compatibility, without packages."""
from html.parser import HTMLParser
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs["id"])
        for key in ("href", "src", "srcset"):
            if key in attrs:
                self.links.append(attrs[key])
        if tag == "img":
            assert "alt" in attrs, "Image without alternative text"


for name in ("index.html", "README.md", "README.en.md", "SETUP_GUIDE.md", "CREDITS.md"):
    source = (ROOT / name).read_text()
    parser = Links()
    parser.feed(source)
    links = parser.links + re.findall(r"\]\(([^\s)]+)\)", source)
    for link in links:
        if link.startswith(("https://", "http://", "mailto:")):
            continue
        if link.startswith("#"):
            assert link[1:] in parser.ids, f"{name}: missing anchor {link}"
        else:
            assert (ROOT / link.split("#")[0]).is_file(), f"{name}: missing file {link}"
    if name.startswith("README"):
        assert not re.search(r"<(script|canvas|style)\b", source), "Unsupported README HTML"
    assert "file://" not in source, f"Nonportable link in {name}"

for path in (ROOT / "assets").glob("*.svg"):
    root = ET.parse(path).getroot()
    assert "viewBox" in root.attrib, f"Missing viewBox in {path}"
    assert not re.search(r"<script\b|\bonload=", path.read_text()), f"Script in {path}"

print("OK: local links, anchors, alternative text, README HTML and SVG XML")
