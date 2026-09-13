import fs from 'node:fs';

const out='krankheitslexikon-all-2026.js';
const EXPECTED=14370;
const INDEX_URL='https://klassifikationen.bfarm.de/icd-10-gm/kode-suche/htmlgm2026/';

function categoryFor(code){
  const c=(code||'').charAt(0).toUpperCase();
  const map={A:'Infektiologie',B:'Infektiologie',C:'Onkologie',D:'Blut / Immunsystem',E:'Endokrinologie / Stoffwechsel',F:'Psychiatrie / Verhalten',G:'Neurologie',H:'Augen / HNO',I:'Kardiologie / Kreislauf',J:'Pneumologie / Atmung',K:'Gastroenterologie',L:'Dermatologie',M:'Orthopädie / Rheumatologie',N:'Urologie / Gynäkologie',O:'Schwangerschaft / Geburt',P:'Neonatologie / Perinatalmedizin',Q:'Humangenetik / Angeborene Erkrankungen',R:'Symptome / Befunde',S:'Traumatologie',T:'Vergiftungen / Verletzungen',U:'Besondere Zwecke',V:'Äußere Ursachen',W:'Äußere Ursachen',X:'Äußere Ursachen',Y:'Äußere Ursachen',Z:'Versorgungs-/Gesundheitsfaktoren'};
  return map[c]||'Sonstige';
}
function slug(code){return String(code).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'unknown'}
function decodeHtml(s){return String(s).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'\"').replace(/&#39;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&#x([0-9a-f]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))}
function cleanText(s){return decodeHtml(String(s).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()}
async function fetchText(url){
  const res=await fetch(url,{headers:{'User-Agent':'IntranetRettungsdienst ICD-10-GM 2026 importer','Accept':'text/html,application/xhtml+xml'}});
  if(!res.ok)throw new Error(`BfArM request failed: HTTP ${res.status} for ${url}`);
  return res.text();
}

const index=await fetchText(INDEX_URL);
const files=[...index.matchAll(/href=[\"'](block-[a-z0-9-]+\.htm)[\"']/gi)].map(m=>m[1]);
const uniqueFiles=[...new Set(files)].sort();
if(uniqueFiles.length<200)throw new Error(`BfArM index discovery returned only ${uniqueFiles.length} block pages; refusing to build an incomplete catalogue.`);
console.log(`Discovered ${uniqueFiles.length} official BfArM ICD-10-GM 2026 block pages.`);

const entriesByCode=new Map();
let headingCount=0;
let listCount=0;
let threeCharCount=0;
const codePattern=/^([A-Z]\d{2}(?:\.[0-9A-Z]+)?!?)(?:\s+|$)(.*)$/i;
const accept=(raw,source)=>{
  const text=cleanText(raw);
  const m=text.match(codePattern);
  if(!m)return;
  const code=m[1].toUpperCase();
  const name=m[2].trim();
  // Group headings use a trailing '-' (e.g. A00.-) and manifestation/reference
  // codes use '*' markers. Neither is a terminal ICD-10-GM concept.
  if(code.endsWith('-')||code.includes('*')||!name||name==='-')return;
  if(!code.includes('.'))threeCharCount++;
  entriesByCode.set(code,{code,name,source});
};

for(let i=0;i<uniqueFiles.length;i+=8){
  const batch=uniqueFiles.slice(i,i+8);
  const pages=await Promise.all(batch.map(async file=>({file,html:await fetchText(new URL(file,INDEX_URL).href)})));
  for(const {file,html} of pages){
    // Normal leaf codes are rendered as h5 elements. Some ICD-10-GM terminal
    // codes are one level deeper (for example A04.70-A04.79) and are rendered
    // as list items. Capture both representations.
    for(const m of html.matchAll(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi)){headingCount++;accept(m[1],'h5');}
    for(const m of html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)){listCount++;accept(m[1],'li');}
  }
  console.log(`Parsed ${Math.min(i+8,uniqueFiles.length)}/${uniqueFiles.length} pages; ${entriesByCode.size} unique terminal candidates (${headingCount} headings, ${listCount} list items).`);
}

const entries=[...entriesByCode.values()].sort((a,b)=>a.code.localeCompare(b.code,'en')).map(x=>({
  id:`icd10gm-${slug(x.code)}`,
  name:x.name,
  category:categoryFor(x.code),
  code:x.code,
  aliases:'',
  summary:`ICD-10-GM 2026 · ${x.name}`,
  focus:'Amtlicher terminaler ICD-10-GM-2026-Kode für Diagnoseklassifikation und strukturierte Recherche.',
  redFlags:'Aus dem ICD-Kode allein lässt sich keine individuelle Dringlichkeit oder Behandlungsentscheidung ableiten.',
  education:'Für Ausbildung und Recherche: Kode und offizielle Bezeichnung gemeinsam verwenden; lokale SOPs und aktuelle Leitlinien beachten.',
  source:'BfArM ICD-10-GM 2026, offizielles systematisches Verzeichnis / Kode-Suche',
  terminal:true
}));

console.log(`Terminal candidates: ${entries.length}; 3-character terminal codes detected: ${threeCharCount}.`);
if(entries.length!==EXPECTED){
  const first=entries.slice(0,12).map(x=>`${x.code} ${x.name}`).join(' | ');
  const last=entries.slice(-12).map(x=>`${x.code} ${x.name}`).join(' | ');
  throw new Error(`Expected exactly ${EXPECTED} terminal ICD-10-GM 2026 codes, extracted ${entries.length}. First: ${first}. Last: ${last}`);
}

const meta={version:'2026',terminalCount:entries.length,conceptCount:entries.length,source:'BfArM ICD-10-GM 2026'};
fs.writeFileSync(out,`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify(meta)};\n`,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 entries.`);
