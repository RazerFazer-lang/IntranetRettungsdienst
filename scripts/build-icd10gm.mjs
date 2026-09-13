import fs from 'node:fs';

const out='krankheitslexikon-all-2026.js';
const EXPECTED=14370;
const SOURCE_URL='https://terminologien.bfarm.de/rendering_data/ValueSet-icd10gm-terminale-codes-2026.json';

function categoryFor(code){
  const c=(code||'').charAt(0).toUpperCase();
  const map={A:'Infektiologie',B:'Infektiologie',C:'Onkologie',D:'Blut / Immunsystem',E:'Endokrinologie / Stoffwechsel',F:'Psychiatrie / Verhalten',G:'Neurologie',H:'Augen / HNO',I:'Kardiologie / Kreislauf',J:'Pneumologie / Atmung',K:'Gastroenterologie',L:'Dermatologie',M:'Orthopädie / Rheumatologie',N:'Urologie / Gynäkologie',O:'Schwangerschaft / Geburt',P:'Neonatologie / Perinatalmedizin',Q:'Humangenetik / Angeborene Erkrankungen',R:'Symptome / Befunde',S:'Traumatologie',T:'Vergiftungen / Verletzungen',U:'Besondere Zwecke',V:'Äußere Ursachen',W:'Äußere Ursachen',X:'Äußere Ursachen',Y:'Äußere Ursachen',Z:'Versorgungs-/Gesundheitsfaktoren'};
  return map[c]||'Sonstige';
}
function slug(code){return String(code).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'unknown'}

async function fetchJson(url){
  const res=await fetch(url,{headers:{'User-Agent':'IntranetRettungsdienst ICD-10-GM 2026 importer','Accept':'application/json'}});
  if(!res.ok)throw new Error(`BfArM request failed: HTTP ${res.status}`);
  return res.json();
}

const data=await fetchJson(SOURCE_URL);
const rawRows=Array.isArray(data?.rows)?data.rows:Array.isArray(data?.expansion?.contains)?data.expansion.contains:Array.isArray(data?.compose?.include?.[0]?.concept)?data.compose.include[0].concept:[];
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

console.log(`BfArM source: ${SOURCE_URL}`);
console.log(`Raw rows: ${rawRows.length}; unique catalogue entries: ${entries.length}.`);
if(entries.length!==EXPECTED)throw new Error(`Expected exactly ${EXPECTED} terminal ICD-10-GM 2026 entries, received ${entries.length}.`);

const meta={version:'2026',terminalCount:entries.length,conceptCount:rawRows.length,source:'BfArM ICD-10-GM 2026'};
fs.writeFileSync(out,`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify(meta)};\n`,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 entries.`);
