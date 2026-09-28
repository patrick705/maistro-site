/* Inline script from final page */
if(window.parent!==window&&new URLSearchParams(location.search).get('maistro-embed')==='1')document.documentElement.classList.add('maistro-connected');

/* Inline script from final page */
(()=>{
'use strict';
const journey=document.getElementById('journey'),stage=document.querySelector('.stage'),scene=document.getElementById('scene'),brain=document.getElementById('brain');
const svg=document.getElementById('connections'),paths=document.getElementById('paths'),packets=document.getElementById('packets'),targetLayer=document.getElementById('targets');
const chapters=[...document.querySelectorAll('.chapter')],nav=[...document.querySelectorAll('[data-go]')],navWrap=document.querySelector('.chapter-nav');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),ns='http://www.w3.org/2000/svg';
const anchors=[
 {id:'stock',x:.669,y:.223,label:'Stock room',step:1},
 {id:'kitchen',x:.450319,y:.373206,label:'Fries KDS',step:2,station:'sides'},
 {id:'kds-grill',x:.772051,y:.393989,label:'Grill KDS',step:2,station:'mains'},
 {id:'staff',x:.493,y:.504,label:'Alex · staff app',step:3,member:'alex'},
 {id:'staff2',x:.646,y:.519,label:'Mia · staff app',step:3,member:'mia'},
 {id:'pos',x:.557,y:.468,label:'Menu Manager',step:4,heart:true},
 {id:'kiosk',x:.762,y:.638,label:'Kiosk',step:4},
 {id:'signage',x:.555,y:.328,label:'Digital signage',step:4},
 {id:'drivers',x:.709,y:.858,label:'Dispatch',step:5},
 {id:'office',x:.90,y:.219,label:'HQ · Maistro agent',step:6}
];
const states=[
 {name:'Overview',color:'#57ead7',focus:[.50,.49],targets:['stock','kitchen','staff','pos','drivers','office'],token:'',action:'Know your business. Grow your margins. Maistro connects stock, kitchen, staff, Menu Manager, delivery and HQ. Select a connection to explore.'},
 {name:'Stock room',color:'#76efd0',focus:[.62,.26],targets:['stock'],token:'',action:'Stock usage returns to Maistro: 3 cans of Coke and 20 grams of pepperoni depleted. Maistro sends a replenishment order back: 24 Coke cans and 1 kilogram of pepperoni.'},
 {name:'Kitchen',color:'#57ead7',focus:[.53,.423],targets:['kitchen','kds-grill'],token:'',action:'A cheeseburger and fries order goes to Maistro. The brain sends the cheeseburger to Grill KDS and the fries to Fries KDS.'},
 {name:'Staff',color:'#c3b8ff',focus:[.60,.51],targets:['staff','staff2'],token:'SHIFT',action:'Maistro forecasts staffing demand to reduce labour costs and grow margins. Alex and Mia receive their schedules in the staff app. Choose a staff member and accept their shift.'},
 {name:'Orders',color:'#57ead7',focus:[.64,.52],targets:['pos','kiosk','signage'],token:'MENU',action:'Orders from every channel reach Menu Manager and Maistro. The brain sends each food item to the right kitchen screen. Menus go to digital signage.'},
 {name:'Auto dispatch',color:'#7edef4',focus:[.67,.84],targets:['drivers'],token:'ASSIGN',action:'Three delivery orders are matched to Liam, Sofia and Daniel. Watch each order travel from the list through Maistro to its driver outside the restaurant.'},
 {name:'HQ',color:'#b3c6ff',focus:[.80,.25],targets:['office'],token:'ACTION',action:'Talk to your business through Maistro’s agentic AI agent. Create reports and run tasks across your empire.'},
 {name:'Margins',color:'#57ead7',focus:[.50,.49],targets:[],token:'',action:'Grow your margins. Sales rise, costs fall, and the profit between them grows. Replay the animation or drag the slider to explore.'}
];
const lastStep=states.length-1;
document.getElementById('chapter-total').textContent=String(states.length).padStart(2,'0');
let w=0,h=0,mobile=false,scrollTarget=0,p=0,current=-1,paused=reduced.matches,time=0,last=0,visible=true,cam={x:0,y:0,scale:1};
let source={x:0,y:0},curveData=[];
let selectedChannel='voice',dispatchElapsed=0,dispatchPhase=-1,hqMode='report',taskRunning=false,taskElapsed=0,taskStep=-1;
function make(tag,attrs){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs||{}))el.setAttribute(k,String(v));return el}
function readablePacket(label){const g=make('g',{class:'readable-packet','aria-label':label});['1010','0110','1001'].forEach((bits,i)=>{const txt=make('text',{x:-14,y:4-i*13,fill:i===0?'#b1ffe8':'#62dacb',opacity:1-i*.25,'font-size':11,'font-family':'monospace','letter-spacing':1});txt.textContent=bits;g.append(txt)});return g}
function smooth(t){return t*t*(3-2*t)}function clamp(n,a,b){return Math.max(a,Math.min(b,n))}function mix(a,b,t){return a+(b-a)*t}
function jump(i){if(mobile){mobileMove(i);return}const dist=journey.offsetHeight-stage.offsetHeight;window.scrollTo({top:journey.offsetTop+dist*i/lastStep,behavior:reduced.matches?'instant':'smooth'})}
nav.forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.go))));document.getElementById('explore').addEventListener('click',()=>jump(1));document.querySelector('.wordmark')?.addEventListener('click',e=>{e.preventDefault();jump(0)});
anchors.forEach(a=>{
 const button=document.createElement('button');button.type='button';button.className='target';button.setAttribute('aria-label','Explore '+a.label);button.dataset.target=a.id;
 const dot=document.createElement('span');dot.className=a.heart?'heart':'dot';dot.setAttribute('aria-hidden','true');if(a.heart)dot.textContent='♥';
 const label=document.createElement('span');label.className='target-label';label.textContent=a.label;button.append(dot,label);button.addEventListener('click',()=>{if(a.station)startKitchenOrder();if(a.member)selectStaff(a.member);if(current!==a.step)jump(a.step)});targetLayer.append(button);a.el=button;
});
function updatePause(){document.body.classList.toggle('paused',paused);const b=document.getElementById('motion');if(b){b.textContent=paused?'Play motion':'Pause motion';b.setAttribute('aria-pressed',String(paused))}}
document.getElementById('motion')?.addEventListener('click',()=>{paused=!paused;updatePause()});reduced.addEventListener('change',()=>{paused=reduced.matches;updatePause()});updatePause();
document.getElementById('fullscreen')?.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){document.getElementById('fullscreen')?.setAttribute('aria-label','Use your browser full screen control')}});
document.addEventListener('fullscreenchange',()=>{const label=document.querySelector('.full-label');const button=document.getElementById('fullscreen');if(label)label.textContent=document.fullscreenElement?'Exit full screen':'Full screen';if(button)button.setAttribute('aria-label',document.fullscreenElement?'Exit full screen':'Enter full screen');resize()});
const conceptSteps=[0,1,4,2,3,5,6,7];
function conceptNext(delta){return conceptSteps[clamp(conceptSteps.indexOf(current)+delta,0,7)]}
let mobileTransition=null,touchY=null,touchDelta=0,conceptLoopEnabled=true;
function carryOrder(){const card=document.createElement('div');card.className='order-carry';const logo=document.getElementById('ticket-source').cloneNode(true);logo.removeAttribute('id');card.append(logo);const label=document.createElement('strong');label.textContent=orderExamples[selectedChannel].number+' → Kitchen';card.append(label);document.body.append(card);setTimeout(()=>card.classList.add('dropping'),30);setTimeout(()=>card.remove(),1500)}

