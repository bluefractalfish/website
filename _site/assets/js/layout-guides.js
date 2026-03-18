// /assets/js/layout-guides.js
// p5 INSTANCE MODE overlay that outlines header/footer rows + left/right fields

(() => {
  const sketch = (p) => {
    let cnv;

    function rectOf(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    }

    function box(r, col) {
      if (!r) return;
      p.stroke(col);
      p.noFill();
      p.rect(r.x, r.y, r.w, r.h);
    }

    p.setup = () => {
      cnv = p.createCanvas(window.innerWidth, window.innerHeight);
      cnv.position(0, 0);
      cnv.style("position", "fixed");
      cnv.style("top", "0");
      cnv.style("left", "0");
      cnv.style("pointer-events", "none");
      cnv.style("z-index", "999999"); // keep it on top
      p.noFill();
    };

    p.draw = () => {
      p.clear();

      p.strokeWeight(1);

      // Outline header row + left/right header fields
      box(rectOf(document.querySelector(".head-row")), p.color(255, 80, 80));
      box(rectOf(document.querySelector(".cursor-left")), p.color(255, 160, 80));
      box(rectOf(document.querySelector(".cursor-right")), p.color(255, 160, 80));

      // Outline footer row + left/right footer fields
      box(rectOf(document.querySelector(".foot-row")), p.color(80, 200, 255));
      box(rectOf(document.querySelector(".footer-left")), p.color(120, 255, 180));
      box(rectOf(document.querySelector(".footer-right")), p.color(120, 255, 180));

    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  };

  new p5(sketch);
})();
