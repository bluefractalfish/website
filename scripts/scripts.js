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

 
boxes.forEach(box => {
  const corners = box.querySelectorAll('.corners');

  box.addEventListener('mousemove', e => {
    const boxRect = box.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    corners.forEach(corner => {
      const rect = corner.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = Math.min(maxOffset / dist, 1);
      corner.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });

  });

  box.addEventListener('mouseleave', () => {
    corners.forEach(corner => {
      corner.style.transform = 'translate(0, 0)';
    });

  });
});
