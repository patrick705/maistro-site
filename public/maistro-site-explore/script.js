/* preview-fit.js */
// Keep dashboard text readable; narrow screens explore the preview horizontally.
(() => {
 const phone = matchMedia('(max-width:720px)');
 document.querySelectorAll('.forecast-preview,.exact-roster').forEach(preview => {
  const frame = document.createElement('div');
  frame.className = 'proportional-preview';
  const label = preview.matches('.forecast-preview') ? 'forecast' : 'staff schedule';
  frame.setAttribute('role','region');
  frame.setAttribute('aria-label',label + ' preview');
  preview.before(frame); frame.append(preview);
  const hint = document.createElement('p');
  hint.className = 'preview-scroll-hint';
  hint.textContent = 'Swipe to explore the full ' + label + '.';
  frame.after(hint);
  const fit = () => {
   preview.style.removeProperty('zoom');
   if(phone.matches){preview.style.width='1000px';frame.tabIndex=0;}
   else {preview.style.removeProperty('width');frame.removeAttribute('tabindex');}
  };
  phone.addEventListener('change',fit);
  fit();
 });
})();

/* facts.js */
const allDetails = [...document.querySelectorAll('.details details')];
const expandButton = document.querySelector('#expand-all');
function syncExpandButton(){const expanded=allDetails.every(d=>d.open);expandButton.setAttribute('aria-expanded',String(expanded));expandButton.innerHTML=expanded?'Collapse all details <span>−</span>':'Expand all details <span>+</span>';}
expandButton.addEventListener('click',()=>{const expand=!allDetails.every(d=>d.open);allDetails.forEach(d=>{d.open=expand;});syncExpandButton();});
allDetails.forEach(d=>d.addEventListener('toggle',syncExpandButton));
const sections=[...document.querySelectorAll('.fact-section')];
const links=[...document.querySelectorAll('[data-section]')];
let queued=false;
function updateActive(){let active=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=160)active=section;}for(const link of links){const match=link.dataset.section===active.id;link.classList.toggle('active',match);if(match)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}queued=false;}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateActive);}},{passive:true});
updateActive();

// In-cell editing is an illustrative, page-local interaction.
function normaliseShift(value){
 const v=value.trim();
 if(/^(off|day off)$/i.test(v))return 'Day off';
 if(/^(holiday|leave)$/i.test(v))return 'Holiday';
 const m=v.match(/^(\d{1,2})(?::(\d{2}))?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?$/);
 if(!m)return null;
 const [h1,m1,h2,m2]=[Number(m[1]),Number(m[2]||0),Number(m[3]),Number(m[4]||0)];
 if(h1>23||h2>23||m1>59||m2>59||(h1===h2&&m1===m2))return null;
 return `${String(h1).padStart(2,'0')}:${String(m1).padStart(2,'0')}–${String(h2).padStart(2,'0')}:${String(m2).padStart(2,'0')}`;
}
function stockState(value,buffer){return value<0?['shortage','Shortfall']:value<=buffer?['low','Low']:['healthy','OK'];}
function orderDeadline(values,buffer,lead){
 const first=values.findIndex(v=>v<=buffer);
 if(first<0)return 'No order needed';
 const date=new Date(Date.UTC(2026,8,21+first-lead));
 return 'Order by '+date.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',timeZone:'UTC'});
}
let activeEditor=null;
const editDays=['Mon 21','Tue 22','Wed 23','Thu 24','Fri 25','Sat 26','Sun 27'];
function renderEditableCell(cell){
 const b=document.createElement('button');b.type='button';b.className='cell-trigger';
 if(cell.dataset.kind==='shift'){
  const value=cell.dataset.value;
  const kind=value==='Holiday'?'leave':value==='Day off'?'off':[4,5].includes(Number(cell.dataset.day))?'peak':'shift';
  b.classList.add('roster-slot',kind);b.textContent=value;
  b.setAttribute('aria-label',`Edit ${cell.dataset.person}, ${editDays[Number(cell.dataset.day)]}: ${value}`);
 }else{
  const [cls,status]=stockState(Number(cell.dataset.value),Number(cell.closest('tr').dataset.buffer));
  b.classList.add('stock-cell',cls);
  const strong=document.createElement('strong');strong.textContent=cell.dataset.value;
  const small=document.createElement('small');small.textContent=status;b.append(strong,small);
  b.setAttribute('aria-label',`Edit ${cell.dataset.product}, ${editDays[Number(cell.dataset.day)]}: ${cell.dataset.value} ${cell.closest('tr').dataset.unit}, ${status}`);
 }
 const pencil=document.createElement('span');pencil.className='edit-pencil';pencil.setAttribute('aria-hidden','true');pencil.textContent='✎';b.append(pencil);cell.replaceChildren(b);return b;
}
function updateStockProjection(){
 let lowProducts=0;
 document.querySelectorAll('.stock-table tbody tr').forEach(row=>{
  const cells=[...row.querySelectorAll('[data-kind="stock"]')];
  const values=cells.map(cell=>Number(cell.dataset.value));const buffer=Number(row.dataset.buffer);
  if(values.some(v=>v<=buffer))lowProducts++;
  row.querySelector('.lead-time small').textContent=orderDeadline(values,buffer,Number(row.dataset.lead));
 });
 document.querySelector('.stock-summary strong').textContent=String(lowProducts);
}
document.addEventListener('click',event=>{
 const trigger=event.target.closest('.cell-trigger');if(!trigger)return;
 if(activeEditor)activeEditor.cancel(false);
 const cell=trigger.closest('.editable-cell');const stock=cell.dataset.kind==='stock';
 const form=document.createElement('form');form.className='cell-editor';
 const input=document.createElement('input');input.type=stock?'number':'text';input.required=true;
 if(stock)input.step='any';input.value=cell.dataset.value;
 input.setAttribute('aria-label',trigger.getAttribute('aria-label'));
 const actions=document.createElement('div');actions.className='editor-actions';
 const save=document.createElement('button');save.type='submit';save.textContent='Save';
 const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel';
 actions.append(save,cancel);form.append(input,actions);cell.replaceChildren(form);cell.classList.add('editing');
 function finish(focus){cell.classList.remove('editing');activeEditor=null;const b=renderEditableCell(cell);if(focus)b.focus();}
 function cancelEdit(focus=true){finish(focus);}
 activeEditor={cancel:cancelEdit};cancel.addEventListener('click',()=>cancelEdit());
 input.addEventListener('input',()=>input.setCustomValidity(''));
 form.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();cancelEdit();}});
 form.addEventListener('submit',e=>{
  e.preventDefault();let value;
  if(stock){value=Number(input.value);if(input.value.trim()===''||!Number.isFinite(value)){input.setCustomValidity('Enter a number.');input.reportValidity();return;}}
  else{value=normaliseShift(input.value);if(value===null){input.setCustomValidity('Use a time range such as 09:00–17:00, Day off or Holiday.');input.reportValidity();return;}}
  cell.dataset.value=String(value);finish(true);if(stock)updateStockProjection();
  document.getElementById('edit-status').textContent=`${stock?cell.dataset.product:cell.dataset.person}, ${editDays[Number(cell.dataset.day)]} updated to ${value}. Demo changes only.`;
 });
 input.focus();input.select();
});

// Close the compact contents after choosing a topic on a phone.
const mobileContents=document.querySelector('.mobile-contents');
mobileContents?.addEventListener('click',event=>{
 if(event.target.closest('a'))mobileContents.open=false;
});

// A single, interruptible sideways preview makes each mobile table discoverable.
const phoneLayout=window.matchMedia('(max-width:720px)');
const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
if('IntersectionObserver' in window){
 document.querySelectorAll('.table-scroll').forEach(table=>{
  let frame=0,started=false,interacted=false;
  const stop=()=>{cancelAnimationFrame(frame);frame=0;};
  const takeControl=()=>{interacted=true;stop();observer.disconnect();};
  const observer=new IntersectionObserver(entries=>{
   const entry=entries[0];
   if(!entry.isIntersecting||entry.intersectionRatio<0.35){stop();return;}
   if(started||interacted||!phoneLayout.matches||reducedMotion.matches)return;
   const remaining=table.scrollWidth-table.clientWidth-table.scrollLeft;
   if(remaining<24)return;
   started=true;
   const origin=table.scrollLeft;
   const distance=Math.min(260,remaining);
   let begin=null;
   const ease=t=>(1-Math.cos(Math.PI*t))/2;
   const animate=now=>{
    if(begin===null)begin=now;
    const elapsed=now-begin;
    let progress=0;
    if(elapsed<550)progress=0;
    else if(elapsed<1950)progress=ease((elapsed-550)/1400);
    else if(elapsed<2400)progress=1;
    else if(elapsed<3800)progress=1-ease((elapsed-2400)/1400);
    else{table.scrollLeft=origin;frame=0;observer.disconnect();return;}
    table.scrollLeft=origin+distance*progress;
    frame=requestAnimationFrame(animate);
   };
   frame=requestAnimationFrame(animate);
  },{threshold:[0,0.35]});
  ['pointerdown','touchstart','wheel','keydown','focusin'].forEach(name=>table.addEventListener(name,takeControl,{passive:true}));
  phoneLayout.addEventListener('change',stop);
  reducedMotion.addEventListener('change',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  observer.observe(table);
 });
}

// Load the hero film only when motion is welcome; retain a poster on failure.
const openingVideo=document.getElementById('opening-video');
const videoToggle=document.getElementById('video-toggle');
if(openingVideo&&videoToggle){
 let userPaused=reducedMotion.matches;
 videoToggle.hidden=false;
 const syncVideoButton=()=>{
  const action=openingVideo.paused?'Play':'Pause';
  videoToggle.textContent=action+' video';
  videoToggle.setAttribute('aria-label',action+' background video');
 };
 const playOpening=()=>{
  if(!openingVideo.getAttribute('src'))openingVideo.src=openingVideo.dataset.src;
  openingVideo.muted=true;
  openingVideo.play().catch(syncVideoButton);
 };
 openingVideo.addEventListener('play',syncVideoButton);
 openingVideo.addEventListener('pause',syncVideoButton);
 openingVideo.addEventListener('error',()=>{openingVideo.hidden=true;videoToggle.hidden=true;});
 videoToggle.addEventListener('click',()=>{
  if(openingVideo.paused){userPaused=false;playOpening();}
  else{userPaused=true;openingVideo.pause();}
 });
 reducedMotion.addEventListener('change',event=>{
  if(event.matches){userPaused=true;openingVideo.pause();}
 });
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{
   if(entries[0].isIntersecting&&!userPaused&&!document.hidden)playOpening();
   else openingVideo.pause();
  },{threshold:0.05}).observe(openingVideo.closest('.facts-opening'));
 }else if(!userPaused)playOpening();
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)openingVideo.pause();
  else if(!userPaused&&openingVideo.closest('.facts-opening').getBoundingClientRect().bottom>0)playOpening();
 });
}

