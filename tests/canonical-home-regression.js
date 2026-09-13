const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4180;
const mime=file=>({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(file).toLowerCase()]||'application/octet-stream';
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0]==='/'?'/index.html':(req.url||'/').split('?')[0]);const file=path.join(root,rel);if(!file.startsWith(root))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end('Not found');res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function assertHome(page,label){
  await page.locator('.learn-hero h1').waitFor({timeout:7000});
  const title=(await page.locator('.learn-hero h1').textContent()).trim();
  if(title!=='Startseite – dein Lernzentrum.')throw new Error(`${label}: wrong home title: ${title}`);
  const stat=(await page.locator('.learn-stats .suite-stat').first().locator('strong').textContent()).trim();
  if(stat!=='0/7')throw new Error(`${label}: wrong Lernmodule value: ${stat}`);
  if(await page.locator('.hero h1').filter({hasText:'Strukturiert handeln.'}).count())throw new Error(`${label}: legacy operational dashboard is rendered`);
  const pct=(await page.locator('.learn-hero-progress .learn-progress-meta strong').textContent()).trim();
  if(pct!=='0%')throw new Error(`${label}: hero percentage is wrong: ${pct}`);
}
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1920,height:1080}});
    const errors=[];page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
    await page.addInitScript(()=>localStorage.clear());
    await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:20000});
    await assertHome(page,'initial');

    await page.locator('[data-view="abfrage"]').click();
    await page.locator('.view-title h1').filter({hasText:'Womit brauchst du Hilfe?'}).waitFor({timeout:7000});

    await page.locator('[data-view="dashboard"]').click();
    await assertHome(page,'sidebar Startseite');

    await page.locator('[data-view="abfrage"]').click();
    await page.locator('.view-title h1').filter({hasText:'Womit brauchst du Hilfe?'}).waitFor({timeout:7000});
    await page.locator('.brand').click();
    await assertHome(page,'RD INTRANET brand');

    await page.locator('[data-view="abfrage"]').click();
    await page.locator('.view-title h1').filter({hasText:'Womit brauchst du Hilfe?'}).waitFor({timeout:7000});
    await page.locator('.brand').click();
    await wait(100);
    await assertHome(page,'second brand navigation');

    if(errors.length)throw new Error(errors.join('\n'));
    console.log('canonical home regression: PASS');
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
