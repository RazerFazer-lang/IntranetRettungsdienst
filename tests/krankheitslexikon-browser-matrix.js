const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,firefox,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4182;
const BROWSER=process.env.BROWSER||'chromium';
const REQUIRED_TERMINAL_COUNT=14370;
const launchers={chromium,firefox,webkit};
const viewports=[
  {width:1920,height:1080,name:'desktop-1920'},
  {width:2560,height:1440,name:'desktop-2560'},
  {width:1024,height:768,name:'tablet-1024'},
  {width:820,height:1180,name:'tablet-820'},
  {width:390,height:844,name:'mobile-390'},
  {width:412,height:915,name:'mobile-412'}
];
const mime=file=>({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(file).toLowerCase()]||'application/octet-stream';
const server=http.createServer((req,res)=>{const u=(req.url||'/').split('?')[0];const rel=decodeURIComponent(u==='/'?'/index.html':u);const file=path.join(root,rel);if(!file.startsWith(root))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end('Not found');res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const text=locator=>locator.textContent().then(v=>v||'');
const parseDeInt=value=>Number(String(value).replace(/[.\s\u00a0\u202f]/g,'').replace(/,/g,''));
async function launchBrowser(){
  if(BROWSER==='edge')return chromium.launch({headless:true,channel:'msedge'});
  const launcher=launchers[BROWSER];
  if(!launcher)throw new Error(`Unsupported browser: ${BROWSER}`);
  return launcher.launch({headless:true});
}
async function verifyDiseaseView(page,label){
  const button=page.locator('.nav-item[data-view="krankheiten-plus"]');
  await button.waitFor({timeout:7000});
  await button.click();
  await page.locator('h1').filter({hasText:'Krankheitsbilder & Erkrankungen'}).waitFor({timeout:7000});
  const countText=await text(page.locator('.disease-plus-meta'));
  const catalogueLength=await page.evaluate(()=>Array.isArray(window.RD_ICD10GM_ALL)?window.RD_ICD10GM_ALL.length:0);
  if(catalogueLength!==REQUIRED_TERMINAL_COUNT)throw new Error(`${label}: browser catalogue has ${catalogueLength} entries, expected ${REQUIRED_TERMINAL_COUNT}`);
  const countMatch=countText.match(/([\d.\s\u00a0\u202f]+) Treffer/);
  const totalMatch=countText.match(/·\s*([\d.\s\u00a0\u202f]+) Einträge/);
  const catalogMatch=countText.match(/Katalogprüfung:\s*([\d.\s\u00a0\u202f]+)\//);
  const count=countMatch?parseDeInt(countMatch[1]):0;
  const total=totalMatch?parseDeInt(totalMatch[1]):0;
  const catalog=catalogMatch?parseDeInt(catalogMatch[1]):0;
  if(total!==REQUIRED_TERMINAL_COUNT)throw new Error(`${label}: UI reports ${total} entries, expected ${REQUIRED_TERMINAL_COUNT}; text=${countText}`);
  if(catalog!==REQUIRED_TERMINAL_COUNT)throw new Error(`${label}: UI catalogue check reports ${catalog}/${REQUIRED_TERMINAL_COUNT}; text=${countText}`);
  if(count<1)throw new Error(`${label}: initial disease results empty`);
  const categories=await page.locator('#dxCategory option').allTextContents();
  if(!categories.includes('Kardiologie / Kreislauf'))throw new Error(`${label}: official category missing`);

  await page.locator('#dxSearch').fill('Sepsis');
  await wait(80);
  const sepsisCards=page.locator('.disease-plus-card');
  if(!(await sepsisCards.count()))throw new Error(`${label}: Sepsis search returned no result`);
  if(!(await text(sepsisCards.first())).toLowerCase().includes('sepsis'))throw new Error(`${label}: Sepsis result text mismatch`);
  await page.locator('[data-dx-open]').first().click();
  await page.locator('#dxModal:not(.hidden)').waitFor({timeout:3000});
  const detailText=await text(page.locator('#dxBody'));
  if(!detailText.includes('Warnzeichen'))throw new Error(`${label}: disease detail missing safety section`);
  await page.locator('#dxClose').click();

  await page.locator('#dxSearch').fill('J44');
  await wait(50);
  if(!(await page.locator('.disease-plus-card').count()))throw new Error(`${label}: ICD code search J44 returned no result`);
  if(!(await text(page.locator('.disease-plus-card').first())).includes('COPD'))throw new Error(`${label}: ICD code J44 did not resolve to COPD entry`);

  await page.locator('#dxSearch').fill('');
  await page.locator('#dxCategory').selectOption({label:'Kardiologie / Kreislauf'});
  await wait(50);
  const cardioCount=await page.locator('.disease-plus-card').count();
  if(!cardioCount)throw new Error(`${label}: official category filter failed`);
  if((await text(page.locator('#dxCategory')))!=='Kardiologie / Kreislauf')throw new Error(`${label}: category select state mismatch`);

  await page.locator('#dxReset').click();
  await page.locator('.disease-plus-card').first().waitFor({timeout:3000});
  await page.locator('.nav-item[data-view="dashboard"]').click();
  await page.waitForTimeout(150);
  await page.locator('.nav-item[data-view="krankheiten-plus"]').click();
  await page.locator('h1').filter({hasText:'Krankheitsbilder & Erkrankungen'}).waitFor({timeout:7000});
  const afterNav=await text(page.locator('.disease-plus-meta'));
  const roundTripLength=await page.evaluate(()=>Array.isArray(window.RD_ICD10GM_ALL)?window.RD_ICD10GM_ALL.length:0);
  if(roundTripLength!==REQUIRED_TERMINAL_COUNT)throw new Error(`${label}: catalogue missing after dashboard round-trip`);
  if(!afterNav.includes('Einträge'))throw new Error(`${label}: disease metadata missing after dashboard round-trip`);
}
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await launchBrowser();
  try{
    const context=await browser.newContext();
    let offlineVerified=false;
    for(const viewport of viewports){
      const page=await context.newPage({viewport:{width:viewport.width,height:viewport.height}});
      const errors=[];
      page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
      page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
      await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:30000});
      await verifyDiseaseView(page,`${BROWSER} ${viewport.name}`);
      const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,inner:window.innerWidth}));
      if(overflow.body>overflow.inner+1)throw new Error(`${BROWSER} ${viewport.name}: horizontal overflow ${overflow.body}>${overflow.inner}`);
      if(!offlineVerified){
        await page.evaluate(async()=>{if(navigator.serviceWorker?.controller) return; try{await navigator.serviceWorker.ready;}catch{}});
        await page.reload({waitUntil:'networkidle',timeout:30000});
        await verifyDiseaseView(page,`${BROWSER} ${viewport.name} after online reload`);
        await context.setOffline(true);
        await page.reload({waitUntil:'networkidle',timeout:30000});
        await page.locator('h1').filter({hasText:'Krankheitsbilder & Erkrankungen'}).waitFor({timeout:7000});
        const offlineLength=await page.evaluate(()=>Array.isArray(window.RD_ICD10GM_ALL)?window.RD_ICD10GM_ALL.length:0);
        const offlineText=await text(page.locator('.disease-plus-meta'));
        if(offlineLength!==REQUIRED_TERMINAL_COUNT||!offlineText.includes('Einträge'))throw new Error(`${BROWSER} offline: full disease catalogue unavailable after offline reload (${offlineLength} entries)`);
        await context.setOffline(false);
        offlineVerified=true;
      }
      if(errors.length)throw new Error(errors.join('\n'));
      await page.close();
    }
    await context.close();
    console.log(`krankheitslexikon matrix: PASS (${BROWSER}) — ${viewports.length} viewports, ${REQUIRED_TERMINAL_COUNT} entries verified, offline reload verified`);
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
