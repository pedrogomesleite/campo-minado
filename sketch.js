let grid;
let numGrid;
let newGrid;
let tam = 20;
let gridH, gridW;
let button;

let flag = 3;
let bomb = 1;
let none = 0;
let see = 2;

let lose = false;
let win = 0;

let qtdBombs;



function setup() {
  widthSize = floor(windowWidth / tam) * tam;
  heightSize = (floor(windowHeight / tam) * tam) - tam * 5;
  createCanvas(widthSize, heightSize);
  gridH = height / tam;
  gridW = width / tam;

  background(255);
  qtdBombs = createInput();
  qtdBombs.input(inputChanged);
}

function inputChanged() {
  createGrid(qtdBombs.value());
  drawGrid(grid);
}

function createGrid(bombs) {
  lose = false;
  win = gridH * gridW - bombs;
  grid = [];
  numGrid = []
  for (let i = 0; i < gridW; i++) {
    grid[i] = [];
    numGrid[i] = [];
    for (let j = 0; j < gridH; j++) {
      grid[i][j] = none;
      numGrid[i][j] = none;
    }
  }
  bombs = int(bombs)
  for (let i = 0; i < bombs; i++) {
    let x = floor(random(0, gridW));
    let y = floor(random(0, gridH));

    if (grid[x][y] == none) {
      grid[x][y] = bomb;
    }
  }
  for (let i = 0; i < gridW; i++) {
    for (let j = 0; j < gridH; j++) {
      let num = countBombs(i, j, grid);
      numGrid[i][j] = num;
    }
  }
}

function drawGrid(grid) {
  for (let i = 0; i < gridW; i++) {
    for (let j = 0; j < gridH; j++) {
      if (!lose) {
        if (grid[i][j] == none || grid[i][j] == bomb) {
          fill(220);
          stroke(180);
          rect(i * tam, j * tam, tam);
        }
        else if (grid[i][j] >= flag) {
          stroke(0);
          let x1 = i * tam + tam * 0.8;
          let y1 = j * tam + tam * 0.8;
          let y2 = j * tam + tam * 0.2;
          line(x1, y1, x1, y2);
          let y3 = j * tam + tam * 0.5;
          let x2 = i * tam + tam * 0.4;
          beginShape();
          vertex(x1, y1);
          vertex(x1, y3);
          vertex(x2, y1);
          vertex(x2, y3);
          bezierVertex(x1, y1, x1 - tam * 0.5, y1 - tam * 0.2, x2, y1);
          bezierVertex(x1, y2, x1 - tam * 0.5, y2 - tam * 0.2, x2, y2);
          endShape();
        }
        else if (grid[i][j] == see) {
          fill(255);
          stroke(180);
          rect(i * tam, j * tam, tam);
          let num = countBombs(i, j, grid);

          if (num > 0) {
            numGrid[i][j] = num;
            fill(0);
            stroke(0);
            text(num, (i * tam) + tam * 0.3, (j * tam) + tam * 0.75);
          }
        }
      }
      else {
        fill(255);
        stroke(180);
        rect(i * tam, j * tam, tam);

        if (grid[i][j] == bomb || grid[i][j] == bomb + flag) {
          fill(0);
          circle(i * tam + tam / 2, j * tam + tam / 2, tam);
        }
      }
    }
  }
}

function countBombs(x, y, grid) {
  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newX = x + i;
      const newY = y + j;
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
        if (grid[newX][newY] == bomb || grid[newX][newY] == bomb + flag) {
          count++;
        }
      }
    }
  }

  return count;
}

document.addEventListener('contextmenu', function (event) {
  var rightEvent = new Event('right');
  document.dispatchEvent(rightEvent);
  event.preventDefault();
});

document.addEventListener('right', function () {
  button = "right";
  let x = floor(mouseX / tam);
  let y = floor(mouseY / tam);
  if (x < 0 || x > gridW || y < 0 || y > gridH) {
    return;
  }
  updateGrid(x, y, button);
});

function mouseClicked() {
  button = "left"
  let x = floor(mouseX / tam);
  let y = floor(mouseY / tam);
  if (x < 0 || x > gridW || y < 0 || y > gridH) {
    return;
  }
  updateGrid(x, y, button);
}

function updateGrid(x, y, button) {
  newGrid = grid;

  if (button === "right") {
    if (newGrid[x][y] >= flag && newGrid[x][y] != see) {
      newGrid[x][y] -= flag;
    }
    else {
      newGrid[x][y] += flag;
    }
  }
  else if (button === "left") {
    if (newGrid[x][y] == bomb) {
      lose = true;
    }
    else {
      verify(x, y, false);
    }
  }

  grid = newGrid;
  drawGrid(grid);
}

function verify(x, y, notFirst) {
  // if(count >= (gridH * gridW) / 100) {
  //   return;
  // }
  if (x < 0 || x == gridW) {
    return;
  }
  if (y < 0 || y == gridH) {
    return;
  }
  
  if (newGrid[x][y] == bomb || newGrid[x][y] == bomb + flag) {
    return;
  }
  if (newGrid[x][y] == see) {
    return;
  }
  if(verifyNumgrid(x,y) && notFirst){
    newGrid[x][y] = see;
    return;
  }
  if (newGrid[x][y] == none || newGrid[x][y] == none + flag) {
    newGrid[x][y] = see;
  }
  verify(x - 1, y, true);
  verify(x + 1, y, true);
  verify(x, y - 1, true);
  verify(x - 1, y - 1, true);
  verify(x + 1, y - 1, true);
  verify(x, y + 1, true);
  verify(x - 1, y + 1, true);
  verify(x + 1, y + 1, true);
}

function verifyNumgrid(x, y, notFirst = true) {
  if (numGrid[x][y] == none && notFirst) {
    return false;
  }
  else if (numGrid[x][y] > none && notFirst) {
    return true;
  }
  else {
    const rows = numGrid.length;
    const cols = numGrid[0].length;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
          if (verifyNumgrid(newX, newY)) {
            return true;
          }
        }
      }
    }
  }
}