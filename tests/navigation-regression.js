const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4176;
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[ext]||'application/octet-stream'}
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0])==='/'?'/index.html':decodeURIComponent((req.url||'/').split('?')[0]);const file=path.join(root,rel);if(!file.startsWith(root)){res.writeHead(403);return res.end()}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
  try{
    await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
    await page.locator('.nav-item[data-view="abfrage"]').click();
    await page.locator('h1').filter({hasText:'Womit brauchst du Hilfe?'}).waitFor({timeout:5000});
    if(await page.locator('#einsatzlagenSection').count())throw new Error('Lagebilder leaked into Abfragehilfe');

    await page.locator('.nav-item[data-view="notfallbilder"]').click();
    await page.locator('#caseGrid').waitFor({timeout:5000});
    if(await page.locator('#einsatzlagenSection').count())throw new Error('Lagebilder leaked into Notfallbilder');

    await page.locator('.nav-item[data-view="lagebilder"]').click();
    await page.locator('#einsatzlagenSection').waitFor({timeout:5000});
    if((await page.locator('.einsatzlage-card').count())<100)throw new Error('Lagebilder catalogue is missing entries');

    await page.locator('.nav-item[data-view="dashboard"]').click();
    await page.locator('[data-suite-route="abcde"]').click();
    await page.locator('h1').filter({hasText:'Schritt für Schritt untersuchen'}).waitFor({timeout:5000});

    const mobile=await browser.newPage({viewport:{width:390,height:844}});
    await mobile.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:15000});
    const sidebar=mobile.locator('#sidebar');
    await mobile.locator('#mobileMenu').click();
    if(!(await sidebar.evaluate(el=>el.classList.contains('open'))))throw new Error('mobile sidebar did not open');
    await mobile.locator('.nav-item[data-view="abfrage"]').click();
    if(await sidebar.evaluate(el=>el.classList.contains('open')))throw new Error('mobile sidebar did not close after navigation');
    await mobile.close();

    if(errors.length)throw new Error(errors.join('\n'));
    console.log('navigation regression test: PASS');
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
