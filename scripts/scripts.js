
// cursor readout
(() => {
  const x = document.getElementById("cursorX");
  const y = document.getElementById("cursorY");
  if (!x || !y) return;

  const pad4 = (n) => String(n % 10000).padStart(4,"0");
  addEventListener("mousemove", (e) => {
    x.textContent = pad4(e.clientX);
    y.textContent = pad4(e.clientY);
  }, { passive: true });
})();



// corner-follow.js

const boxes = document.querySelectorAll('.box');
const maxOffset = 15;

const head = document.querySelector(".head-font");

window.addEventListener("scroll", () => {
  const vh = window.innerHeight;
  const start = .05*vh;
  const end = .45*vh;
  const t = Math.min(
    Math.max((window.scrollY - start) / (end-start),0),1);
  head.classList.toggle("is-fish", window.scrollY > 3);
  head.style.setProperty("--fish-t",t);
});

