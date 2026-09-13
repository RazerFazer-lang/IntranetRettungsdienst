import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const packageDir=process.argv[2]||'.bfarm-packages';
const out='krankheitslexikon-all-2026.js';
const EXPECTED=14370;
const EXPECTED_URL='http://fhir.de/CodeSystem/bfarm/icd-10-gm';

function categoryFor(code){
  const c=(code||'').charAt(0).toUpperCase();
  const map={A:'Infektiologie',B:'Infektiologie',C:'Onkologie',D:'Blut / Immunsystem',E:'Endokrinologie / Stoffwechsel',F:'Psychiatrie / Verhalten',G:'Neurologie',H:'Augen / HNO',I:'Kardiologie / Kreislauf',J:'Pneumologie / Atmung',K:'Gastroenterologie',L:'Dermatologie',M:'Orthopädie / Rheumatologie',N:'Urologie / Gynäkologie',O:'Schwangerschaft / Geburt',P:'Neonatologie / Perinatalmedizin',Q:'Humangenetik / Angeborene Erkrankungen',R:'Symptome / Befunde',S:'Traumatologie',T:'Vergiftungen / Verletzungen',U:'Besondere Zwecke',V:'Äußere Ursachen',W:'Äußere Ursachen',X:'Äußere Ursachen',Y:'Äußere Ursachen',Z:'Versorgungs-/Gesundheitsfaktoren'};
  return map[c]||'Sonstige';
}
function slug(code){return String(code).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'unknown'}
function walk(dir,pattern,results=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory())walk(p,pattern,results);
    else if(pattern.test(e.name))results.push(p);
  }
  return results;
}

const archives=walk(packageDir,/\.tar\.gz$/i);
if(!archives.length)throw new Error(`No BfArM terminology package archive found in ${packageDir}`);
console.log(`Found ${archives.length} terminology package archive(s).`);

const extractDir='.icd10gm-package';
fs.rmSync(extractDir,{recursive:true,force:true});
fs.mkdirSync(extractDir,{recursive:true});
execFileSync('tar',['-xzf',archives.sort().at(-1),'-C',extractDir],{stdio:'inherit'});

const jsonFiles=walk(extractDir,/\.json$/i);
let codeSystem=null;
let codeSystemPath=null;
for(const p of jsonFiles){
  try{
    const value=JSON.parse(fs.readFileSync(p,'utf8'));
    if(value?.resourceType==='CodeSystem'&&value?.url===EXPECTED_URL&&String(value?.version)==='2026'){
      codeSystem=value;
      codeSystemPath=p;
      break;
    }
  }catch{}
}
if(!codeSystem)throw new Error(`No official ICD-10-GM 2026 CodeSystem found in ${archives.at(-1)}. Searched ${jsonFiles.length} JSON files.`);

const flat=[];
function visit(concepts,parent=null){
  for(const c of concepts||[]){
    if(!c?.code)continue;
    const children=Array.isArray(c.concept)?c.concept:[];
    flat.push({code:String(c.code),display:String(c.display||c.definition||c.code),hasChildren:children.length>0,parent});
    visit(children,String(c.code));
  }
}
visit(codeSystem.concept||[]);
const terminal=flat.filter(x=>!x.hasChildren);
const byCode=new Map(terminal.map(x=>[x.code,x]));
const entries=[...byCode.values()].sort((a,b)=>a.code.localeCompare(b.code,'en')).map(x=>({
  id:`icd10gm-${slug(x.code)}`,
  name:x.display,
  category:categoryFor(x.code),
  code:x.code,
  aliases:'',
  summary:`ICD-10-GM 2026 · ${x.display}`,
  focus:'Amtlicher terminaler ICD-10-GM-2026-Kode für Diagnoseklassifikation und strukturierte Recherche.',
  redFlags:'Aus dem ICD-Kode allein lässt sich keine individuelle Dringlichkeit oder Behandlungsentscheidung ableiten.',
  education:'Für Ausbildung und Recherche: Kode und offizielle Bezeichnung gemeinsam verwenden; lokale SOPs und aktuelle Leitlinien beachten.',
  source:'BfArM ICD-10-GM 2026, offizielles maschinenlesbares CodeSystem',
  terminal:true
}));

console.log(`Selected CodeSystem: ${codeSystemPath}`);
console.log(`CodeSystem concepts: ${flat.length}; terminal concepts: ${entries.length}.`);
if(entries.length!==EXPECTED)throw new Error(`Expected exactly ${EXPECTED} terminal ICD-10-GM 2026 codes, received ${entries.length}.`);

const meta={version:'2026',terminalCount:entries.length,conceptCount:flat.length,source:'BfArM ICD-10-GM 2026'};
fs.writeFileSync(out,`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify(meta)};\n`,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 entries.`);
