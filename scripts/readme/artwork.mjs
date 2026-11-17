import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bezier } from '../../src/components/galaxy/geometry.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const source=path.join(root,'src/readme/artwork');
const output=path.join(root,'assets/profile');
fs.mkdirSync(path.join(output,'buttons'),{recursive:true});
const read=file=>fs.readFileSync(path.join(source,file),'utf8');
const write=(file,text)=>fs.writeFileSync(path.join(output,file),text.trim()+'\n');
export function galaxy(width,height) {
  let markup='<g aria-hidden="true">';
  const colors=['#45ffc0','#ff82b4','#ffce83'];
  for(let strand=0;strand<9;strand++) {
    const center=height*.55;
    const points=[{x:-20,y:center+Math.sin(strand*1.6)*height*.32},{x:width*.25,y:center+Math.cos(strand)*height*.6},{x:width*.72,y:center+Math.sin(strand*2)*height*.5},{x:width+20,y:center+Math.cos(strand*1.4)*height*.32}];
    const route=`M${points[0].x},${points[0].y.toFixed(1)} C${points.slice(1).map(p=>`${p.x},${p.y.toFixed(1)}`).join(' ')}`;
    const color=colors[strand%3];
    markup+=`<path d="${route}" fill="none" stroke="${color}" stroke-width="1" opacity=".28"/>`;
    for(let i=0;i<15;i++) {
      const p=bezier(...points,i/14);
      markup+=`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.2" fill="${color}" opacity=".6"/>`;
    }
    for(let i=0;i<4;i++) {
      const duration=6+strand*.35;
      markup+=`<g class="motion"><circle r="${i===0?3:1.7}" fill="${color}"><animateMotion path="${route}" dur="${duration}s" begin="-${(i*duration/4).toFixed(2)}s" repeatCount="indefinite"/></circle></g>`;
    }
  }
  return markup+'</g>';
}
for(const [template,file,height] of [['header.svg','header.svg',280],['terminal.svg','terminal.svg',0],['typing.svg','typing.svg',0]]) {
  write(file,read(template).replace('{{GALAXY}}',galaxy(850,height)));
}
const buttons=JSON.parse(read('buttons.json'));
const authored={
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 5 10 8L22 5"/>',
  orbit:'<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="11" ry="5" transform="rotate(-35 12 12)"/><path d="M12 1v3m0 16v3"/>',
  code:'<path d="m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18"/>'
};
for(const button of buttons) {
  let icon;
  if(authored[button.icon])icon=`<g fill="none" stroke="#080a10" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${authored[button.icon]}</g>`;
  else icon=fs.readFileSync(path.join(root,'assets/icons',`${button.icon}.svg`),'utf8').match(/<path\b[^>]*>/g).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="202" height="64" viewBox="0 0 202 64" role="img" aria-label="${button.label}">
<style>@keyframes arrow{50%{transform:translateX(3px)}}.arrow{animation:arrow 2.4s ease-in-out infinite}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>
<rect x="1" y="3" width="200" height="58" rx="8" fill="#181e2b" stroke="${button.color}" stroke-width="1.5"/>
<rect x="11" y="15" width="34" height="34" rx="7" fill="${button.color}"/>
<g transform="translate(17 21) scale(.92)" fill="#080a10">${icon}</g>
<text x="56" y="29" font-family="sans-serif" font-size="13" font-weight="700" fill="#e6edf3">${button.label}</text>
<text x="56" y="45" font-family="sans-serif" font-size="9.5" fill="#aab8cb">${button.detail}</text>
<path class="arrow" d="M180 26h8v8m-9 1 9-9" fill="none" stroke="${button.color}" stroke-width="1.6"/>
</svg>`;
  write(`buttons/${button.id}.svg`,svg);
}
// Small separator shares the moving-particle language, without taking over the page.
write('divider.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="850" height="18" viewBox="0 0 850 18"><style>@media(prefers-reduced-motion:reduce){.motion{display:none}}</style><path d="M0 9H850" stroke="#64758f" opacity=".6"/><g class="motion"><circle r="3" fill="#45ffc0"><animateMotion path="M0 9H850" dur="6s" repeatCount="indefinite"/></circle></g></svg>`);
console.log('Built README banner, typing, terminal, separators and contact buttons');
