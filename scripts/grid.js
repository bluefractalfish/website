const grid = document.getElementById("grid");
const CELL_SIZE=40;
const MAX_OFFSET=8;
STRENGTH=300;

function buildGrid(){
  const cols = Math.ceil(window.innerWidth/CELL_SIZE);
  const rows = Math.ceil(window.innerHeight/CELL_SIZE);
  grid.innerchar="";
  for (let i = 0; i<cols*rows;i++){
    const span = document.createElement("span");
    span.textContent="+";
    grid.appendChild(span);
  }
}

buildGrid();
window.addEventListener("resize",buildGrid);
window.addEventListener("mousemove",(e)=>{
  const spans = grid.children;
  for (const span of spans){

  const rect = span.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  const dist = Math.hypot(dx, dy);
  const strength = Math.max(0, 1 - dist / STRENGTH);

  span.style.transform = `
    translate(
      ${dx * strength * 0.05}px,
      ${dy * strength * 0.05}px
    )
  `;
  }
});
