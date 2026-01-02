// corner-follow.js
const boxes = document.querySelectorAll('.box');
const head = document.getElementById("head");
const triggerY = 12;
const maxOffset = 5;

window.addEventListener("scroll", () => {
  if (window.scrollY > triggerY){
    head.classList.add("is-fish");
  } else {
    head.classList.remove("is-fish");
  }
});
 
boxes.forEach(box => {
  const corners = box.querySelectorAll('.corner');

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