// Demand forecast details, accessible cell inspection and an interruptible demo.
(()=>{
 const root=document.querySelector('.forecast-preview');if(!root)return;
 const scroll=root.querySelector('.forecast-scroll'),cells=[...root.querySelectorAll('.forecast-cell')];
 const popup=document.createElement('div');popup.className='forecast-popup';popup.id='forecast-popup';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','Forecast details');document.body.append(popup);
 let selected=null,timers=[],demo=false,hasRun=false;
 const clearTimers=()=>{timers.forEach(clearTimeout);timers=[];root.querySelectorAll('.forecast-demo-focus').forEach(c=>c.classList.remove('forecast-demo-focus'));};
 function hide(){popup.hidden=true;selected?.classList.remove('is-active');selected?.setAttribute('aria-expanded','false');selected=null;}
 function stop(){demo=false;clearTimers();root.querySelector('.forecast-replay').textContent='Play animation';}
 function place(){if(!selected||popup.hidden)return;const r=selected.getBoundingClientRect(),h=popup.offsetHeight,w=popup.offsetWidth;const above=r.top-h-10;popup.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';popup.style.top=Math.max(12,Math.min(innerHeight-h-12,above>12?above:r.bottom+10))+'px';}
 function show(cell){hide();(root.closest('dialog[open]')||document.body).append(popup);selected=cell;cell.classList.add('is-active');cell.setAttribute('aria-expanded','true');cell.setAttribute('aria-controls',popup.id);const d=cell.dataset;
 popup.replaceChildren();const header=document.createElement('header'),title=document.createElement('strong'),close=document.createElement('button');title.textContent=d.product+' · '+d.date;close.textContent='×';close.className='forecast-close';close.setAttribute('aria-label','Close forecast details');close.onclick=()=>{stop();hide();cell.focus();};header.append(title,close);popup.append(header);
 const dl=document.createElement('dl');[['Point Forecast',d.point+' Each'],['Lower Bound',d.lower+' Each'],['Upper Bound',d.upper+' Each'],['Trend Factor',d.trend],['Confidence',d.confidence]].forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label+':';dd.textContent=value;dl.append(dt,dd);});popup.append(dl);
 const form=document.createElement('form'),label=document.createElement('label'),input=document.createElement('input'),save=document.createElement('button');label.textContent='Edit sample point forecast';label.htmlFor='forecast-value';input.id='forecast-value';input.type='number';input.min='0';input.step='.01';input.required=true;input.value=d.point;save.type='submit';save.textContent='Save';form.append(label,input,save);popup.append(form);form.onsubmit=e=>{e.preventDefault();stop();d.point=Number(input.value).toFixed(2);cell.querySelector('b').textContent=d.point;cell.setAttribute('aria-label',`${d.product}, ${d.date}, forecast ${d.point} units. Show details`);show(cell);document.getElementById('edit-status').textContent='Sample forecast updated. Confidence bounds and stock runway remain illustrative.';};
 popup.hidden=false;place();
 }
 cells.forEach(cell=>{cell.addEventListener('click',e=>{stop();show(cell);if(e.detail===0)popup.querySelector('button').focus();});cell.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!demo){show(cell);}});});
 document.addEventListener('pointerdown',e=>{if(!root.contains(e.target)&&!popup.contains(e.target)){stop();hide();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden){stop();const c=selected;hide();c?.focus();hide();}});
 popup.addEventListener('pointerdown',stop);root.addEventListener('pointerdown',()=>{if(demo){stop();hide();}},{capture:true});scroll.addEventListener('wheel',()=>{stop();hide();},{passive:true});scroll.addEventListener('touchstart',()=>{stop();hide();},{passive:true});scroll.addEventListener('scroll',place,{passive:true});window.addEventListener('scroll',()=>{if(!demo)hide();else place();},{passive:true});window.addEventListener('resize',place);
 function filter(){stop();hide();const q=root.querySelector('.forecast-search').value.toLowerCase(),confidence=root.querySelector('.forecast-filter').value;let count=0;root.querySelectorAll('tbody tr').forEach(row=>{row.hidden=!row.dataset.name.includes(q)||(confidence!=='all'&&row.dataset.confidence!==confidence);if(!row.hidden)count++;});root.querySelector('.forecast-empty').hidden=count>0;}
 root.querySelector('.forecast-search').addEventListener('input',filter);root.querySelector('.forecast-filter').addEventListener('change',filter);
 for(const [selector,cls] of [['.runway-toggle','no-runway'],['.lead-toggle','no-lead']])root.querySelector(selector).onclick=e=>{const off=root.classList.toggle(cls);e.currentTarget.setAttribute('aria-pressed',String(!off));};
 const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
 let dayStart=0, productCursor=0;
 const controls=document.createElement('div');controls.className='forecast-pages';controls.innerHTML='<button type="button" data-prev aria-label="Previous forecast days">←</button><span></span><button type="button" data-next aria-label="Next forecast days">→</button>';scroll.before(controls);
 function daysPerPage(){return root.clientWidth<600?1:3;}
 function nextDayStart(direction=1){const count=daysPerPage(),pages=count===1?[0,1,2,3,4,5,6]:[0,3,4];let i=pages.indexOf(dayStart);if(i<0)i=0;return pages[(i+direction+pages.length)%pages.length];}
 function pageDays(){const count=daysPerPage();dayStart=Math.min(dayStart,7-count);root.querySelectorAll('.forecast-table tr').forEach(row=>{[...row.children].forEach((cell,i)=>{if(i>=2)cell.hidden=i-2<dayStart||i-2>=dayStart+count;const width=count===1?(i===0?36:i===1?24:40):(i===0?24:i===1?16:20);cell.style.setProperty('width',width+'%','important');});});controls.querySelector('span').textContent='Forecast · '+cells[dayStart].dataset.date+(count>1?' – '+cells[Math.min(dayStart+count-1,6)].dataset.date:'');}
 function advance(direction){stop();hide();dayStart=nextDayStart(direction);pageDays();root.querySelector('.forecast-replay').textContent='Play animation';}
 controls.querySelector('[data-prev]').onclick=()=>advance(-1);controls.querySelector('[data-next]').onclick=()=>advance(1);
 function play(){stop();hide();hasRun=true;demo=true;root.querySelector('.forecast-replay').textContent='Pause animation';
  function frame(){if(!demo)return;pageDays();const visible=cells.filter(c=>!c.closest('tr').hidden&&!c.closest('td').hidden);if(!visible.length){stop();return;}const products=[...new Set(visible.map(c=>c.dataset.product))];const product=products[productCursor%products.length];const productCells=visible.filter(c=>c.dataset.product===product);const cell=productCells[productCursor%productCells.length];productCursor++;cell.classList.add('forecast-demo-focus');if(!reducedMotion.matches)later(()=>show(cell),900);later(()=>{hide();root.querySelectorAll('.forecast-demo-focus').forEach(c=>c.classList.remove('forecast-demo-focus'));dayStart=nextDayStart();frame();},4200);}
  frame();
 }
 root.querySelector('.forecast-replay').onclick=()=>{if(demo){stop();hide();root.querySelector('.forecast-replay').textContent='Play animation';}else play();};
 window.addEventListener('resize',()=>{hide();pageDays();});pageDays();
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!hasRun&&!reducedMotion.matches)play();else if(!entries[0].isIntersecting){stop();hide();}},{threshold:.35}).observe(root);
 reducedMotion.addEventListener('change',()=>{stop();hide();});document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();hide();}});
})();

// Quick rota editing. All people, rates and shifts are sample data.
function parseScheduleShift(text){
 const v=text.trim();if(!v)return {value:'',hours:0};
 if(/^(off|day off)$/i.test(v))return {value:'Day off',hours:0};
 if(/^(holiday|leave)$/i.test(v))return {value:'Holiday',hours:0};
 let hours=0,spans=[],formatted=[];
 for(const part of v.split(',')){
  const m=part.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?$/);if(!m)return null;
  const [a,b,c,d]=[+m[1],+(m[2]||0),+m[3],+(m[4]||0)];if(a>23||c>23||b>59||d>59)return null;
  const start=a*60+b;let end=c*60+d;if(start===end)return null;if(end<start)end+=1440;
  if(spans.some(([x,y])=>start<y&&end>x))return null;spans.push([start,end]);hours+=(end-start)/60;
  const pad=n=>String(n).padStart(2,'0');formatted.push(`${pad(a)}:${pad(b)}–${pad(c)}:${pad(d)}`);
 }
 if(hours>24)return null;return {value:formatted.join(', '),hours};
}
(()=>{
 const root=document.querySelector('.schedule-preview');if(!root)return;
 let editing=null;
 const money=n=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n);
 const hours=n=>`${Number(n.toFixed(2))}h`;
 function total(node,h,p){node.replaceChildren();const b=document.createElement('b'),s=document.createElement('small');b.textContent=hours(h);s.textContent=money(p);node.append(b,s);}
 function recalc(){const days=Array.from({length:7},()=>[0,0]),groups={};let grandH=0,grandP=0;
  root.querySelectorAll('.schedule-person').forEach(row=>{let rh=0,rp=0;const group=row.dataset.group,rate=+row.dataset.rate;groups[group]??=Array.from({length:7},()=>[0,0]);row.querySelectorAll('.schedule-editable').forEach(cell=>{const day=+cell.dataset.day,h=parseScheduleShift(cell.dataset.value).hours,p=h*rate;rh+=h;rp+=p;days[day][0]+=h;days[day][1]+=p;groups[group][day][0]+=h;groups[group][day][1]+=p;});total(row.querySelector('[data-person-total]'),rh,rp);grandH+=rh;grandP+=rp;});
  days.forEach(([h,p],i)=>total(root.querySelector(`[data-total-day="${i}"]`),h,p));total(root.querySelector('[data-grand-total]'),grandH,grandP);
  root.querySelectorAll('[data-group-day]').forEach(node=>total(node,...groups[node.dataset.group][+node.dataset.groupDay]));root.querySelectorAll('[data-group-total]').forEach(node=>{const sums=groups[node.dataset.groupTotal].reduce((a,v)=>[a[0]+v[0],a[1]+v[1]],[0,0]);total(node,...sums);});
 }
 function render(cell){const v=cell.dataset.value,b=document.createElement('button');b.type='button';b.className='schedule-trigger '+(!v?'empty':v==='Holiday'?'holiday':v==='Day off'?'off':'working');b.setAttribute('aria-label',`Edit ${cell.closest('tr').dataset.name}, ${editDays[+cell.dataset.day]}: ${v||'Add shift'}`);const span=document.createElement('span');span.textContent=v||'+';b.append(span);if(v&&v!=='Holiday'&&v!=='Day off'){const s=document.createElement('small');s.textContent='Quick edit';b.append(s);}cell.classList.remove('editing');cell.replaceChildren(b);return b;}
 root.addEventListener('click',event=>{const button=event.target.closest('.schedule-trigger');if(!button)return;if(editing)editing.cancel();const cell=button.closest('.schedule-editable'),form=document.createElement('form'),input=document.createElement('input'),save=document.createElement('button'),cancel=document.createElement('button'),off=document.createElement('button'),holiday=document.createElement('button'),err=document.createElement('span');form.className='schedule-edit-form';input.type='text';input.value=cell.dataset.value;input.placeholder='9–12, 14–18';input.setAttribute('aria-label',button.getAttribute('aria-label'));input.autocomplete='off';save.type='submit';save.textContent='Save';cancel.type='button';cancel.textContent='Cancel';off.type=holiday.type='button';off.textContent='Day off';holiday.textContent='Holiday';err.className='schedule-edit-error';err.setAttribute('role','alert');form.append(input,save,cancel,off,holiday,err);cell.replaceChildren(form);cell.classList.add('editing');
 function finish(focus=false){editing=null;const b=render(cell);if(focus)b.focus();}
 function commit(){const parsed=parseScheduleShift(input.value);if(!parsed){err.textContent='Use 9–17 or 9–12, 14–18. Times must not overlap.';input.setAttribute('aria-invalid','true');return false;}cell.dataset.value=parsed.value;finish(true);recalc();root.querySelector('.schedule-status').textContent=`${cell.closest('tr').dataset.name}, ${editDays[+cell.dataset.day]} updated. Totals recalculated.`;return true;}
 editing={cancel:()=>finish()};cancel.onclick=()=>finish(true);off.onclick=()=>{input.value='Day off';commit();};holiday.onclick=()=>{input.value='Holiday';commit();};form.onsubmit=e=>{e.preventDefault();commit();};input.addEventListener('input',()=>{err.textContent='';input.removeAttribute('aria-invalid');});form.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();finish(true);}};input.focus();input.select();
 });
 root.querySelector('.schedule-reset').onclick=()=>{editing?.cancel();root.querySelectorAll('.schedule-editable').forEach(cell=>{cell.dataset.value=cell.dataset.initial;render(cell);});recalc();root.querySelector('.schedule-status').textContent='Example schedule reset.';};recalc();
})();

