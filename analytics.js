(() => {
 const get=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
 window.dataLayer=window.dataLayer||[];
 let consent=get('fl-consent',null), loaded=false;
 const log=[];
 const gtmId=localStorage.getItem('fl-gtm-id')||FL_CONFIG.gtmId;
 function emit(event,params={},ecommerce=false){
  const entry={event,...params,debug_mode:FL_CONFIG.debug,traffic_type:'demo',demo_mode:true};
  log.unshift({time:new Date().toISOString(),sent:consent==='granted',...structuredClone(entry)});
  if(log.length>150)log.pop();
  if(consent==='granted'){
   if(ecommerce)dataLayer.push({ecommerce:null});
   dataLayer.push(entry);
  }
  window.dispatchEvent(new CustomEvent('fl-event'));
 }
 function load(){
  if(loaded||consent!=='granted'||!/^GTM-[A-Z0-9]+$/.test(gtmId))return;
  loaded=true;dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
  const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(gtmId);document.head.append(s);
 }
 // Basic consent: no Google request before opt-in. Rejected history is not replayed.
 if(consent==='granted')dataLayer.push({event:'consent_state',analytics_consent:'granted'});
 load();
 window.Analytics={
  track:emit,log,
  get consent(){return consent},get gtmId(){return gtmId},
  setConsent(value){
   consent=value;localStorage.setItem('fl-consent',JSON.stringify(value));
   if(value==='denied'){location.reload();return;}
   dataLayer.push({event:'consent_state',analytics_consent:value});load();emit('consent_updated',{analytics_consent:value});
  },
  item(p,quantity=1,variant='',discount=0){return {item_id:p.id,item_name:p.name,item_brand:'Funny Love',item_category:p.category,item_variant:variant||p.color,price:Math.round((p.price-discount)*100)/100,discount,quantity}},
  ecommerce(event,items,extra={}){emit(event,{ecommerce:{currency:'MXN',value:Math.round(items.reduce((n,i)=>n+i.price*i.quantity,0)*100)/100,items,...extra}},true)},
  page(path,title){emit('page_view',{page_location:location.origin+location.pathname+'#'+path,page_title:title,page_path:path})}
 };
})();