function mobileMove(index){index=clamp(index,0,lastStep);if(mobileTransition||index===current)return;if(current===4&&index===2)carryOrder();mobileTransition={from:p,to:index,start:performance.now(),duration:reduced.matches?0:1150};stage.classList.add('mobile-moving');stage.setAttribute('aria-busy','true');document.dispatchEvent(new CustomEvent('maistro-moving',{detail:true}))}
function finishMobileMove(){const end=mobileTransition.to;mobileTransition=null;p=scrollTarget=end;setState(end);stage.classList.remove('mobile-moving');stage.setAttribute('aria-busy','false');document.dispatchEvent(new CustomEvent('maistro-moving',{detail:false}))}
stage.addEventListener('touchstart',e=>{if(!mobile||e.touches.length!==1||e.target.closest('input,select,dialog'))return;touchY=e.touches[0].clientY;touchDelta=0},{passive:true});
stage.addEventListener('touchmove',e=>{if(!mobile||touchY===null)return;touchDelta=touchY-e.touches[0].clientY;if(Math.abs(touchDelta)>8){conceptLoopEnabled=false;e.preventDefault()}},{passive:false});
stage.addEventListener('touchend',()=>{if(mobile&&touchY!==null&&Math.abs(touchDelta)>45)mobileMove(conceptNext(touchDelta>0?1:-1));touchY=null;touchDelta=0},{passive:true});
stage.addEventListener('touchcancel',()=>{touchY=null;touchDelta=0},{passive:true});
window.addEventListener('wheel',e=>{if(!mobile||e.target.closest('dialog,select,input'))return;e.preventDefault();if(Math.abs(e.deltaY)>12){conceptLoopEnabled=false;mobileMove(conceptNext(e.deltaY>0?1:-1))}},{passive:false});
// Mobile sections are selected by gestures and controls, never browser scroll restoration or viewport resizing.
function onScroll(){if(mobile)return;scrollTarget=clamp((window.scrollY-journey.offsetTop)/(journey.offsetHeight-stage.offsetHeight)*lastStep,0,lastStep)}
function resize(){w=stage.clientWidth;h=stage.clientHeight;mobile=w<=760;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);onScroll()}
window.addEventListener('resize',resize,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',()=>{visible=!document.hidden});
function camera(i){
 const st=states[i],overview=i===0||i===lastStep;
 if(mobile){const widths=[1.12,1.35,1.6,1.45,1.45,1.08,1.7,.9],xs=[.5,.54,.52,.78,.62,.5,.66,.5],ys=[.56,.47,.48,.45,.66,.43,.43,.62],focus=[[.5,.48],[.62,.26],[.55,.42],[.60,.51],[.59,.46],[.57,.87],[.80,.25],[.5,.49]];const width=w*widths[i],scale=width/941;return{scale,x:w*xs[i]-focus[i][0]*width,y:h*ys[i]-focus[i][1]*1672*scale}}

 if(i===0){const copyBottom=document.getElementById('intro').getBoundingClientRect().bottom-stage.getBoundingClientRect().top;const room=Math.max(120,h-113-copyBottom-26);const width=mobile?Math.min(w*.75,room/.639*941/1672):Math.min(w*.49,h*.57),scale=width/941;return{scale,x:w*(mobile?.57:.74)-width*.5,y:mobile?h-113-1672*scale*.858:h*.245-1672*scale*.223}}
 if(i===1){const width=mobile?w*1.04:Math.min(w*.62,h*.88),scale=width/941;return{scale,x:w*(mobile?.52:.742)-width*.57,y:h*(mobile?(h<740?.76:.74):.58)-1672*scale*.245}}
 if(i===2){const width=mobile?w*1.55:Math.min(w*1.02,1510),scale=width/941;return{scale,x:w*(mobile?.51:.75)-width*.61,y:h*(mobile?(h<740?.70:.65):.60)-1672*scale*.40}}
 if(i===3){const width=mobile?w*1.57:Math.min(w*.88,1320),scale=width/941;return{scale,x:w*(mobile?.84:.80)-st.focus[0]*width,y:h*(mobile?(h<740?.75:.67):.63)-st.focus[1]*1672*scale}}
 if(mobile&&i===4){const width=w*.84,scale=width/941;return{scale,x:w*.72-width*.557,y:h*.89-1672*scale*.468}}
 if(mobile&&i===5){const width=w*1.04,scale=width/941;return{scale,x:w*.50-width*.57,y:h-140-1460*scale}}
 if(mobile){if(overview){const width=w*.72,scale=width/941;return{scale,x:w*.55-width*.5,y:h*.39}}const width=w*1.30,scale=width/941;return{scale,x:w*.52-st.focus[0]*width,y:h*(i===1?(h<740?.86:.82):i===6?(h<740?.89:.82):.62)-st.focus[1]*1672*scale}}
 if(overview){const width=Math.min(w*.50,h*.47),scale=width/941;return{scale,x:w*.733-width*.50,y:h*.14}}
 if(i===5){const width=Math.min(w*.57,860),scale=width/941;return{scale,x:w*.805-width*.61,y:Math.min(h-165,h*.75)-1460*scale}}
 const width=Math.min(w*(i===6?.74:.65),i===6?1150:1040),scale=width/941;
 return{scale,x:w*.733-st.focus[0]*width,y:h*.60-st.focus[1]*1672*scale};
}
function setState(index){
 if(index===current)return;current=index;const st=states[index];document.documentElement.style.setProperty('--accent',st.color);brain.classList.remove('is-routing');
 if(index===5)selectDriver(0);
 if(index===3)startStaffDemo();
 if(index===7)startMarginGrowth();
 if(index===1)stockElapsed=0;
 if(index===2)startKitchenOrder();
 document.getElementById('order-ticket').hidden=index!==4;document.getElementById('order-ticket').inert=index!==4;
 if(index===4){conceptLoopEnabled=true;orderAuto=!reduced.matches;selectChannel(mobile&&window.conceptOrderSeen?orderSequence[(orderSequence.indexOf(selectedChannel)+1)%7]:'voice');window.conceptOrderSeen=true;updateChannelTour()}
 document.getElementById('staff-app').hidden=index!==3;document.getElementById('staff-app').inert=index!==3;
 anchors.forEach(a=>{a.el.querySelector('.target-label').textContent=index===0&&a.id==='office'?'HQ':index===0&&a.station?'Kitchen':index!==3&&a.member?'Staff':index===3&&mobile&&a.member?a.label.split(' · ')[0]:a.label});
 chapters.forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-hidden',String(i!==index));el.inert=i!==index});stage.dataset.chapter=String(index);
 nav.forEach((el,i)=>{if(i===index)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});
 const active=nav[index];if(active.offsetLeft<navWrap.scrollLeft||active.offsetLeft+active.offsetWidth>navWrap.scrollLeft+navWrap.clientWidth)navWrap.scrollTo({left:active.offsetLeft-navWrap.clientWidth/2+active.offsetWidth/2,behavior:reduced.matches?'instant':'smooth'});
 document.getElementById('chapter-number').textContent=String(index+1).padStart(2,'0');document.getElementById('explore').hidden=index!==0;
 const note=document.getElementById('floor-note');note.hidden=index===0;note.innerHTML=`<span>${String(index).padStart(2,'0')}</span> ${index===lastStep?'ONE CONNECTED RESTAURANT':st.name.toUpperCase()}`;
 document.getElementById('accessible-state').textContent=st.action;
 paths.replaceChildren();packets.replaceChildren();curveData=[];
 if([1,2,4,5].includes(index))return;
 st.targets.forEach((id,n)=>{
  const a=anchors.find(x=>x.id===id),path=make('path',{class:'connection'+(index===lastStep?' ghost':'')});paths.append(path);
  const incoming=mobile?readablePacket(index===6?'Report data':index===3?'Shift update':'Live data'):make('text',{class:'binary'});if(!mobile)incoming.textContent='1010';packets.append(incoming);
  const bubble=make('g',{}),rect=make('rect',{class:'data-token',x:index===1?-51:-34,y:-12,width:index===1?102:68,height:24,rx:12}),text=make('text',{class:'token-text',y:4});text.textContent=st.token;
  bubble.append(rect,text);packets.append(bubble);if(index===lastStep){bubble.setAttribute('opacity','0');incoming.setAttribute('opacity','0')}
  const fromAnchor=index===4&&id!=='pos'?anchors.find(x=>x.id==='pos'):null;if(fromAnchor)incoming.textContent='ORDER';
  curveData.push({a,path,incoming,bubble,fromAnchor,offset:n*.42});
 });
}
function positionAnchor(a){return{x:cam.x+a.x*941*cam.scale,y:cam.y+a.y*1672*cam.scale}}
function pointAt(c,t){const s=1-t;return{x:s*s*s*c[0].x+3*s*s*t*c[1].x+3*s*t*t*c[2].x+t*t*t*c[3].x,y:s*s*s*c[0].y+3*s*s*t*c[1].y+3*s*t*t*c[2].y+t*t*t*c[3].y}}
function draw(dt){
 const f=clamp(p,0,lastStep),a=Math.floor(f),b=Math.min(lastStep,a+1),t=mobileTransition?smooth(clamp((performance.now()-mobileTransition.start)/mobileTransition.duration,0,1)):smooth(f-a),one=camera(mobileTransition?Math.round(mobileTransition.from):a),two=camera(mobileTransition?mobileTransition.to:b);
 const intro=1-smooth(clamp(f,0,1));stage.style.setProperty('--intro-strength',intro.toFixed(4));stage.style.setProperty('--intro-brain-scale',(1+intro*(mobile?-.07:.08)).toFixed(4));stage.style.setProperty('--intro-brain-shift','0px');
 brain.style.left=(mobile?mix(w*.73,86,intro):w*.145).toFixed(2)+'px';
 cam={x:mix(one.x,two.x,t),y:mix(one.y,two.y,t),scale:mix(one.scale,two.scale,t)};scene.style.transform=`translate3d(${cam.x.toFixed(2)}px,${cam.y.toFixed(2)}px,0) scale(${cam.scale.toFixed(5)})`;
 const brainRect=brain.getBoundingClientRect(),stageRect=stage.getBoundingClientRect();source={x:brainRect.left+brainRect.width*.50-stageRect.left,y:brainRect.top+brainRect.height*.84-stageRect.top};
 document.getElementById('progress').style.width=(f/lastStep*100).toFixed(2)+'%';
 for(const anchor of anchors){const xy=positionAnchor(anchor),active=states[current].targets.includes(anchor.id)&&(current!==4||anchor.id==='pos'||anchor.id===selectedChannel);anchor.el.style.left=xy.x+'px';anchor.el.style.top=xy.y+'px';const shown=active&&xy.y>175&&xy.y<h-95&&xy.x>20&&xy.x<w-20;anchor.el.classList.toggle('is-shown',shown);anchor.el.setAttribute('aria-hidden',String(!shown));anchor.el.setAttribute('aria-current',String(active&&current!==lastStep));anchor.el.tabIndex=shown?0:-1;anchor.el.classList.toggle('staff-selected',current===3&&anchor.member===selectedStaff);anchor.el.classList.toggle('label-left',current===0?['stock','kitchen','pos','office'].includes(anchor.id):xy.x>w*.78)}
 if(!paused)time+=dt;
 curveData.forEach(c=>{
  const end=positionAnchor(c.a),s=c.fromAnchor?positionAnchor(c.fromAnchor):source,bend=Math.max(70,Math.abs(end.y-s.y)*.5);
  const controls=current===3?(mobile?[s,{x:w*.98,y:s.y+60},{x:w*.98,y:end.y-80},end]:[s,{x:w*.43,y:Math.min(170,h*.21)},{x:end.x,y:end.y-170},end]):c.fromAnchor?[s,{x:s.x+65,y:s.y+(end.y<s.y?-40:40)},{x:end.x+65,y:end.y+(end.y<s.y?40:-40)},end]:current===0?(mobile?[s,{x:-90,y:s.y},{x:-90,y:end.y},end]:[s,{x:w*.51,y:s.y-16},{x:end.x-30,y:end.y-75},end]):mobile?[s,{x:w*.94,y:s.y+bend*.6},{x:w*.94,y:end.y-bend*.35},end]:[s,{x:mix(s.x,w*.53,1-intro),y:s.y+mix(bend,-10,1-intro)},{x:end.x,y:end.y-bend*.5},end];
  c.path.setAttribute('d',`M${s.x} ${s.y} C${controls[1].x} ${controls[1].y} ${controls[2].x} ${controls[2].y} ${end.x} ${end.y}`);
  const phase=((time/4600)+c.offset)%1,out=pointAt(controls,smooth(phase)),back=pointAt(controls,1-smooth((phase+.49)%1));
  c.bubble.setAttribute('transform',`translate(${out.x} ${out.y})`);c.incoming.setAttribute('transform',`translate(${back.x-14} ${back.y+4})`);
  if(current!==lastStep){const hide=reduced.matches?'0':'1';c.bubble.setAttribute('opacity',hide);c.incoming.setAttribute('opacity',current===4&&c.a.id==='signage'?'0':hide)}
  if(current===4&&c.fromAnchor){const active=selectedChannel===c.a.id;c.path.style.opacity=active?'.8':'.25';c.bubble.setAttribute('opacity',active&&!reduced.matches?'1':'0');c.incoming.setAttribute('opacity',active&&c.a.id!=='signage'&&!reduced.matches?'1':'0');}
  if(current===3){const person=staffPeople[c.a.member];c.path.style.opacity=c.a.member===selectedStaff?'.85':'.25';c.bubble.querySelector('text').textContent=person.accepted?'✓ READY':'SHIFT';if(!mobile)c.incoming.textContent=person.accepted?'✓':'1010';c.bubble.setAttribute('opacity','0');c.incoming.setAttribute('opacity','0');}
 });
 drawOrderTour(dt);drawChannelFlow();drawKitchenOrder(dt);drawStockFlow(dt);drawStaffFlow(dt);drawRestaurantDisplays();drawKitchenDisplays();drawDemos(dt);drawMargins(dt);
}


const foodCrops={pizza:{x:250,y:479,w:153,h:90},burger:{x:420,y:496,w:108,h:91},fresh:{x:544,y:512,w:130,h:91},drinks:{x:687,y:532,w:169,h:94}};
function displayFood(kind,width,height){const c=foodCrops[kind],scale=Math.max(width/c.w,height/c.h);return `<div class="display-food"><img src="${document.querySelector('.restaurant-art').getAttribute('src')}" alt="" style="width:${941*scale}px;height:${1672*scale}px;left:${-c.x*scale+(width-c.w*scale)/2}px;top:${-c.y*scale+(height-c.h*scale)/2}px"></div>`}
function mapDisplay(el,quad,width,height){const [p0,p1,p2,p3]=quad;const sx=p0[0]-p1[0]+p2[0]-p3[0],sy=p0[1]-p1[1]+p2[1]-p3[1],dx1=p1[0]-p2[0],dx2=p3[0]-p2[0],dy1=p1[1]-p2[1],dy2=p3[1]-p2[1],det=dx1*dy2-dx2*dy1;const g=(sx*dy2-dx2*sy)/det,j=(dx1*sy-sx*dy1)/det;const a=p1[0]-p0[0]+g*p1[0],b=p3[0]-p0[0]+j*p3[0],d=p1[1]-p0[1]+g*p1[1],e=p3[1]-p0[1]+j*p3[1];el.style.width=width+'px';el.style.height=height+'px';el.style.transform=`matrix3d(${a/width},${d/width},0,${g/width},${b/height},${e/height},0,${j/height},0,0,1,0,${p0[0]},${p0[1]},0,1)`}
const screenSpecs=[{kind:'pizza',quad:[[252,479],[405,493],[402,572],[249,561]],offer:'Pizza<br>night.',sub:'Something worth sharing.',menu:'Pizza',note:'Fresh from the oven'},{kind:'burger',quad:[[420,495],[528,504],[525,588],[420,578]],offer:'Make it<br>a meal.',sub:'Add fries + a drink.',menu:'Burgers',note:'Your favourites, made fresh'},{kind:'fresh',quad:[[544,507],[677,517],[674,602],[544,591]],offer:'Try something<br>fresh.',sub:'Find a new favourite.',menu:'Fresh<br>favourites',note:'Made for your appetite'},{kind:'drinks',quad:[[687,523],[859,539],[856,625],[687,609]],offer:'Make it<br>refreshing.',sub:'Add a cold drink.',menu:'Drinks',note:'Find your refreshment'}];
const restaurantDisplays=document.getElementById('restaurant-displays');const rotatingDisplays=[];
for(const [i,spec] of screenSpecs.entries()){const el=document.createElement('div');el.className='restaurant-display wall-display';el.dataset.display=spec.kind;el.dataset.phase='0';el.innerHTML=`<div class="display-state display-offer">${displayFood(spec.kind,205,168)}<div class="display-offer-copy"><small>On the menu</small><strong>${spec.offer}</strong><span>${spec.sub}</span></div></div><div class="display-state display-menu">${displayFood(spec.kind,205,168)}<div class="display-offer-copy"><small>Our menu</small><strong>${spec.menu}</strong><span>${spec.note}</span></div></div>`;mapDisplay(el,spec.quad,320,168);restaurantDisplays.append(el);rotatingDisplays.push({el,offset:i*1100,period:6200,last:-1})}
const kioskDisplay=document.createElement('div');kioskDisplay.className='restaurant-display kiosk-display';kioskDisplay.dataset.display='kiosk';kioskDisplay.dataset.phase='0';kioskDisplay.innerHTML=`<div class="display-state display-offer kiosk-offer"><div class="kiosk-brand">Menu</div><span class="kiosk-offer-label">A LITTLE EXTRA?</span><h3>Make it<br>a meal.</h3><p>Add fries and<br>your favourite drink.</p>${displayFood('burger',180,245)}<div class="kiosk-footer">Explore meals →</div></div><div class="display-state display-menu kiosk-menu"><div class="kiosk-brand">Menu</div><h3>What are you<br>craving?</h3><div class="kiosk-item">${displayFood('pizza',156,107)}<strong>Pizza</strong></div><div class="kiosk-item">${displayFood('burger',156,107)}<strong>Burgers</strong></div><div class="kiosk-item">${displayFood('drinks',156,107)}<strong>Drinks</strong></div><div class="kiosk-footer">Start your order →</div></div>`;mapDisplay(kioskDisplay,[[697,898],[740,910],[736,1030],[695,1020]],180,500);restaurantDisplays.append(kioskDisplay);rotatingDisplays.push({el:kioskDisplay,offset:3100,period:5500,last:-1});
function drawRestaurantDisplays(){for(const display of rotatingDisplays){const phase=reduced.matches?0:Math.floor((time+display.offset)/display.period)%3;if(phase!==display.last){display.last=phase;display.el.dataset.phase=String(phase)}}}


const forecastDialog=document.getElementById('forecast-dialog');document.getElementById('open-forecast').addEventListener('click',()=>forecastDialog.showModal());document.getElementById('close-forecast').addEventListener('click',()=>forecastDialog.close());forecastDialog.addEventListener('click',event=>{if(event.target===forecastDialog){const r=forecastDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)forecastDialog.close()}});
const kitchenScreens=[{id:'sides',title:'FRIES',order:'#1051',item:'1 × Fries',detail:'Same order · Sides station',kind:'fries',quad:[[406,609],[442,613],[441,640],[406,634]],started:0,last:-1,waiting:false},{id:'mains',title:'GRILL',order:'#1051',item:'1 × Cheeseburger',detail:'Same order · Grill station',kind:'burger',quad:[[708,643],[746,648],[745,675],[707,669]],started:0,last:-1,waiting:false}];
for(const screen of kitchenScreens){const el=document.createElement('div');el.className='kds-display';el.dataset.station=screen.id;el.dataset.state='new';el.innerHTML=`<div class="kds-header"><strong>${screen.title}</strong><span>KDS</span></div><div class="kds-ticket"><div class="kds-ticket-top"><b>${screen.order}</b><span>NEW</span></div><strong>${screen.item}</strong><small>${screen.detail}</small><div class="kds-item-photo"></div><div class="kds-progress"><i></i><i></i><i></i></div></div>`;mapDisplay(el,screen.quad,400,250);document.getElementById('kitchen-displays').append(el);screen.el=el;}
function drawKitchenDisplays(){for(const screen of kitchenScreens){if(screen.waiting)continue;const elapsed=reduced.matches?5500:time-screen.started;const phase=elapsed<3000?0:elapsed<11000?1:2;if(phase!==screen.last){screen.last=phase;screen.el.dataset.state=['new','preparing','ready'][phase];screen.el.querySelector('.kds-ticket-top span').textContent=['NEW','PREPARING','READY'][phase];}}}

