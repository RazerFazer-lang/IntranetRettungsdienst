const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4176;
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[ext]||'application/octet-stream'}
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0])==='/'?'/index.html':decodeURIComponent((req.url||'/').split('?')[0]);const file=path.join(root,rel);if(!file.startsWith(root)){res.writeHead(403);return res.end()}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
const errors=[];
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
  try{
    await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
    const standard={
      abfrage:{selector:'h1',text:'Womit brauchst du Hilfe?'},
      notfallbilder:{selector:'#caseGrid'},
      checklisten:{selector:'h1',text:'Praktische Kurzlisten'},
      medikamente:{selector:'h1',text:'Rettungsdienst-Liste'},
      manv:{selector:'h1',text:'MANV-Sichtungsübersicht'},
      rechner:{selector:'h1',text:'Praktische Schnellrechner'},
      wissen:{selector:'h1',text:'Wissensbereich'}
    };
    for(const [view,expect] of Object.entries(standard)){
      await page.locator(`.nav-item[data-view="${view}"]`).click();
      if(expect.text)await page.locator(expect.selector).filter({hasText:expect.text}).waitFor({timeout:5000});
      else await page.locator(expect.selector).waitFor({timeout:5000});
      if(await page.locator('#einsatzlagenSection').count())throw new Error(`Lagebilder leaked into ${view}`);
      if(!(await page.locator('.nav-item.active').first().getAttribute('data-view')===view))throw new Error(`active nav mismatch on ${view}`);
    }

    await page.locator('.nav-item[data-view="lagebilder"]').click();
    await page.locator('#einsatzlagenSection').waitFor({timeout:5000});
    if((await page.locator('.einsatzlage-card').count())<100)throw new Error('Lagebilder catalogue is missing entries');
    await page.locator('#einsatzlagenSearch').fill('Verkehr');
    if((await page.locator('.einsatzlage-card').count())<1)throw new Error('Lagebilder search failed');
    await page.locator('.nav-item[data-view="notfallbilder"]').click();
    await page.locator('#caseGrid').waitFor({timeout:5000});
    if(await page.locator('#einsatzlagenSection').count())throw new Error('Lagebilder reappeared in Notfallbilder');

    await page.locator('.nav-item[data-view="dashboard"]').click();
    await page.locator('.suite-hero').waitFor({timeout:5000});
    const dashboardRoutes=['abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche'];
    for(const route of dashboardRoutes){
      const card=page.locator(`[data-suite-route="${route}"]`).first();
      if(await card.count()!==1)throw new Error(`dashboard route missing: ${route}`);
      await card.click();
      await page.waitForTimeout(80);
      if(!(await page.locator('.nav-item.active').first().getAttribute('data-view')===route))throw new Error(`dashboard route did not activate ${route}`);
      if(!(await page.locator('.suite-hero').count()))throw new Error(`suite view missing for ${route}`);
      await page.locator('.nav-item[data-view="dashboard"]').click();
      await page.locator('.suite-hero').waitFor({timeout:5000});
    }

    const suiteViews=['abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche','statistik'];
    for(const view of suiteViews){
      await page.locator(`.nav-item[data-view="${view}"]`).click();
      await page.waitForTimeout(80);
      if(!(await page.locator('.nav-item.active').first().getAttribute('data-view')===view))throw new Error(`suite sidebar navigation failed: ${view}`);
      if(!(await page.locator('.suite-hero').count()))throw new Error(`suite sidebar view missing: ${view}`);
    }

    const mobile=await browser.newPage({viewport:{width:390,height:844}});
    const mobileErrors=[];
    mobile.on('pageerror',e=>mobileErrors.push(`pageerror: ${e.message}`));
    mobile.on('console',m=>{if(m.type()==='error')mobileErrors.push(`console: ${m.text()}`)});
    await mobile.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
    const sidebar=mobile.locator('#sidebar');
    await mobile.locator('#mobileMenu').click();
    if(!(await sidebar.evaluate(el=>el.classList.contains('open'))))throw new Error('mobile sidebar did not open');
    await mobile.locator('.nav-item[data-view="lagebilder"]').click();
    if(await sidebar.evaluate(el=>el.classList.contains('open')))throw new Error('mobile sidebar did not close after Lagebilder navigation');
    await mobile.locator('.nav-item[data-view="abfrage"]').click();
    if(await sidebar.evaluate(el=>el.classList.contains('open')))throw new Error('mobile sidebar did not close after Abfragehilfe navigation');
    const navOverflow=await mobile.locator('.nav').evaluate(el=>({scroll:el.scrollHeight,client:el.clientHeight,overflow:getComputedStyle(el).overflowY}));
    if(navOverflow.overflow==='visible')throw new Error('navigation list is not scrollable');
    await mobile.close();

    if(errors.length||mobileErrors.length)throw new Error([...errors,...mobileErrors].join('\n'));
    console.log('navigation regression test: PASS');
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
