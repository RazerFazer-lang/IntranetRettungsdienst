const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,firefox,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4182;
const BROWSER=process.env.BROWSER||'chromium';
const launchers={chromium,firefox,webkit};
const mime=file=>({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(file).toLowerCase()]||'application/octet-stream';
const server=http.createServer((req,res)=>{const u=(req.url||'/').split('?')[0];const rel=decodeURIComponent(u==='/'?'/index.html':u);const file=path.join(root,rel);if(!file.startsWith(root))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end('Not found');res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await launchers[BROWSER].launch({headless:true});
  try{
    for(const viewport of [{width:1920,height:1080},{width:1024,height:768},{width:390,height:844}]){
      const page=await browser.newPage({viewport});
      const errors=[];
      page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
      page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
      await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:20000});
      const button=page.locator('.nav-item[data-view="krankheiten-plus"]');
      await button.waitFor({timeout:7000});
      await button.click();
      await page.locator('h1').filter({hasText:'Krankheitsbilder & Erkrankungen'}).waitFor({timeout:7000});
      const countText=await page.locator('.disease-plus-meta').textContent();
      const count=parseInt(countText.match(/(\d+) Treffer/)?.[1]||'0',10);
      const total=parseInt(countText.match(/· (\d+) Einträge/)?.[1]||'0',10);
      if(total<400)throw new Error(`${BROWSER} ${viewport.width}: expected >=400 disease entries, got ${total}`);
      if(count<1)throw new Error(`${BROWSER}: initial disease results empty`);
      await page.locator('#dxSearch').fill('Sepsis');
      await wait(80);
      if(!(await page.locator('.disease-plus-card').count()))throw new Error(`${BROWSER}: Sepsis search returned no result`);
      await page.locator('[data-dx-open]').first().click();
      await page.locator('#dxModal:not(.hidden)').waitFor({timeout:3000});
      if(!(await page.locator('#dxBody').textContent()).includes('Warnzeichen'))throw new Error(`${BROWSER}: disease detail missing safety section`);
      await page.locator('#dxClose').click();
      await page.locator('#dxCategory').selectOption({label:'Kardiologie'});
      await wait(50);
      if(!(await page.locator('.disease-plus-card').count()))throw new Error(`${BROWSER}: category filter failed`);
      const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,inner:window.innerWidth}));
      if(overflow.body>overflow.inner+1)throw new Error(`${BROWSER} ${viewport.width}: horizontal overflow ${overflow.body}>${overflow.inner}`);
      if(errors.length)throw new Error(errors.join('\n'));
      await page.close();
    }
    console.log(`krankheitslexikon matrix: PASS (${BROWSER})`);
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
