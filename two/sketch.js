let cols = 3;
let rows = 2;
let grid = [];

let stepsPerCell = 1;
let padding = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Use hue-based colors
  colorMode(HSB, 360, 100, 100, 100);

  textAlign(CENTER, CENTER);
  textSize(100);
  strokeWeight(130);

  regenerate();
  noLoop();
}

function draw() {
  background(0, 0, 0);

  const cellW = (width - padding * 2) / cols;
  const cellH = (height - padding * 2) / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      drawRouteFrom(i, j, cellW, cellH);
    }
  }


}

function drawRouteFrom(i, j, cellW, cellH) {

  let ci = i;
  let cj = j;

  // give each route its own hue
  let hue = random(360);

  for (let s = 0; s < stepsPerCell; s++) {

    const dir = digitToDir(grid[ci][cj]);

    const ni = constrain(ci + dir.di, 0, cols - 1);
    const nj = constrain(cj + dir.dj, 0, rows - 1);

    if (ni === ci && nj === cj) break;

    const a = cellCenter(ci, cj, cellW, cellH);
    const b = cellCenter(ni, nj, cellW, cellH);

    // colorful stroke
    stroke(hue, 80, 90, 80);

    line(a.x, a.y, b.x, b.y);

    ci = ni;
    cj = nj;

    // shift hue slightly each step
    hue = (hue + 50) % 360;
  }
}

function digitToDir(d) {
  switch (d) {
    case 0: return { di: 1, dj: 0 };
    case 1: return { di: 1, dj: -1 };
    case 2: return { di: 0, dj: -1 };
    case 3: return { di: -1, dj: -1 };
    case 4: return { di: -1, dj: 0 };
    case 5: return { di: -1, dj: 1 };
    case 6: return { di: 0, dj: 1 };
    case 7: return { di: 1, dj: 1 };
    case 8: return { di: 2, dj: 0 };
    case 9: return { di: 0, dj: 2 };
  }
}

function cellCenter(i, j, cellW, cellH) {
  return {
    x: padding + i * cellW + cellW / 2,
    y: padding + j * cellH + cellH / 2
  };
}

function regenerate() {
  grid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(10));
    }
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    regenerate();
    redraw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
