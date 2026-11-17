"""Adapt the supplied vector village into a visibly animated README scene."""
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[2]
NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS)
root=ET.parse(ROOT/'assets/globe-scene.svg').getroot()
village=next(node for node in root if node.tag==f'{{{NS}}}g')
# Keep source geometry untouched; animation goes inside existing positioning groups.
for node in village.iter():
    transform=node.get('transform','')
    if transform in ('translate(98, 192)','translate(122, 188)'):
        wrapper=ET.Element(f'{{{NS}}}g',{'class':'gopher-walk' if '98,' in transform else 'friend-wave'})
        for child in list(node):
            node.remove(child)
            wrapper.append(child)
        node.append(wrapper)
    if node.get('class') in ('snow-flurry-1','snow-flurry-2'):
        node.set('class','original-snow')
# Add near and far repeating snowfall, clipped to the glass.
inside=next(node for node in village.iter() if node.get('clip-path')=='url(#dome-clip)')
for layer in range(2):
    snow=ET.SubElement(inside,f'{{{NS}}}g',{'class':f'snowfall snow-{layer}'})
    for i in range(65):
        ET.SubElement(snow,f'{{{NS}}}circle',{
            'cx':str(25+(i*37+layer*13)%195),
            'cy':str(-130+(i*29)%340),
            'r':str(.8+(i%3)*.35),
            'fill':'#f2f6ff','opacity':'.9' if layer==0 else '.55'})
# Give the roof windows a slow warm shimmer, without flashing the scene.
for node in village.iter():
    if node.get('fill') in ('#ffbe3b','#45ffc0') and node.tag.endswith('rect'):
        node.set('class','window-light')
body=ET.tostring(village,encoding='unicode')
style='''
@keyframes snow-near { from{transform:translate(-8px,-25px)}to{transform:translate(15px,125px)} }
@keyframes snow-far { from{transform:translate(8px,-40px)}to{transform:translate(-10px,120px)} }
@keyframes stroll { 0%,100%{transform:translateX(-8px)}50%{transform:translateX(11px)} }
@keyframes greet { 0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)} }
@keyframes smoke { from{transform:translateY(0);opacity:.65}to{transform:translateY(-28px);opacity:0} }
@keyframes warm { 50%{opacity:.65} }
.snow-0{animation:snow-near 2.8s linear infinite}.snow-1{animation:snow-far 4.1s linear infinite}
.gopher-walk{animation:stroll 4s ease-in-out infinite}.friend-wave{animation:greet 2.5s ease-in-out infinite}
.smoke-puff{animation:smoke 2s ease-out infinite}.window-light{animation:warm 3.5s ease-in-out infinite}
.original-snow{display:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important}.motion{display:none}}
'''
svg=f'''<svg xmlns="{NS}" width="850" height="420" viewBox="0 0 850 420" role="img" aria-labelledby="title">
<title id="title">El universo de Leonidas: casas Rust y Podman, gophers y nieve en movimiento</title>
<style>{style}</style><rect width="850" height="420" rx="14" fill="#080a10"/>
{{{{GALAXY}}}}
<g transform="translate(200,-10) scale(1.5)">{body}</g>
<g font-family="monospace">
<rect x="24" y="27" width="260" height="35" rx="6" fill="#10141e"/>
<text x="40" y="50" fill="#e6edf3" font-size="17" font-weight="700">CÓDIGO Y NIEVE</text>
<rect x="24" y="113" width="180" height="66" rx="6" fill="#10141e"/>
<text x="40" y="139" fill="#ffad85" font-size="18" font-weight="700">RUST</text><text x="40" y="161" fill="#aab8cb" font-size="12">En aprendizaje</text>
<rect x="24" y="200" width="180" height="66" rx="6" fill="#10141e"/>
<text x="40" y="226" fill="#c4b5ff" font-size="18" font-weight="700">PODMAN</text><text x="40" y="248" fill="#aab8cb" font-size="12">Contenedores</text>
<rect x="656" y="113" width="170" height="66" rx="6" fill="#10141e"/>
<text x="672" y="139" fill="#8eb7ff" font-size="18" font-weight="700">GO</text><text x="672" y="161" fill="#aab8cb" font-size="12">Conocimientos básicos</text>
<rect x="656" y="200" width="170" height="66" rx="6" fill="#10141e"/>
<text x="672" y="226" fill="#45ffc0" font-size="18" font-weight="700">LEONIDAS</text><text x="672" y="248" fill="#aab8cb" font-size="12">Código + curiosidad</text>
<rect x="24" y="340" width="250" height="42" rx="6" fill="#10141e" stroke="#45ffc0"/>
<text x="40" y="366" fill="#45ffc0" font-size="13">ABRIR MI UNIVERSO 3D ↗</text>
</g></svg>'''
(ROOT/'src/readme/artwork/world.generated.svg').write_text(svg)