// Connected AI dashboard rotation, with manual selection and motion controls.
(() => {
 document.querySelectorAll('.hq-dashboards').forEach(root => {
 const images=[...root.querySelectorAll('.hq-dashboard-slide')], tabs=[...root.querySelectorAll('[data-hq-slide]')], pause=root.querySelector('.hq-pause');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');let current=0, paused=motion.matches, visible=false, timer;
 function show(i){current=i;images.forEach((img,j)=>img.hidden=j!==i);tabs.forEach((tab,j)=>tab.setAttribute('aria-pressed',String(j===i)));}
 function schedule(){clearInterval(timer);pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-label',paused?'Play dashboard rotation':'Pause dashboard rotation');if(!paused&&visible&&!document.hidden)timer=setInterval(()=>show((current+1)%images.length),3000);}
 tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{show(i);schedule();}));
 pause.addEventListener('click',()=>{paused=!paused;schedule();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:0.15}).observe(root);
 document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',e=>{paused=e.matches;schedule();});schedule();
 });
})();
// Scale the reference roster and reveal its cost breakdown on hover/focus/tap.
(()=>{const root=document.querySelector('.exact-roster');if(!root)return;const fit=root.querySelector('.roster-fit'),app=root.querySelector('.roster-app');
 const tip=document.createElement('div');tip.className='roster-cost-tip';tip.id='roster-cost-detail';tip.setAttribute('role','tooltip');document.body.append(tip);let active=null,delay;
 function hide(){clearTimeout(delay);active?.removeAttribute('aria-describedby');active?.classList.remove('roster-demo-active');active=null;tip.classList.remove('visible');}
 function show(button){if(!button.classList.contains('working'))return;const cell=button.closest('.schedule-editable'),row=cell.closest('tr');const shifts=cell.dataset.value.match(/(\d{1,2}):(\d{2})[–-](\d{1,2}):(\d{2})/g)||[];let hours=0;shifts.forEach(s=>{const n=s.match(/\d+/g).map(Number);hours+=(n[2]*60+n[3]-n[0]*60-n[1])/60;});if(!hours)return;hide();(root.closest('dialog[open]')||document.body).append(tip);active=button;button.setAttribute('aria-describedby',tip.id);const rate=Number(row.dataset.rate),cost=hours*rate;tip.innerHTML=`<table><thead><tr><th>Type</th><th>Hours</th><th>Price</th><th>Total cost</th></tr></thead><tbody><tr><td>Standard</td><td>${hours}h</td><td>€${rate.toFixed(2)}</td><td>€${cost.toFixed(2)}</td></tr><tr><th>Totals</th><th>${hours}h</th><th>—</th><th>€${cost.toFixed(2)}</th></tr></tbody></table>`;const r=button.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(innerWidth-tip.offsetWidth-8,r.left+r.width/2-tip.offsetWidth/2))+'px';tip.style.top=(r.top>tip.offsetHeight+12?r.top-tip.offsetHeight-8:r.bottom+8)+'px';tip.classList.add('visible');}
 root.addEventListener('pointerover',e=>{const b=e.target.closest('.schedule-trigger');if(b&&e.pointerType!=='touch'){clearTimeout(delay);delay=setTimeout(()=>show(b),180);}});root.addEventListener('pointerout',e=>{const b=e.target.closest('.schedule-trigger');if(b&&!b.contains(e.relatedTarget))hide();});root.addEventListener('focusin',e=>{const b=e.target.closest('.schedule-trigger');if(b)show(b);});root.addEventListener('focusout',hide);
 let tapped=null;root.addEventListener('click',e=>{const b=e.target.closest('.schedule-trigger');if(b&&matchMedia('(hover: none)').matches&&b.classList.contains('working')&&tapped!==b){e.stopImmediatePropagation();e.preventDefault();tapped=b;show(b);}else{tapped=null;hide();}},true);document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});window.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);
 let start=0,count=3,demoOn=!matchMedia('(prefers-reduced-motion: reduce)').matches,inView=false,frame=0,tick=null,userBusy=false;
 const label=root.querySelector('.roster-visible-days'),prev=root.querySelector('.roster-prev'),next=root.querySelector('.roster-next'),toggle=root.querySelector('.roster-demo-toggle');
 function days(){const width=root.clientWidth;count=width<540?1:width<900?3:7;start=Math.min(start,7-count);root.querySelectorAll('.schedule-table tr').forEach(row=>{[...row.children].forEach((cell,i)=>{if(i>0&&i<8)cell.hidden=i-1<start||i-1>=start+count;});});label.textContent=count===7?'21–27 September':`${['Mon 21','Tue 22','Wed 23','Thu 24','Fri 25','Sat 26','Sun 27'][start]}${count>1?' – '+['Mon 21','Tue 22','Wed 23','Thu 24','Fri 25','Sat 26','Sun 27'][start+count-1]:''}`;prev.disabled=start===0;next.disabled=start+count===7;hide();}
 prev.onclick=()=>{start=Math.max(0,start-count);days();};next.onclick=()=>{start=Math.min(7-count,start+count);days();};new ResizeObserver(days).observe(fit);days();
 function stopDemo(){clearTimeout(tick);hide();}
 function demo(){stopDemo();toggle.textContent=demoOn?'Pause demo':'Play demo';toggle.setAttribute('aria-pressed',String(demoOn));if(!demoOn||!inView||userBusy||document.hidden)return;tick=setTimeout(()=>{const buttons=[...root.querySelectorAll('.schedule-trigger.working')].filter(b=>!b.closest('td').hidden);if(buttons.length){const b=buttons[frame++%Math.min(buttons.length,4)];show(b);b.classList.add('roster-demo-active');}tick=setTimeout(()=>{hide();tick=setTimeout(demo,900);},3000);},700);}
 toggle.onclick=()=>{demoOn=!demoOn;demo();};new IntersectionObserver(e=>{inView=e[0].isIntersecting;demo();},{threshold:.3}).observe(root);
 root.addEventListener('pointerenter',()=>{userBusy=true;stopDemo();});root.addEventListener('pointerleave',()=>{userBusy=false;demo();});root.addEventListener('focusin',()=>{userBusy=true;clearTimeout(tick);});root.addEventListener('focusout',()=>{setTimeout(()=>{userBusy=root.contains(document.activeElement);if(!userBusy)demo();},0);});document.addEventListener('visibilitychange',demo);

})();

