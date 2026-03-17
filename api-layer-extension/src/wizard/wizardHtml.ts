export function getWizardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>API Layer</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--vscode-font-family);background:var(--vscode-editor-background);color:var(--vscode-editor-foreground);padding:24px;line-height:1.5}
  h1{font-size:20px;font-weight:600;margin-bottom:4px;display:flex;align-items:center;gap:10px}
  .sub{font-size:12px;color:var(--vscode-descriptionForeground);margin-bottom:28px}
  .progress{display:flex;gap:4px;margin-bottom:28px}
  .dot{flex:1;height:3px;border-radius:2px;background:var(--vscode-input-border)}
  .dot.active{background:var(--vscode-focusBorder)}
  .dot.done{background:var(--vscode-testing-iconPassed)}
  .step-label{font-size:11px;color:var(--vscode-descriptionForeground);margin-left:6px;white-space:nowrap}
  .card{background:var(--vscode-input-background);border:1px solid var(--vscode-input-border);border-radius:6px;padding:20px;margin-bottom:16px}
  .card-label{font-size:10px;color:var(--vscode-focusBorder);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}
  .card-title{font-size:17px;font-weight:600;margin-bottom:4px}
  .card-sub{font-size:12px;color:var(--vscode-descriptionForeground);margin-bottom:16px}
  textarea,input[type=text]{width:100%;background:var(--vscode-input-background);border:1px solid var(--vscode-input-border);border-radius:4px;padding:8px 10px;font-size:13px;color:var(--vscode-input-foreground);font-family:var(--vscode-font-family);outline:none}
  textarea{resize:vertical;min-height:72px}
  textarea:focus,input[type=text]:focus{border-color:var(--vscode-focusBorder)}
  .grid{display:grid;gap:6px}
  .grid.c2{grid-template-columns:1fr 1fr}
  .grid.c3{grid-template-columns:1fr 1fr 1fr}
  .opt{background:var(--vscode-editor-background);border:1px solid var(--vscode-input-border);border-radius:4px;padding:10px 12px;cursor:pointer;transition:all .12s;user-select:none}
  .opt:hover{border-color:var(--vscode-focusBorder)}
  .opt.sel{border-color:var(--vscode-focusBorder);background:var(--vscode-list-activeSelectionBackground)}
  .opt .on{font-size:13px;font-weight:600}
  .opt .od{font-size:11px;color:var(--vscode-descriptionForeground);margin-top:2px}
  .opt .ob{font-size:10px;color:var(--vscode-focusBorder);border:1px solid var(--vscode-focusBorder);padding:1px 5px;border-radius:3px;margin-top:3px;display:inline-block}
  .tags{display:flex;gap:6px;flex-wrap:wrap}
  .tag{background:var(--vscode-editor-background);border:1px solid var(--vscode-input-border);border-radius:12px;padding:5px 12px;cursor:pointer;font-size:12px;transition:all .12s;user-select:none}
  .tag.sel{border-color:var(--vscode-testing-iconPassed);color:var(--vscode-testing-iconPassed);background:var(--vscode-list-activeSelectionBackground)}
  .fg{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .fc{background:var(--vscode-editor-background);border:1px solid var(--vscode-input-border);border-radius:4px;padding:8px 10px;cursor:pointer;transition:all .12s;display:flex;gap:8px;user-select:none}
  .fc.sel{border-color:var(--vscode-testing-iconPassed);background:var(--vscode-list-activeSelectionBackground)}
  .fck{width:16px;height:16px;border-radius:3px;border:1px solid var(--vscode-input-border);flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:10px}
  .fc.sel .fck{background:var(--vscode-testing-iconPassed);border-color:var(--vscode-testing-iconPassed);color:#fff}
  .fn{font-size:12px;font-weight:600}
  .fd{font-size:11px;color:var(--vscode-descriptionForeground);margin-top:1px}
  .sug{font-size:9px;color:var(--vscode-testing-iconPassed);border:1px solid var(--vscode-testing-iconPassed);padding:1px 4px;border-radius:3px;margin-top:2px;display:inline-block}
  .nav{display:flex;justify-content:space-between;align-items:center;margin-top:20px;gap:10px}
  /* Back — VS Code ghost style */
  .btn-back{padding:7px 16px;border-radius:3px;font-size:12px;font-weight:500;font-family:var(--vscode-font-family);cursor:pointer;background:transparent;border:1px solid var(--vscode-button-secondaryBorder,var(--vscode-input-border));color:var(--vscode-button-secondaryForeground,var(--vscode-foreground));transition:all .12s}
  .btn-back:hover{background:var(--vscode-button-secondaryHoverBackground)}
  /* Continue — VS Code primary button style */
  .btn-next{padding:8px 22px;border-radius:3px;font-size:12px;font-weight:600;font-family:var(--vscode-font-family);cursor:pointer;background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:none;transition:all .12s}
  .btn-next:hover{background:var(--vscode-button-hoverBackground)}
  .btn-next:disabled{opacity:.4;cursor:not-allowed}
  /* Generate — prominent */
  .btn-gen{flex:1;padding:10px 0;border-radius:3px;font-size:13px;font-weight:600;font-family:var(--vscode-font-family);cursor:pointer;background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:none;transition:all .12s}
  .btn-gen:hover{background:var(--vscode-button-hoverBackground)}
  .sr{display:flex;flex-direction:column;gap:8px}
  .row{display:flex;gap:10px}
  .rk{font-size:11px;color:var(--vscode-descriptionForeground);width:90px;flex-shrink:0;padding-top:2px}
  .rv{font-size:12px;font-weight:500}
  .ready{background:var(--vscode-editor-background);border:1px solid var(--vscode-testing-iconPassed);border-radius:4px;padding:12px;margin-top:12px}
  .ready-t{font-size:12px;font-weight:600;color:var(--vscode-testing-iconPassed);margin-bottom:4px}
  .ready-d{font-size:11px;color:var(--vscode-descriptionForeground)}
  .gen-area{text-align:center;padding:32px 0}
  .spinner{width:32px;height:32px;border:3px solid var(--vscode-input-border);border-top-color:var(--vscode-focusBorder);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 12px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .gen-status{font-size:12px;color:var(--vscode-descriptionForeground)}
  .result-tree{background:var(--vscode-editor-background);border:1px solid var(--vscode-input-border);border-radius:4px;padding:12px;font-family:var(--vscode-editor-font-family,monospace);font-size:11px;line-height:1.8;overflow-x:auto;white-space:pre;margin-top:12px}
  .err{font-size:12px;color:var(--vscode-errorForeground);margin-top:12px;padding:10px;border:1px solid var(--vscode-errorForeground);border-radius:4px}
  .folder-row{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--vscode-editor-background);border:1px solid var(--vscode-input-border);border-radius:4px;margin-bottom:10px}
  .folder-path{font-size:11px;font-family:monospace;color:var(--vscode-focusBorder);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .folder-btn{background:transparent;border:1px solid var(--vscode-input-border);border-radius:3px;padding:3px 8px;font-size:11px;cursor:pointer;color:var(--vscode-foreground)}
  .folder-btn:hover{border-color:var(--vscode-focusBorder)}
  .hidden{display:none}
</style>
</head>
<body>
<h1>⚡ API Layer</h1>
<div class="sub">Scaffold a complete backend API project — powered by your AI provider</div>
<div class="progress" id="pb"></div>
<div id="sc"></div>

<script>
const vscode = acquireVsCodeApi();
const S={step:0,type:'',desc:'',entities:'',consumers:[],lang:'',fw:'',db:'',auth:'',feats:[],folder:''};
const STEPS=['Type','Project','Entities','Consumers','Language','Framework','Database','Auth','Features','Confirm'];
const FWS={
  'Python':[{n:'FastAPI',d:'Modern, fast, auto-docs',b:'Recommended'},{n:'Django REST',d:'Batteries included'},{n:'Flask',d:'Lightweight'}],
  'JavaScript':[{n:'Express',d:'Minimal, huge ecosystem',b:'Recommended'},{n:'Fastify',d:'Fast, schema-based'},{n:'NestJS',d:'Structured, scalable'}],
  'TypeScript':[{n:'NestJS',d:'Fully typed, structured',b:'Recommended'},{n:'Fastify',d:'Fast + TypeScript'},{n:'Express',d:'Classic + types'}],
  'C#':[{n:'ASP.NET Core Web API',d:'Industry standard',b:'Recommended'},{n:'Minimal API',d:'Less boilerplate'}],
  'Java':[{n:'Spring Boot',d:'Enterprise standard',b:'Recommended'},{n:'Quarkus',d:'Cloud-native'}],
  'Go':[{n:'Gin',d:'Fast, minimalist',b:'Recommended'},{n:'Echo',d:'High performance'},{n:'Fiber',d:'Express-inspired'}],
  'PHP':[{n:'Laravel',d:'Elegant, full-featured',b:'Recommended'},{n:'Slim',d:'Micro-framework'}],
  'Ruby':[{n:'Rails API',d:'Convention over config',b:'Recommended'},{n:'Sinatra',d:'Minimal'}]
};
const DBS=[{n:'SQLite',d:'Zero setup, file-based',b:'Easiest'},{n:'PostgreSQL',d:'Production-grade SQL'},{n:'MySQL',d:'Widely used'},{n:'MongoDB',d:'Document-based'}];
const AUTHS=[{n:'JWT',d:'Token-based, stateless',b:'Most common'},{n:'API Key',d:'Simple, server-to-server'},{n:'OAuth2',d:'Third-party login'},{n:'Session',d:'Server-side sessions'},{n:'None',d:'No auth needed'}];
const FEATS=[
  {n:'OpenAPI / Swagger',d:'Browser-based API tester',s:true},
  {n:'CORS Config',d:'Required for web & mobile',s:true},
  {n:'Structured Logging',d:'Clear logs for debugging',s:true},
  {n:'Rate Limiting',d:'Prevent API abuse'},
  {n:'Pagination',d:'Handle large data lists'},
  {n:'Caching',d:'Speed up repeated requests'},
  {n:'Unit Tests',d:'Automated test scaffold'},
  {n:'Docker',d:'Containerise for deployment'}
];

window.addEventListener('message', e => {
  const m = e.data;
  if(m.command === 'generationStarted') showGenerating();
  if(m.command === 'generationStatus') document.getElementById('gstat').textContent = m.message;
  if(m.command === 'generationComplete') showResult(m);
  if(m.command === 'generationError') showError(m.message);
  if(m.command === 'generationCancelled') { S.step=9; rs(); }
  if(m.command === 'folderSelected') { S.folder=m.folder; rs(); }
});

function rp(){
  const b=document.getElementById('pb');
  b.innerHTML=STEPS.map((_,i)=>\`<div class="dot \${i<S.step?'done':i===S.step?'active':''}"></div>\`).join('')+\`<span class="step-label">\${STEPS[S.step]}</span>\`;
}
function go(n){S.step=n;rp();rs();}
function next(){go(S.step+1);}
function back(){if(S.step>0)go(S.step-1);}
function render(h){document.getElementById('sc').innerHTML=h;}

function rs(){
  const steps=[s0,s1,s2,s3,s4,s5,s6,s7,s8,s9];
  steps[S.step]();
  if(S.step===8) preFeats();
}

function s0(){render(\`<div class="card">
  <div class="card-label">Step 1 of 10</div><div class="card-title">Where are you starting?</div>
  <div class="card-sub">Helps me understand how much context to gather.</div>
  <div class="grid c3">\${[['From scratch','Clean slate'],['Mid-project','Have frontend/DB'],['Existing API','Extend existing']].map(([n,d])=>\`<div class="opt\${S.type===n?' sel':''}" onclick="pick('type','\${n}',this)"><div class="on">\${n}</div><div class="od">\${d}</div></div>\`).join('')}</div>
  <div class="nav"><div></div><button class="btn-next" onclick="next()" \${!S.type?'disabled':''}>Continue</button></div>
</div>\`);}

function s1(){render(\`<div class="card">
  <div class="card-label">Step 2 of 10</div><div class="card-title">What are you building?</div>
  <div class="card-sub">Describe your project — what it does and who it's for.</div>
  <textarea id="di" placeholder="e.g. A task management API for a mobile app...">\${S.desc}</textarea>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" onclick="sd()">Continue</button></div>
</div>\`);}
function sd(){const v=document.getElementById('di').value.trim();if(!v)return;S.desc=v;next();}

function s2(){render(\`<div class="card">
  <div class="card-label">Step 3 of 10</div><div class="card-title">Main entities?</div>
  <div class="card-sub">These become your routes, models, and DB tables. Use real names.</div>
  <input type="text" id="ei" placeholder="e.g. users, posts, comments, categories" value="\${S.entities}">
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" onclick="se()">Continue</button></div>
</div>\`);}
function se(){const v=document.getElementById('ei').value.trim();if(!v)return;S.entities=v;next();}

function s3(){render(\`<div class="card">
  <div class="card-label">Step 4 of 10</div><div class="card-title">Who calls this API?</div>
  <div class="card-sub">Select all that apply.</div>
  <div class="tags">\${['Web frontend','Mobile app','Other services','Third-party clients'].map(o=>\`<div class="tag\${S.consumers.includes(o)?' sel':''}" onclick="togC('\${o}',this)">\${o}</div>\`).join('')}</div>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" id="cn" onclick="next()" \${!S.consumers.length?'disabled':''}>Continue</button></div>
</div>\`);}
function togC(v,el){const i=S.consumers.indexOf(v);if(i>-1){S.consumers.splice(i,1);el.classList.remove('sel');}else{S.consumers.push(v);el.classList.add('sel');}const b=document.getElementById('cn');if(b)b.disabled=!S.consumers.length;}

function s4(){render(\`<div class="card">
  <div class="card-label">Step 5 of 10</div><div class="card-title">Which language?</div>
  <div class="grid c2">\${Object.keys(FWS).map(l=>\`<div class="opt\${S.lang===l?' sel':''}" onclick="pickLang('\${l}',this)"><div class="on">\${l}</div></div>\`).join('')}</div>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" id="ln" onclick="next()" \${!S.lang?'disabled':''}>Continue</button></div>
</div>\`);}
function pickLang(v,el){el.closest('.grid').querySelectorAll('.opt').forEach(e=>e.classList.remove('sel'));el.classList.add('sel');S.lang=v;S.fw='';const b=document.getElementById('ln');if(b)b.disabled=false;}

function s5(){render(\`<div class="card">
  <div class="card-label">Step 6 of 10</div><div class="card-title">Which framework?</div>
  <div class="card-sub">Top picks for \${S.lang}.</div>
  <div class="grid">\${(FWS[S.lang]||[]).map(f=>\`<div class="opt\${S.fw===f.n?' sel':''}" onclick="pick('fw','\${f.n.replace(/'/g,"\\\\'")}',this)"><div class="on">\${f.n}</div><div class="od">\${f.d}</div>\${f.b?\`<div class="ob">\${f.b}</div>\`:''}</div>\`).join('')}</div>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" id="fn" onclick="next()" \${!S.fw?'disabled':''}>Continue</button></div>
</div>\`);}

function s6(){render(\`<div class="card">
  <div class="card-label">Step 7 of 10</div><div class="card-title">Which database?</div>
  <div class="grid c2">\${DBS.map(d=>\`<div class="opt\${S.db===d.n?' sel':''}" onclick="pick('db','\${d.n}',this)"><div class="on">\${d.n}</div><div class="od">\${d.d}</div>\${d.b?\`<div class="ob">\${d.b}</div>\`:''}</div>\`).join('')}</div>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" id="dn" onclick="next()" \${!S.db?'disabled':''}>Continue</button></div>
</div>\`);}

function s7(){render(\`<div class="card">
  <div class="card-label">Step 8 of 10</div><div class="card-title">Authentication?</div>
  <div class="grid">\${AUTHS.map(a=>\`<div class="opt\${S.auth===a.n?' sel':''}" onclick="pick('auth','\${a.n}',this)"><div class="on">\${a.n}</div><div class="od">\${a.d}</div>\${a.b?\`<div class="ob">\${a.b}</div>\`:''}</div>\`).join('')}</div>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" id="an" onclick="next()" \${!S.auth?'disabled':''}>Continue</button></div>
</div>\`);}

function s8(){render(\`<div class="card">
  <div class="card-label">Step 9 of 10</div><div class="card-title">Which features?</div>
  <div class="card-sub">Pre-selected based on your choices. Add or remove as needed.</div>
  <div class="fg" id="fg">\${FEATS.map(f=>\`<div class="fc\${S.feats.includes(f.n)?' sel':''}" onclick="togF('\${f.n}',this)" data-n="\${f.n}">
    <div class="fck">\${S.feats.includes(f.n)?'✓':''}</div>
    <div><div class="fn">\${f.n}</div><div class="fd">\${f.d}</div>\${f.s?'<div class="sug">suggested</div>':''}</div>
  </div>\`).join('')}</div>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-next" onclick="next()">Continue</button></div>
</div>\`);}
function preFeats(){['OpenAPI / Swagger','CORS Config','Structured Logging'].forEach(f=>{if(!S.feats.includes(f))S.feats.push(f);});document.querySelectorAll('.fc').forEach(el=>{if(S.feats.includes(el.dataset.n)){el.classList.add('sel');el.querySelector('.fck').textContent='✓';}});}
function togF(v,el){const i=S.feats.indexOf(v);if(i>-1){S.feats.splice(i,1);el.classList.remove('sel');el.querySelector('.fck').textContent='';}else{S.feats.push(v);el.classList.add('sel');el.querySelector('.fck').textContent='✓';}}

function s9(){
  const rows=[['type',S.type],['description',S.desc],['entities',S.entities],['consumers',S.consumers.join(', ')],['language',S.lang],['framework',S.fw],['database',S.db],['auth',S.auth],['features',S.feats.join(', ')||'None']];
  render(\`<div class="card">
  <div class="card-label">Step 10 of 10 — Final step</div><div class="card-title">Confirm your config</div>
  <div class="card-sub">Review everything, then choose where to write the project.</div>
  <div class="sr">\${rows.map(([k,v])=>\`<div class="row"><div class="rk">\${k}</div><div class="rv">\${v}</div></div>\`).join('')}</div>
  <div class="folder-row">
    <span style="font-size:12px;color:var(--vscode-descriptionForeground)">Output folder:</span>
    <span class="folder-path">\${S.folder||'(not selected)'}</span>
    <button class="folder-btn" onclick="pickFolder()">Browse</button>
  </div>
  <div class="ready"><div class="ready-t">What happens next</div><div class="ready-d">Files are written directly to your chosen folder and opened in VS Code Explorer.</div></div>
  <div class="nav"><button class="btn-back" onclick="back()">Back</button><button class="btn-gen" onclick="generate()">⚡ Generate project</button></div>
</div>\`);}

function generate(){
  vscode.postMessage({command:'generate', config:{type:S.type,description:S.desc,entities:S.entities,consumers:S.consumers,language:S.lang,framework:S.fw,database:S.db,auth:S.auth,features:S.feats}});
}
function pickFolder(){vscode.postMessage({command:'pickFolder'});}
function showGenerating(){render(\`<div class="card"><div class="card-title">Generating your project</div><div class="gen-area"><div class="spinner"></div><div class="gen-status" id="gstat">Starting...</div></div></div>\`);}
function showResult(m){render(\`<div class="card"><div class="card-title">✅ Project ready</div><div class="card-sub">\${m.fileCount} files written to \${m.outputFolder}</div><div class="result-tree">\${m.folderStructure}</div></div>\`);}
function showError(msg){const el=document.getElementById('sc');el.innerHTML+=\`<div class="err">Generation failed: \${msg}</div>\`;}

function pick(key,val,el){el.closest('.grid').querySelectorAll('.opt').forEach(e=>e.classList.remove('sel'));el.classList.add('sel');S[key]=val;const ids={fw:'fn',db:'dn',auth:'an'};const b=document.getElementById(ids[key]||'');if(b)b.disabled=false;else{const nb=document.querySelector('.btn-next');if(nb&&!nb.id)nb.disabled=false;}}

rp();rs();
</script>
</body>
</html>`;
}
