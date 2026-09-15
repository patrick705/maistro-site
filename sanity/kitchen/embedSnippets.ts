// Shared Custom HTML embed snippets — kept in their own module (rather than
// inline in blockShowcaseContent.ts or blockTypes.ts) so both the Block
// Showcase entry and the "+ Add block" pre-filled entry point at the exact
// same code, with nowhere for the two copies to drift apart.

// Points at the widget hosted at public/maistro-kitchen/index.html — must
// stay same-origin with the page for the resize-observer script's
// frame.contentDocument read to work (see that file's own README).
export const BEFORE_AFTER_EMBED_CODE = `<style>
  .maistro-website-embed {
    display: block;
    width: 100%;
    height: 760px;
    border: 0;
  }
  @media (max-width: 720px) {
    .maistro-website-embed { height: calc(56.28vw + 90px); }
  }
</style>
<iframe
  class="maistro-website-embed"
  src="/maistro-kitchen/index.html"
  title="Before and after Maistro: an interactive kitchen comparison"
  loading="lazy"
></iframe>
<script>
(() => {
  document.querySelectorAll('.maistro-website-embed').forEach(frame => {
    if (frame.dataset.maistroEmbedReady) return;
    frame.dataset.maistroEmbedReady = 'true';
    let observer;
    let sceneBlock;
    let pending;

    const fit = () => {
      if (!sceneBlock || pending) return;
      pending = requestAnimationFrame(() => {
        pending = null;
        const height = Math.ceil(sceneBlock.getBoundingClientRect().height);
        if (height > 0 && frame.style.height !== height + 'px') {
          frame.style.height = height + 'px';
        }
      });
    };

    const connect = () => {
      if (observer) observer.disconnect();
      sceneBlock = null;
      try {
        sceneBlock = frame.contentDocument &&
          frame.contentDocument.querySelector('.maistro-story');
      } catch (_) {
        return;
      }
      if (!sceneBlock) return;
      fit();
      if ('ResizeObserver' in window) {
        observer = new ResizeObserver(fit);
        observer.observe(sceneBlock);
      }
    };

    frame.addEventListener('load', connect);
    window.addEventListener('resize', fit, { passive: true });
    connect();
  });
})();
</script>`
