(() => {
  const scene = document.querySelector('.fly-scene');
  const shell = document.querySelector('.shell');
  const tracked = [...document.querySelectorAll('.tracked')];
  const menuNetwork = document.querySelector('.menu-network');
  const menuHub = document.querySelector('.menu-hub');
  const networkTargets = [...document.querySelectorAll('.network-target')];
  const networkPath = document.querySelector('.network-lines path');
  const managerNetworks = [...document.querySelectorAll('.manager-network')];
  const agent = document.querySelector('.maistro-agent');
  const agentTargets = [
    document.querySelector('.g1 .system-callout .tracked-label'),
    menuHub,
    menuHub,
    document.querySelector('.staff-master .tracked-label'),
    document.querySelector('.stock-master .tracked-label')
  ];
  const imageRatio = 821 / 1915;
  const duration = 42000;
  const markers = [0, .20, .41, .64, .82];
  const shots = [
    { x: 0,   y: 100, size: 146 },
    { x: 25,  y: 67,  size: 178 },
    { x: 50,  y: 22,  size: 198 },
    { x: 58,  y: 54,  size: 154 },
    { x: 78,  y: 16,  size: 155 },
    { x: 78,  y: 16,  size: 155 }
  ];
  let cycleStart = performance.now();
  let lastChapter = -1;
  let lastProgress = 0;

  const smooth = value => value * value * (3 - 2 * value);
  const mix = (a, b, amount) => a + (b - a) * amount;

  function chapter(progress) {
    let active = 0;
    markers.forEach((marker, index) => {
      if (progress >= marker) active = index;
    });
    return active;
  }

  function camera(progress) {
    if (progress < .11) {
      const drift = smooth(progress / .11);
      return { x: mix(0, 2, drift), y: 100, size: mix(146, 150, drift) };
    }
    if (progress < .20) {
      const amount = smooth((progress - .11) / .09);
      return {
        x: mix(2, shots[1].x, amount),
        y: mix(100, shots[1].y, amount),
        size: mix(150, shots[1].size, amount)
      };
    }
    const scaled = progress * (shots.length - 1);
    const index = Math.min(shots.length - 2, Math.floor(scaled));
    const amount = smooth(scaled - index);
    return {
      x: mix(shots[index].x, shots[index + 1].x, amount),
      y: mix(shots[index].y, shots[index + 1].y, amount),
      size: mix(shots[index].size, shots[index + 1].size, amount)
    };
  }

  window.maistroSeek = index => {
    cycleStart = performance.now() - markers[index] * duration;
    lastChapter = -1;
  };

  function positionTrackedMessages(view) {
    const sceneRect = scene.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    const imageWidth = sceneRect.width * view.size / 100;
    const imageHeight = imageWidth * imageRatio;
    const imageLeft = sceneRect.left + (sceneRect.width - imageWidth) * view.x / 100;
    const imageTop = sceneRect.top + (sceneRect.height - imageHeight) * view.y / 100;

    tracked.forEach(item => {
      const anchorX = imageLeft + imageWidth * Number(item.dataset.x) - shellRect.left;
      const anchorY = imageTop + imageHeight * Number(item.dataset.y) - shellRect.top;
      item.style.left = `${anchorX}px`;
      item.style.top = `${anchorY}px`;

      const label = item.querySelector('.tracked-label');
      const desiredX = anchorX + Number(item.dataset.dx);
      const desiredY = anchorY + Number(item.dataset.dy);
      const labelX = Math.max(8, Math.min(shellRect.width - label.offsetWidth - 8, desiredX));
      const labelY = Math.max(68, Math.min(shellRect.height - label.offsetHeight - 46, desiredY));
      const deltaX = labelX - anchorX;
      const deltaY = labelY - anchorY;
      label.style.transform = `translate(${deltaX}px,${deltaY}px)`;

      const elbowX = deltaX * .38;
      item.querySelector('path').setAttribute('d', `M0 0 L${elbowX} ${deltaY} L${deltaX} ${deltaY}`);
    });

    const hubX = shellRect.width > 720 ? shellRect.width - 434 : 0;
    const hubY = shellRect.width > 720 ? 48 : 34;
    menuHub.style.left = `${hubX}px`;
    menuHub.style.top = `${hubY}px`;
    const startX = hubX + 30;
    const startY = hubY + menuHub.offsetHeight * .58;
    const lines = [];
    networkTargets.forEach((target, index) => {
      const targetX = imageLeft + imageWidth * Number(target.dataset.x) - shellRect.left;
      const targetY = imageTop + imageHeight * Number(target.dataset.y) - shellRect.top;
      target.style.left = `${targetX}px`;
      target.style.top = `${targetY}px`;
      const bendX = mix(startX, targetX, .45);
      lines.push(`M${startX} ${startY + index * 3} Q${bendX} ${startY} ${targetX} ${targetY}`);
    });
    networkPath.setAttribute('d', lines.join(' '));

    managerNetworks.forEach(network => {
      const source = document.querySelector(network.dataset.source);
      const sourceRect = source.getBoundingClientRect();
      const startX = sourceRect.left - shellRect.left + sourceRect.width * .5;
      const startY = sourceRect.top - shellRect.top + sourceRect.height * .5;
      const branches = [];
      network.querySelectorAll('.manager-target').forEach((target, index) => {
        const targetX = imageLeft + imageWidth * Number(target.dataset.x) - shellRect.left;
        const targetY = imageTop + imageHeight * Number(target.dataset.y) - shellRect.top;
        target.style.left = `${targetX}px`;
        target.style.top = `${targetY}px`;
        const bendX = mix(startX, targetX, .5);
        branches.push(`M${startX} ${startY + index * 3} Q${bendX} ${startY} ${targetX} ${targetY}`);
      });
      network.querySelector('.manager-lines path').setAttribute('d', branches.join(' '));
    });
  }

  function positionAgent(active) {
    const shellRect = shell.getBoundingClientRect();
    const targetRect = agentTargets[active].getBoundingClientRect();
    const targetLeft = targetRect.left - shellRect.left;
    const targetRight = targetRect.right - shellRect.left;
    const agentWidth = agent.offsetWidth;
    const agentHeight = agent.offsetHeight;
    if (shellRect.width <= 720) {
      const left = Math.max(4, Math.min(shellRect.width - agentWidth - 4, targetRight - agentWidth));
      const top = Math.max(10, Math.min(shellRect.height - agentHeight - 54, targetRect.bottom - shellRect.top + 10));
      agent.style.left = `${left}px`;
      agent.style.top = `${top}px`;
      return;
    }
    const preferredLeft = targetLeft - 136;
    const sideLeft = preferredLeft >= 4 ? preferredLeft : targetRight + 16;
    const left = Math.max(4, Math.min(shellRect.width - agentWidth - 4, sideLeft));
    const top = Math.max(66, Math.min(shellRect.height - agentHeight - 6, targetRect.top - shellRect.top + targetRect.height * .5 - agentHeight * .5));
    agent.style.left = `${left}px`;
    agent.style.top = `${top}px`;
  }

  function render(now) {
    const progress = ((now - cycleStart) % duration) / duration;
    if (progress < lastProgress) {
      window.dispatchEvent(new CustomEvent('maistro-cycle-reset'));
    }
    lastProgress = progress;

    const active = chapter(progress);
    if (active !== lastChapter) {
      lastChapter = active;
      window.dispatchEvent(new CustomEvent('maistro-chapter', { detail: { index: active } }));
    }

    const view = camera(progress);
    if (shell.getBoundingClientRect().width <= 800) view.size *= 1.45;
    scene.style.backgroundPosition = `${view.x}% ${view.y}%`;
    scene.style.backgroundSize = `${view.size}% auto`;
    scene.style.setProperty('--focus-x', `${view.x}%`);
    scene.style.setProperty('--focus-y', `${view.y}%`);
    positionTrackedMessages(view);
    positionAgent(active);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
