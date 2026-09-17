const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,firefox,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const port=4180;
const BROWSER=process.env.BROWSER||'chromium';
const launchers={chromium,firefox,webkit};
const mime=file=>({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(file).toLowerCase()]||'application/octet-stream';
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0]==='/'?'/index.html':(req.url||'/').split('?')[0]);const file=path.join(root,rel);if(!file.startsWith(root))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end('Not found');res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});res.end(data)})});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function launchBrowser(){if(BROWSER==='edge')return chromium.launch({headless:true,channel:'msedge'});const launcher=launchers[BROWSER];if(!launcher)throw new Error(`Unsupported browser: ${BROWSER}`);return launcher.launch({headless:true})}
async function assertHome(page,label){
  await page.locator('.rd-mainmenu-hero h1').filter({hasText:'Hauptmenü'}).waitFor({timeout:7000});
  const menuTiles=await page.locator('.rd-mainmenu-tile').count();
  if(menuTiles<14)throw new Error(`${label}: main menu exposes only ${menuTiles} tiles`);
  if((await page.locator('.rd-mainmenu-hero p').textContent()).includes('legacy'))throw new Error(`${label}: unexpected legacy main menu content`);
  if(await page.locator('.hero h1').filter({hasText:'Strukturiert handeln.'}).count())throw new Error(`${label}: legacy operational dashboard is rendered`);
}
(async()=>{
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  const browser=await launchBrowser();
  try{
    for(const viewport of [{width:1920,height:1080},{width:390,height:844}]){
      const page=await browser.newPage({viewport});
      const errors=[];
      page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
      page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
      await page.addInitScript(()=>localStorage.clear());
      await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:20000});
      await assertHome(page,`${BROWSER} ${viewport.width} initial`);
      if(await page.locator('#rdStartup').count())await page.locator('#rdStartup').waitFor({state:'detached',timeout:4000});

      await page.locator('.rd-mainmenu-tile[data-main-route="krankheiten-plus"]').click();
      await page.locator('h1').filter({hasText:'Krankheitsbilder & Erkrankungen'}).waitFor({timeout:7000});
      await page.locator('[data-view="dashboard"]').click();
      await assertHome(page,`${BROWSER} ${viewport.width} sidebar Startseite`);

      await page.locator('.rd-mainmenu-tile[data-main-route="abfrage"]').click();
      await page.locator('.view-title h1').filter({hasText:'Womit brauchst du Hilfe?'}).waitFor({timeout:7000});
      await page.locator('.brand').click();
      await assertHome(page,`${BROWSER} ${viewport.width} RD INTRANET brand`);

      await page.locator('.rd-mainmenu-tile[data-main-route="abfrage"]').click();
      await page.locator('.view-title h1').filter({hasText:'Womit brauchst du Hilfe?'}).waitFor({timeout:7000});
      await page.locator('.brand').click();
      await wait(100);
      await assertHome(page,`${BROWSER} ${viewport.width} second brand navigation`);

      await page.locator('.rd-mainmenu-tile[data-main-route="suite:ausbildung"]').click();
      await page.locator('.suite-hero h1').filter({hasText:'Ausbildung'}).waitFor({timeout:7000});
      await page.locator('.brand').click();
      await assertHome(page,`${BROWSER} ${viewport.width} return from suite`);

      if(errors.length)throw new Error(`${BROWSER} ${viewport.width}x${viewport.height}\n`+errors.join('\n'));
      await page.close();
    }
    console.log(`canonical home regression: PASS (${BROWSER})`);
  }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
