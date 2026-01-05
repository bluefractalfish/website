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


