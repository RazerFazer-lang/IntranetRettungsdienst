/* The enhanced checklist controller owns checklist navigation.
   Suppress the legacy document-level click handler registered by checklists.js
   while that legacy module initializes; keep all other listeners untouched. */
(()=>{
  const original=document.addEventListener.bind(document);
  let active=true;
  document.addEventListener=function(type,listener,options){
    if(active&&type==='click')return;
    return original(type,listener,options);
  };
  window.__restoreChecklistDocumentListener=function(){
    if(!active)return;
    active=false;
    document.addEventListener=original;
  };
  setTimeout(()=>window.__restoreChecklistDocumentListener?.(),500);
})();