/* operations.js */
(()=>{
const groups={pos:[['home','Home'],['menu','Menu categories'],['order','Order entry'],['deals','Meal deals'],['payment','Payment'],['orders','Orders'],['reports','End of day'],['settings','Settings']],kds:[['kds','Kitchen display']],drivers:[['drivers','Orders'],['map','Map']]};
const hotspot=(label,action,x,y,w,h)=>({label,action,x,y,w,h});
const hotspots={home:[hotspot('Start a takeaway order','menu',43,16,13,8),hotspot('Open reports','reports',56,88,13,6),hotspot('Open orders','orders',4,94,13,6)],menu:[hotspot('View pizza order','order',4,13,12,8),hotspot('View meal deal','deals',17,22,12,8)],order:[hotspot('Checkout','payment',70.5,79.5,14,6),hotspot('View meal deals','deals',17,19,13,8),hotspot('Back to categories','menu',4.5,94,10,5)],deals:[hotspot('Review payment','payment',70,79,14,7)],payment:[hotspot('Try card payment','pay',37,63,10,6),hotspot('Try cash payment','cash',48,63,10,6),hotspot('Back to order','order',70,95,28,5)],drivers:[hotspot('Open map','map',51,2,9,6),hotspot('Assign first delivery','assign',5.3,23,29,4),hotspot('Assign second delivery','assign2',37.2,23,29,4)],map:[hotspot('View delivery orders','drivers',42,6,9,6),hotspot('Inspect delivery location','pin',29,58,3,5)],kds:[hotspot('Mark first order ready','ready1',4.6,22.2,16.2,4.7),hotspot('Mark second order ready','ready2',23.4,22.2,16.2,4.7),hotspot('Show ready orders','readytab',52.4,5,9,5.5),hotspot('Show open orders','opentab',43.4,5,9,5.5)]};
hotspots.home.push(...['Table','Collection','Delivery'].map((name,i)=>hotspot('Start '+name+' order','menu',4+i*13,16,12,8)));
hotspots.menu.push(...[['Dips',30],['Desserts',43],['Sides',56]].map(([n,x])=>hotspot(n,'info:'+n,x,13,12,8)),hotspot('Drinks','info:Drinks',4,22,12,8));
hotspots.order.push(...['Margherita','Hawaii Five-0','All Out Pepperoni','Spicy Nduja','The G.O.A.T.'].map((n,i)=>hotspot('Select '+n,'info:'+n,4.4+i*13,43.7,12,7.8)),hotspot('Pay by card','payment',70.5,86,9,6),hotspot('Pay cash','payment',80,86,9,6));
hotspots.drivers.push(hotspot('Assign third delivery','assign',69,23,29,4));
const labels={pos:'POS product tour',kds:'Kitchen display product tour',drivers:'Driver station product tour'};
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mountDriverMap(root){
root.className='screen-tour driver-live';
root.innerHTML=`<div class="screen-toolbar"><strong>M<span>ai</span>stro <small>Driver tracking</small></strong><button type="button" class="dispatch-toggle" aria-pressed="true">● Auto dispatch enabled</button><button type="button" data-expand aria-expanded="false">Expand preview</button></div><div class="screen-workspace"><div class="screen-scroll"><div class="screen-stage"><img src="assets/product-screens/map.webp" alt="Your driver station map of Dublin, with moving demonstration drivers and matching delivery highlights." loading="lazy"><div class="driver-overlay"></div></div></div></div><div class="screen-caption"><span role="status" data-driver-status>Alex Reed · Delivery 3 selected</span><p>Animated demonstration · Fictional drivers · Select a driver or delivery to highlight both.</p></div>`;
const overlay=root.querySelector('.driver-overlay'),status=root.querySelector('[data-driver-status]'),toggle=root.querySelector('.dispatch-toggle');
const drivers=[{name:'Alex Reed',order:3,path:[[31,64],[33,62],[35,59],[34,56],[33,54],[32,50]]},{name:'Sam Ellis',order:4,path:[[27,61],[29,59],[30,57],[31,55],[31,51],[30,48]]},{name:'Robin Hayes',order:6,path:[[38,73],[39,76],[38,79],[36,81],[33,83],[30,85]]}];
overlay.innerHTML=drivers.map((d,i)=>`<button type="button" class="moving-driver" data-driver="${i}" aria-label="Highlight ${d.name}, delivery ${d.order}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v10H3zM14 10h4l3 4v3h-7M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4" fill="none" stroke="currentColor" stroke-width="2"/></svg><span>${d.order}</span></button><button type="button" class="delivery-highlight" data-driver="${i}" style="top:${12.6+i*15.2}%;left:69.2%;width:30.3%;height:13.5%" aria-label="Highlight delivery ${d.order}, ${d.name}"><span>${d.name} · En route</span></button>`).join('');
let selected=0,enabled=true,visible=false,time=0,last=0,frame=null,manualUntil=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function select(i){selected=i;overlay.querySelectorAll('[data-driver]').forEach(b=>{const active=Number(b.dataset.driver)===i;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});status.textContent=drivers[i].name+' · Delivery '+drivers[i].order+' selected'}
function position(){drivers.forEach((d,i)=>{const t=((time/24000+i*.23)%2),progress=t<=1?t:2-t,point=progress*(d.path.length-1),k=Math.min(Math.floor(point),d.path.length-2),f=point-k,a=d.path[k],b=d.path[k+1],el=overlay.querySelector('.moving-driver[data-driver="'+i+'"]');el.style.left=(a[0]+(b[0]-a[0])*f)+'%';el.style.top=(a[1]+(b[1]-a[1])*f)+'%'})}
function tick(now){frame=null;if(!enabled||!visible||document.hidden||reduced.matches){last=0;return}if(last)time+=Math.min(now-last,100);last=now;position();if(now>manualUntil){const next=Math.floor(time/3000)%drivers.length;if(next!==selected)select(next)}frame=requestAnimationFrame(tick)}
function start(){if(frame===null)frame=requestAnimationFrame(tick)}
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start()},{threshold:.1}).observe(root);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)start()});reduced.addEventListener('change',start);
overlay.addEventListener('click',e=>{let b=e.target.closest('[data-driver]');if(b){select(Number(b.dataset.driver));manualUntil=performance.now()+9000}});
toggle.addEventListener('click',()=>{enabled=!enabled;toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'● Auto dispatch enabled':'Ⅱ Auto dispatch paused';if(enabled)start()});
const expand=root.querySelector('[data-expand]');expand.addEventListener('click',()=>{const open=root.classList.toggle('screen-expanded');expand.textContent=open?'Close expanded preview':'Expand preview';expand.setAttribute('aria-expanded',String(open))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){root.classList.remove('screen-expanded');expand.textContent='Expand preview';expand.setAttribute('aria-expanded','false')}});
select(0);position();
}
document.querySelectorAll('[data-operation]').forEach(root=>{
if(root.dataset.operation==='kds')return;
if(root.dataset.operation==='drivers'){mountDriverMap(root);return}
const group=root.dataset.operation,list=[...groups.pos,['kds','KDS'],['packing','Packing station'],['drivers','Driver station'],['map','Driver map']];let current=groups[group][0][0],ready=[false,false],readyView=false,assigned=[false,false],packed=[false,false];
root.className='screen-tour';
root.innerHTML=`<div class="screen-toolbar"><strong>M<span>ai</span>stro <small>${labels[group]}</small></strong><button type="button" data-expand>Expand preview</button><button type="button" data-reset>Reset</button></div><div class="screen-workspace"><div class="screen-scroll"><div class="screen-stage"><img alt="" loading="lazy" decoding="async"><div class="screen-hotspots"></div></div></div></div><div class="screen-caption"><span data-status role="status">Your actual product screens. Select a highlighted control to explore.</span><p>Interactive screenshot tour · Sample actions only · Expand for a closer look.</p><div class="screen-actions"></div></div><dialog class="screen-dialog"><div data-dialog-body></div><button type="button" data-close>Close</button></dialog>`;
const image=root.querySelector('img'),stage=root.querySelector('.screen-hotspots'),status=root.querySelector('[data-status]'),dialog=root.querySelector('dialog');
function paint(){
image.hidden=current==='packing';image.src=`assets/product-screens/${current==='packing'?'kds':current}.png`;root.querySelector('.screen-stage').classList.toggle('packing-view',current==='packing');image.alt='Actual '+(list.find(v=>v[0]===current)?.[1]||current)+' screen supplied by Maistro';
root.querySelectorAll('[data-screen]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.screen===current)));
let spots=[...(hotspots[current]||[])];
if(current!=='packing'){
 const noBar=['order','drivers'].includes(current), start=noBar?2.5:5.6, step=noBar?8.6:7.55;
 [['Home','home'],['Orders','orders'],['Customers','info:Customers'],['Order history','orders'],['KDS','kds'],['Packing station','packing'],['Driver station','drivers']].forEach(([label,action],i)=>spots.push(hotspot(label,action,0,start+i*step,3,5)));
 spots.push(hotspot('Settings','settings',0,95,3,5));
}

stage.innerHTML=spots.map(h=>`<button type="button" class="screen-hotspot" style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%" data-action="${h.action}" aria-label="${h.label}" title="${h.label}"></button>`).join('');
root.querySelector('.screen-actions').innerHTML='';
if(current==='packing'){stage.innerHTML=`<div class="packing-demo"><button type="button" data-action="home">← Home</button><h3>Packing station</h3><p>Inferred preview · Sample orders</p><div class="packing-grid">${['Margherita 12.5″','Hawaii Five-0 9.5″'].map((item,i)=>`<article><header>Order ${i+1} · ${i?'Delivery':'Collection'}</header><h4>${item}</h4><label><input type="checkbox" data-pack-check="${i}" ${packed[i]?'checked':''}> Food checked and packed</label><button type="button" data-action="pack${i}" ${packed[i]?'':'disabled'}>${packed[i]?'Complete handover':'Check items first'}</button></article>`).join('')}</div></div>`;}
if(current==='kds'){
ready.forEach((done,i)=>{if(done!==readyView)stage.insertAdjacentHTML('beforeend',`<div class="screen-mask" style="left:${i?22.4:3.55}%;top:11.6%;width:18.3%;height:86.6%"></div>`);else if(done)stage.insertAdjacentHTML('beforeend',`<button type="button" class="screen-ready" data-action="recall${i}" style="left:${i?23.4:4.6}%;top:22.2%;width:16.2%;height:4.7%">Ready ✓ · Recall</button>`)});
if(readyView)stage.insertAdjacentHTML('beforeend','<div class="screen-tab-cover" style="left:43.4%;top:5%;width:9%;height:5.5%">Open</div><div class="screen-tab-cover active" style="left:52.4%;top:5%;width:9%;height:5.5%">Ready</div>');
}
if(current==='drivers')assigned.forEach((a,i)=>{if(a)stage.insertAdjacentHTML('beforeend',`<div class="screen-assigned" style="left:${i?37.2:5.3}%;top:23%;width:29%;height:4%">Assigned · ${i?'Sam Ellis':'Alex Reed'} ✓</div>`)});
}
function modal(html){root.querySelector('[data-dialog-body]').innerHTML=html;dialog.showModal()}
function act(a){
if(list.some(v=>v[0]===a)){current=a;status.textContent='Viewing '+list.find(v=>v[0]===a)[1]+'.';paint();return}
if(a.startsWith('pack')){status.textContent='Order '+(Number(a.at(-1))+1)+' handed over in this demo.';packed[Number(a.at(-1))]=false;paint();return}
if(a.startsWith('info:')){modal('<h3>'+esc(a.slice(5))+'</h3><p>Illustrative selection based on your POS layout.</p><button type="button" data-action="selectitem">Add to sample order</button>');return}
if(a==='selectitem'){dialog.close();current='order';status.textContent='Sample selection added. Showing your actual order-entry screen.';paint();return}
if(a==='pay'||a==='cash')modal(`<h3>${a==='pay'?'Card':'Cash'} payment</h3><p>This is the payment screen from your POS. This tour does not take a real payment.</p><button type="button" data-action="paid">Complete sample payment</button>`);
if(a==='paid'){dialog.close();status.textContent='Sample payment completed. Return to Home to explore another workflow.'}
if(a==='assign'||a==='assign2')modal(`<h3>Assign driver</h3><p>Choose a fictional driver for this demonstration.</p><button type="button" data-action="assigned${a==='assign'?0:1}">${a==='assign'?'Alex Reed':'Sam Ellis'} · Available</button>`);
if(a.startsWith('assigned')){assigned[Number(a.at(-1))]=true;dialog.close();status.textContent='Driver assigned in this preview.';paint()}
if(a==='pin')modal('<h3>Delivery location</h3><p>The map is your supplied driver-station screenshot. Switch to Orders to try assigning a delivery.</p><button type="button" data-action="maporders">View orders</button>');
if(a==='maporders'){dialog.close();act('drivers')}
if(a==='ready1'||a==='ready2'){ready[a==='ready1'?0:1]=true;status.textContent='Order marked ready. Select Show ready orders to view it.';paint()}
if(a==='readytab'||a==='opentab'){readyView=a==='readytab';status.textContent=readyView?'Ready orders. Select Recall to return one to the kitchen.':'Open kitchen orders.';paint()}
if(a.startsWith('recall')){ready[Number(a.at(-1))]=false;status.textContent='Order recalled to Open.';paint()}
}
root.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.dataset.screen)act(b.dataset.screen);if(b.dataset.action)act(b.dataset.action);if(b.hasAttribute('data-close'))dialog.close();if(b.hasAttribute('data-reset')){ready=[false,false];assigned=[false,false];readyView=false;current=groups[group][0][0];packed=[false,false];status.textContent='Preview reset. Select a highlighted control to explore.';paint()}if(b.hasAttribute('data-expand')){root.classList.toggle('screen-expanded');b.textContent=root.classList.contains('screen-expanded')?'Close expanded preview':'Expand preview';b.setAttribute('aria-expanded',root.classList.contains('screen-expanded'))}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('screen-expanded')){root.classList.remove('screen-expanded');root.querySelector('[data-expand]').textContent='Expand preview';root.querySelector('[data-expand]').setAttribute('aria-expanded','false')}});
root.addEventListener('change',e=>{if(e.target.hasAttribute('data-pack-check')){packed[Number(e.target.dataset.packCheck)]=e.target.checked;paint()}});
paint();
});
})();

