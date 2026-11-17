"""Keep the real contribution graph, synchronize a faster loop, add static variants."""
from pathlib import Path
import re
import sys

directory=Path(sys.argv[1] if len(sys.argv)>1 else 'dist')
for suffix in ('','-dark'):
    source=directory/f'github-contribution-grid-snake{suffix}.svg'
    svg=source.read_text()
    svg=re.sub(r'\b(\d+)ms\b',lambda match: f'{round(int(match[1])*.72)}ms',svg)
    reduce='<style>@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>'
    source.write_text(svg.replace('</svg>',reduce+'</svg>'))
    static='<style>*{animation:none!important}</style>'
    (directory/f'github-contribution-grid-static{suffix}.svg').write_text(svg.replace('</svg>',static+'</svg>'))
print('Prepared faster contribution animations and static alternatives')
