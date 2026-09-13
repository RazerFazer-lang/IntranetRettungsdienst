const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4177;
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[ext]||'application/octet-stream'}
const server=http.createServer((req,res)=>{const url=(req.url||'/').split('?')[0];const rel=decodeURIComponent(url==='/'?'/index.html':url);const file=path.join(root,rel);if(!file.startsWith(root)){res.writeHead(403);return res.end()}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true});
  const errors=[];
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
    page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
    await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});

    if((await page.locator('.nav-item[data-view="dashboard"] .nav-label').textContent())?.trim()!=='Startseite')throw new Error('home navigation label is not Startseite');
    if((await page.locator('#breadcrumbCurrent').textContent())?.trim()!=='Startseite')throw new Error('home breadcrumb is not Startseite');

    // Sidebar footer must sit below the offline card with no overlap.
    const bounds=await page.evaluate(()=>{
      const card=document.querySelector('.sidebar-card')?.getBoundingClientRect();
      const footer=document.querySelector('.sidebar-footer')?.getBoundingClientRect();
      return {card,footer};
    });
    if(!bounds.card||!bounds.footer||bounds.footer.top < bounds.card.bottom-1)throw new Error('sidebar offline card and footer overlap');

    const sidebar=page.locator('#sidebar');
    await page.locator('#mobileMenu').click();
    if(!(await sidebar.evaluate(el=>el.classList.contains('open'))))throw new Error('hamburger did not open the sidebar');
    await page.locator('#mobileMenu').click();
    if(await sidebar.evaluate(el=>el.classList.contains('open')))throw new Error('hamburger did not close the sidebar');

    await page.locator('#mobileMenu').click();
    await page.locator('.nav-item[data-view="abcde"]').click();
    await page.locator('.suite-hero h1').filter({hasText:'Schritt für Schritt untersuchen'}).waitFor({timeout:5000});
    if(!(await page.locator('.nav-item.active').getAttribute('data-view')==='abcde'))throw new Error('ABCDE navigation did not activate correctly');

    const ids=['abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche'];
    await page.evaluate(ids=>localStorage.setItem('rd-suite-progress-v1',JSON.stringify({done:Object.fromEntries(ids.map(id=>[id,true])),abcde:5,quizCorrect:10,quizTotal:10,examBest:100,docs:1,cases:1})),ids);
    await page.locator('.nav-item[data-view="dashboard"]').click();
    await page.locator('.suite-stat strong').first().waitFor({timeout:5000});
    if((await page.locator('.suite-stat strong').first().textContent())?.trim()!=='100%')throw new Error('learning progress did not reach 100%');
    if((await page.locator('.suite-panel-head .suite-badge').first().textContent())?.trim()!=='9/9')throw new Error('learning progress badge did not become 9/9');

    await page.locator('.nav-item[data-view="psychiatrie"]').click();
    await page.locator('.suite-hero h1').filter({hasText:'Psychiatrische Einsatzlagen'}).waitFor({timeout:5000});
    await page.locator('.brand').click();
    await page.locator('.suite-hero h1').filter({hasText:'Dein Rettungsdienst-Dashboard.'}).waitFor({timeout:5000});
    if(!(await page.locator('.nav-item.active').getAttribute('data-view')==='dashboard'))throw new Error('brand home button did not return to Startseite');
    if((await page.locator('#breadcrumbCurrent').textContent())?.trim()!=='Startseite')throw new Error('brand navigation did not restore Startseite breadcrumb');

    // Desktop sanity check for the same footer-overlap regression.
    const desktop=await browser.newPage({viewport:{width:1920,height:1080}});
    await desktop.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
    const desktopBounds=await desktop.evaluate(()=>{const c=document.querySelector('.sidebar-card')?.getBoundingClientRect(),f=document.querySelector('.sidebar-footer')?.getBoundingClientRect();return {c,f}});
    if(!desktopBounds.c||!desktopBounds.f||desktopBounds.f.top < desktopBounds.c.bottom-1)throw new Error('desktop sidebar offline card and footer overlap');
    await desktop.close();

    if(errors.length)throw new Error(errors.join('\n'));
    console.log('ui fixes regression test: PASS');
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
