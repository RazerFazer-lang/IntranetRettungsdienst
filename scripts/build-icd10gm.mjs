import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const packageDir=process.argv[2]||'.bfarm-packages';
const out='krankheitslexikon-all-2026.js';
const EXPECTED=14370;

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
const archives=walk(packageDir,/bfarm\.terminologien\.icd10gm-.*\.tar\.gz$/i);
if(!archives.length)throw new Error(`No downloaded BfArM ICD-10-GM package found in ${packageDir}`);
const archive=archives.sort().at(-1);
const extractDir='.icd10gm-package';
fs.rmSync(extractDir,{recursive:true,force:true});
fs.mkdirSync(extractDir,{recursive:true});
execFileSync('tar',['-xzf',archive,'-C',extractDir],{stdio:'inherit'});
const candidates=walk(extractDir,/CodeSystem-icd10gm.*2026\.json$/i);
if(!candidates.length)throw new Error('No 2026 ICD-10-GM CodeSystem JSON found in downloaded BfArM package');
const codeSystem=candidates.find(p=>/CodeSystem-icd10gm-2026\.json$/i.test(p))||candidates[0];
const json=JSON.parse(fs.readFileSync(codeSystem,'utf8'));
const flat=[];
function visit(concepts,parent=null){
  for(const c of concepts||[]){
    if(!c?.code)continue;
    flat.push({code:String(c.code),display:String(c.display||c.definition||c.code),hasChildren:Array.isArray(c.concept)&&c.concept.length>0,parent});
    visit(c.concept,c.code);
  }
}
visit(json.concept||[]);
const terminal=flat.filter(x=>!x.hasChildren);
const byCode=new Map(terminal.map(x=>[x.code,x]));
const entries=[...byCode.values()].map(x=>({
  id:`icd10gm-${slug(x.code)}`,
  name:x.display,
  category:categoryFor(x.code),
  code:x.code,
  aliases:'',
  summary:`ICD-10-GM 2026 · ${x.display}`,
  focus:'Amtlicher terminaler ICD-10-GM-2026-Kode für Diagnoseklassifikation und strukturierte Recherche.',
  redFlags:'Aus dem ICD-Kode allein lässt sich keine individuelle Dringlichkeit oder Behandlungsentscheidung ableiten.',
  education:'Für Ausbildung und Recherche: Kode und offizielle Bezeichnung gemeinsam verwenden; lokale SOPs und aktuelle Leitlinien beachten.',
  source:'BfArM ICD-10-GM 2026, maschinenlesbare FHIR-Fassung',
  terminal:true
}));
if(entries.length!==EXPECTED)throw new Error(`Expected exactly ${EXPECTED} terminal codes, received ${entries.length} from ${codeSystem}`);
const meta={version:'2026',terminalCount:entries.length,conceptCount:flat.length,source:'BfArM ICD-10-GM 2026'};
fs.writeFileSync(out,`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify(meta)};\n`,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 concepts from ${path.basename(archive)}.`);
