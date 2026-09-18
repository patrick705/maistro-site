(() => {
  const $ = s => document.querySelector(s);
  const story=$('.story'), stage=$('.stage'),world=$('.world'),agent=$('.maistro'),figure=$('.agent-figure'),lines=$('.connections');
  const chapters=[...document.querySelectorAll('.chapter')],ticks=[...document.querySelectorAll('.tick')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
  const states = [
    {name:'Financial Hub',color:'#68e8f7',panel:'.financial-hub-card',focus:.145,side:'right',targets:[[.28,.105],[.48,.155],[.68,.105],[.57,.238]]},
    {name:'Stock',color:'#78dbe8',panel:'.stock-card',focus:.405,side:'left',targets:[[.37,.337],[.51,.342],[.67,.345],[.20,.422],[.42,.422],[.63,.431],[.31,.492],[.61,.505]]},
    {name:'Menu',color:'#b5a0ff',panel:'.menu-card',focus:.625,side:'right',targets:[[.25,.625],[.39,.642],[.31,.684],[.44,.689],[.56,.652],[.39,.542],[.57,.555],[.72,.57]]},
    {name:'Staff',color:'#c6ef78',panel:'.staff-card',focus:.79,side:'left',targets:[[.28,.556],[.44,.565],[.60,.575],[.74,.596],[.29,.667],[.53,.676],[.67,.695],[.21,.754],[.42,.781],[.63,.797],[.79,.823],[.52,.865]]},
    {name:'Direct sales',color:'#68e8f7',panel:'.driver-card',focus:.955,side:'right',targets:[[.09,.928],[.22,.943],[.34,.963],[.49,.951],[.61,.971],[.75,.939],[.84,.961],[.93,.929]]}
  ];

  const officeFocus=.085;

  const points=states.map(s=>(s.focus-states[0].focus)/(states[4].focus-states[0].focus));
  const welcome=$('.welcome'),outro=$('.outro'),outroLink=outro?.querySelector('.outro-cta');
  let layout, wanted=0, progress=null, introWanted=0, introProgress=null, frame=0,last=0,angle=60,active=-1;
  let scrollChapter=0,scrollLocal=0,lastDistance=null,goingBack=false;
  let outroTimer=0,outroVisible=false;
  // Allocate scroll distance by message count so every submenu gets a clear beat.
  const chapterStops=[0,.16,.285,.55,.71,1];
  const revealTiming=[
    {start:.07,end:.88,fade:.62},
    {start:.08,end:.86,fade:.62},
    {start:.07,end:.88,fade:.62},
    {start:.08,end:.86,fade:.62},
    {start:.06,end:.90,fade:.62}
  ];
  const revealMemory=[0,0,0,0,0];
  let revealKey='', gestureStart=-Infinity;
  let mascotX=null,mascotY=null,mascotChapter=-1,spinStart=-Infinity,spinBase=0;
  const financeCards=[...document.querySelectorAll('.financial-hub-popup')];
  const stockCards=[...document.querySelectorAll('.stock-popup')],stockSteps=[...document.querySelectorAll('.stock-steps i')];
  const stockTargets=[[[.36,.337],[.52,.343]],[[.68,.347]],[[.31,.467],[.60,.505]]];
  const channelCards=[...document.querySelectorAll('.channel-popup')];
  const channelTargets=[[.245,.645],[.43,.67],[.35,.714],[[.30,.572],[.51,.572],[.72,.572]],[.58,.574],[.29,.68],[.63,.70]];
  const featureGroups=[
    {chapter:0,cards:financeCards,targets:[[.28,.105],[.48,.155],[.68,.105],[.57,.238]],connectActiveOnly:true},
    {chapter:3,cards:[...document.querySelectorAll('.staff-popup')],targets:[[.52,.865],[.63,.797],[.29,.667],[.58,.566]]},
    {chapter:4,cards:[...document.querySelectorAll('.logistics-popup')],targets:[null,null,null,[.75,.939],[.61,.971],[.34,.963],[.49,.951],null]}
  ];

  // Small conceptual diagrams support each message without adding dashboard data.
  const signalPaths={
    forecast:'M8 34 C35 34 34 15 61 22 S97 30 119 12 S157 26 188 6',
    wave:'M8 23 H24 L30 17 L37 30 L45 8 L53 38 L61 18 L68 24 H84 L91 13 L98 32 L105 20 H121 L128 10 L136 34 L144 18 L153 24 H188',
    route:'M10 32 H47 Q57 32 57 22 V15 Q57 6 69 6 H117 Q129 6 129 18 V24 Q129 34 141 34 H188',
    flow:'M12 22 H188',
    portion:'M12 32 H46 V17 H80 V32 H114 V17 H148 V32 H188'
  };
  const signalKinds=['forecast','portion','flow','wave','flow','flow','flow','flow','flow','forecast','wave','forecast','flow','flow','flow','flow','route','route','route','route','wave'];
  const signalCards=[...stockCards,...channelCards.filter(el=>!el.classList.contains('partner-group')),...featureGroups.flatMap(g=>g.cards)];
  signalCards.forEach((card,i)=>{
    const kind=card.dataset.signal||signalKinds[i]||'flow',path=signalPaths[kind];
    const graphic=document.createElementNS('http://www.w3.org/2000/svg','svg');
    graphic.setAttribute('class','signal-visual');graphic.setAttribute('viewBox','0 0 200 44');graphic.setAttribute('aria-hidden','true');
    graphic.innerHTML='<path class="signal-grid" d="M0 42H200 M25 0V44 M75 0V44 M125 0V44 M175 0V44"/>'+
      '<path class="signal-track" d="'+path+'"/><path class="signal-flow" pathLength="1" d="'+path+'"/>'+
      (kind==='flow'?'<circle class="signal-node" cx="12" cy="22" r="5"/><circle class="signal-node" cx="70" cy="22" r="5"/><circle class="signal-node" cx="130" cy="22" r="5"/><circle class="signal-pulse" cx="188" cy="22" r="5"/>':'');
    card.append(graphic);
  });

  const tags=[
    [],
    [],[],[],[]
  ];
  const nodes=Array.from({length:28},()=>{
    const path=document.createElementNS('http://www.w3.org/2000/svg','path'),dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('r','4');lines.append(path,dot);return {path,dot};
  });
  function schedule(){if(!frame)frame=requestAnimationFrame(render)}
  function atStoryEnd(){
    const scrolling=document.scrollingElement||document.documentElement;
    return scrolling.scrollTop+innerHeight>=scrolling.scrollHeight-8;
  }
  function showOutro(visible){
    if(!outro||outroVisible===visible)return;
    outroVisible=visible;
    outro.classList.toggle('is-visible',visible);
    outro.setAttribute('aria-hidden',String(!visible));
    if(outroLink)outroLink.tabIndex=visible?0:-1;
  }
  function updateOutro(){
    if(atStoryEnd()){
      if(!outroTimer&&!outroVisible){
        outroTimer=setTimeout(()=>{
          outroTimer=0;
          if(atStoryEnd())showOutro(true);
        },5000);
      }
      return;
    }
    if(outroTimer){clearTimeout(outroTimer);outroTimer=0}
    showOutro(false);
  }
  function measure(){
    const base=stage.getBoundingClientRect(),w=stage.clientWidth,h=stage.clientHeight,aw=agent.offsetWidth,ah=agent.offsetHeight;
    // All layout reads happen on resize/load, never interleaved with frame writes.
    const panels=states.map((s,i)=>{
      const r=chapters[i].querySelector(s.panel).getBoundingClientRect(),left=r.left-base.left,right=r.right-base.left,top=r.top-base.top,onLeft=s.side==='left';
      return {left,right,top,height:r.height,onLeft,x:clamp(onLeft?right+24:left-aw-30,8,w-aw-8),y:clamp(top+r.height*.48-ah*.3,60,h-ah-90)};
    });
    tags.forEach((list,i)=>list.forEach(t=>{t.el=chapters[i].querySelector(t.selector);t.width=t.el.offsetWidth;t.height=t.el.offsetHeight}));
    const channelRects=channelCards.map(el=>{const r=el.getBoundingClientRect();return {x:r.left-base.left,y:r.top-base.top,width:r.width,height:r.height}});
    const stockRects=stockCards.map(el=>{const r=el.getBoundingClientRect();return {x:r.left-base.left,y:r.top-base.top,width:r.width,height:r.height}});
    featureGroups.forEach(g=>{g.rects=g.cards.map(el=>{const r=el.getBoundingClientRect();return {x:r.left-base.left,y:r.top-base.top,width:r.width,height:r.height}})});
    layout={stockRects,channelRects,w,h,aw,ah,ww:world.offsetWidth,wh:world.offsetHeight,panels,start:story.getBoundingClientRect().top+scrollY,range:Math.max(1,story.offsetHeight-h)};
    update();
  }
  function update(){
    if(!layout)return;
    updateOutro();
    const distance=clamp(scrollY-layout.start,0,layout.range);
    if(lastDistance!==null&&Math.abs(distance-lastDistance)>1)goingBack=distance<lastDistance;
    lastDistance=distance;
    introWanted=clamp(distance/layout.h,0,1);
    const raw=clamp((distance-layout.h)/Math.max(1,layout.range-layout.h),0,1);
    // Each chapter holds still while its messages arrive, then hands over to
    // the next restaurant area during the final part of that section.
    let section=0;while(section<4&&raw>=chapterStops[section+1])section++;
    scrollChapter=section;
    scrollLocal=clamp((raw-chapterStops[section])/(chapterStops[section+1]-chapterStops[section]),0,1);
    const handover=ease(clamp((scrollLocal-.72)/.28,0,1));
    // Forward scrolling preserves the cinematic handover. On the way back,
    // return directly and smoothly to the previous chapter without replaying it.
    const reverseFrom=points[Math.max(0,section-1)],reverseTo=points[section];
    wanted=goingBack
      ?mix(reverseFrom,reverseTo,ease(scrollLocal))
      :(section===4?points[4]:mix(points[section],points[section+1],handover));
    schedule();
  }
  function render(now){
    frame=0;
    const dt=last?Math.min(48,now-last):16.67;last=now;
    // Stay close to the user's finger/wheel while retaining enough interpolation
    // to keep the camera and messages visually fluid.
    const alpha=reduced.matches?1:1-Math.exp(-dt/55);
    introProgress=introProgress===null?introWanted:mix(introProgress,introWanted,alpha);
    if(Math.abs(introProgress-introWanted)<.00001)introProgress=introWanted;
    const welcomeOpacity=1-ease(clamp((introProgress-.3)/.5,0,1));
    const storyOpacity=ease(clamp((introProgress-.72)/.28,0,1));
    welcome.style.opacity=String(welcomeOpacity);
    welcome.style.visibility=welcomeOpacity>.001?'visible':'hidden';
    welcome.setAttribute('aria-hidden',String(welcomeOpacity<.5));
    agent.style.opacity=String(storyOpacity);
    $('.progress').style.opacity=String(storyOpacity);
    progress=progress===null?wanted:mix(progress,wanted,alpha);
    if(Math.abs(progress-wanted)<.00001)progress=wanted;
    const {w,h,ww,wh,aw,ah,panels}=layout;
    const signageArrive=scrollChapter===2?ease(clamp((scrollLocal-.25)/.11,0,1)):0;
    const signageLeave=scrollChapter===2?ease(clamp((scrollLocal-.57)/.12,0,1)):0;
    const signageAttention=signageArrive*(1-signageLeave);
    const operatingFocus=mix(states[0].focus,states[4].focus,progress)-.045*signageAttention;
    const officeToStock=ease(clamp((introProgress-.34)/.66,0,1));
    const focus=mix(officeFocus,operatingFocus,officeToStock);
    let from=0;while(from<states.length-2&&progress>points[from+1])from++;
    const t=clamp((progress-points[from])/(points[from+1]-points[from]),0,1),blend=ease(t);
    const index=t<.5?from:from+1,s=states[index],panel=panels[index];
    const top=clamp(wh*focus-h*.5,0,Math.max(0,wh-h));
    const operatingFx=.15+.7*mix([.50,.58,.47,.56,.47][from],[.50,.58,.47,.56,.47][from+1],blend)+signageAttention*(w<821?.11:.055);
    const fx=mix(.50,operatingFx,officeToStock);
    const left=w<821&&ww>w?clamp(w*.5-ww*fx,w-ww,0):(w-ww)*.5;
    world.style.left='0';world.style.transform=`translate3d(${left}px,${-top}px,0)`;
    const cross=ease(clamp((t-.30)/.40,0,1));
    chapters.forEach((el,i)=>{
      const opacity=(i===from?1-cross:i===from+1?cross:0)*storyOpacity;
      el.style.opacity=String(opacity);el.style.visibility=opacity>.001?'visible':'hidden';
      el.style.setProperty('--message-lift',reduced.matches?'0px':`${(1-opacity)*18}px`);
      el.setAttribute('aria-hidden',String(i!==index||storyOpacity<.5));
      el.querySelector('.manager-cta')?.setAttribute('tabindex',i===index&&storyOpacity>=.5?'0':'-1');
      if(i!==index)tags[i].forEach(tag=>{tag.el.style.visibility='hidden'});
    });
    if(active!==index){active=index;ticks.forEach((el,i)=>el.classList.toggle('active',i===index));$('#chapter-name').textContent=s.name;figure.style.setProperty('--facing',panel.onLeft?'-1':'1')}
    // Fade pointers during the handover instead of teleporting visible lines.
    lines.style.opacity=String(Math.abs(cross-.5)*2*storyOpacity);
    nodes.forEach(n=>{n.path.style.display=n.dot.style.display='none'});let slot=0;
    const screen=p=>({x:left+ww*(.15+.7*p[0]),y:wh*p[1]-top});
    function connect(source,dest){
      const n=nodes[slot++];if(!n)return;
      n.path.style.display=n.dot.style.display='';
      n.path.setAttribute('stroke',s.color);n.dot.setAttribute('fill',s.color);
      n.path.setAttribute('d',`M${source.x} ${source.y} L${dest.x} ${dest.y}`);
      n.dot.setAttribute('cx',dest.x);n.dot.setAttribute('cy',dest.y);
    }
    const origin={x:panel.onLeft?panel.right:panel.left,y:panel.top+panel.height*.5};
    (index===3?s.targets:[]).forEach(p=>{const d=screen(p);if(d.x>8&&d.x<w-8&&d.y>8&&d.y<h-12)connect(origin,d)});
    // Messages build cumulatively as the visitor moves through each chapter.
    const revealProgress=(chapter,count,start=revealTiming[chapter].start,end=revealTiming[chapter].end)=>{
      if(scrollChapter<chapter)return 0;
      if(scrollChapter>chapter){revealMemory[chapter]=count;return count}
      const current=clamp((scrollLocal-start)/Math.max(.001,end-start),0,1)*count;
      revealMemory[chapter]=Math.max(revealMemory[chapter],current);
      return revealMemory[chapter];
    };
    const channelProgress=revealProgress(2,channelCards.length);
    channelCards.forEach((card,i)=>{
      const local=channelProgress-i;
      const opacity=ease(clamp(local/revealTiming[2].fade,0,1));
      card.style.opacity=String(opacity);card.style.visibility=opacity>.001?'visible':'hidden';
      card.setAttribute('aria-hidden',String(opacity<.5));
      const rise=reduced.matches?0:(1-opacity)*28;
      card.style.transform=`translate3d(0,${rise}px,0) perspective(700px) rotateX(${reduced.matches?0:(1-opacity)*9}deg) scale(${reduced.matches?1:.94+.06*opacity})`;
      if(opacity>.01&&index===2){
        const r=layout.channelRects[i],source={x:r.x+r.width*.5,y:r.y+rise};
        const targets=Array.isArray(channelTargets[i][0])?channelTargets[i]:[channelTargets[i]];
        connect({x:origin.x,y:origin.y},source);
        targets.forEach(point=>{const dest=screen(point);if(dest.x>8&&dest.x<w-8&&dest.y>8&&dest.y<h-12)connect(source,dest)});
      }
    });
    // The opening promise leads into three distinct stock-management beats.
    const stockProgress=revealProgress(1,stockCards.length);
    stockCards.forEach((card,i)=>{
      const local=stockProgress-i;
      const opacity=ease(clamp(local/revealTiming[1].fade,0,1));
      const rise=reduced.matches?0:(1-opacity)*28;
      card.style.opacity=String(opacity);card.style.visibility=opacity>.001?'visible':'hidden';
      card.style.transform=`translate3d(0,${rise}px,0) perspective(700px) rotateX(${reduced.matches?0:(1-opacity)*9}deg) scale(${reduced.matches?1:.94+.06*opacity})`;
      card.setAttribute('aria-hidden',String(opacity<.5));
      stockSteps[i].classList.toggle('active',index===1&&local>=0);
      if(opacity>.01&&index===1){
        const r=layout.stockRects[i],source={x:r.x+r.width*.5,y:r.y+rise};
        connect(origin,source);
        stockTargets[i].forEach(p=>{const d=screen(p);if(d.x>8&&d.x<w-8&&d.y>8&&d.y<h-12)connect(source,d)});
      }
    });
    featureGroups.forEach(group=>{
      const position=revealProgress(
        group.chapter,
        group.cards.length,
        group.revealStart??revealTiming[group.chapter].start,
        group.revealEnd??revealTiming[group.chapter].end
      );
      group.position=position;
      const currentIndex=clamp(Math.floor(position-.001),0,group.cards.length-1);
      group.cards.forEach((card,i)=>{
        const local=position-i;
        const opacity=ease(clamp(local/(group.fadeSpan??revealTiming[group.chapter].fade),0,1));
        const rise=reduced.matches?0:(1-opacity)*28;
        card.style.opacity=String(opacity);card.style.visibility=opacity>.001?'visible':'hidden';
        card.style.transform=`translate3d(0,${rise}px,0) perspective(700px) rotateX(${reduced.matches?0:(1-opacity)*9}deg) scale(${reduced.matches?1:.94+.06*opacity})`;
        card.setAttribute('aria-hidden',String(opacity<.5));
        if(opacity>.01&&index===group.chapter&&(!group.connectActiveOnly||i===currentIndex)){
          const r=group.rects[i],source={x:r.x+r.width*.5,y:r.y+rise};
          connect(origin,source);
          if(group.targets[i]){const d=screen(group.targets[i]);if(d.x>8&&d.x<w-8&&d.y>8&&d.y<h-12)connect(source,d)}
        }
      });
    });
    tags[index].forEach((tag,i)=>{
      const d=screen(tag.point),visible=d.x>5&&d.x<w-5&&d.y>0&&d.y<h;
      const x=clamp(d.x-(i%2?tag.width+35:-25),8,w-tag.width-8),y=clamp(d.y-72-i*13,h*.39,h*.66);
      tag.el.style.visibility=visible?'visible':'hidden';tag.el.style.right=tag.el.style.bottom='auto';
      tag.el.style.left=x+'px';tag.el.style.top=y+'px';
      if(visible)connect({x:x+20,y:y+tag.height},d);
    });
    // Follow the active feature while retaining one spin per chapter crossing.
    const group=index===1?{cards:stockCards,rects:layout.stockRects,position:stockProgress}:index===2?{cards:channelCards,rects:layout.channelRects,position:channelProgress}:featureGroups.find(g=>g.chapter===index);
    const position=group.position;
    const selected=clamp(Math.floor(position-.001),0,group.cards.length-1);
    const nextReveal=storyOpacity>.5&&position>.001?`${index}:${selected}`:'';
    if(nextReveal!==revealKey){
      const entering=nextReveal!=='';
      revealKey=nextReveal;
      gestureStart=entering&&!reduced.matches&&!goingBack?now+180:-Infinity;
      if(entering&&!reduced.matches&&!goingBack)group.cards[selected].animate(
        [{filter:'brightness(1)'},{filter:'brightness(1.24)',offset:.28},{filter:'brightness(1)'}],
        {duration:1700,easing:'ease-in-out'}
      );
    }
    [...stockCards,...channelCards,...featureGroups.flatMap(g=>g.cards)].forEach(card=>card.classList.toggle('is-cued',storyOpacity>.5&&position>0&&card===group.cards[selected]));
    const target=position>0?group.rects[selected]:null;
    const cardOnLeft=target?target.x+target.width*.5<w*.5:panel.onLeft;
    const breathingRoom=w<821?32:52;
    const destinationX=target?clamp(cardOnLeft?target.x+target.width+breathingRoom:target.x-aw-breathingRoom,10,w-aw-10):clamp((panel.left+panel.right-aw)/2,10,w-aw-10);
    const bottomClearance=index===0?(w<821?110:150):18;
    const destinationY=target?clamp(target.y+target.height*.5-ah*.42,12,h-ah-bottomClearance):Math.max(10,panel.top-ah-24);
    const movementAlpha=reduced.matches?1:1-Math.exp(-dt/170);
    mascotX=mascotX===null?destinationX:mix(mascotX,destinationX,movementAlpha);
    mascotY=mascotY===null?destinationY:mix(mascotY,destinationY,movementAlpha);
    const moving=Math.abs(mascotX-destinationX)+Math.abs(mascotY-destinationY)>.25;
    if(!moving){mascotX=destinationX;mascotY=destinationY}
    if(mascotChapter!==index){if(mascotChapter!==-1&&!goingBack){spinBase+=360;spinStart=now}mascotChapter=index}
    const spinProgress=reduced.matches?1:clamp((now-spinStart)/950,0,1),spinning=spinProgress<1;
    const airborne=spinning?Math.sin(spinProgress*Math.PI):0;
    const ax=mascotX,ay=mascotY-airborne*8;
    agent.style.transform=`translate3d(${ax}px,${ay}px,0)`;
    figure.style.setProperty('--conductor-spin',(spinning?spinBase-360+360*ease(spinProgress):spinBase)+'deg');
    const facing=target?(cardOnLeft?1:-1):(panel.onLeft?-1:1);
    figure.style.setProperty('--conductor-facing',facing);
    figure.style.setProperty('--conductor-hop',(-airborne*6)+'px');
    const aimX=target?target.x+target.width*.5:(panel.left+panel.right)*.5,aimY=target?target.y+target.height*.5:panel.top+35;
    const radians=Math.atan2(aimY-(ay+ah*.28),(aimX-(ax+aw*(facing<0?.6:.4)))*facing);
    // Keep the arm raised in a conductor's working position, rather than aiming like a spear.
    const aimInfluence=index===0?.16:.06;
    const desired=reduced.matches?0:clamp(-32+(radians*180/Math.PI)*aimInfluence,index===0?-55:-44,index===0?-12:-20);
    angle=mix(angle,desired,alpha);
    // A two-beat conducting phrase: broad, continuous arcs with soft starts and finishes.
    const beat=clamp((now-gestureStart)/1700,0,1),conducting=!reduced.matches&&beat<1;
    const envelope=conducting?Math.sin(Math.PI*beat):0;
    const sweep=(index===0?24:18)*Math.sin(4*Math.PI*beat)*envelope;
    const resting=reduced.matches?0:airborne;
    agent.style.setProperty('--arm-angle',mix(angle+sweep,-12,resting)+'deg');
    const sway=2.8*Math.sin(2*Math.PI*beat)*envelope;
    figure.style.setProperty('--body-lean',(sway*(1-resting))+'deg');
    figure.style.setProperty('--body-stretch',String(1-.008*envelope*(1-resting)));
    if(progress!==wanted||introProgress!==introWanted||Math.abs(angle-desired)>.1||conducting||moving||spinning)schedule();else last=0;
  }
  addEventListener('scroll',update,{passive:true});addEventListener('resize',measure,{passive:true});
  document.querySelectorAll('img').forEach(img=>img.addEventListener('load',measure));
  document.fonts?.ready.then(measure);reduced.addEventListener('change',update);measure();

  // This page runs inside an iframe on the host site — a separate browsing
  // context, so scroll input over it never reaches the host page at all by
  // default. Forwarding EVERY wheel tick unconditionally (an earlier version
  // of this) fixed the host header feeling "stuck", but also dragged
  // whatever's below this block (footer, other sections) into view long
  // before the story itself finished — this page is much taller internally
  // than the host page has room for below it. Instead: forward just enough
  // to clear the host header (HEADER_CLEARANCE px), which needs very little
  // scroll since the header is a fixed height; any upward scroll forwards
  // immediately so scrolling back up always retreats the header right away;
  // and forwarding resumes at our own top/bottom boundary so the rest of the
  // host page is still reachable once the story is actually finished.
  if(window.parent!==window){
    const HEADER_CLEARANCE=110;
    const atOwnTop=()=>(document.scrollingElement||document.documentElement).scrollTop<=0;
    // Tracks our own running estimate of how far we've pushed the parent,
    // rather than reading window.parent.scrollY back — that read lags behind
    // in-flight postMessage calls, so a burst of rapid wheel ticks could each
    // see a stale "haven't reached the cap yet" value and all forward, badly
    // overshooting HEADER_CLEARANCE before any of them landed.
    let forwarded=0;
    addEventListener('wheel',e=>{
      const goingDown=e.deltaY>0;
      const forward=goingDown?(forwarded<HEADER_CLEARANCE||atStoryEnd()):(forwarded>0||atOwnTop());
      if(!forward)return;
      window.parent.postMessage({source:'maistro-widget-scroll',deltaY:e.deltaY},'*');
      forwarded=goingDown?Math.min(HEADER_CLEARANCE,forwarded+e.deltaY):Math.max(0,forwarded+e.deltaY);
    },{passive:true});
  }
})();
