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
for(let i=0;i<uniqueFiles.length;i+=8){
  const batch=uniqueFiles.slice(i,i+8);
  const pages=await Promise.all(batch.map(async file=>({file,html:await fetchText(new URL(file,INDEX_URL).href)})));
  for(const {file,html} of pages){
    // BfArM's official block pages render concrete ICD codes as h5 headings;
    // higher-level group headings use h4, so h5 gives the terminal catalogue.
    const headings=[...html.matchAll(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi)];
    for(const match of headings){
      const raw=decodeHtml(match[1]).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
      const m=raw.match(/^([A-Z]\d{2}\.[0-9A-Z]+!?)(?:\s+|$)(.*)$/i);
      if(!m)continue;
      const code=m[1].toUpperCase();
      const name=m[2].trim();
      if(!name||name==='-'||code.includes('*'))continue;
      entriesByCode.set(code,{code,name});
    }
  }
  console.log(`Parsed ${Math.min(i+8,uniqueFiles.length)}/${uniqueFiles.length} pages; ${entriesByCode.size} unique terminal candidates.`);
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

if(entries.length!==EXPECTED){
  throw new Error(`Expected exactly ${EXPECTED} terminal ICD-10-GM 2026 codes, extracted ${entries.length}.`);
}

const meta={version:'2026',terminalCount:entries.length,conceptCount:entries.length,source:'BfArM ICD-10-GM 2026'};
fs.writeFileSync(out,`window.RD_ICD10GM_ALL=${JSON.stringify(entries)};\nwindow.RD_ICD10GM_META=${JSON.stringify(meta)};\n`,'utf8');
console.log(`Generated ${entries.length} terminal ICD-10-GM 2026 entries.`);