let foodArtId=0;
function foodArt(kind,width=48,height=44){
 const atlas={burger:[15,90,872,747],fries:[1060,65,694,770]},crop=atlas[kind]||[foodCrops[kind].x,foodCrops[kind].y,foodCrops[kind].w,foodCrops[kind].h];
 const art=make('svg',{viewBox:crop.join(' '),width,height,preserveAspectRatio:'xMidYMid meet','aria-hidden':'true',overflow:'hidden'});
 const clipId='food-crop-'+(++foodArtId),defs=make('defs',{}),clip=make('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'});clip.append(make('rect',{x:crop[0],y:crop[1],width:crop[2],height:crop[3]}));defs.append(clip);art.append(defs,make('image',{href:document.querySelector(atlas[kind]?'#meal-item-atlas':'.restaurant-art').getAttribute('src'),x:0,y:0,width:atlas[kind]?1774:941,height:atlas[kind]?887:1672,'clip-path':'url(#'+clipId+')'}));return art;
}
document.querySelectorAll('[data-meal-photo]').forEach(el=>el.append(foodArt(el.dataset.mealPhoto,100,70)));
function foodKind(name){return /fries/i.test(name)?'fries':/burger/i.test(name)?'burger':/pizza/i.test(name)?'pizza':/coke|cola|fanta|sprite|water/i.test(name)?'drinks':null}
function foodLabel(name){return /fries/i.test(name)?'Fries':/burger/i.test(name)?'Burger':/pizza/i.test(name)?'Pizza':/coke|cola|fanta|sprite|water/i.test(name)?'Drinks':/wrap/i.test(name)?'Wrap':name}
function foodPacket(kind,quantity,label,destination){const g=make('g',{}),box=make('rect',{class:'item-packet-box',x:-72,y:-27,width:144,height:54,rx:10});g.append(box);let tx=-58;if(kind){const art=foodArt(kind,47,43);art.setAttribute('x','-66');art.setAttribute('y','-22');g.append(art);tx=-10}const title=make('text',{class:'item-packet-title',x:tx,y:-2});title.textContent=quantity+' × '+label;const sub=make('text',{class:'item-packet-sub',x:tx,y:14});sub.textContent=destination;g.append(title,sub);return g}
function sendPacket(packet,curve,progress,visible=true){const xy=pointAt(curve,smooth(clamp(progress,0,1)));packet.setAttribute('transform',`translate(${mobile?clamp(xy.x,77,w-77):xy.x} ${xy.y}) scale(${mobile?.86:1})`);packet.setAttribute('opacity',visible&&!reduced.matches&&progress>=0&&progress<=1?String(Math.min(1,progress*9,(1-progress)*9)):'0')}
function brainToStation(station){const end=positionAnchor(anchors.find(a=>a.station===station));return mobile?[source,{x:w*.99,y:source.y+70},{x:w*.99,y:end.y-15},end]:[source,{x:w*.52,y:source.y-20},{x:end.x-20,y:end.y-90},end]}
function showKdsItems(station,number,items,type){const screen=kitchenScreens.find(s=>s.id===station),first=items[0],kind=foodKind(first[1]);screen.waiting=false;screen.started=time;screen.last=-1;screen.el.querySelector('.kds-header strong').textContent=station==='mains'?(kind==='pizza'?'PIZZA':'GRILL'):(kind==='fries'?'FRIES':'SIDES');screen.el.querySelector('.kds-ticket-top b').textContent=number;screen.el.querySelector('.kds-ticket>strong').textContent=first[0]+' × '+first[1];screen.el.querySelector('.kds-ticket>small').textContent=items.length>1?items.slice(1).map(i=>i[0]+' × '+i[1]).join(' · '):type;const photo=screen.el.querySelector('.kds-item-photo');photo.replaceChildren();if(kind)photo.append(foodArt(kind,87,87));}
function clearKds(){for(const screen of kitchenScreens){screen.waiting=true;screen.el.dataset.state='waiting';screen.el.querySelector('.kds-header strong').textContent=screen.title;screen.el.querySelector('.kds-ticket-top b').textContent='—';screen.el.querySelector('.kds-ticket-top span').textContent='WAITING';screen.el.querySelector('.kds-ticket>strong').textContent='Next order';screen.el.querySelector('.kds-ticket>small').textContent='Connected to Maistro';screen.el.querySelector('.kds-item-photo').replaceChildren()}}
const kitchenFlowLayer=make('g',{'data-flow':'kitchen-items'}),kitchenInputPath=make('path',{class:'item-flow-line'}),kitchenBundle=make('g',{});svg.append(kitchenFlowLayer);kitchenFlowLayer.append(kitchenInputPath,kitchenBundle);
kitchenBundle.append(make('rect',{class:'item-packet-box',x:-74,y:-27,width:148,height:54,rx:10}));['burger','fries'].forEach((kind,i)=>{const art=foodArt(kind,43,43);art.setAttribute('x',String(-66+i*44));art.setAttribute('y','-22');kitchenBundle.append(art)});const bundleNumber=make('text',{class:'item-packet-title',x:26,y:5});bundleNumber.textContent='#1051';kitchenBundle.append(bundleNumber);
const kitchenItemRoutes=[{station:'mains',kind:'burger',label:'Burger',destination:'Grill KDS',items:[[1,'Cheeseburger']]},{station:'sides',kind:'fries',label:'Fries',destination:'Fries KDS',items:[[1,'Fries']]}].map((route,i)=>{route.path=make('path',{class:'item-flow-line'+(i?' sides-line':'')});route.packet=foodPacket(route.kind,1,route.label,route.destination);route.dot=make('circle',{class:'item-arrival',r:5});if(i)route.packet.querySelector('rect').style.stroke='#c4adff';kitchenFlowLayer.append(route.path,route.dot,route.packet);return route});
let kitchenElapsed=0,kitchenPhase=-1,kitchenOrderNumber='#1051',kitchenIntroSeen=false,kitchenIntroRemaining=0;
function prepareConceptKitchen(){
 const order=orderExamples[selectedChannel];if(!order||selectedChannel==='signage')return;
 kitchenOrderNumber=order.number;
 kitchenItemRoutes.forEach(r=>{r.path.remove();r.packet.remove();r.dot.remove()});kitchenItemRoutes.length=0;
 for(const r of orderRoutes){const first=r.items[0],kind=foodKind(first[1]),destination=r.station==='mains'?(kind==='pizza'?'Pizza KDS':'Grill KDS'):(kind==='fries'?'Fries KDS':'Sides KDS');const route={station:r.station,kind,label:foodLabel(first[1]),destination,items:r.items,path:make('path',{class:'item-flow-line'}),packet:foodPacket(kind,first[0],foodLabel(first[1]),destination),dot:make('circle',{class:'item-arrival',r:5})};kitchenFlowLayer.append(route.path,route.packet,route.dot);kitchenItemRoutes.push(route)}
 document.querySelector('.kitchen-meal-head strong').textContent='Order '+order.number;document.querySelector('.kitchen-meal-head>span').textContent=order.name;
 const rows=document.querySelector('.kitchen-meal-items');rows.replaceChildren();kitchenItemRoutes.forEach(r=>{const row=document.createElement('div'),photo=document.createElement('span'),title=document.createElement('strong'),sub=document.createElement('small');photo.className='meal-photo';if(r.kind)photo.append(foodArt(r.kind,100,70));title.textContent=r.items[0][0]+' × '+r.items[0][1];sub.textContent=r.destination;row.append(photo,title,sub);rows.append(row)});
 bundleNumber.textContent=order.number;
}

