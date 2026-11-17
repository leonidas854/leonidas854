import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {galaxy} from './artwork.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dir=path.join(root,'assets/profile');
const source=path.join(root,'src/readme/artwork/world.generated.svg');
fs.writeFileSync(path.join(dir,'world.svg'),fs.readFileSync(source,'utf8').replace('{{GALAXY}}',galaxy(850,420)));
fs.unlinkSync(source);
for(const file of ['header','typing','terminal','world']) {
  const svg=fs.readFileSync(path.join(dir,file+'.svg'),'utf8');
  const override='<style>*{animation:none!important}.motion{display:none}.type,.clip{width:760px}.line{opacity:0}.first{opacity:1}</style>';
  fs.writeFileSync(path.join(dir,file+'-static.svg'),svg.replace('</svg>',override+'</svg>'));
}
console.log('Built README world and reduced-motion alternatives');
