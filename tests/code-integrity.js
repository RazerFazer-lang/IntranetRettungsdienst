const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const localRefs=[...index.matchAll(/(?:src|href)=["']\.\/(?:([^"']+))["']/g)].map(m=>m[1]);
const forbidden=['suite-nav-fix.js','lagebilder-nav-fix.js','navigation-ui-fix.js'];
for(const file of forbidden){if(index.includes(file))throw new Error(`legacy navigation patch still referenced: ${file}`)}
for(const ref of localRefs){const clean=ref.split('#')[0].split('?')[0];if(!clean||clean.startsWith('http'))continue;const full=path.join(root,clean);if(!full.startsWith(root)||!fs.existsSync(full))throw new Error(`missing local asset referenced by index.html: ${ref}`)}
const scripts=localRefs.filter(x=>x.endsWith('.js')).map(x=>path.join(root,x));
for(const file of scripts){const r=cp.spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)throw new Error(`syntax error in ${path.relative(root,file)}\n${r.stderr||r.stdout}`)}
const allRootJs=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='node_modules'||entry.name==='.git')continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith('.js'))allRootJs.push(full)}}
walk(root);
for(const file of allRootJs){const r=cp.spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)throw new Error(`syntax error in ${path.relative(root,file)}\n${r.stderr||r.stdout}`)}
const cache=fs.readFileSync(path.join(root,'cache-v7.js'),'utf8');
for(const ref of localRefs.filter(x=>x.endsWith('.js')||x.endsWith('.css'))){const clean=ref.split('#')[0].split('?')[0];if(!cache.includes(`'./${clean}'`))throw new Error(`asset missing from offline shell cache: ${clean}`)}
const scriptsInIndex=localRefs.filter(x=>x.endsWith('.js'));const duplicateScripts=scriptsInIndex.filter((x,i,a)=>a.indexOf(x)!==i);if(duplicateScripts.length)throw new Error(`duplicate script tags: ${duplicateScripts.join(', ')}`);
console.log(`code integrity: PASS (${allRootJs.length} JavaScript files syntax-checked, ${localRefs.length} local index assets verified)`);