function startKitchenOrder(){if(mobile){prepareConceptKitchen();if(!kitchenIntroSeen){kitchenIntroSeen=true;kitchenIntroRemaining=reduced.matches?0:3600;stage.classList.add('concept-kitchen-intro')}}kitchenElapsed=mobile?2600:0;kitchenPhase=-1;clearKds();anchors.filter(a=>a.station).forEach(a=>a.el.querySelector('.target-label').textContent=a.label)}
document.getElementById('kitchen-send').addEventListener('click',()=>{startKitchenOrder();if(paused&&!reduced.matches){paused=false;updatePause()}});
function drawKitchenOrder(dt){
 kitchenFlowLayer.style.display=current===2?'':'none';if(current!==2)return;
 if(mobile&&kitchenIntroRemaining>0){kitchenFlowLayer.style.display='none';document.getElementById('kitchen-routing-status').textContent='Order '+kitchenOrderNumber+' received from Menu Manager';if(!paused&&!mobileTransition)kitchenIntroRemaining=Math.max(0,kitchenIntroRemaining-dt);if(kitchenIntroRemaining===0)stage.classList.remove('concept-kitchen-intro');return}
 if(!paused&&!reduced.matches)kitchenElapsed+=dt;
 if(kitchenElapsed>12500){if(mobile){if(conceptLoopEnabled&&orderAuto&&!paused&&!reduced.matches&&!mobileTransition&&touchY===null){mobileMove(4);return}}else startKitchenOrder();}

 const t=reduced.matches?9000:kitchenElapsed,phase=t<2600?0:t<3500?1:t<7400?2:3;
 if(phase!==kitchenPhase){kitchenPhase=phase;document.getElementById('kitchen-routing-status').textContent=(mobile?['Order '+kitchenOrderNumber+' received','Maistro routes '+kitchenOrderNumber,kitchenItemRoutes.map(r=>r.label+' → '+r.destination).join(' · '),'Order '+kitchenOrderNumber+' on the kitchen screens ✓']:['Burger + fries → Maistro','Maistro splits the order by kitchen station','Burger → Grill KDS · Fries → Fries KDS','Same order. Two screens. Ready to cook.'])[phase];if(phase===3)kitchenItemRoutes.forEach(route=>{showKdsItems(route.station,kitchenOrderNumber,route.items,'Same order · Cook now');anchors.find(a=>a.station===route.station).el.querySelector('.target-label').textContent=route.destination+' · 1 × '+route.label})}
 const r=document.getElementById('kitchen-meal').getBoundingClientRect(),st=stage.getBoundingClientRect(),from={x:r.right-st.left,y:r.top-st.top+r.height*.45};
 const incoming=mobile?[from,{x:w*.96,y:from.y},{x:w*.97,y:source.y+35},source]:[from,{x:from.x+100,y:from.y-30},{x:source.x+340,y:source.y+20},source];kitchenInputPath.setAttribute('d',curvePath(incoming));kitchenInputPath.style.opacity=phase===0?'.85':'.23';sendPacket(kitchenBundle,incoming,t/2600);
 kitchenItemRoutes.forEach((route,i)=>{const controls=brainToStation(route.station),end=controls[3],progress=(t-3500-i*250)/3300;route.path.setAttribute('d',curvePath(controls));route.path.style.opacity=phase>=2?'.85':'.19';sendPacket(route.packet,controls,progress);route.dot.setAttribute('cx',String(end.x));route.dot.setAttribute('cy',String(end.y));route.dot.setAttribute('opacity',progress>=1?'1':'.12')});brain.classList.toggle('is-routing',phase===1||phase===2);
}

const stockFlowLayer=make('g',{'data-flow':'stock-movements'}),stockUsagePath=make('path',{class:'item-flow-line stock-usage-line'}),stockOrderPath=make('path',{class:'item-flow-line'});svg.append(stockFlowLayer);stockFlowLayer.append(stockUsagePath,stockOrderPath);
function stockPacket(title,lines,outgoing=false){const g=make('g',{}),height=lines.length===1?54:76;g.append(make('rect',{class:'item-packet-box',x:-86,y:-height/2,width:172,height,rx:10}));if(!outgoing)g.querySelector('rect').style.stroke='#bdacf4';const head=make('text',{class:'stock-packet-title'+(outgoing?' stock-order-title':''),x:-72,y:-height/2+18});head.textContent=title;g.append(head);lines.forEach((line,i)=>{const text=make('text',{class:'stock-packet-label',x:-72,y:-height/2+39+i*20});text.textContent=line;g.append(text)});stockFlowLayer.append(g);return g}
const stockCokePacket=stockPacket('STOCK → MAISTRO',['−3 cans of Coke']),stockPepperoniPacket=stockPacket('STOCK → MAISTRO',['−20 g pepperoni']),stockPurchasePacket=stockPacket('MAISTRO → AUTO ORDER',['Coke · 24 cans','Pepperoni · 1 kg'],true);let stockElapsed=0;
function drawStockFlow(dt){
 stockFlowLayer.style.display=current===1?'':'none';if(current!==1)return;if(!paused&&!reduced.matches)stockElapsed+=dt;const t=reduced.matches?9800:stockElapsed%(mobile?18000:13000),end=positionAnchor(anchors.find(a=>a.id==='stock'));
 if(mobile)document.dispatchEvent(new CustomEvent('maistro-stock-tick',{detail:{day:Math.floor(stockElapsed/18000),phase:t<4500?0:t<9300?1:t<13000?2:3}}));
 const usage=mobile?[end,{x:w*.97,y:end.y-150},{x:w*.98,y:source.y+90},source]:[end,{x:end.x-30,y:end.y-155},{x:source.x+280,y:source.y-30},source];
 const purchase=mobile?[source,{x:w*.87,y:source.y+105},{x:w*.87,y:end.y-130},end]:[source,{x:w*.53,y:source.y-3},{x:end.x+40,y:end.y-140},end];
 stockUsagePath.setAttribute('d',curvePath(usage));stockOrderPath.setAttribute('d',curvePath(purchase));stockUsagePath.style.opacity=t<4500?'.85':'.25';stockOrderPath.style.opacity=t>=4500?'.8':'.25';
 sendPacket(stockCokePacket,usage,t/2600);sendPacket(stockPepperoniPacket,usage,(t-1700)/2700);sendPacket(stockPurchasePacket,purchase,(t-4900)/4400);
 if(mobile&&t>=13000)stockPurchasePacket.setAttribute('opacity','0');
 if(t>=9300&&(!mobile||t<13000)){stockPurchasePacket.setAttribute('transform',`translate(${mobile?clamp(end.x-28,92,w-92):end.x-90} ${end.y-(mobile?61:74)}) scale(${mobile?.86:1})`);stockPurchasePacket.setAttribute('opacity','1')}
 const stockLabel=anchors.find(a=>a.id==='stock').el.querySelector('.target-label');stockLabel.textContent=t<4500?'Stock used':t<9300?'Auto ordering':mobile&&t>=13000?'Delivery arrived ✓':'Order sent';stockFlowLayer.dataset.phase=t<4500?'depletion':t<9300?'purchase-order':'sent';
 brain.classList.toggle('is-routing',t>=4400&&t<5600);
}

