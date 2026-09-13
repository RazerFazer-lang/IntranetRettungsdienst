const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4176;
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[ext]||'application/octet-stream'}
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0])==='/'?'/index.html':decodeURIComponent((req.url||'/').split('?')[0]);const file=path.join(root,rel);if(!file.startsWith(root)){res.writeHead(403);return res.end()}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
const errors=[];
async function clickNav(page,view){
  const locator=page.locator(`.nav-item[data-view="${view}"]`);
  await locator.waitFor({timeout:5000});
  await locator.evaluate(el=>el.scrollIntoView({block:'center',inline:'nearest'}));
  await locator.click({timeout:5000});
}
async function assertSidebarStyle(page,label){
  const buttons=page.locator('.nav-item');
  const count=await buttons.count();
  if(count<15)throw new Error(`${label}: sidebar has too few navigation buttons (${count})`);
  const values=await buttons.evaluateAll(els=>els.map(el=>{const s=getComputedStyle(el);return{height:Math.round(parseFloat(s.height)),minHeight:Math.round(parseFloat(s.minHeight)),padding:s.padding,gap:s.gap,borderRadius:s.borderRadius,fontSize:s.fontSize,lineHeight:s.lineHeight,display:s.display,alignItems:s.alignItems,boxSizing:s.boxSizing,width:Math.round(el.getBoundingClientRect().width)}}));
  const first=values[0];
  for(const [i,v] of values.entries()){
    for(const key of ['height','minHeight','padding','gap','borderRadius','fontSize','lineHeight','display','alignItems','boxSizing']){
      if(v[key]!==first[key])throw new Error(`${label}: inconsistent ${key} on nav item ${i}`);
    }
    if(v.height!==52||v.minHeight!==52)throw new Error(`${label}: navigation row ${i} is not exactly 52px high`);
    if(v.width<150)throw new Error(`${label}: navigation row ${i} is unexpectedly narrow`);
  }
  const iconWidths=await page.locator('.nav-item span').evaluateAll(els=>els.map(el=>Math.round(el.getBoundingClientRect().width)));
  if(iconWidths.some(w=>w!==20))throw new Error(`${label}: navigation icons do not use the shared 20px column`);
}
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1365,height:1200}});
  page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
  try{
    await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
    await assertSidebarStyle(page,'desktop');
    const standard={
      abfrage:{selector:'h1',text:'Womit brauchst du Hilfe?'},
      notfallbilder:{selector:'#caseGrid'},
      checklisten:{selector:'h1',text:'Geführte Einsatzabfragen'},
      medikamente:{selector:'h1',text:'Rettungsdienst-Liste'},
      manv:{selector:'h1',text:'MANV-Sichtungsübersicht'},
      rechner:{selector:'h1',text:'Praktische Schnellrechner'},
      wissen:{selector:'h1',text:'Wissensbereich'}
    };
    for(const [view,expect] of Object.entries(standard)){
      await clickNav(page,view);
      if(expect.text)await page.locator(expect.selector).filter({hasText:expect.text}).waitFor({timeout:5000});
      else await page.locator(expect.selector).waitFor({timeout:5000});
      if(await page.locator('#einsatzlagenSection').count())throw new Error(`Lagebilder leaked into ${view}`);
      if(!(await page.locator('.nav-item.active').first().getAttribute('data-view')===view))throw new Error(`active nav mismatch on ${view}`);
    }

    await clickNav(page,'lagebilder');
    await page.locator('#einsatzlagenSection').waitFor({timeout:5000});
    if((await page.locator('.einsatzlage-card').count())<100)throw new Error('Lagebilder catalogue is missing entries');
    await page.locator('#einsatzlagenSearch').fill('Verkehr');
    if((await page.locator('.einsatzlage-card').count())<1)throw new Error('Lagebilder search failed');
    await clickNav(page,'notfallbilder');
    await page.locator('#caseGrid').waitFor({timeout:5000});
    if(await page.locator('#einsatzlagenSection').count())throw new Error('Lagebilder reappeared in Notfallbilder');

    await clickNav(page,'dashboard');
    await page.locator('.suite-hero').waitFor({timeout:5000});
    const dashboardRoutes=['abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche'];
    for(const route of dashboardRoutes){
      const card=page.locator(`[data-suite-route="${route}"]`).first();
      if(await card.count()!==1)throw new Error(`dashboard route missing: ${route}`);
      await card.click();
      await page.waitForTimeout(80);
      if(!(await page.locator('.nav-item.active').first().getAttribute('data-view')===route))throw new Error(`dashboard route did not activate ${route}`);
      if(!(await page.locator('.suite-hero').count()))throw new Error(`suite view missing for ${route}`);
      await clickNav(page,'dashboard');
      await page.locator('.suite-hero').waitFor({timeout:5000});
    }

    const suiteViews=['abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche','statistik'];
    for(const view of suiteViews){
      await clickNav(page,view);
      await page.waitForTimeout(80);
      if(!(await page.locator('.nav-item.active').first().getAttribute('data-view')===view))throw new Error(`suite sidebar navigation failed: ${view}`);
      if(!(await page.locator('.suite-hero').count()))throw new Error(`suite sidebar view missing: ${view}`);
    }

    const mobile=await browser.newPage({viewport:{width:390,height:844}});
    const mobileErrors=[];
    mobile.on('pageerror',e=>mobileErrors.push(`pageerror: ${e.message}`));
    mobile.on('console',m=>{if(m.type()==='error')mobileErrors.push(`console: ${m.text()}`)});
    await mobile.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
    await assertSidebarStyle(mobile,'mobile');
    const sidebar=mobile.locator('#sidebar');
    await mobile.locator('#mobileMenu').click();
    if(!(await sidebar.evaluate(el=>el.classList.contains('open'))))throw new Error('mobile sidebar did not open');
    await clickNav(mobile,'lagebilder');
    if(await sidebar.evaluate(el=>el.classList.contains('open')))throw new Error('mobile sidebar did not close after Lagebilder navigation');
    await mobile.locator('#mobileMenu').click();
    await clickNav(mobile,'abfrage');
    if(await sidebar.evaluate(el=>el.classList.contains('open')))throw new Error('mobile sidebar did not close after Abfragehilfe navigation');
    const navOverflow=await mobile.locator('.nav').evaluate(el=>({scroll:el.scrollHeight,client:el.clientHeight,overflow:getComputedStyle(el).overflowY}));
    if(navOverflow.scroll<=navOverflow.client)throw new Error('mobile navigation does not overflow and therefore cannot scroll');
    if(!['auto','scroll'].includes(navOverflow.overflow))throw new Error(`mobile navigation has wrong overflow mode: ${navOverflow.overflow}`);
    await mobile.close();

    if(errors.length||mobileErrors.length)throw new Error([...errors,...mobileErrors].join('\n'));
    console.log('navigation + sidebar visual regression test: PASS');
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
