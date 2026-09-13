import fs from 'node:fs';
import path from 'node:path';

const out='krankheitslexikon-all-2026.js';
const EXPECTED=14370;
const SOURCE_URL='https://terminologien.bfarm.de/rendering_data/ValueSet-icd10gm-terminale-codes-2026.json';
const input=process.argv[2]||null;

function categoryFor(code){
  const c=(code||'').charAt(0).toUpperCase();
  const map={A:'Infektiologie',B:'Infektiologie',C:'Onkologie',D:'Blut / Immunsystem',E:'Endokrinologie / Stoffwechsel',F:'Psychiatrie / Verhalten',G:'Neurologie',H:'Augen / HNO',I:'Kardiologie / Kreislauf',J:'Pneumologie / Atmung',K:'Gastroenterologie',L:'Dermatologie',M:'Orthopädie / Rheumatologie',N:'Urologie / Gynäkologie',O:'Schwangerschaft / Geburt',P:'Neonatologie / Perinatalmedizin',Q:'Humangenetik / Angeborene Erkrankungen',R:'Symptome / Befunde',S:'Traumatologie',T:'Vergiftungen / Verletzungen',U:'Besondere Zwecke',V:'Äußere Ursachen',W:'Äußere Ursachen',X:'Äußere Ursachen',Y:'Äußere Ursachen',Z:'Versorgungs-/Gesundheitsfaktoren'};
  return map[c]||'Sonstige';
}
function slug(code){return String(code).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'unknown'}
function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function extractRows(data){
  if(Array.isArray(data?.rows)) return data.rows;
  if(Array.isArray(data?.expansion?.contains)) return data.expansion.contains;
  const includes=Array.isArray(data?.compose?.include)?data.compose.include:[];
  return includes.flatMap(x=>Array.isArray(x?.concept)?x.concept:[]);
}
function collectValueSetCandidates(root){
  const found=[];
  function walk(v,p){
    if(!v||typeof v!=='object')return;
    if(v.resourceType==='ValueSet' && /icd10gm-terminale-codes/i.test(String(v.url||'ValueSet-icd10gm-terminale-codes'))){
      found.push({value:v,path:p});
    }
    if(Array.isArray(v))v.forEach((x,i)=>walk(x,`${p}[${i}]`));
    else for(const [k,x] of Object.entries(v))walk(x,p?`${p}.${k}`:k);
  }
  walk(root,'');
  return found;
}
function loadFromDirectory(dir){
  const files=[];
  function walk(d){
    for(const e of fs.readdirSync(d,{withFileTypes:true})){
      const p=path.join(d,e.name);
      if(e.isDirectory())walk(p); else if(/\.(json)$/i.test(e.name))files.push(p);
    }
  }
  walk(dir);
  const candidates=[];
  for(const file of files){
    try{
      const data=readJson(file);
      for(const c of collectValueSetCandidates(data)) candidates.push({...c,file});
    }catch{}
  }
  candidates.sort((a,b)=>{
    const av=String(a.value.version||''); const bv=String(b.value.version||'');
    const ac=extractRows(a.value).length; const bc=extractRows(b.value).length;
    return (Number(bv==='2026')-Number(av==='2026')) || Math.abs(bc-EXPECTED)-Math.abs(ac-EXPECTED);
  });
  const hit=candidates.find(x=>extractRows(x.value).length===EXPECTED)||candidates.find(x=>String(x.value.version||'')==='2026');
  if(!hit)throw new Error(`No BfArM terminal ICD-10-GM ValueSet found in ${files.length} JSON files.`);
  const rows=extractRows(hit.value);
  console.log(`Selected ValueSet file: ${hit.file}`);
  console.log(`ValueSet URL: ${hit.value.url||'unknown'}; version: ${hit.value.version||'unknown'}; rows: ${rows.length}`);
  return {rows,source:`BfArM package ${path.relative('.',hit.file)}`};
}

async function fetchRemote(){
  const res=await fetch(SOURCE_URL,{headers:{'User-Agent':'IntranetRettungsdienst ICD-10-GM 2026 importer','Accept':'application/json'},signal:AbortSignal.timeout(60000)});
  if(!res.ok)throw new Error(`BfArM request failed: HTTP ${res.status}`);
  return {data:await res.json(),source:SOURCE_URL};
}

let data,source;
if(input){
  if(fs.existsSync(input)&&fs.statSync(input).isDirectory())({rows:data,source}=loadFromDirectory(input));
  else if(fs.existsSync(input))({rows:data,source}={rows:extractRows(readJson(input)),source:input});
  else throw new Error(`Input path not found: ${input}`);
}else{
  const remote=await fetchRemote();
  data=extractRows(remote.data); source=remote.source;
}

const rawRows=data;
const byCode=new Map();
for(const row of rawRows){
  const code=String(row?.Code||row?.code||'').trim();
  const name=String(row?.Display||row?.display||'').trim();
  if(!code||!name)continue;
  byCode.set(code,{code,name});
}
const entries=[...byCode.values()].sort((a,b)=>a.code.localeCompare(b.code,'en')).map(x=>({
  id:`icd10gm-${slug(x.code)}`,
  name:x.name,
  category:categoryFor(x.code),
  code:x.code,
  aliases:'',
  summary:`ICD-10-GM 2026 · ${x.name}`,
  focus:'Amtlicher terminaler ICD-10-GM-2026-Kode für Diagnoseklassifikation und strukturierte Recherche.',
  redFlags:'Aus dem ICD-Kode allein lässt sich keine individuelle Dringlichkeit oder Behandlungsentscheidung ableiten.',
  education:'Für Ausbildung und Recherche: Kode und offizielle Bezeichnung gemeinsam verwenden; lokale SOPs und aktuelle Leitlinien beachten.',
  source:'BfArM ICD-10-GM 2026, offizielles terminales ValueSet',
  terminal:true
}));

console.log(`Source: ${source}`);
console.log(`Raw rows: ${rawRows.length}; unique catalogue entries: ${entries.length}.`);
if(entries.length!==EXPECTED)throw new Error(`Expected exactly ${EXPECTED} terminal ICD-10-GM 2026 entries, received ${entries.length}.`);

const meta={version:'2026',terminalCount:entries.length,conceptCount:rawRows.length,source:'BfArM ICD-10-GM 2026'};
fs.writeFileSync(out,`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify(meta)};\n`,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 entries.`);
