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
    for(const viewport of [{width:390,height:844},{width:1920,height:1080}]){
      const page=await browser.newPage({viewport});
      page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
      page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
      await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
      if(await page.locator('#mobileMenu').count()!==0)throw new Error('obsolete hamburger menu button still exists');
      if((await page.locator('.nav-item[data-view="dashboard"] .nav-label').textContent())?.trim()!=='Startseite')throw new Error('home navigation label is not Startseite');
      if((await page.locator('#breadcrumbCurrent').textContent())?.trim()!=='Startseite')throw new Error('home breadcrumb is not Startseite');
      const bounds=await page.evaluate(()=>{const c=document.querySelector('.sidebar-card')?.getBoundingClientRect();const f=document.querySelector('.sidebar-footer')?.getBoundingClientRect();return {c,f}});
      if(!bounds.c||!bounds.f||bounds.f.top < bounds.c.bottom-1)throw new Error(`sidebar overlap at ${viewport.width}x${viewport.height}`);
      await page.locator('.nav-item[data-view="abcde"]').scrollIntoViewIfNeeded();
      await page.locator('.nav-item[data-view="abcde"]').click();
      await page.locator('.suite-hero h1').filter({hasText:'Schritt für Schritt untersuchen'}).waitFor({timeout:5000});
      if(!(await page.locator('.nav-item.active').getAttribute('data-view')==='abcde'))throw new Error('ABCDE navigation did not activate correctly');
      await page.locator('.brand').click();
      await page.locator('.suite-hero h1').filter({hasText:'Startseite – dein Lernzentrum.'}).waitFor({timeout:5000});
      if(!(await page.locator('.nav-item.active').getAttribute('data-view')==='dashboard'))throw new Error('brand home navigation failed');
      await page.close();
    }
    if(errors.length)throw new Error(errors.join('\n'));
    console.log('ui fixes regression test: PASS');
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
