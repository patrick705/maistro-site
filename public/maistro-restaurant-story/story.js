(() => {
  const $ = s => document.querySelector(s);
  const story=$('.story'), stage=$('.stage'),world=$('.world'),agent=$('.maistro'),figure=$('.agent-figure'),lines=$('.connections');
  const chapters=[...document.querySelectorAll('.chapter')],ticks=[...document.querySelectorAll('.tick')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
  const states = [
    {name:'Stock',color:'#f4be62',panel:'.stock-card',focus:.12,targets:[[.46,.075],[.61,.09],[.77,.108],[.22,.17],[.49,.19],[.79,.224],[.35,.36],[.64,.56]]},
    {name:'Menu',color:'#b5a0ff',panel:'.menu-card',focus:.423,targets:[[.493,.521],[.554,.531],[.336,.445],[.407,.471],[.478,.493],[.432,.298],[.516,.322],[.593,.344]]},
    {name:'Staff',color:'#c6ef78',panel:'.staff-card',focus:.665,targets:[[.28,.323],[.384,.338],[.445,.359],[.51,.389],[.665,.405],[.86,.384],[.50,.501],[.576,.51],[.744,.494],[.63,.675],[.69,.234],[.527,.217]]},
    {name:'Direct sales',color:'#68e8f7',panel:'.driver-card',focus:.9,targets:[[.116,.815],[.207,.862],[.357,.91],[.51,.857],[.88,.944]]}
  ];

  const points=states.map(s=>(s.focus-states[0].focus)/(states[3].focus-states[0].focus));
  let layout, wanted=0, progress=null, frame=0,last=0,angle=60,active=-1;
  const stockCards=[...document.querySelectorAll('.stock-popup')],stockSteps=[...document.querySelectorAll('.stock-steps i')];
  const stockTargets=[[[.49,.19],[.61,.09]],[[.79,.224]],[[.35,.36],[.445,.359]]];
  const channelCards=[...document.querySelectorAll('.channel-popup')];
  const channelTargets=[[.493,.521],[.554,.531],[.336,.445],[.407,.471],[.516,.322],[.493,.521],[.554,.531]];
  const featureGroups=[{chapter:2,cards:[...document.querySelectorAll('.staff-popup')],targets:[[.63,.675],[.63,.675],[.744,.494],[.50,.501]]},{chapter:3,cards:[...document.querySelectorAll('.logistics-popup')],targets:[null,null,null,[.207,.862],[.88,.944],[.207,.862],[.88,.944],null]}];

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
    const kind=signalKinds[i]||'flow',path=signalPaths[kind];
    const graphic=document.createElementNS('http://www.w3.org/2000/svg','svg');
    graphic.setAttribute('class','signal-visual');graphic.setAttribute('viewBox','0 0 200 44');graphic.setAttribute('aria-hidden','true');
    graphic.innerHTML='<path class="signal-grid" d="M0 42H200 M25 0V44 M75 0V44 M125 0V44 M175 0V44"/>'+
      '<path class="signal-track" d="'+path+'"/><path class="signal-flow" pathLength="1" d="'+path+'"/>'+
      (kind==='flow'?'<circle class="signal-node" cx="12" cy="22" r="5"/><circle class="signal-node" cx="70" cy="22" r="5"/><circle class="signal-node" cx="130" cy="22" r="5"/><circle class="signal-pulse" cx="188" cy="22" r="5"/>':'');
    card.append(graphic);
  });

  const tags=[
    [],
    [],[],[]
  ];
  const nodes=Array.from({length:24},()=>{
    const path=document.createElementNS('http://www.w3.org/2000/svg','path'),dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('r','4');lines.append(path,dot);return {path,dot};
  });
  function schedule(){if(!frame)frame=requestAnimationFrame(render)}
  function measure(){
    const base=stage.getBoundingClientRect(),w=stage.clientWidth,h=stage.clientHeight,aw=agent.offsetWidth,ah=agent.offsetHeight;
    // All layout reads happen on resize/load, never interleaved with frame writes.
    const panels=states.map((s,i)=>{
      const r=chapters[i].querySelector(s.panel).getBoundingClientRect(),left=r.left-base.left,right=r.right-base.left,top=r.top-base.top,onLeft=i%2===1;
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
    const raw=clamp((scrollY-layout.start)/layout.range,0,1);
    // Spend most of the scroll distance on the menu channels and the staff and logistics stories.
    const stops=[0,.18,.53,.68,1],storyStops=[0,points[1]*.5,(points[1]+points[2])*.5,(points[2]+1)*.5,1];
    let section=0;while(section<3&&raw>stops[section+1])section++;
    wanted=mix(storyStops[section],storyStops[section+1],(raw-stops[section])/(stops[section+1]-stops[section]));
    schedule();
  }
  function render(now){
    frame=0;
    const dt=last?Math.min(64,now-last):16.67;last=now;
    const alpha=reduced.matches?1:1-Math.exp(-dt/125);
    progress=progress===null?wanted:mix(progress,wanted,alpha);
    if(Math.abs(progress-wanted)<.00001)progress=wanted;
    const {w,h,ww,wh,aw,ah,panels}=layout;
    const focus=mix(states[0].focus,states[3].focus,progress);
    let from=0;while(from<2&&progress>points[from+1])from++;
    const t=clamp((progress-points[from])/(points[from+1]-points[from]),0,1),blend=ease(t);
    const index=t<.5?from:from+1,s=states[index],panel=panels[index];
    const top=clamp(wh*focus-h*.5,0,Math.max(0,wh-h));
    const fx=mix([.62,.47,.56,.47][from],[.62,.47,.56,.47][from+1],blend);
    const left=w<821?clamp(w*.5-ww*fx,w-ww,0):(w-ww)*.5;
    world.style.left='0';world.style.transform=`translate3d(${left}px,${-top}px,0)`;
    const cross=ease(clamp((t-.30)/.40,0,1));
    chapters.forEach((el,i)=>{
      const opacity=i===from?1-cross:i===from+1?cross:0;
      el.style.opacity=String(opacity);el.style.visibility=opacity>.001?'visible':'hidden';
      el.style.setProperty('--message-lift',reduced.matches?'0px':`${(1-opacity)*18}px`);
      el.setAttribute('aria-hidden',String(i!==index));
      if(i!==index)tags[i].forEach(tag=>{tag.el.style.visibility='hidden'});
    });
    if(active!==index){active=index;ticks.forEach((el,i)=>el.classList.toggle('active',i===index));$('#chapter-name').textContent=s.name;figure.style.setProperty('--facing',panel.onLeft?'-1':'1')}
    // Fade pointers during the handover instead of teleporting visible lines.
    lines.style.opacity=String(Math.abs(cross-.5)*2);
    nodes.forEach(n=>{n.path.style.display=n.dot.style.display='none'});let slot=0;
    const screen=p=>({x:left+ww*p[0],y:wh*p[1]-top});
    function connect(source,dest){
      const n=nodes[slot++];if(!n)return;
      n.path.style.display=n.dot.style.display='';
      n.path.setAttribute('stroke',s.color);n.dot.setAttribute('fill',s.color);
      n.path.setAttribute('d',`M${source.x} ${source.y} L${mix(source.x,dest.x,.28)} ${source.y} L${dest.x} ${dest.y}`);
      n.dot.setAttribute('cx',dest.x);n.dot.setAttribute('cy',dest.y);
    }
    const origin={x:panel.onLeft?panel.right:panel.left,y:panel.top+panel.height*.5};
    (index===2?s.targets:[]).forEach(p=>{const d=screen(p);if(d.x>8&&d.x<w-8&&d.y>8&&d.y<h-12)connect(origin,d)});
    // Each channel gets its own scroll interval; only the handover overlaps.
    const menuStart=points[1]*.5,menuEnd=(points[1]+points[2])*.5;
    const channelProgress=clamp((progress-menuStart)/(menuEnd-menuStart),0,1)*channelCards.length;
    channelCards.forEach((card,i)=>{
      const local=channelProgress-i;
      const opacity=ease(clamp(local/.22,0,1));
      card.style.opacity=String(opacity);card.style.visibility=opacity>.001?'visible':'hidden';
      card.setAttribute('aria-hidden',String(opacity<.5));
      const rise=reduced.matches?0:(1-opacity)*28;
      card.style.transform=`translate3d(0,${rise}px,0) perspective(700px) rotateX(${reduced.matches?0:(1-opacity)*9}deg) scale(${reduced.matches?1:.94+.06*opacity})`;
      if(opacity>.01&&index===1){
        const r=layout.channelRects[i],source={x:r.x+r.width*.5,y:r.y+rise},dest=screen(channelTargets[i]);
        connect({x:origin.x,y:origin.y},source);
        if(dest.x>8&&dest.x<w-8&&dest.y>8&&dest.y<h-12)connect(source,dest);
      }
    });
    // The opening promise leads into three distinct stock-management beats.
    const stockProgress=clamp((progress-.018)/(menuStart-.018),0,1)*3;
    stockCards.forEach((card,i)=>{
      const local=stockProgress-i;
      const opacity=ease(clamp(local/.22,0,1));
      const rise=reduced.matches?0:(1-opacity)*28;
      card.style.opacity=String(opacity);card.style.visibility=opacity>.001?'visible':'hidden';
      card.style.transform=`translate3d(0,${rise}px,0) perspective(700px) rotateX(${reduced.matches?0:(1-opacity)*9}deg) scale(${reduced.matches?1:.94+.06*opacity})`;
      card.setAttribute('aria-hidden',String(opacity<.5));
      stockSteps[i].classList.toggle('active',index===0&&local>=0);
      if(opacity>.01&&index===0){
        const r=layout.stockRects[i],source={x:r.x+r.width*.5,y:r.y+rise};
        connect(origin,source);
        stockTargets[i].forEach(p=>{const d=screen(p);if(d.x>8&&d.x<w-8&&d.y>8&&d.y<h-12)connect(source,d)});
      }
    });
    featureGroups.forEach(group=>{
      const start=group.chapter===2?menuEnd:(points[2]+1)*.5,end=group.chapter===2?(points[2]+1)*.5:1;
      const position=clamp((progress-start)/(end-start),0,1)*group.cards.length;
      group.cards.forEach((card,i)=>{
        const local=position-i;
        const fadeOut=1;
        const opacity=ease(clamp(local/.22,0,1))*fadeOut;
        const rise=reduced.matches?0:(1-opacity)*28;
        card.style.opacity=String(opacity);card.style.visibility=opacity>.001?'visible':'hidden';
        card.style.transform=`translate3d(0,${rise}px,0) perspective(700px) rotateX(${reduced.matches?0:(1-opacity)*9}deg) scale(${reduced.matches?1:.94+.06*opacity})`;
        card.setAttribute('aria-hidden',String(opacity<.5));
        if(opacity>.01&&index===group.chapter){
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
    // The character travels with the scroll, not with discrete chapter switches.
    const travel=ease(clamp((t-.2)/.6,0,1));
    const edgeX=i=>i%2===0?w-aw-(w<821?12:24):(w<821?12:24);
    const ax=mix(edgeX(from),edgeX(from+1),travel),ay=h*(w<821?.66:.64)-Math.sin(travel*Math.PI)*h*.12;
    agent.style.transform=`translate3d(${ax}px,${ay}px,0)`;
    const facing=panel.onLeft?-1:1,aimX=panel.onLeft?panel.right-24:panel.left+24,aimY=panel.top+42;
    const desired=clamp(Math.atan2(aimY-(ay+ah*.3),(aimX-(ax+aw*(panel.onLeft?.6:.4)))*facing)*180/Math.PI+95,5,130);
    angle=mix(angle,desired,alpha);agent.style.setProperty('--arm-angle',angle+'deg');
    if(progress!==wanted||Math.abs(angle-desired)>.1)schedule();else last=0;
  }
  addEventListener('scroll',update,{passive:true});addEventListener('resize',measure,{passive:true});
  document.querySelectorAll('img').forEach(img=>img.addEventListener('load',measure));
  document.fonts?.ready.then(measure);reduced.addEventListener('change',update);measure();
})();