/* kitchen.js */
(() => {
  const root = document.querySelector('[data-operation="kds"]');
  if (!root) return;
  const seed = [
    ['1041', 'Collection', ['Margherita 12.5″', 'Garlic bread', 'BBQ dip', 'Cola × 2']],
    ['1042', 'Takeaway', ['Pepperoni 9.5″ × 2', 'Fries', 'Chipotle dip']],
    ['1043', 'Delivery', ['Hawaii Five-0', 'Chicken wings', 'Garlic mayo', 'Orange × 2']],
    ['1044', 'Collection', ['Spicy Nduja', 'Vegan pizza', 'Fries × 2', 'Still water']],
    ['1045', 'Delivery', ['Margherita 9.5″', 'Garlic bread', 'BBQ dip']],
    ['1046', 'Table 06', ['Pepperoni 12.5″', 'Chicken wings', 'Fries', 'Cola']]
  ];
  const rows = seed.map(([id, type, items]) => ({ id, type, items, checked: new Set(), state: 'open' }));
  const sequence = ['1041', '1044', '1042'];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let auto = !motion.matches, visible = false, cursor = 0, hold = 0, timer;
  const manualTimers = new Set();
  const paths = ['M3 10l9-7 9 7v11H3z', 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 22v-3a8 8 0 0 1 16 0v3', 'M12 3a9 9 0 1 0 .1 0M12 7v6l4 2', 'M3 12h18l-2 9H5zM7 3v5M12 2v6M17 3v5', 'M4 7h16v15H4zM8 7V3h8v4', 'M2 8h12v10H2zM14 11h4l4 4v3h-8M5 22v-4M18 22v-4'];
  root.className = 'kitchen-live';
  root.innerHTML = `<header class="kl-head"><strong>M<span>ai</span>stro</strong><b>KDS</b><button type="button" data-auto></button><button type="button" data-reset>Reset</button></header>
    <div class="kl-layout"><nav aria-label="Kitchen navigation">${paths.map((d,i) => `<a href="#${['tools','tools','direct','tools','kitchen','kitchen','drivers'][i]}" title="${['Home','Orders','Customers','History','Kitchen','Packing','Drivers'][i]}" aria-label="${['Home','Orders','Customers','History','Kitchen','Packing','Drivers'][i]}" ${i===4?'aria-current="page"':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="${d}"/></svg></a>`).join('')}</nav>
      <div class="kl-main"><div class="kl-filters"><span class="kl-open-count" data-open-count>Open · 6</span><span>All stations · Sample orders</span></div>
        <div class="kl-grid">${rows.map(r => `<article class="kl-ticket" data-ticket="${r.id}"><header><b>#${r.id}</b><span>${r.type}</span></header><div>${r.items.map((item,i) => `<label><input type="checkbox" data-order="${r.id}" data-item="${i}"><span>${item}</span></label>`).join('')}</div><button type="button" data-ready="${r.id}" disabled>Tick items as they are ready</button></article>`).join('')}</div>
      </div>
    </div><p class="kl-note">Tick items as they are ready. Completed orders clear from the board.</p>`;

  const autoButton = root.querySelector('[data-auto]');
  const grid = root.querySelector('.kl-grid');
  const nodes = new Map(rows.map(row => [row.id, root.querySelector(`[data-ticket="${row.id}"]`)]));
  const moves = new Map();
  // Reserve the full board height so the page stays still as the queue closes up.
  function sizeBoard() {
    const hiddenCards = [...nodes.values()].filter(card => card.hidden);
    grid.style.minHeight = '';
    hiddenCards.forEach(card => { card.hidden = false; });
    const height = grid.offsetHeight;
    hiddenCards.forEach(card => { card.hidden = true; });
    grid.style.minHeight = `${height}px`;
  }
  function paint() {
    const layoutChanged = rows.some(row => nodes.get(row.id).hidden !== (row.state === 'gone'));
    const before = new Map();
    if (layoutChanged) {
      nodes.forEach(card => {
        if (!card.hidden) before.set(card, card.getBoundingClientRect());
      });
      moves.forEach(animation => animation.cancel());
      moves.clear();
    }
    root.querySelector('[data-open-count]').textContent = `Open · ${rows.filter(row => row.state === 'open').length}`;
    autoButton.textContent = `${auto ? 'Pause' : 'Play'} demo`;
    autoButton.setAttribute('aria-label', auto ? 'Pause automatic order completion' : 'Play automatic order completion');
    autoButton.setAttribute('aria-pressed', String(auto));
    rows.forEach(row => {
      const card = nodes.get(row.id), gone = row.state === 'gone', ready = row.state === 'ready';
      card.classList.toggle('kl-active', auto && row.id === sequence[cursor] && !gone);
      card.classList.toggle('kl-complete', ready);
      card.hidden = gone;
      card.setAttribute('aria-hidden', String(gone));
      card.inert = gone;
      card.querySelectorAll('input').forEach(input => {
        input.checked = row.checked.has(Number(input.dataset.item));
        input.disabled = row.state !== 'open';
      });
      const button = card.querySelector('[data-ready]');
      button.disabled = row.state !== 'open' || row.checked.size !== row.items.length;
      button.textContent = ready || gone ? 'Ready ✓' : row.checked.size === row.items.length ? 'Mark order ready' : 'Tick items as they are ready';
    });
    if (layoutChanged && !motion.matches) {
      const scale = grid.offsetWidth ? grid.getBoundingClientRect().width / grid.offsetWidth : 1;
      nodes.forEach(card => {
        if (card.hidden || !card.animate) return;
        const from = before.get(card), to = card.getBoundingClientRect();
        const dx = from ? (from.left - to.left) / scale : 0, dy = from ? (from.top - to.top) / scale : 10;
        if (from && !dx && !dy) return;
        const animation = card.animate([
          { transform: `translate(${dx}px, ${dy}px)`, opacity: from ? 1 : 0 },
          { transform: 'translate(0, 0)', opacity: 1 }
        ], { duration: 580, easing: 'cubic-bezier(.22, 1, .36, 1)' });
        moves.set(card, animation);
        animation.onfinish = () => { if (moves.get(card) === animation) moves.delete(card); };
      });
    }
  }
  function reset() {
    manualTimers.forEach(clearTimeout);
    manualTimers.clear();
    rows.forEach(row => { row.checked.clear(); row.state = 'open'; });
    cursor = 0;
    hold = 0;
    paint();
  }
  function advance() {
    if (cursor >= sequence.length) {
      if (++hold >= 4) reset();
      return;
    }
    const row = rows.find(r => r.id === sequence[cursor]);
    if (row.state === 'gone') { cursor++; paint(); return; }
    if (row.state === 'ready') { row.state = 'gone'; cursor++; paint(); return; }
    const remaining = row.items.map((_, i) => i).filter(i => !row.checked.has(i));
    if (remaining.length) remaining.slice(0, 2).forEach(i => row.checked.add(i));
    else row.state = 'ready';
    paint();
  }
  function schedule() {
    clearTimeout(timer);
    if (auto && visible && !document.hidden) timer = setTimeout(() => { advance(); schedule(); }, 1100);
  }
  root.addEventListener('change', event => {
    const input = event.target;
    if (!input.dataset.order) return;
    const row = rows.find(r => r.id === input.dataset.order);
    if (!row || row.state !== 'open') return;
    auto = false;
    const index = Number(input.dataset.item);
    if (input.checked) row.checked.add(index); else row.checked.delete(index);
    paint();
    schedule();
  });
  root.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-auto')) auto = !auto;
    if (button.hasAttribute('data-reset')) reset();
    if (button.dataset.ready) {
      const row = rows.find(r => r.id === button.dataset.ready);
      if (!row || row.state !== 'open' || row.checked.size !== row.items.length) return;
      auto = false;
      row.state = 'ready';
      // Move focus out of a ticket before it clears, preserving keyboard access.
      if (nodes.get(row.id).contains(document.activeElement)) autoButton.focus({ preventScroll: true });
      const finish = setTimeout(() => {
        row.state = 'gone';
        manualTimers.delete(finish);
        paint();
      }, motion.matches ? 0 : 900);
      manualTimers.add(finish);
    }
    paint();
    schedule();
  });
  root.addEventListener('focusin', event => {
    if (event.target.closest('.kl-ticket')) { auto = false; paint(); schedule(); }
  });
  motion.addEventListener('change', () => {
    auto = !motion.matches;
    moves.forEach(animation => animation.cancel());
    moves.clear();
    paint(); schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: .15 }).observe(root);
  } else visible = true;
  paint();
  sizeBoard();
  if ('ResizeObserver' in window) {
    let width = grid.clientWidth;
    new ResizeObserver(() => {
      const nextWidth = grid.clientWidth;
      if (nextWidth !== width) { width = nextWidth; sizeBoard(); }
    }).observe(grid);
  } else window.addEventListener('resize', sizeBoard);
  if (document.fonts) document.fonts.ready.then(sizeBoard);
  schedule();
})();

/* voice.js */
(()=>{const root=document.querySelector('.voice-story');if(!root)return;const scenes=[['01 / THE OLD WAY','Three calls. Two hands.','The phone rings. Tickets pile up. Your team is pulled away from service.','The dinner rush. And the phone won’t stop.',['☎ Incoming call…','☎ Another call waiting…']],['02 / ENTER MAISTRO','Every caller gets through.','Maistro takes as many calls as needed at once, while your team keeps service moving.','AI handles the phones. Your team handles the food.',['✓ Calls handled simultaneously','✓ Phone number and address recognised']],['03 / THE UPSELL','“Make it a meal?”','A relevant side, drink or topping, offered naturally during the conversation.','More than taking an order. Making the most of it.',['AI: “Would you like garlic bread and a drink?”','Customer: “Yes, please.”','✓ Extras added to the order']],['04 / READY FOR THE KITCHEN','Taken. Checked. Sent through.','Order guardrails help catch rogue requests, with a handover to your team when needed.','The order comes through. Service carries on.',['✓ Pizza + garlic bread + drink','✓ Order checks complete','✓ Sent to the kitchen']]];let phase=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,visible=false;const toggle=root.querySelector('[data-voice-toggle]');function paint(){const s=scenes[phase];root.dataset.phase=phase;root.querySelector('.voice-step').textContent=s[0];root.querySelector('h3').textContent=s[1];root.querySelector('.voice-line').textContent=s[2];root.querySelector('.voice-scene-label').textContent=s[3];root.querySelector('.voice-order-cards').replaceChildren(...s[4].map(t=>{const d=document.createElement('div');d.textContent=t;return d}));toggle.textContent=playing?'Pause story':'Play story';toggle.setAttribute('aria-pressed',String(playing))}toggle.addEventListener('click',()=>{playing=!playing;paint()});root.querySelector('[data-voice-replay]').addEventListener('click',()=>{phase=0;playing=true;paint()});new IntersectionObserver(([e])=>visible=e.isIntersecting,{threshold:.25}).observe(root);setInterval(()=>{if(playing&&visible&&!document.hidden){phase=(phase+1)%scenes.length;paint()}},4200);paint()})();

/* menu-motion.js */
(() => {
 const figure=document.querySelector('#menus .section-image');
 const original=figure?.querySelector('img');if(!original)return;
 const stage=document.createElement('div');stage.className='menu-motion-stage';original.before(stage);stage.append(original);
 const heart=original.cloneNode();heart.alt='';heart.setAttribute('aria-hidden','true');heart.className='menu-heart-pulse';stage.append(heart);
 const ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1672 941');svg.setAttribute('aria-hidden','true');svg.classList.add('menu-flow-layer');
 const routes=[
  ['#ffb648','M710 410 C590 390 650 220 480 200'],
  ['#58f6ed','M680 460 C580 460 580 385 480 385'],
  ['#64f29d','M1000 415 C1110 410 1090 265 1230 265'],
  ['#64f29d','M700 510 C530 505 300 515 235 580'],
  ['#64f29d','M710 525 C570 520 450 515 415 610'],
  ['#64f29d','M730 565 C635 570 620 615 610 675'],
  ['#64f29d','M970 555 C1010 575 1040 625 1040 687'],
  ['#64f29d','M980 525 C1140 525 1200 535 1230 652'],
  ['#64f29d','M980 495 C1290 510 1470 510 1490 665']
 ];
 routes.forEach(([colour,path],i)=>{
  const line=document.createElementNS(ns,'path');line.setAttribute('d',path);line.setAttribute('fill','none');line.setAttribute('stroke',colour);line.setAttribute('stroke-width','2');line.setAttribute('opacity','.35');svg.append(line);
  [false,true].forEach(reverse=>{
   const group=document.createElementNS(ns,'g');
   const arrow=document.createElementNS(ns,'path');arrow.setAttribute('d',reverse?'M10 -7 L0 0 L10 7 M1 0 H26':'M-10 -7 L0 0 L-10 7 M-1 0 H-26');arrow.setAttribute('fill','none');arrow.setAttribute('stroke',colour);arrow.setAttribute('stroke-width','5');arrow.setAttribute('stroke-linecap','round');arrow.setAttribute('stroke-linejoin','round');group.append(arrow);
   const motion=document.createElementNS(ns,'animateMotion');motion.setAttribute('path',path);motion.setAttribute('dur','4s');motion.setAttribute('begin',(-i*.37-(reverse?2:0))+'s');motion.setAttribute('repeatCount','indefinite');motion.setAttribute('rotate','auto');motion.setAttribute('calcMode','linear');motion.setAttribute('keyPoints',reverse?'1;0':'0;1');motion.setAttribute('keyTimes','0;1');group.append(motion);svg.append(group);
  });
 });
 const dataPath='M855 410 C940 355 930 310 895 265';
 ['0101','128','0110','256','1011','64'].forEach((value,i)=>{
  const group=document.createElementNS(ns,'g');const label=document.createElementNS(ns,'text');label.textContent=value;label.setAttribute('text-anchor','middle');label.setAttribute('fill','#a8f5ff');label.setAttribute('font-family','ui-monospace,monospace');label.setAttribute('font-size','21');label.setAttribute('font-weight','700');label.setAttribute('stroke','#07111c');label.setAttribute('stroke-width','5');label.setAttribute('paint-order','stroke');group.append(label);
  const motion=document.createElementNS(ns,'animateMotion');motion.setAttribute('path',dataPath);motion.setAttribute('dur','3.6s');motion.setAttribute('begin',(-i*.6)+'s');motion.setAttribute('repeatCount','indefinite');group.append(motion);
  const fade=document.createElementNS(ns,'animate');fade.setAttribute('attributeName','opacity');fade.setAttribute('values','0;1;1;0');fade.setAttribute('keyTimes','0;.12;.85;1');fade.setAttribute('dur','3.6s');fade.setAttribute('begin',(-i*.6)+'s');fade.setAttribute('repeatCount','indefinite');group.append(fade);svg.append(group);
 });
 stage.append(svg);
 const caption=document.createElement('figcaption');caption.className='menu-motion-caption';caption.innerHTML='<span>Menus out. Orders in. Data to Maistro.</span><button type="button">Pause animation</button>';figure.append(caption);
 const button=caption.querySelector('button'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=false;
 function update(){const running=visible&&!paused&&!document.hidden;figure.classList.toggle('menu-motion-paused',!running);if(running)svg.unpauseAnimations();else svg.pauseAnimations();button.textContent=paused?'Play animation':'Pause animation';button.setAttribute('aria-pressed',String(!paused));}
 button.onclick=()=>{paused=!paused;update();};reduced.addEventListener('change',()=>{paused=reduced.matches;update();});document.addEventListener('visibilitychange',update);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.1}).observe(figure);update();
})();

/* crm-story.js */
(() => {
  const root = document.querySelector('.crm-story');
  if (!root) return;
  const paths = {
    people:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2m6 0v-2a4 4 0 0 0-3-4M16 3a4 4 0 0 1 0 8"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2"/>',
    activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    chevron:'<path d="m9 5 7 7-7 7"/>', down:'<path d="m6 9 6 6 6-6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', check:'<path d="m5 12 4 4L19 6"/>',
    spark:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 6 9 7 9-7"/>',
    phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
    location:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    plus:'<path d="M12 5v14M5 12h14"/>', bag:'<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    pause:'<path d="M9 5v14M15 5v14"/>', play:'<path d="m8 4 12 8-12 8V4Z"/>', replay:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
    signal:'<path d="M4 17v3M9 13v7M14 8v12M19 3v17"/>', wifi:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r=".7"/>',
    battery:'<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 10v4M5 10h11v4H5z"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
  const customers = [
    ['EC','Emma Clarke',24,'2 days ago','Regular','mint'], ['JR','James Reed',18,'Yesterday','Regular','blue'],
    ['AP','Amira Patel',32,'4 days ago','VIP','violet'], ['SW','Sofia Walsh',11,'Today','Regular','peach'],
    ['NB','Noah Brooks',9,'1 week ago','Returning','blue']
  ];
  root.innerHTML = `
    <header class="crm-story-header"><div><span class="crm-story-kicker">ONLINE · CRM · MARKETING</span><strong>From customer to next order.</strong></div><button type="button" class="crm-playback" data-crm-pause>${icon('pause')}<span>Pause</span></button></header>
    <div class="crm-story-layout">
      <div class="crm-console">
        <div class="crm-workspace-header"><div class="crm-workspace-brand"><span class="crm-mark">M</span><div><strong>M<span>ai</span>stro <b>CRM</b></strong><small>Riverside Kitchen · All locations</small></div></div><span class="crm-connected"><i></i>Connected</span></div>
        <nav class="crm-workspace-nav" aria-label="CRM demonstration views"><button type="button" data-crm-step="0">${icon('people')}Customers</button><button type="button" data-crm-step="1">${icon('calendar')}Campaigns</button><button type="button" data-crm-step="3">${icon('activity')}Activity</button></nav>
        <div class="crm-stage">
          <section class="crm-view crm-customers">
            <div class="crm-view-heading"><div><h3>Customers</h3><p>Your customer relationships, in one place.</p></div><span class="crm-synced">${icon('check')} Synced</span></div>
            <div class="crm-metrics"><div><span>Total contacts</span><strong>150,000</strong></div><div><span>App subscribers</span><strong>100,000</strong></div><div><span>Email subscribers</span><strong>50,000</strong></div></div>
            <div class="crm-table-toolbar"><label class="crm-search">${icon('search')}<input type="search" placeholder="Find a customer" aria-label="Search example customers"></label><label class="crm-segment-filter"><select aria-label="Customer segment"><option value="all">All customers</option><option value="Regular">Regulars</option><option value="VIP">VIP customers</option><option value="Returning">Returning</option></select></label></div>
            <table class="crm-customer-table"><thead><tr><th scope="col">Customer</th><th scope="col">Orders</th><th scope="col">Last order</th><th scope="col">Segment</th></tr></thead><tbody>${customers.map(([initials,name,orders,last,segment,tone])=>`<tr data-customer="${name.toLowerCase()}" data-segment="${segment}"><td><span class="crm-person-avatar ${tone}">${initials}</span><strong>${name}</strong></td><td>${orders}</td><td>${last}</td><td><span class="crm-segment ${tone}">${segment}</span></td></tr>`).join('')}</tbody></table>
            <p class="crm-empty" hidden>No example customers match this search.</p><div class="crm-table-summary"><span data-customer-count>Showing 5 example customers</span><span>All locations</span></div>
            <div class="crm-customer-insight">${icon('spark')}<div><strong>Turn customer history into the next order</strong><span>Connected to campaigns, offers and your ordering app.</span></div><button type="button" data-crm-step="1" aria-label="View the campaign planner">${icon('chevron')}</button></div>
          </section>
          <section class="crm-view crm-scheduler" hidden>
            <div class="crm-view-heading"><div><h3>Campaign planner</h3><p>21–27 September 2026 · All locations</p></div><span class="crm-automation">${icon('spark')}<span>Maistro<br>automation</span></span></div>
            <div class="crm-calendar" aria-label="Campaign calendar for the week of 21 September 2026"><div class="crm-calendar-top"><strong>September 2026</strong><span>Week view ${icon('down')}</span></div>
              <div class="crm-calendar-days">${['Mon|21','Tue|22','Wed|23','Thu|24','Fri|25'].map((d,i)=>`<div class="${i===3?'selected':''}"><span>${d.split('|')[0]}</span><strong>${d.split('|')[1]}</strong></div>`).join('')}</div>
              <div class="crm-calendar-slots"><div></div><div><span class="crm-calendar-event crm-event-muted">Welcome<small>09:00 · Email</small></span></div><div></div><div class="selected"><span class="crm-calendar-event">Dinner offer<small>17:30 · Push + email</small></span></div><div></div></div>
            </div>
            <div class="crm-campaign">
              <div class="crm-campaign-title"><div><span class="crm-detail-label">SELECTED CAMPAIGN</span><h4>Dinner, on your terms</h4></div><span class="crm-campaign-status" data-campaign-status>${icon('clock')} Scheduled</span></div>
              <div class="crm-campaign-fields"><div><span>Audience</span><strong>Opted-in customers</strong></div><div><span>Send time</span><strong>Thu 24 Sep · 17:30</strong></div><div><span>Offer</span><strong>20% off · Code DINNER20</strong></div><div><span>Automation</span><strong>Maistro · Scheduled</strong></div></div>
              <div class="crm-channel-row"><span class="crm-channel-icon">${icon('phone')}</span><div><strong>App push notification</strong><small>100,000 subscribers</small></div><span class="crm-channel-state" data-push-count>Queued</span></div>
              <div class="crm-channel-row"><span class="crm-channel-icon mail">${icon('mail')}</span><div><strong>Email campaign</strong><small>50,000 subscribers</small></div><span class="crm-channel-state" data-email-count>Queued</span></div>
              <div class="crm-progress" role="progressbar" aria-label="Example campaign send progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><div class="crm-send-summary"><span data-delivery-status>Audience ready. Scheduled for 17:30.</span><strong data-send-total>150,000 messages</strong></div>
            </div>
            <div class="crm-activity-log"><span class="crm-log-dot"></span><span data-activity-log>Maistro automation · Campaign queued</span><time>17:30</time></div>
          </section>
        </div>
      </div>
      <div class="crm-phone-area"><span class="crm-phone-label"><i></i>YOUR RESTAURANT. YOUR APP.</span>
        <div class="crm-phone"><div class="crm-phone-screen">
          <div class="crm-phone-status"><span>17:30</span><span>${icon('signal')}${icon('wifi')}${icon('battery')}</span></div><div class="crm-island" aria-hidden="true"></div>
          <div class="crm-app">
            <div class="crm-app-header"><div><span>ORDERING FROM</span><strong>Riverside Kitchen ${icon('down')}</strong></div><span class="crm-app-avatar">EC</span></div>
            <div class="crm-app-fulfilment"><span>${icon('location')} Delivery to home</span><span>25–35 min ${icon('chevron')}</span></div>
            <div class="crm-app-greeting"><h3>Good food.<br>Great evening.</h3><p>Fresh from our kitchen to yours.</p></div>
            <div class="crm-app-hero"><img src="assets/crm-pizza.webp" width="1200" height="800" alt="Fresh pepperoni pizza with melted mozzarella and basil" loading="lazy"><div><span>TONIGHT’S FAVOURITE</span><strong>A proper<br>pizza night.</strong><span class="crm-hero-pill">Made fresh. Always.</span></div></div>
            <div class="crm-app-categories" aria-label="Ordering app menu categories"><button type="button" data-food-category="all" aria-pressed="true">Popular</button><button type="button" data-food-category="pizza" aria-pressed="false">Pizza</button><button type="button" data-food-category="burger" aria-pressed="false">Burgers</button></div>
            <div class="crm-app-popular"><strong data-menu-heading>Your favourites</strong><span>${icon('star')} 4.8</span></div>
            <div class="crm-app-products"><div class="crm-app-product" data-food="pizza"><img src="assets/crm-pizza.webp" alt="Pepperoni pizza" width="76" height="76" loading="lazy"><div><strong>Pepperoni classic</strong><small>Mozzarella, basil, hot honey</small><b>€14.50</b></div><button type="button" data-add="pizza" aria-label="Add pepperoni pizza to the example basket">${icon('plus')}</button></div><div class="crm-app-product" data-food="burger"><img src="assets/crm-burger.webp" alt="Double smash burger and fries" width="76" height="76" loading="lazy"><div><strong>The double smash</strong><small>Two patties. Proper cheese.</small><b>€13.50</b></div><button type="button" data-add="burger" aria-label="Add double smash burger to the example basket">${icon('plus')}</button></div></div>
            <div class="crm-app-basket"><span class="crm-basket-icon">${icon('bag')}<b data-basket-count>0</b></span><span data-basket-copy>Your next favourite awaits</span><strong data-basket-price></strong></div>
          </div>
          <button type="button" class="crm-push" data-open-offer tabindex="-1" aria-hidden="true"><span class="crm-push-top"><b>R</b><strong>RIVERSIDE KITCHEN</strong><small>now</small></span><strong class="crm-push-title">Your dinner plans? Sorted.</strong><span class="crm-push-copy">Enjoy 20% off your next direct order.<br>Use DINNER20. Tap to tuck in.</span></button>
          <div class="crm-phone-toast" role="status" aria-live="polite"></div><div class="crm-home-indicator" aria-hidden="true"></div>
        </div></div><span class="crm-phone-received">${icon('check')}<span>Offer sent straight to their phone.</span></span>
      </div>
    </div>
    <footer class="crm-story-footer"><span data-crm-caption></span><button type="button" data-crm-replay>${icon('replay')} Replay</button><small>Interactive example · Fictional customers and campaign data. No messages are sent.</small></footer>`;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pause = root.querySelector('[data-crm-pause]'), customersView = root.querySelector('.crm-customers'), schedulerView = root.querySelector('.crm-scheduler');
  const push = root.querySelector('.crm-push'), progress = root.querySelector('.crm-progress'), status = root.querySelector('[data-campaign-status]');
  const pushCount = root.querySelector('[data-push-count]'), emailCount = root.querySelector('[data-email-count]'), totalCount = root.querySelector('[data-send-total]');
  const captions = ['1 / 4 · Get to know your customers.','2 / 4 · Plan the offer with Maistro automation.','3 / 4 · Send 100,000 push notifications and 50,000 emails.','4 / 4 · SENT. The next order is a tap away.'];
  const durations = [4000,4500,3000,6500];
  let step=0, elapsed=0, lastFrame=0, frame=0, visible=false, paused=reducedMotion.matches;
  let offerApplied=false, pizzaCount=0, burgerCount=0, toastTimer;
  const format = value => Math.round(value).toLocaleString('en-GB');
  function paintProgress() {
    const ratio = step===3 ? 1 : step===2 ? Math.min(elapsed/durations[2],1) : 0;
    progress.style.setProperty('--crm-progress',`${ratio*100}%`);
    progress.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
    pushCount.textContent = step<2 ? 'Queued' : `${format(100000*ratio)} ${step===3?'sent':'/ 100,000'}`;
    emailCount.textContent = step<2 ? 'Queued' : `${format(50000*ratio)} ${step===3?'sent':'/ 50,000'}`;
    totalCount.textContent = step<2 ? '150,000 messages' : `${format(150000*ratio)} sent`;
  }
  function paintStep() {
    root.dataset.step=String(step);
    customersView.hidden=step!==0; schedulerView.hidden=step===0;
    status.innerHTML=`${icon(step===3?'check':step===2?'activity':'clock')} ${step===3?'SENT':step===2?'Sending':'Scheduled'}`;
    root.querySelector('[data-delivery-status]').textContent=step===3?'Campaign completed successfully.':step===2?'Delivering across both channels…':'Audience ready. Scheduled for 17:30.';
    root.querySelector('[data-activity-log]').textContent=step===3?'Maistro automation · Both channels sent':step===2?'Maistro automation · Sending campaign':'Maistro automation · Campaign queued';
    root.querySelector('[data-crm-caption]').textContent=captions[step];
    root.querySelectorAll('[data-crm-step]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.crmStep)===(step===2?1:step))));
    const pushVisible=step===3&&!offerApplied;
    push.setAttribute('aria-hidden',String(!pushVisible));push.tabIndex=pushVisible?0:-1;
    paintProgress();
  }
  function tick(now) {
    if(lastFrame)elapsed+=Math.min(now-lastFrame,100);
    lastFrame=now;
    if(elapsed>=durations[step]){step=(step+1)%4;elapsed=0;paintStep();}else if(step===2)paintProgress();
    frame=requestAnimationFrame(tick);
  }
  function syncPlayback() {
    cancelAnimationFrame(frame);lastFrame=0;
    const running=!paused&&visible&&!document.hidden;
    root.classList.toggle('crm-paused',!running);
    pause.innerHTML=`${icon(paused?'play':'pause')}<span>${paused?'Play':'Pause'}</span>`;
    pause.setAttribute('aria-label',paused?'Play the CRM animation':'Pause the CRM animation');
    pause.setAttribute('aria-pressed',String(paused));
    if(running)frame=requestAnimationFrame(tick);
  }
  function selectStep(next,manual=true){step=next;elapsed=0;if(manual)paused=true;paintStep();syncPlayback();}
  function pauseForInteraction(){paused=true;syncPlayback();}
  pause.addEventListener('click',()=>{paused=!paused;syncPlayback();});
  root.querySelector('[data-crm-replay]').addEventListener('click',()=>{paused=false;offerApplied=false;root.classList.remove('crm-offer-open');paintBasket();selectStep(0,false);});
  root.querySelectorAll('[data-crm-step]').forEach(button=>button.addEventListener('click',()=>selectStep(Number(button.dataset.crmStep))));
  const search=root.querySelector('.crm-search input'),segment=root.querySelector('.crm-segment-filter select');
  function filterCustomers(){
    pauseForInteraction();let count=0;
    root.querySelectorAll('[data-customer]').forEach(row=>{row.hidden=!row.dataset.customer.includes(search.value.trim().toLowerCase())||(segment.value!=='all'&&row.dataset.segment!==segment.value);if(!row.hidden)count++;});
    root.querySelector('[data-customer-count]').textContent=`Showing ${count} example customer${count===1?'':'s'}`;
    root.querySelector('.crm-empty').hidden=count>0;
  }
  search.addEventListener('input',filterCustomers);search.addEventListener('focus',pauseForInteraction);
  segment.addEventListener('change',filterCustomers);segment.addEventListener('focus',pauseForInteraction);
  function showToast(message){const toast=root.querySelector('.crm-phone-toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2500);}
  function paintBasket(){
    const count=pizzaCount+burgerCount,fullPrice=pizzaCount*14.5+burgerCount*13.5;
    root.querySelector('[data-basket-count]').textContent=String(count);
    root.querySelector('[data-basket-copy]').textContent=count?`${count} item${count===1?'':'s'} in your basket`:offerApplied?'DINNER20 applied · 20% off':'Your next favourite awaits';
    root.querySelector('[data-basket-price]').textContent=count?`€${(fullPrice*(offerApplied ? 0.8 : 1)).toFixed(2)}`:'';
    root.classList.toggle('crm-has-basket',count>0);
  }
  root.querySelectorAll('[data-food-category]').forEach(button=>button.addEventListener('click',()=>{
    pauseForInteraction();const category=button.dataset.foodCategory;
    root.querySelectorAll('[data-food-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    root.querySelectorAll('[data-food]').forEach(product=>{product.hidden=category!=='all'&&product.dataset.food!==category;});
    root.querySelector('[data-menu-heading]').textContent=category==='all'?'Your favourites':category==='pizza'?'Fresh from the oven':'Made to order';
  }));
  root.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>{pauseForInteraction();if(button.dataset.add==='pizza')pizzaCount++;else burgerCount++;paintBasket();showToast('Added to your example basket');}));
  root.querySelector('[data-open-offer]').addEventListener('click',()=>{pauseForInteraction();offerApplied=true;root.classList.add('crm-offer-open');push.setAttribute('aria-hidden','true');push.tabIndex=-1;paintBasket();root.querySelector('[data-add="pizza"]').focus();showToast('DINNER20 applied. Enjoy 20% off.');});
  root.addEventListener('focusin',event=>{if(!event.target.closest('[data-crm-pause], [data-crm-replay]'))pauseForInteraction();});
  reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;syncPlayback();});
  document.addEventListener('visibilitychange',syncPlayback);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncPlayback();},{threshold:.15}).observe(root);else visible=true;
  paintStep();syncPlayback();
})();

/* pos-showcase.js */
(() => {
  const root = document.querySelector('[data-pos-carousel]');
  if (!root) return;
  const slides = [...root.querySelectorAll('.pos-slide')];
  const buttons = [...root.querySelectorAll('[data-pos-slide]')];
  const toggle = root.querySelector('[data-pos-pause]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, paused = motion.matches, visible = false, hovered = false, timer = null;
  const duration = 3000;

  function paint() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  function schedule() {
    clearTimeout(timer);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play POS screen rotation' : 'Pause POS screen rotation');
    toggle.innerHTML = paused
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
    if (!paused && visible && !hovered && !document.hidden) {
      timer = setTimeout(() => { current = (current + 1) % slides.length; paint(); schedule(); }, duration);
    }
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => {
    current = i;
    paused = true;
    paint();
    schedule();
  }));
  toggle.addEventListener('click', () => { paused = !paused; schedule(); });
  const display = root.querySelector('.pos-display');
  display.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; schedule(); }
  });
  display.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  root.addEventListener('focusin', event => {
    if (!event.target.closest('[data-pos-pause]')) { paused = true; schedule(); }
  });
  root.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    current = (current + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length;
    paused = true;
    paint();
    buttons[current].focus();
    schedule();
  });
  motion.addEventListener('change', () => { paused = motion.matches; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) slides.forEach(slide => { slide.querySelector('img').loading = 'eager'; });
      schedule();
    }, { threshold: .15 }).observe(root);
  } else visible = true;
  paint();
  schedule();
})();

/* export-dialog.js */
(() => {
  const links = [...document.querySelectorAll('a.download[download]')];
  if (!links.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'export-dialog';
  dialog.setAttribute('aria-labelledby', 'export-title');
  dialog.setAttribute('aria-describedby', 'export-copy');
  dialog.innerHTML = `
    <button class="export-close" type="button" aria-label="Close download request">×</button>
    <div class="export-brand">M<span>ai</span>stro</div>
    <div class="export-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5"/></svg><span>PDF GUIDE</span></div>
    <p class="export-eyebrow">THE DETAIL, TO GO</p>
    <h2 id="export-title">Take the facts with you.</h2>
    <p id="export-copy">Leave your email and we’ll get your guide ready to download.</p>
    <p class="export-guide"></p>
    <form class="export-form">
      <label for="export-email">Your email address</label>
      <input id="export-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@yourbusiness.com" maxlength="254" required>
      <p class="export-error" id="export-error" role="alert" hidden></p>
      <button class="export-submit" type="submit">Get my PDF <span aria-hidden="true">↓</span></button>
      <p class="export-small">By continuing, you’re sharing your email with Maistro for this download.</p>
    </form>
    <div class="export-success" hidden>
      <a class="export-again" download>Download again <span aria-hidden="true">↓</span></a>
      <button class="export-done" type="button">Keep exploring</button>
    </div>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form');
  const input = dialog.querySelector('input');
  const submit = dialog.querySelector('.export-submit');
  const title = dialog.querySelector('h2');
  const copy = dialog.querySelector('#export-copy');
  const error = dialog.querySelector('.export-error');
  const success = dialog.querySelector('.export-success');
  const again = dialog.querySelector('.export-again');
  let selected, controller, busy = false, lastEmail = '', requestKey = '', requestId = '';

  function setBusy(value) {
    busy = value;
    input.readOnly = value;
    submit.disabled = value;
    form.setAttribute('aria-busy', String(value));
    submit.innerHTML = value ? 'Getting your guide…' : 'Get my PDF <span aria-hidden="true">↓</span>';
  }
  function clearError() {
    error.hidden = true;
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
  function close() { dialog.close(); }
  links.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      event.preventDefault();
      selected = link;
      title.textContent = 'Take the facts with you.';
      copy.textContent = 'Leave your email and we’ll get your guide ready to download.';
      dialog.querySelector('.export-guide').textContent = link.dataset.exportTitle;
      input.value = lastEmail;
      form.hidden = false;
      success.hidden = true;
      requestKey = '';
      clearError();
      setBusy(false);
      dialog.showModal();
      document.documentElement.classList.add('export-is-open');
      input.focus({ preventScroll: true });
    });
  });
  dialog.querySelector('.export-close').addEventListener('click', close);
  dialog.querySelector('.export-done').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  });
  dialog.addEventListener('close', () => {
    controller?.abort();
    controller = null;
    setBusy(false);
    document.documentElement.classList.remove('export-is-open');
    selected?.focus({ preventScroll: true });
  });
  input.addEventListener('input', clearError);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (busy || !selected) return;
    input.value = input.value.trim();
    if (!form.reportValidity()) return;
    clearError();
    lastEmail = input.value;
    form.hidden = true;
    success.hidden = false;
    title.textContent = 'Your guide is ready.';
    copy.textContent = 'The PDF is included with this page and will download directly.';
    again.href = selected.href;
    again.download = selected.download;
    again.click();
    dialog.querySelector('.export-done').focus({ preventScroll: true });
  });
})();

