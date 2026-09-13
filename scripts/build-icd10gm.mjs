import fs from 'node:fs';

const out='krankheitslexikon-all-2026.js';
const TERMINAL_URL='https://terminologien.bfarm.de/fhir/ValueSet/$expand?url=https%3A%2F%2Fterminologien.bfarm.de%2Ffhir%2FValueSet%2Ficd10gm-terminale-codes&valueSetVersion=2026';
const EXPECTED=14370;

function categoryFor(code){
  const c=(code||'').charAt(0).toUpperCase();
  const map={A:'Infektiologie',B:'Infektiologie',C:'Onkologie',D:'Blut / Immunsystem',E:'Endokrinologie / Stoffwechsel',F:'Psychiatrie / Verhalten',G:'Neurologie',H:'Augen / HNO',I:'Kardiologie / Kreislauf',J:'Pneumologie / Atmung',K:'Gastroenterologie',L:'Dermatologie',M:'Orthopädie / Rheumatologie',N:'Urologie / Gynäkologie',O:'Schwangerschaft / Geburt',P:'Neonatologie / Perinatalmedizin',Q:'Humangenetik / Angeborene Erkrankungen',R:'Symptome / Befunde',S:'Traumatologie',T:'Vergiftungen / Verletzungen',U:'Besondere Zwecke',V:'Äußere Ursachen',W:'Äußere Ursachen',X:'Äußere Ursachen',Y:'Äußere Ursachen',Z:'Versorgungs-/Gesundheitsfaktoren'};
  return map[c]||'Sonstige';
}
function slug(code){return String(code).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'unknown'}
async function fetchJson(url){
  const res=await fetch(url,{headers:{Accept:'application/fhir+json, application/json'}});
  if(!res.ok)throw new Error(`BfArM FHIR request failed: HTTP ${res.status}`);
  return res.json();
}
const valueSet=await fetchJson(TERMINAL_URL);
const concepts=valueSet?.expansion?.contains||[];
if(!Array.isArray(concepts)||concepts.length!==EXPECTED)throw new Error(`Expected exactly ${EXPECTED} terminal ICD-10-GM 2026 concepts, received ${concepts.length}`);
const seen=new Set();
const entries=[];
for(const c of concepts){
  const code=String(c?.code||'').trim();
  const name=String(c?.display||'').trim();
  if(!code||!name||seen.has(code))continue;
  seen.add(code);
  entries.push({id:`icd10gm-${slug(code)}`,name,category:categoryFor(code),code,aliases:'',summary:`ICD-10-GM 2026 · ${name}`,focus:'Amtlicher terminaler ICD-10-GM-2026-Kode für Diagnoseklassifikation und strukturierte Recherche.',redFlags:'Aus dem ICD-Kode allein lässt sich keine individuelle Dringlichkeit oder Behandlungsentscheidung ableiten.',education:'Für Ausbildung und Recherche: Kode und offizielle Bezeichnung gemeinsam verwenden; lokale SOPs und aktuelle Leitlinien beachten.',source:'BfArM ICD-10-GM 2026, ValueSet ICD10GM_Terminale_Codes',terminal:true});
}
if(entries.length!==EXPECTED)throw new Error(`Duplicate or malformed codes reduced the catalogue to ${entries.length}; expected ${EXPECTED}`);
const meta={version:'2026',terminalCount:entries.length,source:'BfArM ICD-10-GM 2026 · ICD10GM_Terminale_Codes'};
fs.writeFileSync(out,`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify(meta)};\n`,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 concepts.`);
