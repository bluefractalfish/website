const pad4 = (n) => String(Math.max(0, n|0)).padStart(4, "0");

addEventListener("mousemove", (e) => {
  const x = document.getElementById("cursorX");
  const y = document.getElementById("cursorY");
  if (!x || !y) return;
  x.textContent = pad4(e.clientX);
  y.textContent = pad4(e.clientY);
});
