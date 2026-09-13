const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,firefox,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4190;
const requestedBrowser=process.env.BROWSER||'chromium';
const launchers={chromium,firefox,webkit};
if(!launchers[requestedBrowser])throw new Error(`Unsupported browser: ${requestedBrowser}`);
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0]==='/'?'/index.html':(req.url||'/').split('?')[0]);const file=path.join(root,rel);if(!file.startsWith(root))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end('Not found');const ext=path.extname(file).toLowerCase();const type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[ext]||'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(data)})});
const viewports=[
  {name:'desktop-fhd',width:1920,height:1080},
  {name:'desktop-qhd',width:2560,height:1440},
  {name:'tablet-landscape',width:1024,height:768},
  {name:'tablet-portrait',width:820,height:1180},
  {name:'phone-390',width:390,height:844},
  {name:'phone-412',width:412,height:915}
];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await launchers[requestedBrowser].launch({headless:true});
  try{
    for(const viewport of viewports){
      const page=await browser.newPage({viewport});
      const errors=[];
      page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
      page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
      await page.addInitScript(()=>localStorage.clear());
      await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:20000});
      const nav=page.locator('.nav-item[data-view="krankheiten-plus"]');
      await nav.waitFor({timeout:7000});
      await nav.click();
      await page.locator('#dxResults').waitFor({timeout:15000});
      const info=(await page.locator('.disease-plus-meta').textContent())||'';
      if(!/14\.370/.test(info))throw new Error(`${requestedBrowser} ${viewport.name}: expected 14.370 terminal ICD entries, got: ${info}`);
      const cards=await page.locator('.disease-plus-card').count();
      if(cards<1||cards>96)throw new Error(`${requestedBrowser} ${viewport.name}: pagination rendered ${cards} cards`);
      const blank=await page.locator('.disease-plus-card').evaluateAll(cards=>cards.filter(c=>!c.querySelector('h2')?.textContent?.trim()||!c.querySelector('p')?.textContent?.trim()).length);
      if(blank)throw new Error(`${requestedBrowser} ${viewport.name}: ${blank} disease cards are blank`);
      const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,inner:window.innerWidth}));
      if(overflow.body>overflow.inner+1)throw new Error(`${requestedBrowser} ${viewport.name}: horizontal overflow ${overflow.body}>${overflow.inner}`);

      await page.locator('#dxSearch').fill('Sepsis');
      await wait(100);
      if(await page.locator('.disease-plus-card').count()<1)throw new Error(`${requestedBrowser} ${viewport.name}: Sepsis search returned no result`);
      await page.locator('[data-dx-open]').first().click();
      await page.locator('#dxModal:not(.hidden)').waitFor({timeout:3000});
      const closeButton=page.locator('#dxClose');
      const closeBox=await closeButton.boundingBox();
      const closeStyle=await closeButton.evaluate(el=>{const s=getComputedStyle(el);return{width:parseFloat(s.width),height:parseFloat(s.height),display:s.display,placeItems:s.placeItems,justifyContent:s.justifyContent,alignItems:s.alignItems,padding:s.padding}});
      if(!closeBox||Math.abs(closeBox.width-40)>1||Math.abs(closeBox.height-40)>1)throw new Error(`${requestedBrowser} ${viewport.name}: close button size is not 40x40`);
      if(closeStyle.display!=='grid'||!/(center)/.test(closeStyle.placeItems||'')||closeStyle.padding!=='0px')throw new Error(`${requestedBrowser} ${viewport.name}: close button is not centered by CSS`);
      await closeButton.click();
      await page.locator('#dxModal.hidden').waitFor({timeout:3000});

      if(!/Sepsis/.test((await page.locator('#dxSearch').inputValue())))throw new Error(`${requestedBrowser} ${viewport.name}: search state lost`);
      await page.locator('#dxReset').click();
      await wait(50);
      if(!(await page.locator('.disease-page').count()>=2))throw new Error(`${requestedBrowser} ${viewport.name}: pagination controls missing`);
      await page.locator('.disease-page').nth(1).click();
      await wait(50);
      if(!(await page.locator('.disease-plus-card').count()>0))throw new Error(`${requestedBrowser} ${viewport.name}: second catalogue page is empty`);
      if(errors.length)throw new Error(`${requestedBrowser} ${viewport.name}\n${errors.join('\n')}`);
      await page.close();
    }
    console.log(`complete ICD-10-GM browser test: PASS (${requestedBrowser}; ${viewports.length} viewports)`);
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
