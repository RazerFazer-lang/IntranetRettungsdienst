const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4190;
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0]==='/'?'/index.html':(req.url||'/').split('?')[0]);const file=path.join(root,rel);if(!file.startsWith(root))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end('Not found');const ext=path.extname(file).toLowerCase();const type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[ext]||'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(data)})});
(async()=>{
 await new Promise(r=>server.listen(port,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[];page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
  await page.addInitScript(()=>localStorage.clear());
  await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:20000});
  const nav=page.locator('.nav-item[data-view="krankheiten-plus"]');
  await nav.waitFor({timeout:7000});
  await nav.click();
  await page.locator('#dxResults').waitFor({timeout:15000});
  const info=await page.locator('.disease-plus-meta').textContent();
  if(!/14\.370/.test(info))throw new Error(`Expected 14.370 terminal ICD entries, got: ${info}`);
  const cards=await page.locator('.disease-plus-card').count();
  if(cards<50||cards>96)throw new Error(`Pagination should render at most 96 cards, got ${cards}`);
  await page.locator('#dxSearch').fill('Sepsis');
  await page.waitForTimeout(100);
  if(await page.locator('.disease-plus-card').count()<1)throw new Error('Sepsis search returned no result');
  await page.locator('[data-dx-open]').first().click();
  await page.locator('#dxModal:not(.hidden)').waitFor({timeout:3000});
  await page.locator('#dxClose').click();
  await page.locator('#dxModal.hidden').waitFor({timeout:3000});
  if(errors.length)throw new Error(errors.join('\n'));
  console.log('complete ICD-10-GM browser test: PASS');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