/* section-fit.js */
(() => {
  const visuals = [...document.querySelectorAll('.section-visual')];
  let frame;
  const controllers = [];
  function schedule() {
    if (!frame) frame = requestAnimationFrame(() => { frame = null; controllers.forEach(fit => fit()); });
  }
  visuals.forEach(visual => {
    const viewport = visual.querySelector('.section-visual-viewport');
    const stage = visual.querySelector('.section-visual-stage');
    const expand = visual.querySelector('.visual-expand');
    const dialog = visual.querySelector('.visual-dialog');
    const body = dialog.querySelector('.visual-dialog-body');
    const close = dialog.querySelector('.visual-close');
    const naturalWidth = Number(visual.dataset.visualWidth);
    visual.style.setProperty('--visual-width', `${naturalWidth}px`);
    expand.hidden = false;
    visual.classList.add('is-fit');

    function fit() {
      if (dialog.open || !viewport.clientWidth) return;
      const height = stage.offsetHeight;
      if (!height) return;
      // Use the whole section width and preserve the preview's proportions.
      const scale = viewport.clientWidth / naturalWidth;
      visual.style.setProperty('--visual-scale', String(scale));
      viewport.style.height = `${Math.ceil(height * scale)}px`;
    }
    controllers.push(fit);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(schedule);
      [viewport, stage].forEach(element => observer.observe(element));
    }
    stage.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule));
    expand.addEventListener('click', () => {
      body.append(stage);
      dialog.showModal();
      document.documentElement.classList.add('visual-dialog-open');
      close.focus({ preventScroll: true });
      window.dispatchEvent(new Event('resize'));
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target.closest('a[href^="#"]')) dialog.close();
    });
    dialog.addEventListener('close', () => {
      viewport.append(stage);
      dialog.querySelectorAll('.forecast-popup').forEach(popup => { popup.hidden = true; document.body.append(popup); });
      stage.querySelectorAll('.forecast-cell[aria-expanded="true"]').forEach(cell => {
        cell.setAttribute('aria-expanded', 'false');
        cell.classList.remove('is-active');
      });
      dialog.querySelectorAll('.roster-cost-tip').forEach(tip => { tip.classList.remove('visible'); document.body.append(tip); });
      document.documentElement.classList.remove('visual-dialog-open');
      expand.focus({ preventScroll: true });
      window.dispatchEvent(new Event('resize'));
      schedule();
    });
    fit();
  });
  window.addEventListener('resize', schedule, { passive: true });
  if (document.fonts) document.fonts.ready.then(schedule);
  // Product tables choose their visible days from their newly fitted canvas width.
  window.dispatchEvent(new Event('resize'));
  schedule();
})();
