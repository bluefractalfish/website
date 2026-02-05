
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

//font scrambler
(() => {
  const text = "f.Fish";
  const logo = document.getElementById("ffish");
  if (!logo) return;

  const fontClasses = ["f0","f1","f2","f3","f4","f5"];

  // Build spans once
  logo.innerHTML = "";
  const spans = [...text].map(ch => {
    const s = document.createElement("span");
    s.textContent = ch;
    logo.appendChild(s);
    return s;
  });

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function randomize() {
    spans.forEach((s) => {
      // remove any existing font class
      fontClasses.forEach(c => s.classList.remove(c));
      // add a random one
      s.classList.add(pick(fontClasses));
    });
  }

  randomize();                 
  setInterval(randomize, 10000); // change randomly every 10s

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

