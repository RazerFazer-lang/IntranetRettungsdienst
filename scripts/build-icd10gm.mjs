import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const pkgRoot=path.join(root,'.icd-package','node_modules','bfarm.terminologien.icd10gm');
const out=path.join(root,'krankheitslexikon-all-2026.js');

function findCodeSystem(dir){
  const wanted=/CodeSystem-icd10gm-[^/]+\.json$/i;
  const stack=[dir];
  while(stack.length){
    const cur=stack.pop();
    for(const name of fs.readdirSync(cur,{withFileTypes:true})){
      const full=path.join(cur,name.name);
      if(name.isDirectory())stack.push(full);
      else if(wanted.test(name.name))return full;
    }
  }
  throw new Error('ICD-10-GM CodeSystem JSON not found in the BfArM package');
}

function flattenNested(concepts,parent=null,rows=[]){
  for(const c of concepts||[]){
    if(!c?.code)continue;
    rows.push({code:c.code,display:c.display||c.definition||c.code,parent,hasChildren:Array.isArray(c.concept)&&c.concept.length>0,properties:c.property||[]});
    flattenNested(c.concept,c.code,rows);
  }
  return rows;
}

function getParentRefs(rows){
  const parents=new Set();
  for(const row of rows){
    for(const p of row.properties||[]){
      const uri=String(p.code||'').toLowerCase();
      if(uri==='parent'||uri.endsWith('#parent')||uri.includes('/parent')){
        if(p.valueCode)parents.add(String(p.valueCode));
      }
    }
  }
  return parents;
}

function categoryFor(code){
  const c=(code||'').charAt(0).toUpperCase();
  const map={A:'Infektiologie',B:'Infektiologie',C:'Onkologie',D:'Blut / Immunsystem',E:'Endokrinologie / Stoffwechsel',F:'Psychiatrie / Verhalten',G:'Neurologie',H:'Augen / HNO',I:'Kardiologie / Kreislauf',J:'Pneumologie / Atmung',K:'Gastroenterologie',L:'Dermatologie',M:'Orthopädie / Rheumatologie',N:'Urologie / Gynäkologie',O:'Schwangerschaft / Geburt',P:'Neonatologie / Perinatalmedizin',Q:'Humangenetik / Angeborene Erkrankungen',R:'Symptome / Befunde',S:'Traumatologie',T:'Vergiftungen / Verletzungen',U:'Besondere Zwecke',V:'Äußere Ursachen',W:'Äußere Ursachen',X:'Äußere Ursachen',Y:'Äußere Ursachen',Z:'Versorgungs-/Gesundheitsfaktoren'};
  return map[c]||'Sonstige';
}

function escJson(value){return JSON.stringify(value,(_,v)=>typeof v==='string'?v:v)}

const codeSystem=findCodeSystem(pkgRoot);
const json=JSON.parse(fs.readFileSync(codeSystem,'utf8'));
const nested=flattenNested(json.concept||[]);
const flat=nested.length?nested:[];
const parentRefs=getParentRefs(flat);
const terminal=flat.filter(r=>!r.hasChildren&&!parentRefs.has(r.code));
const unique=new Map();
for(const r of terminal)unique.set(r.code,r);
const entries=[...unique.values()].map((r,i)=>({
  id:`icd10gm-${r.code.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||i}`,
  name:r.display,
  category:categoryFor(r.code),
  code:r.code,
  aliases:'',
  summary:`ICD-10-GM 2026 · ${r.display}`,
  focus:'Amtlicher ICD-10-GM-2026-Kode. Für Ausbildung, Recherche und strukturierte Orientierung im Intranet.',
  redFlags:'Der ICD-Kode selbst beschreibt keine individuelle Dringlichkeit. Klinische Warnzeichen immer separat beurteilen.',
  education:'Kodesuche: Diagnosebegriff und ICD-10-GM-Kode gemeinsam verwenden. Für reale Versorgung gelten lokale SOPs und aktuelle Leitlinien.',
  source:'BfArM ICD-10-GM 2026, maschinenlesbare Fassung',
  terminal:true
}));

const payload=`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify({version:'2026',terminalCount:entries.length,conceptCount:flat.length,source:'BfArM ICD-10-GM 2026'} )};\n`;
fs.writeFileSync(out,payload,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 concepts from ${flat.length} concepts.`);
if(entries.length<10000)throw new Error(`Unexpectedly low terminal count: ${entries.length}`);