const staffPeople={alex:{name:'Alex Murphy',initials:'AM',role:'Front of house',shift:'17:00 – 23:00',next:'16:00 – 22:00',accepted:false},mia:{name:'Mia Byrne',initials:'MB',role:'Team lead',shift:'16:30 – 23:00',next:'17:00 – 23:00',accepted:false}};
let selectedStaff='alex',staffElapsed=0,staffAuto=true,staffAcceptedAt=-10000,staffDemoPhase=-1;
function selectStaff(key){selectedStaff=key;const person=staffPeople[key];document.querySelectorAll('[data-staff]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.staff===key)));document.getElementById('staff-avatar').textContent=person.initials;document.getElementById('staff-person-name').textContent=person.name;document.getElementById('staff-role').textContent=person.role;document.getElementById('staff-shift-time').textContent=person.shift;document.getElementById('staff-next-time').textContent=person.next;document.getElementById('shift-state').textContent=person.accepted?'CONFIRMED':'NEW SHIFT';const accept=document.getElementById('accept-shift');accept.disabled=person.accepted;accept.innerHTML=person.accepted?'Shift accepted <span aria-hidden="true">✓</span>':'Accept shift <span aria-hidden="true">✓</span>';document.getElementById('staff-phone').classList.toggle('shift-accepted',person.accepted);document.getElementById('staff-app-feedback').textContent=person.accepted?'Confirmed with Maistro':'New shift from Maistro';const count=2+Object.values(staffPeople).filter(p=>p.accepted).length;document.getElementById('staff-team-status').textContent=count===4?'4 of 4 confirmed · team ready':count+' of 4 shifts confirmed';document.querySelectorAll('.forecast-slots i').forEach((el,i)=>el.classList.toggle('confirmed',i<count));for(const a of anchors.filter(a=>a.member)){a.el.querySelector('.target-label').textContent=staffPeople[a.member].name.split(' ')[0]+(mobile?(staffPeople[a.member].accepted?' ✓':''):(staffPeople[a.member].accepted?' · confirmed':' · staff app'));a.el.setAttribute('aria-label','View '+staffPeople[a.member].name+' in staff app')}}
document.querySelectorAll('[data-staff]').forEach(b=>b.addEventListener('click',()=>{staffAuto=false;selectStaff(b.dataset.staff)}));
function acceptStaffShift(){const person=staffPeople[selectedStaff];if(person.accepted)return;person.accepted=true;staffAcceptedAt=time;selectStaff(selectedStaff);const phone=document.getElementById('staff-phone');phone.classList.remove('accept-flash');void phone.offsetWidth;phone.classList.add('accept-flash');const event=document.getElementById('staff-accept-event');event.textContent=person.name.split(' ')[0]+' accepted ✓';event.classList.add('confirmed');document.getElementById('staff-app').classList.remove('accepting')}
document.getElementById('accept-shift').addEventListener('click',()=>{staffAuto=false;acceptStaffShift()});
function startStaffDemo(){staffElapsed=0;staffAuto=!reduced.matches;staffDemoPhase=-1;staffAcceptedAt=-10000;Object.values(staffPeople).forEach(p=>p.accepted=reduced.matches);selectStaff('alex');document.getElementById('staff-accept-event').textContent=reduced.matches?'Both shifts accepted ✓':'Sending Alex’s shift';document.getElementById('staff-accept-event').classList.toggle('confirmed',reduced.matches)}
document.getElementById('staff-replay').addEventListener('click',()=>{startStaffDemo();if(paused&&!reduced.matches){paused=false;updatePause()}});
const staffFlowLayer=document.getElementById('staff-flow-layer'),staffFlowPath=make('path',{class:'staff-app-connection'}),staffFlowPacket=make('g',{});staffFlowPacket.append(make('rect',{x:-43,y:-12,width:86,height:24,rx:12,class:'data-token'}),make('text',{y:4,class:'token-text'}));staffFlowLayer.append(staffFlowPath,staffFlowPacket);
function drawStaffFlow(dt){
 staffFlowLayer.style.display=current===3?'':'none';if(current!==3)return;
 if(staffAuto&&!paused&&!reduced.matches){staffElapsed+=dt;const phase=staffElapsed<2200?0:staffElapsed<4100?1:staffElapsed<8200?2:staffElapsed<10400?3:staffElapsed<12300?4:5;if(phase!==staffDemoPhase){staffDemoPhase=phase;const event=document.getElementById('staff-accept-event'),app=document.getElementById('staff-app');if(phase===1||phase===4){app.classList.add('accepting');document.getElementById('accept-shift').innerHTML='Accepting shift… <span aria-hidden="true">✓</span>';event.textContent=selectedStaff==='alex'?'Alex is accepting…':'Mia is accepting…'}if(phase===2||phase===5){acceptStaffShift();if(phase===5){event.textContent='Both shifts accepted ✓';staffAuto=false}}if(phase===3){selectStaff('mia');event.textContent='Sending Mia’s shift';event.classList.remove('confirmed')}}}
 const r=document.getElementById('staff-phone').getBoundingClientRect(),st=stage.getBoundingClientRect(),end={x:r.left-st.left-5,y:r.top-st.top+r.height*.38};
 const controls=mobile?[source,{x:9,y:source.y+10},{x:9,y:end.y-45},end]:[source,{x:Math.max(28,r.left-st.left-32),y:source.y+15},{x:Math.max(28,r.left-st.left-32),y:end.y-60},end];
 staffFlowPath.setAttribute('d',curvePath(controls));const accepted=staffPeople[selectedStaff].accepted,phase=accepted?(time-staffAcceptedAt)/2500:((time/3500)%1),xy=pointAt(controls,accepted?1-smooth(clamp(phase,0,1)):smooth(phase));
 const copyTop=document.querySelector('.staff-copy').getBoundingClientRect().top-st.top,copyBottom=document.querySelector('.staff-copy>p').getBoundingClientRect().bottom-st.top,overCopy=mobile&&xy.y>copyTop-15&&xy.y<copyBottom+15;staffFlowPacket.setAttribute('transform',`translate(${mobile?Math.max(46,xy.x):xy.x} ${xy.y}) scale(${mobile?.79:1})`);staffFlowPacket.querySelector('text').textContent=accepted?'✓ ACCEPTED':'SCHEDULE';staffFlowPacket.setAttribute('opacity',overCopy||reduced.matches||phase<0||phase>1?'0':String(Math.min(1,phase*9,(1-phase)*9)));brain.classList.toggle('is-routing',accepted&&phase>.8&&phase<1.3);
}
selectStaff('alex');

const channelOptions={voice:{label:'VOICE',caption:'Voice → Menu Manager → Maistro → kitchen'},pos:{label:'POS',caption:'POS → Menu Manager → Maistro → kitchen'},kiosk:{label:'KIOSK',caption:'Kiosk → Menu Manager → Maistro → kitchen'},signage:{label:'MENU',caption:'Menu Manager → digital signage'},web:{label:'APP + WEB',caption:'App & web → Menu Manager → Maistro → kitchen'},uber:{label:'Uber Eats',logo:'logo-uber',caption:'Uber Eats → Menu Manager → Maistro → kitchen'},deliveroo:{label:'Deliveroo',logo:'logo-deliveroo',caption:'Deliveroo → Menu Manager → Maistro → kitchen'},justeat:{label:'Just Eat',logo:'logo-justeat',caption:'Just Eat → Menu Manager → Maistro → kitchen'}};
const orderExamples={
 voice:{name:'Voice AI',number:'#1042',type:'Collection',items:[[1,'Cheeseburger'],[1,'Fries'],[1,'Coca-Cola']],note:'Voice AI upsell: fries + drink added',station:'grill'},
 pos:{name:'POS',number:'#1043',type:'Dine in',items:[[2,'Margherita pizzas'],[2,'Sparkling waters']],note:'No basil · Table 8',station:'pizza'},
 kiosk:{name:'Kiosk',number:'#1044',type:'Takeaway',items:[[1,'Chicken burger'],[1,'Fries'],[1,'Fanta']],note:'Meal deal selected',station:'grill'},
 web:{name:'App & web',number:'#1045',type:'Delivery',items:[[1,'Pepperoni pizza'],[1,'Garlic dip'],[1,'Coca-Cola']],note:'Ordered direct through your app',station:'pizza'},
 uber:{name:'Uber Eats',number:'#1046',type:'Delivery',items:[[2,'Cheeseburgers'],[1,'Large fries'],[2,'Coke Zeros']],note:'No onions on one burger',station:'grill'},
 deliveroo:{name:'Deliveroo',number:'#1047',type:'Delivery',items:[[1,'Margherita pizza'],[1,'Garlic bread'],[1,'Sprite']],note:'Thin crust · Extra cheese',station:'pizza'},
 justeat:{name:'Just Eat',number:'#1048',type:'Delivery',items:[[1,'Chicken wrap'],[1,'Fries'],[1,'Fanta']],note:'Chilli sauce on the side',station:'grill'},
 signage:{name:'Digital menus',number:'Menu sync',type:'All screens',items:[['','Burger meal'],['','Pizza offer'],['','Cold drinks']],note:'Menus & offers from Menu Manager',station:'pizza'}
};
const orderSequence=['voice','deliveroo','web','kiosk','uber','pos','justeat','signage'];let orderElapsed=0,orderAuto=!reduced.matches,orderPhase=-1,orderRoutes=[];
const orderTicket=document.getElementById('order-ticket'),channelButtons=[...document.querySelectorAll('.channel-picker [data-channel]')],channelLayer=document.getElementById('channel-flow-layer'),channelPath=make('path',{class:'channel-flow'}),channelBrainPath=make('path',{class:'item-flow-line'}),orderItemLayer=make('g',{'data-flow':'order-items'}),channelPacket=make('g',{});
channelLayer.append(channelPath,channelBrainPath,orderItemLayer,channelPacket);
function updateChannelTour(){const button=document.getElementById('channel-tour');button.setAttribute('aria-pressed',String(orderAuto));document.getElementById('channel-tour-symbol').textContent=orderAuto?'Ⅱ':'▶';document.getElementById('channel-tour-label').textContent=orderAuto?'Pause tour':'Resume tour'}
function selectChannel(key,manual=false){
 selectedChannel=key;orderElapsed=0;orderPhase=-1;if(manual){orderAuto=mobile&&!reduced.matches;if(paused&&!reduced.matches){paused=false;updatePause()}}orderTicket.classList.add('is-receiving');updateChannelTour();
 channelButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.channel===key)));const data=channelOptions[key],order=orderExamples[key];document.getElementById('channel-caption').textContent=data.caption;document.getElementById('channel-tour-position').textContent=String(orderSequence.indexOf(key)+1).padStart(2,'0')+' / 08';
 channelPacket.replaceChildren();const bg=make('rect',{class:'channel-packet-bg',x:-44,y:-18,width:88,height:45,rx:9});channelPacket.append(bg);
 const sourceEl=document.getElementById('ticket-source');sourceEl.replaceChildren();sourceEl.dataset.channel=key;
 if(data.logo){if(key==='justeat')bg.style.fill='#fff5ea';const src=document.getElementById(data.logo).getAttribute('src'),logo=make('image',{href:src,x:-34,y:-12,width:68,height:19,preserveAspectRatio:'xMidYMid meet'});channelPacket.append(logo);const img=document.createElement('img');img.src=src;img.alt=order.name;sourceEl.append(img)}
 else{const label=make('text',{class:'channel-packet-label',y:0});label.textContent=data.label;channelPacket.append(label);if(key==='voice')sourceEl.append(document.querySelector('.voice-channel .voice-wave').cloneNode(true));const name=document.createElement('span');name.textContent=order.name;sourceEl.append(name)}
 const packetNumber=make('text',{class:'channel-packet-label',y:19});packetNumber.style.fontSize='10px';packetNumber.textContent=key==='signage'?'UPDATED':order.number;if(key==='justeat')packetNumber.style.fill='#703919';channelPacket.append(packetNumber);
 document.getElementById('ticket-number').textContent=order.number;document.getElementById('ticket-type').textContent=order.type;document.getElementById('ticket-note').textContent=order.note;
 const items=document.getElementById('ticket-items');items.replaceChildren();order.items.forEach(([qty,name])=>{const li=document.createElement('li'),q=document.createElement('b'),label=document.createElement('span');q.textContent=qty?qty+' ×':'—';label.textContent=name;const kind=foodKind(name);if(kind){const photo=document.createElement('span');photo.className='ticket-food';photo.append(foodArt(kind,27,27));li.append(photo)}li.append(q,label);items.append(li)});
 const routeLabels=key==='signage'?['Menu Manager','Published','On screen']:['Menu Manager','Maistro','Kitchen'];document.querySelectorAll('#ticket-route span').forEach((el,i)=>el.textContent=routeLabels[i]);orderTicket.querySelector('.ticket-status small').textContent=key==='signage'?'Example menu':'Example order';
 orderItemLayer.replaceChildren();orderRoutes=[];if(key!=='signage'){clearKds();for(const station of ['mains','sides']){const selected=order.items.filter(item=>(/fries|dip|bread|coke|cola|fanta|sprite|water/i.test(item[1])?'sides':'mains')===station);if(!selected.length)continue;const first=selected[0],kind=foodKind(first[1]),destination=station==='mains'?(kind==='pizza'?'Pizza KDS':'Grill KDS'):(kind==='fries'?'Fries KDS':'Sides KDS');const route={station,items:selected,path:make('path',{class:'item-flow-line'+(station==='sides'?' sides-line':'')}),packet:foodPacket(kind,first[0],foodLabel(first[1]),destination),dot:make('circle',{class:'item-arrival',r:5})};orderItemLayer.append(route.path,route.dot,route.packet);orderRoutes.push(route)}}
}
channelButtons.forEach(b=>b.addEventListener('click',()=>selectChannel(b.dataset.channel,true)));
document.getElementById('channel-tour').addEventListener('click',()=>{orderAuto=!orderAuto;if(orderAuto){orderElapsed=0;orderPhase=-1;if(paused&&!reduced.matches){paused=false;updatePause()}}updateChannelTour()});
function drawOrderTour(dt){
 if(current!==4)return;if(!paused&&!reduced.matches)orderElapsed+=dt;if(mobile&&orderAuto&&!paused&&!reduced.matches&&selectedChannel!=='signage'&&orderElapsed>=6800){mobileMove(2);return;}
 if(orderAuto&&!reduced.matches&&orderElapsed>=(mobile?12500:13500))selectChannel(orderSequence[(orderSequence.indexOf(selectedChannel)+1)%orderSequence.length]);
 const phase=reduced.matches?3:orderElapsed<1700?0:orderElapsed<(mobile?7000:5300)?1:orderElapsed<(mobile?10500:8800)?2:3;
 if(phase!==orderPhase){orderPhase=phase;orderTicket.dataset.phase=String(phase);orderTicket.classList.toggle('is-receiving',phase===0&&selectedChannel!=='signage');document.getElementById('hub-live').textContent=selectedChannel==='signage'?'Menu sync':phase===0?'Receiving…':phase===1?'Order received':'Connected';document.getElementById('hub-waiting').textContent='Incoming from '+orderExamples[selectedChannel].name+'…';document.querySelectorAll('#ticket-route span').forEach((el,i)=>{el.classList.toggle('reached',i<=Math.min(phase,2));el.classList.toggle('current',i===Math.min(Math.max(0,phase-1),2))});const order=orderExamples[selectedChannel];document.getElementById('ticket-status').textContent=selectedChannel==='signage'?['Updating menus','Publishing to screens','Menus & offers are live','Menus & offers are live'][phase]:['Order on its way to Menu Manager','Order received → Maistro','Maistro routes each item','Kitchen received the order ✓'][phase];if(phase===3&&selectedChannel!=='signage')orderRoutes.forEach(route=>showKdsItems(route.station,order.number,route.items,order.type+' · '+order.name))}
 document.getElementById('channel-tour-progress').style.width=(orderAuto?Math.min(100,orderElapsed/(mobile?125:135)):0)+'%';
}
function menuHubPoint(){const r=document.getElementById('hub-heart').getBoundingClientRect(),st=stage.getBoundingClientRect();return{x:r.left-st.left+r.width/2,y:r.top-st.top+r.height/2}}
function drawChannelFlow(){
 channelLayer.style.display=current===4?'':'none';if(current!==4)return;
 const button=channelButtons.find(b=>b.dataset.channel===selectedChannel),r=button.getBoundingClientRect(),st=stage.getBoundingClientRect(),hr=orderTicket.getBoundingClientRect(),menu=menuHubPoint(),s={x:r.left-st.left+r.width/2,y:r.bottom-st.top+3},t=reduced.matches?10000:orderElapsed;
 const top=hr.top-st.top,entry={x:menu.x,y:top+6},incoming=[s,{x:s.x,y:top-15},{x:entry.x,y:top-18},entry];
 const exit={x:hr.right-st.left,y:top+40},corridor=mobile?w-10:Math.max(exit.x+60,w*.49);
 let toBrain=[exit,{x:corridor,y:exit.y},{x:corridor,y:source.y+25},source];
 channelPath.setAttribute('d',curvePath(incoming));channelPath.style.opacity=selectedChannel==='signage'?'0':orderPhase===0?'.8':'.19';
 if(selectedChannel==='signage'){const signage=positionAnchor(anchors.find(a=>a.id==='signage'));toBrain=[exit,{x:corridor,y:exit.y},{x:signage.x+45,y:signage.y-60},signage];channelBrainPath.setAttribute('d',curvePath(toBrain));channelBrainPath.style.opacity='.7';sendPacket(channelPacket,toBrain,t/6000);brain.classList.remove('is-routing');return}
 channelBrainPath.setAttribute('d',curvePath(toBrain));channelBrainPath.style.opacity=orderPhase===1?'.8':'.18';
 if(t<1700)sendPacket(channelPacket,incoming,t/1700);else sendPacket(channelPacket,toBrain,(t-(mobile?4200:2600))/2200);
 orderRoutes.forEach((route,i)=>{const c=brainToStation(route.station),end=c[3],progress=(t-(mobile?7000:5300)-i*200)/3000;route.path.setAttribute('d',curvePath(c));route.path.style.opacity=orderPhase>=2?'.55':'.08';sendPacket(route.packet,c,progress);route.dot.setAttribute('cx',String(end.x));route.dot.setAttribute('cy',String(end.y));route.dot.setAttribute('opacity',progress>=1?'1':'.06')});
 brain.classList.toggle('is-routing',t>=(mobile?6300:4700)&&t<(mobile?8600:6900));
}
const dispatchStatus=document.getElementById('dispatch-status'),dispatchMap=document.getElementById('dispatch-map');
const drivers=[
 {name:'Liam',id:'driver-one',start:[63,88],pickup:[[63,88],[220,88]],scene:[330,1410],crop:[72,21,405,973],order:{number:1052,channel:'deliveroo',kind:'burger',label:'Burger + fries'}},
 {name:'Sofia',id:'driver-two',start:[151,154],pickup:[[151,154],[151,88],[220,88]],scene:[535,1460],crop:[582,66,379,933],order:{number:1053,channel:'web',kind:'pizza',label:'Pizza + 2 Coke'}},
 {name:'Daniel',id:'driver-three',start:[347,172],pickup:[[347,172],[347,154],[260,154],[260,88],[220,88]],scene:[747,1495],crop:[1078,24,408,976],order:{number:1054,channel:'justeat',kind:'fries',label:'2 wraps + fries'}}
];
let selectedDriver=0,dispatchOrder=1052,driverArtId=0;
function driverArt(index,size=48){const crop=[108,781,1467][index],id='driver-crop-'+(++driverArtId),art=make('svg',{viewBox:`${crop} 26 480 480`,width:size,height:size,preserveAspectRatio:'xMidYMid meet','aria-hidden':'true'}),defs=make('defs',{}),clip=make('clipPath',{id,clipPathUnits:'userSpaceOnUse'});clip.append(make('rect',{x:crop,y:26,width:480,height:480}));defs.append(clip);art.append(defs,make('image',{href:document.getElementById('driver-portrait-atlas').getAttribute('src'),width:2030,height:775,'clip-path':`url(#${id})`}));return art}
document.querySelectorAll('[data-driver-portrait]').forEach(el=>el.append(driverArt(Number(el.dataset.driverPortrait))));
drivers.forEach((driver,i)=>{driver.el=document.getElementById(driver.id);driver.el.replaceChildren();driver.el.append(make('circle',{class:'marker-ring',r:19}));const portrait=driverArt(i,34);portrait.setAttribute('x','-17');portrait.setAttribute('y','-18');driver.el.append(portrait);const name=make('text',{class:'marker-name',y:33,'text-anchor':'middle'});name.textContent=driver.name;driver.el.append(name)});
const mapGround=make('g',{});for(const child of [...dispatchMap.children]){if(child.id==='dispatch-route')break;if(child.tagName.toLowerCase()!=='defs')mapGround.append(child)}dispatchMap.insertBefore(mapGround,document.getElementById('dispatch-route'));
const riderAssignments=document.getElementById('rider-assignments'),riderScene=document.getElementById('delivery-riders');
for(const [i,driver] of drivers.entries()){
 const el=document.createElement('div');el.className='scene-courier';el.dataset.sceneDriver=String(i);el.style.left=driver.scene[0]+'px';el.style.top=driver.scene[1]+'px';
 const crop=driver.crop,clipId='courier-clip-'+i,art=make('svg',{viewBox:crop.join(' '),width:108,height:188,preserveAspectRatio:'xMidYMax meet'}),defs=make('defs',{}),clip=make('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'});clip.append(make('rect',{x:crop[0],y:crop[1],width:crop[2],height:crop[3]}));defs.append(clip);art.append(defs,make('image',{href:document.getElementById('scene-driver-atlas').getAttribute('src'),width:1536,height:1024,'clip-path':`url(#${clipId})`}));el.append(art);riderScene.append(el);driver.figure=el;
 const badge=document.createElement('button');badge.type='button';badge.className='rider-assignment';badge.dataset.rider=String(i);badge.setAttribute('aria-pressed','false');badge.setAttribute('aria-label','Assign order '+driver.order.number+' to '+driver.name);badge.innerHTML='<strong>'+driver.name+'</strong><small>Available</small>';badge.addEventListener('click',()=>{selectDriver(i);if(paused&&!reduced.matches){paused=false;updatePause()}});riderAssignments.append(badge);driver.badge=badge;
 const channel=document.querySelector(`[data-driver="${i}"] [data-order-channel]`);if(driver.order.channel!=='web'){const img=document.createElement('img');img.src=document.getElementById('logo-'+driver.order.channel).getAttribute('src');img.alt=orderExamples[driver.order.channel].name;channel.append(img)}
}
const dispatchLayer=make('g',{'data-flow':'driver-dispatch'}),dispatchInput=make('path',{class:'item-flow-line'}),dispatchOutput=make('path',{class:'item-flow-line'}),dispatchPacket=make('g',{}),driverPhonePulse=make('circle',{class:'driver-phone-pulse',r:5});dispatchLayer.append(dispatchInput,dispatchOutput,driverPhonePulse,dispatchPacket);svg.append(dispatchLayer);
function selectDriver(index){
 selectedDriver=index;dispatchElapsed=0;dispatchPhase=-1;dispatchOrder=drivers[index].order.number;
 const order=drivers[index].order;dispatchPacket.replaceChildren();dispatchPacket.append(make('rect',{class:'item-packet-box',x:-72,y:-26,width:144,height:52,rx:10}));const photo=foodArt(order.kind,41,40);photo.setAttribute('x','-66');photo.setAttribute('y','-20');dispatchPacket.append(photo);const number=make('text',{class:'dispatch-order-label',x:-17,y:-4});number.textContent='#'+order.number;const description=make('text',{class:'dispatch-food-label',x:-17,y:13});description.textContent=order.label;dispatchPacket.append(number,description);
 document.querySelectorAll('[data-driver]').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===index));b.querySelector('.driver-state').textContent=i===index?'Matching…':drivers[i].result||'Ready'});
 drivers.forEach((d,i)=>{d.el.classList.toggle('selected-driver',i===index);d.figure.classList.remove('is-assigned');d.badge.setAttribute('aria-pressed',String(i===index));d.badge.classList.remove('receiving');if(i===index){d.result=null;d.badge.classList.remove('accepted');d.badge.querySelector('small').textContent=mobile?'#'+order.number+' · Pending':'Waiting for #'+order.number}});
}
document.querySelectorAll('[data-driver]').forEach(b=>b.addEventListener('click',()=>{selectDriver(Number(b.dataset.driver));if(paused&&!reduced.matches){paused=false;updatePause()}}));
document.getElementById('dispatch-replay').addEventListener('click',()=>{selectDriver(selectedDriver);if(paused&&!reduced.matches){paused=false;updatePause()}});
function routePosition(points,progress){const lengths=points.slice(1).map((point,i)=>Math.hypot(point[0]-points[i][0],point[1]-points[i][1]));let left=clamp(progress,0,1)*lengths.reduce((a,b)=>a+b,0);for(let i=0;i<lengths.length;i++){if(left<=lengths[i]||i===lengths.length-1){const t=lengths[i]?left/lengths[i]:0;return{x:mix(points[i][0],points[i+1][0],t),y:mix(points[i][1],points[i+1][1],t)}}left-=lengths[i]}return{x:points[0][0],y:points[0][1]}}
function drawDispatch(dt){
 dispatchLayer.style.display=current===5?'':'none';riderAssignments.hidden=current!==5;if(current!==5)return;if(!paused&&!reduced.matches)dispatchElapsed+=dt;if(dispatchElapsed>=14500)selectDriver((selectedDriver+1)%3);
 const t=reduced.matches?11100:dispatchElapsed,phase=t<1900?0:t<2600?1:t<4800?2:t<6800?3:t<11000?4:5,driver=drivers[selectedDriver],scaleY=mobile?1.85:1;
 dispatchMap.setAttribute('viewBox',`0 -5 420 ${mobile?405:218}`);mapGround.setAttribute('transform',`scale(1 ${scaleY})`);dispatchMap.querySelector('.map-restaurant').setAttribute('transform',`translate(220 ${88*scaleY})`);document.getElementById('map-customer').setAttribute('transform',`translate(367 ${42*scaleY})`);
 const delivery=[[220,88],[260,88],[260,42],[367,42]],d=delivery.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]*scaleY).join(' '),route=document.getElementById('dispatch-route'),routeSoft=document.getElementById('dispatch-route-soft');route.setAttribute('d',d);routeSoft.setAttribute('d',d);route.style.opacity=phase>=1?'.9':'.14';routeSoft.style.opacity=phase>=1?'.22':'.05';
 const roamingRoutes=[[[18,88],[87,88],[87,20],[151,20],[151,88],[87,88]],[[151,154],[151,198],[260,198],[260,154],[151,154]],[[347,172],[347,154],[260,154],[260,88],[347,88],[347,154],[410,154]]],roamTime=(t/7200)%1,waiting={x:220,y:112};
 drivers.forEach((person,i)=>{let xy=routePosition(roamingRoutes[i],(roamTime+i*.31)%1);const waitingHere=i===selectedDriver&&phase>=1;if(waitingHere)xy=waiting;person.el.classList.toggle('assigned-waiting',waitingHere);person.el.setAttribute('transform',`translate(${xy.x} ${xy.y*scaleY})`);person.badge.style.setProperty('--rider-hit',188*cam.scale+'px');person.badge.style.left=clamp(cam.x+person.scene[0]*cam.scale,mobile?48:64,w-(mobile?48:64))+'px';person.badge.style.top=cam.y+person.scene[1]*cam.scale+(mobile?5:9)+'px'});
 const waitingTag=document.getElementById('driver-waiting-tag');waitingTag.setAttribute('transform',`translate(220 ${132*scaleY})`);waitingTag.setAttribute('opacity',phase>=1?'1':'0');
 if(phase!==dispatchPhase){dispatchPhase=phase;const row=document.querySelector(`[data-driver="${selectedDriver}"]`);row.querySelector('.driver-state').textContent=['Matching…','Selected','Sent','Waiting outside ✓','Ready to collect','Assigned ✓'][phase];dispatchStatus.textContent=['Order #'+dispatchOrder+' → Maistro','Maistro selects '+driver.name,'#'+dispatchOrder+' sent to '+driver.name,driver.name+' is waiting outside the restaurant','#'+dispatchOrder+' ready for collection','Driver assigned · next order'][phase];dispatchLayer.dataset.phase=['received','selected','sent','waiting','collecting','assigned'][phase];driver.badge.querySelector('small').textContent=mobile?(phase<1?'#'+dispatchOrder+' · Pending':'#'+dispatchOrder+' · Outside'):(phase<1?'Waiting for #'+dispatchOrder:'#'+dispatchOrder+' · Waiting outside');driver.figure.classList.toggle('is-assigned',phase>=2);driver.badge.classList.toggle('accepted',phase>=3);driver.badge.classList.toggle('receiving',phase===2);if(phase>=3)driver.result='Waiting outside ✓';}
 const st=stage.getBoundingClientRect(),row=document.querySelector(`[data-driver="${selectedDriver}"]`).getBoundingClientRect(),from={x:row.right-st.left,y:row.top-st.top+row.height/2},end={x:cam.x+(driver.scene[0]+18)*cam.scale,y:cam.y+(driver.scene[1]-112)*cam.scale};
 const incoming=mobile?[from,{x:w+70,y:from.y},{x:w+70,y:source.y+15},source]:[from,{x:from.x+50,y:from.y-40},{x:source.x+330,y:source.y+15},source],outgoing=mobile?[source,{x:w+30,y:source.y+90},{x:w+30,y:end.y-85},end]:[source,{x:w*.66,y:source.y+5},{x:end.x+30,y:end.y-140},end];
 dispatchInput.setAttribute('d',curvePath(incoming));dispatchOutput.setAttribute('d',curvePath(outgoing));dispatchInput.style.opacity=phase===0?'.8':'.14';dispatchOutput.style.opacity=phase===2?'.9':phase>=3?'.48':'.14';if(t<1900)sendPacket(dispatchPacket,incoming,t/1900);else sendPacket(dispatchPacket,outgoing,(t-2600)/2200);driverPhonePulse.setAttribute('cx',end.x);driverPhonePulse.setAttribute('cy',end.y);driverPhonePulse.setAttribute('opacity',phase>=3?'1':'.15');driverPhonePulse.setAttribute('r',phase===3&&!paused?String(4+Math.sin(t/180)*2):'4');brain.classList.toggle('is-routing',phase===1||phase===2);
}
function drawDemos(dt){drawDispatch(dt);if(current===6&&taskRunning){if(!paused)taskElapsed+=dt;const step=reduced.matches?3:Math.min(3,Math.floor(taskElapsed/650));if(step!==taskStep){taskStep=step;document.querySelectorAll('#agent-tasks li').forEach((li,i)=>li.classList.toggle('done',i<step));document.getElementById('agent-status').textContent=step===3?'Prep tasks created and added to the kitchen queue.':'Building tomorrow’s kitchen plan…';if(step===3)taskRunning=false}}}
function chooseAgent(mode){hqMode=mode;taskRunning=false;document.querySelectorAll('[data-agent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agent===mode)));document.getElementById('agent-report').hidden=mode!=='report';document.getElementById('agent-tasks').hidden=mode!=='task';if(mode==='report'){showReport(document.querySelector('[data-report="sales"]'))}else{document.getElementById('agent-prompt').textContent='“Create tomorrow’s kitchen prep tasks.”';document.getElementById('agent-status').textContent='Building tomorrow’s kitchen plan…';document.querySelectorAll('#agent-tasks li').forEach(li=>li.classList.remove('done'));taskElapsed=0;taskStep=-1;taskRunning=true}}
document.querySelectorAll('[data-agent]').forEach(b=>b.addEventListener('click',()=>chooseAgent(b.dataset.agent)));
selectChannel('voice');
const reportButtons=[...document.querySelectorAll('[data-report]')],reportBars=[...document.querySelectorAll('.report-bar')];
const reports={sales:{bars:[37,49,42,61,87,94,72],caption:'Sales by day'},labour:{bars:[46,46,52,56,74,85,65],caption:'Staff hours by day'},stock:{bars:[28,36,32,49,73,85,57],caption:'Stock usage by day'}};
function showReport(button){const key=button.dataset.report,data=reports[key];reportButtons.forEach(b=>{const selected=b===button;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});reportBars.forEach((bar,i)=>bar.style.setProperty('--bar',data.bars[i]+'%'));document.getElementById('report-panel').setAttribute('aria-labelledby',button.id);document.querySelector('.report-chart').setAttribute('aria-label','Illustrative '+data.caption.toLowerCase()+' across one week');document.getElementById('report-caption').textContent=data.caption;if(hqMode==='report'){const subject={sales:'sales',labour:'staff hours',stock:'stock usage'}[key];document.getElementById('agent-prompt').textContent='“Show this week’s '+subject+' across my locations.”';document.getElementById('agent-status').textContent='Your '+subject+' report is ready.'}}
reportButtons.forEach((button,i)=>{button.addEventListener('click',()=>showReport(button));button.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%reportButtons.length;else if(e.key==='ArrowLeft')next=(i+reportButtons.length-1)%reportButtons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=reportButtons.length-1;else return;e.preventDefault();showReport(reportButtons[next]);reportButtons[next].focus()})});

