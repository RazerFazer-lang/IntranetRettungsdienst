const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,firefox,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4178;
const BROWSER=process.env.BROWSER||'chromium';
const launchers={chromium,firefox,webkit};
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[ext]||'application/octet-stream'}
const server=http.createServer((req,res)=>{const url=(req.url||'/').split('?')[0];const rel=decodeURIComponent(url==='/'?'/index.html':url);const file=path.join(root,rel);if(!file.startsWith(root)){res.writeHead(403);return res.end()}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function nav(page,view){const b=page.locator(`.nav-item[data-view="${view}"]`);await b.waitFor({timeout:7000});await b.scrollIntoViewIfNeeded();await b.click();await wait(40)}
async function answerCorrect(page,name){const card=page.locator('.learning-question').first();const correct=await card.getAttribute('data-correct');if(correct===null)throw new Error(`missing data-correct for ${name}`);await page.locator(`input[name="${name}"][value="${correct}"]`).check();}
async function assertCanonicalHome(page,label){
  await page.locator('.rd-mainmenu-hero h1').filter({hasText:'Hauptmenü'}).waitFor({timeout:7000});
  const tileCount=await page.locator('.rd-mainmenu-tile').count();
  if(tileCount<14)throw new Error(`${BROWSER}: ${label} has only ${tileCount} main menu tiles`);
  if(await page.locator('.hero h1').filter({hasText:'Strukturiert handeln.'}).count())throw new Error(`${BROWSER}: ${label} opened the legacy operational dashboard`);
}
(async()=>{
 await new Promise(r=>server.listen(port,'127.0.0.1',r));
 const browser=await launchers[BROWSER].launch({headless:true});
 try{
  for(const viewport of [{width:1920,height:1080},{width:390,height:844}]){
   const page=await browser.newPage({viewport});const errors=[];
   page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
   await page.addInitScript(()=>{localStorage.clear();localStorage.setItem('rd-suite-progress-v1',JSON.stringify({done:{abcde:true,dokumentation:true,medlernen:true,gefahren:true,psychiatrie:true,pruefung:true,wissensdatenbank:true},quizCorrect:9,quizTotal:10,examBest:90,docs:2}))});
   await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:20000});
   await assertCanonicalHome(page,'initial load');
   if(await page.locator('#mobileMenu').count())throw new Error('obsolete mobile menu button is still present');
   if((await page.locator('.nav-item[data-view="dashboard"] .nav-label').textContent())?.trim()!=='Startseite')throw new Error('Startseite label missing');
   await page.locator('.rd-mainmenu-tile[data-main-route="suite:ausbildung"]').click();
   await page.locator('.suite-stat strong').first().waitFor({timeout:7000});
   if((await page.locator('.suite-stat strong').first().textContent())?.trim()!=='100%')throw new Error(`${BROWSER}: progress migration did not reach 100%`);
   if((await page.locator('.learn-module.done').count())!==7)throw new Error(`${BROWSER}: migration did not mark seven learning modules done`);

   // Canonical-home regression: both the sidebar Startseite and the RD INTRANET brand
   // must lead to exactly the same main menu, never a legacy renderer.
   await page.evaluate(()=>{localStorage.removeItem('rd-suite-progress-v2');localStorage.removeItem('rd-suite-progress-v1')});
   await page.locator('.nav-item[data-view="dashboard"]').click();
   await assertCanonicalHome(page,'sidebar Startseite');
   await nav(page,'abfrage');
   if(!(await page.locator('.view-title h1').filter({hasText:'Womit brauchst du Hilfe?'}).count()))throw new Error(`${BROWSER}: Abfragehilfe did not open`);
   await page.locator('.brand').click();
   await assertCanonicalHome(page,'RD INTRANET brand');

   await page.evaluate(()=>{localStorage.removeItem('rd-suite-progress-v2');localStorage.removeItem('rd-suite-progress-v1')});
   await page.reload({waitUntil:'networkidle'});
   await assertCanonicalHome(page,'fresh reload');

   await nav(page,'abcde');
   for(let i=0;i<5;i++){await answerCorrect(page,'abcde-answer');await page.locator('[data-action="abcde-check"]').click();if(i<4)await page.locator('.suite-hero h1').filter({hasText:'ABCDE-Training'}).waitFor({timeout:5000})}
   if(!await page.locator('.suite-hero h1').filter({hasText:'ABCDE abgeschlossen'}).count())throw new Error(`${BROWSER}: ABCDE did not complete`);

   await nav(page,'dokumentation');
   const fields={fall:'TRAINING-001',ort:'Wohnung',meldung:'Dyspnoe',anamnese:'Beginn vor 30 Minuten.',befunde:'ABCDE im Training.',massnahmen:'Monitoring und Re-Evaluation.',uebergabe:'Strukturierte Übergabe.'};
   for(const [name,value] of Object.entries(fields))await page.locator(`[name="${name}"]`).fill(value);
   await page.locator('#docForm button[type="submit"]').click();await page.locator('text=Dokumentation abgeschlossen').waitFor({timeout:5000});

   await nav(page,'medlernen');
   for(let i=0;i<5;i++){await answerCorrect(page,'med-answer');await page.locator('[data-action="med-check"]').click();await page.locator('[data-action="med-next"]').click();}
   if((await page.evaluate(()=>JSON.parse(localStorage.getItem('rd-suite-progress-v2')).completed.medlernen))!==true)throw new Error(`${BROWSER}: medication learning did not complete`);

   await nav(page,'gefahren');
   for(let i=0;i<6;i++){await answerCorrect(page,'hazard-answer');await page.locator('[data-action="hazard-check"]').click();await wait(30)}
   if((await page.evaluate(()=>JSON.parse(localStorage.getItem('rd-suite-progress-v2')).completed.gefahren))!==true)throw new Error(`${BROWSER}: hazard training did not complete`);

   await nav(page,'psychiatrie');
   for(let i=0;i<5;i++){await answerCorrect(page,'psych-answer');await page.locator('[data-action="psych-check"]').click();await wait(30)}
   if((await page.evaluate(()=>JSON.parse(localStorage.getItem('rd-suite-progress-v2')).completed.psychiatrie))!==true)throw new Error(`${BROWSER}: psychiatric training did not complete`);

   await nav(page,'wissensdatenbank');
   for(let i=0;i<10;i++){await page.locator(`[data-action="knowledge-read"][data-index="${i}"]`).click();await wait(10)}
   if((await page.evaluate(()=>JSON.parse(localStorage.getItem('rd-suite-progress-v2')).completed.wissensdatenbank))!==true)throw new Error(`${BROWSER}: knowledge module did not complete`);

   await nav(page,'pruefung');
   for(let i=0;i<10;i++){await answerCorrect(page,'exam-answer');await page.locator('[data-action="exam-next"]').click();await wait(30)}
   await page.locator('.suite-hero h1').filter({hasText:'Prüfung bestanden'}).waitFor({timeout:7000});

   await nav(page,'ausbildung');
   if((await page.locator('.learn-module.done').count())!==7)throw new Error(`${BROWSER}: Ausbildung overview does not show 7/7 modules`);
   await nav(page,'statistik');
   if((await page.locator('.suite-stat strong').first().textContent())?.trim()!=='100%')throw new Error(`${BROWSER}: Statistik is not 100% after completing all modules`);

   const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,inner:window.innerWidth}));
   if(overflow.body>overflow.inner+1)throw new Error(`${BROWSER}: horizontal overflow ${overflow.body}>${overflow.inner}`);
   if(errors.length)throw new Error(`${BROWSER} ${viewport.width}x${viewport.height}\n`+errors.join('\n'));
   await page.close();
  }
  console.log(`learning suite matrix test: PASS (${BROWSER})`);
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