const marginVisual=document.getElementById('margin-visual'),marginArticle=document.querySelector('.margins-copy'),marginSlider=document.getElementById('margin-growth'),profitWord=document.getElementById('profit-word');
const marginParts=Object.fromEntries(['profit-area','profit-depth','profit-clip-path','sales-curve','costs-curve','sales-halo','costs-halo','margin-bracket','sales-end','costs-end','sales-label','costs-label'].map(id=>[id,document.getElementById(id)]));
const marginLink=make('g',{}),marginInputPath=make('path',{class:'margin-input-line'}),marginInputBits=[0,1].map(i=>matchMedia('(max-width:760px)').matches?readablePacket(i?'Cost update':'Sales data'):make('text',{class:'margin-input-bit'}));marginLink.append(marginInputPath,...marginInputBits);svg.append(marginLink);
const marginContours=Array.from({length:5},()=>{const path=make('path',{class:'profit-contour'});document.getElementById('profit-contours').append(path);return path});
const marginSparks=Array.from({length:10},(_,i)=>{const dot=make('circle',{class:'profit-spark',r:i<6?2.1:1.2});document.getElementById('profit-particles').append(dot);return dot});
let marginProgress=0,marginElapsed=0,marginAuto=true,marginMode=-1;
document.addEventListener('maistro-margin-mode',e=>{if(!mobile)return;marginMode=Number(e.detail);marginElapsed=0;marginProgress=reduced.matches?1:0;marginAuto=!reduced.matches;if(paused&&!reduced.matches){paused=false;updatePause()}drawMargins(0)});
function startMarginGrowth(){marginElapsed=0;marginProgress=reduced.matches?1:0;marginAuto=!reduced.matches;document.getElementById('margin-replay').hidden=reduced.matches}
function curvePath(c){return `M${c[0].x} ${c[0].y} C${c[1].x} ${c[1].y} ${c[2].x} ${c[2].y} ${c[3].x} ${c[3].y}`}
function drawMargins(dt){
 marginLink.style.display=current===7?'':'none';if(current!==7)return;
 if(marginAuto&&!paused){marginElapsed=Math.min(mobile?9000:32000,marginElapsed+dt);marginProgress=marginElapsed/(mobile?9000:32000);if(marginProgress===1)marginAuto=false}
 const g=(1-Math.exp(-2.8*marginProgress))/(1-Math.exp(-2.8)),top=204-g*(mobile&&marginMode>0?25:155),bottom=236+g*(mobile&&marginMode===0?25:149);
 const upper=[{x:40,y:211},{x:290,y:211},{x:515,y:top+22},{x:870,y:top}],lower=[{x:40,y:229},{x:290,y:229},{x:515,y:bottom-22},{x:870,y:bottom}];
 const up=curvePath(upper),down=curvePath(lower),area=`${up} L870 ${bottom} C515 ${bottom-22} 290 229 40 229 Z`;
 for(const id of ['profit-area','profit-depth','profit-clip-path'])marginParts[id].setAttribute('d',area);
 for(const id of ['sales-curve','sales-halo'])marginParts[id].setAttribute('d',up);
 for(const id of ['costs-curve','costs-halo'])marginParts[id].setAttribute('d',down);
 marginParts['margin-bracket'].setAttribute('d',`M919 ${top} H931 V${bottom} H919`);
 for(const [id,y]of [['sales-end',top],['costs-end',bottom]]){marginParts[id].setAttribute('cx','870');marginParts[id].setAttribute('cy',String(y))}
 marginParts['sales-label'].style.top=top/440*100+'%';marginParts['costs-label'].style.top=bottom/440*100+'%';
 marginContours.forEach((path,i)=>{const f=(i+1)/6,c=upper.map((a,j)=>({x:a.x,y:mix(a.y,lower[j].y,f)}));path.setAttribute('d',curvePath(c));path.style.opacity=String(.035+g*.08)});
 marginSparks.forEach((dot,i)=>{const phase=((time/(i<6?5800:10500))+i*.143)%1,f=i<3?0:i<6?1:(i-5)/5,c=upper.map((a,j)=>({x:a.x,y:mix(a.y,lower[j].y,f)})),xy=pointAt(c,phase);dot.setAttribute('cx',String(xy.x));dot.setAttribute('cy',String(xy.y));dot.setAttribute('opacity',reduced.matches?'0':String(Math.min(1,phase*8,(1-phase)*8)*(i<6?.85:.3))) });
 profitWord.style.transform=`translate(-50%,-50%) scale(${.38+g*.62})`;profitWord.style.opacity=String(.55+g*.45);marginArticle.style.setProperty('--growth',g.toFixed(4));
 const percent=Math.round(marginProgress*100);marginSlider.value=String(percent);marginSlider.style.setProperty('--fill',percent+'%');marginSlider.setAttribute('aria-valuetext',percent===100?'Fully expanded margin':percent===0?'Starting margin':percent+' percent through the growth animation');
 const r=marginVisual.getBoundingClientRect(),st=stage.getBoundingClientRect(),end={x:r.left-st.left+r.width*.04,y:r.top-st.top+r.height*.5};
 const link=mobile?[source,{x:source.x,y:r.top-st.top-32},{x:18,y:r.top-st.top-25},end]:[source,{x:source.x-45,y:source.y+90},{x:end.x-40,y:end.y-80},end];marginInputPath.setAttribute('d',curvePath(link));
 marginInputBits.forEach((bit,i)=>{const phase=((time/4900)+i*.5)%1,xy=pointAt(link,smooth(phase));if(!mobile)bit.textContent=i?'0101':'1010';bit.setAttribute('transform',`translate(${xy.x-14} ${xy.y})`);bit.setAttribute('opacity',reduced.matches?'0':String(Math.min(1,phase*8,(1-phase)*8)*.9))});
}
marginSlider.addEventListener('input',()=>{marginAuto=false;marginProgress=Number(marginSlider.value)/100;marginElapsed=marginProgress*32000;drawMargins(0)});
document.getElementById('margin-replay').addEventListener('click',()=>{startMarginGrowth();if(paused&&!reduced.matches){paused=false;updatePause()}drawMargins(0)});
function frame(now){const dt=Math.min(1000,now-(last||now));last=now;if(visible){if(mobile){if(mobileTransition){const progress=mobileTransition.duration?clamp((now-mobileTransition.start)/mobileTransition.duration,0,1):1;p=mix(mobileTransition.from,mobileTransition.to,smooth(progress));draw(0);if(progress===1)finishMobileMove()}else draw(dt);requestAnimationFrame(frame);return}p=reduced.matches?scrollTarget:p+(scrollTarget-p)*(1-Math.exp(-dt/115));if(Math.abs(scrollTarget-p)<.0005)p=scrollTarget;setState(clamp(Math.round(p),0,lastStep));draw(dt)}requestAnimationFrame(frame)}
resize();setState(0);requestAnimationFrame(frame);
})();

/* cinematic-mobile.js */
(()=>{
 if(!matchMedia('(max-width:760px)').matches)return;
 const stage=document.getElementById('stage')||document.querySelector('.stage');
 const titles=['Your restaurant','Stock','Kitchen','Staff','Menu Manager','Delivery','HQ','Margins'],steps=[0,1,4,2,3,5,6,7];
 const descriptions=['One AI brain connects your tools, data and decisions. Talk to your business. Grow your margins.','Forecast demand, see live stock and automatically reorder. Menu Manager records recipe-level usage so you know your real costs and margins.','An order reaches Maistro. The burger goes to Grill KDS and the fries go to Fries KDS.','Maistro forecasts how many staff you need and sends their shifts. Watch Alex and Mia accept in the staff app.','Voice AI, your app and website, POS, kiosk and delivery marketplaces send orders to Menu Manager. Maistro routes each item to the kitchen. Digital menus receive updated offers.','Maistro assigns each order to a driver. Watch the order travel through the brain to the drivers outside the restaurant.','Talk to your business with Maistro’s agentic AI. Create reports and run tasks across your empire.','More sales and lower operating costs create more room for profit. This animation illustrates the effect; it is not a forecast.'];
 const controls=document.createElement('div');controls.className='mobile-controls';controls.innerHTML='<button aria-label="Previous section">←</button><select aria-label="Restaurant section">'+steps.map((i,n)=>'<option value="'+i+'">'+(n+1)+' · '+titles[i]+'</option>').join('')+'</select><button aria-label="Replay section">↻</button><button aria-label="Next section">→</button>';document.body.append(controls);
 const [prev,replay,next]=controls.querySelectorAll('button'),select=controls.querySelector('select');
 const details=document.createElement('button');details.className='mobile-details';details.textContent='Details +';document.body.append(details);
 const dialog=document.createElement('dialog');dialog.id='mobile-info';dialog.innerHTML='<h2></h2><p></p><button>Back to the restaurant</button>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();details.onclick=()=>{dialog.querySelector('h2').textContent=titles[index];dialog.querySelector('p').textContent=descriptions[index];dialog.showModal()};
 let index=0,timer;function reveal(){clearTimeout(timer);stage.classList.remove('mobile-playing');timer=setTimeout(()=>stage.classList.add('mobile-playing'),4200)}
 function update(){index=Number(stage.dataset.chapter||0);select.value=index;prev.disabled=index===0;next.disabled=index===7;reveal()}
 const go=i=>document.querySelector('.chapter-nav [data-go="'+i+'"]').click();prev.onclick=()=>go(steps[steps.indexOf(index)-1]);next.onclick=()=>go(steps[steps.indexOf(index)+1]);select.onchange=()=>go(Number(select.value));
 replay.onclick=()=>{reveal();const id={2:'kitchen-send',3:'staff-replay',5:'dispatch-replay',7:'margin-replay'}[index];if(id)document.getElementById(id).click();if(index===4)document.querySelector('.channel-button[aria-pressed=true]').click()};
 new MutationObserver(update).observe(stage,{attributes:true,attributeFilter:['data-chapter']});update();
 const picker=document.querySelector('.channel-picker');picker.title='Tap to try the next channel';picker.addEventListener('click',e=>{if(!e.isTrusted)return;const buttons=[...picker.querySelectorAll('button')],i=buttons.findIndex(b=>b.getAttribute('aria-pressed')==='true');buttons[(i+1)%buttons.length].click()});
})();
(()=>{if(!matchMedia('(max-width:760px)').matches)return;const article=document.querySelector('.margins-copy'),stage=document.querySelector('.stage');const strip=document.createElement('div');strip.className='margin-levers';strip.innerHTML='<button type="button" aria-pressed="true"><span>↗</span>Sales</button><button type="button" aria-pressed="false"><span>↓</span>Stock costs</button><button type="button" aria-pressed="false"><span>↓</span>Staff costs</button><p class="margin-reason" aria-live="polite">Voice AI adds a relevant upsell.</p>';article.append(strip);const lines=['Sales rise. Your profit grows.','Less stock waste. Lower costs.','Smarter shifts. Lower labour costs.'];let current=0,manualUntil=0;function set(i){current=i;strip.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));strip.querySelector('p').textContent=lines[i];document.getElementById('margin-visual').dataset.lever=i;document.dispatchEvent(new CustomEvent('maistro-margin-mode',{detail:i}))}strip.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{set(i);manualUntil=Infinity});setInterval(()=>{if(stage.dataset.chapter==='7'&&!document.hidden&&!document.body.classList.contains('paused')&&Date.now()>manualUntil)set((current+1)%3)},13000)})();
document.addEventListener('maistro-moving',e=>{const controls=document.querySelector('.mobile-controls');if(!controls)return;controls.querySelectorAll('button,select').forEach(b=>b.disabled=e.detail);if(!e.detail){const i=Number(document.querySelector('.stage').dataset.chapter);controls.querySelector('[aria-label="Previous section"]').disabled=i===0;controls.querySelector('[aria-label="Next section"]').disabled=i===7;controls.querySelector('select').value=i}});

(()=>{if(!matchMedia('(max-width:760px)').matches)return;
 document.querySelector('#intro h1').innerHTML='Talk to your business.<br><em>Grow your margins.</em>';
 const forecast=document.getElementById('open-forecast');
 const schedule=document.createElement('div');schedule.className='stock-schedule';
 let lastStockState='';
 function stockSchedule(day,phase){const key=day+':'+phase;if(key===lastStockState)return;lastStockState=key;
 const first=Math.floor(day/3)*3,active=day%3,dates=Array.from({length:3},(_,i)=>new Date(Date.UTC(2026,8,28+first+i)));
 const products=[{name:'Coke',unit:'cans',levels:[10,7,2,26],full:30,planned:[8,12,9],arrived:26},{name:'Pepperoni',unit:'grams',levels:[300,280,80,1080],full:1200,planned:[240,320,280],arrived:1080}];
 const rows=products.map(p=>'<div class="product-name">'+p.name+'<small>'+p.unit+'</small></div>'+dates.map((_,i)=>{const value=i===active?p.levels[phase]:i<active?p.arrived:p.planned[i];const state=i===active?(phase===3?'arrived':phase>0?'low':'live'):i<active?'past':'forecast';return '<div class="product-quantity '+state+'"><strong>'+value.toLocaleString('en-IE')+'</strong><span class="stock-meter"><i style="width:'+Math.min(100,value/p.full*100)+'%"></i></span></div>'}).join('')).join('');
 schedule.dataset.stockPhase=phase;
 schedule.innerHTML='<div class="schedule-head"><span>Stock forecast</span><small>EXAMPLE</small></div><div class="product-grid"><span class="product-column">Products</span>'+dates.map((d,i)=>'<b class="product-day '+(i===active?'active':'')+'">'+d.toLocaleDateString('en-IE',{weekday:'short',timeZone:'UTC'}).toUpperCase()+'</b>').join('')+rows+'</div><div class="jit-status" role="status"><span class="jit-dot"></span><strong>'+['Orders coming in','Running low · auto order sent','Delivery on its way','Arrived just in time ✓'][phase]+'</strong></div><div class="jit-detail">'+['Live usage updates the forecast','24 cans + 1 kg ordered by Maistro','2 cans left · delivery due before zero','+24 cans · +1 kg received'][phase]+'</div><div class="jit-legend"><span>Solid: on hand · Faded: forecast</span><b>Explore ↗</b></div>';
 }
 document.addEventListener('maistro-stock-tick',e=>stockSchedule(e.detail.day,e.detail.phase));stockSchedule(0,0);
 forecast.append(schedule);
 const capture=document.createElement('div');capture.className='capture-label';capture.innerHTML='<i></i> Capturing live data';document.querySelector('.stage').append(capture);
})();

(()=>{if(!matchMedia('(max-width:760px)').matches)return;const footer=document.querySelector('.kitchen-meal-footer');const next=document.createElement('button');next.textContent='Next order →';next.onclick=()=>document.querySelector('.chapter-nav [data-go="4"]').click();footer.append(next);document.querySelector('.kitchen-meal-footer>span').style.display='none';})();
(()=>{if(!matchMedia('(max-width:760px)').matches)return;
 const stage=document.querySelector('.stage'),article=document.querySelector('.margins-copy'),heading=article.querySelector('.margin-heading h2');
 heading.innerHTML='More profit.<br><em>Automatically.</em>';
 const story=document.createElement('div');story.className='profit-story';story.setAttribute('aria-live','polite');story.innerHTML='<div class="profit-event"><i></i><div><small>MAISTRO ACTS</small><strong></strong><span></span></div></div><div class="profit-progress" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
 article.append(story);
 const steps=[
  ['Sales increased','Voice AI added a drink','+ €4.50'],
  ['Waste avoided','Forecast matched demand','− €18.00'],
  ['Shift optimised','Two quiet hours removed','− 2 hours'],
  ['More profit stays yours','Sales up. Costs down.','PROFIT ↑']
 ];
 let step=0,last=-1,started=0;
 function show(i){step=i;const data=steps[i],box=story.querySelector('.profit-event');box.classList.remove('show');void box.offsetWidth;box.querySelector('strong').textContent=data[0];box.querySelector('span').textContent=data[1];box.querySelector('small').textContent=data[2];box.classList.add('show');story.querySelectorAll('.profit-progress i').forEach((el,j)=>el.classList.toggle('active',j<=i));document.dispatchEvent(new CustomEvent('maistro-margin-mode',{detail:-1}));}
 function start(){started=performance.now();last=-1;show(0);const replay=document.getElementById('margin-replay');replay.hidden=false}
 new MutationObserver(()=>{if(stage.dataset.chapter==='7')start()}).observe(stage,{attributes:true,attributeFilter:['data-chapter']});
 setInterval(()=>{if(stage.dataset.chapter!=='7'||document.body.classList.contains('paused'))return;const elapsed=performance.now()-started,i=Math.min(3,Math.floor(elapsed/3200));if(i!==last){last=i;show(i)}if(elapsed>15000)start()},250);
 document.getElementById('margin-replay').addEventListener('click',start);
})();

/* hq-mobile.js */
(()=>{
if(!matchMedia('(max-width:760px)').matches)return;
const stage=document.querySelector('.stage'),brain=document.getElementById('brain'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
const panel=document.createElement('section');panel.className='hq-demo';panel.hidden=true;panel.setAttribute('aria-label','Maistro agent demonstration');panel.innerHTML='<div class="hq-demo-head">New request</div><p class="hq-demo-request"></p><div class="hq-demo-status" role="status"></div><div class="hq-demo-result"></div>';stage.append(panel);
const ns='http://www.w3.org/2000/svg',flow=document.createElementNS(ns,'svg');flow.classList.add('hq-data');flow.setAttribute('aria-hidden','true');flow.hidden=true;flow.innerHTML='<path/><g><rect x="-54" y="-16" width="108" height="32" rx="8"/><text y="4"></text></g>';stage.append(flow);const path=flow.querySelector('path'),packet=flow.querySelector('g');
const request=panel.querySelector('.hq-demo-request'),status=panel.querySelector('.hq-demo-status'),result=panel.querySelector('.hq-demo-result'),buttons=[...panel.querySelectorAll('button')];
const demos=[{prompt:'Create my sales dashboard.',send:'Dashboard request',back:'Dashboard ready',done:'Dashboard created ✓',html:'<div class="hq-result-title">Sales dashboard · This week</div><div class="hq-mini-bars">'+[34,49,42,61,86,96,72].map(h=>'<i style="--h:'+h+'%"></i>').join('')+'</div><div class="hq-mini-foot"><span>All locations</span><span>Sales · Labour · Stock</span></div>'},{prompt:'Add Alex Murphy to my team.',send:'Add staff request',back:'Staff record',done:'Staff member added ✓',html:'<div class="hq-staff-card"><span class="hq-staff-avatar">AM</span><div><strong>Alex Murphy</strong><small>Front of house · Main restaurant</small></div></div><div class="hq-success">✓ Staff profile created</div>'},{prompt:'Change the cheeseburger price to €8.50.',send:'Price change',back:'Menu update',done:'Price updated across channels ✓',html:'<div class="hq-result-title">Cheeseburger</div><div class="hq-price"><del>€8.00</del><span>→</span><strong>€8.50</strong></div><div class="hq-success">✓ Menu Manager synced</div>'}];
let index=0,elapsed=0,last=0,phase=-1,active=false;
function choose(i){index=i;elapsed=0;phase=-1;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));request.textContent='“'+demos[i].prompt+'”';result.innerHTML=demos[i].html;result.classList.add('pending');setPhase(reduce.matches?4:0)}
function setPhase(p){if(phase===p)return;phase=p;panel.dataset.phase=String(p);panel.querySelector('.hq-demo-head').textContent=p===0?'New request':p===4?'Task complete':'Maistro is on it';status.textContent=['','Sending to Maistro…','Running the task…','Receiving the result…',demos[index].done,''][p];result.classList.toggle('pending',p!==4);result.setAttribute('aria-hidden',String(p!==4));if(p===4)result.innerHTML=demos[index].html;packet.querySelector('text').textContent=p===1?demos[index].send:demos[index].back}

function sync(){const next=stage.dataset.chapter==='6'&&!stage.classList.contains('mobile-moving');panel.hidden=!next;flow.style.display=next?'':'none';if(next&&!active)choose(0);active=next}new MutationObserver(sync).observe(stage,{attributes:true,attributeFilter:['data-chapter','class']});buttons.forEach((b,i)=>b.onclick=()=>choose(i));document.querySelector('[aria-label="Replay section"]').addEventListener('click',()=>{if(active)choose(index)});sync();
function frame(now){const dt=last?Math.min(now-last,100):0;last=now;if(active&&!document.hidden){const paused=document.body.classList.contains('paused')||document.querySelector('dialog[open]');if(!paused&&!reduce.matches)elapsed+=dt;if(elapsed>14500)choose((index+1)%3);const p=reduce.matches?4:elapsed<2400?0:elapsed<4400?1:elapsed<6500?2:elapsed<8500?3:elapsed<13200?4:5;setPhase(p);const st=stage.getBoundingClientRect(),a=panel.getBoundingClientRect(),b=brain.getBoundingClientRect(),x0=a.right-st.left-24,y0=a.top-st.top+12,x1=b.left-st.left+b.width*.5,y1=b.bottom-st.top-12,cx=stage.clientWidth-17;flow.setAttribute('viewBox','0 0 '+stage.clientWidth+' '+stage.clientHeight);path.setAttribute('d',`M${x0} ${y0} C${cx} ${y0-70} ${cx} ${y1+50} ${x1} ${y1}`);let t=p===1?(elapsed-2400)/2000:p===3?1-(elapsed-6500)/2000:0;const u=1-t,x=u*u*u*x0+3*u*u*t*cx+3*u*t*t*cx+t*t*t*x1,y=u*u*u*y0+3*u*u*t*(y0-70)+3*u*t*t*(y1+50)+t*t*t*y1;packet.setAttribute('transform',`translate(${x} ${y})`);packet.style.opacity=p===1||p===3?'1':'0'}requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();
