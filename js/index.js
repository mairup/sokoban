const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const textarea = document.getElementById("a");
const textareaB = document.getElementById("b");
let i = 1;
let man = [0, 0];
let moves = "";

let currentLevel = levels[0].split("\n");
drawLevel(currentLevel);

function drawLevel(level, prevLevel) {
  if (!prevLevel)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  textarea.value = "";
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      if (!prevLevel)
        drawBlock(level[i][j], i, j);
      else if (prevLevel[i][j] != level[i][j])
        drawBlock(level[i][j], i, j);
      textarea.value += currentLevel[i][j];
    }
    textarea.value += "\n"
  }
}


function drawBlock(item, i, j) {
  const blockWidth = canvas.width / currentLevel[i].length;
  const blockHeight = canvas.height / currentLevel.length;

  if (item == "S" || item == "$") {
    man[0] = i;
    man[1] = j;
  }

  ctx.clearRect(blockWidth * j, blockHeight * i, blockWidth, blockHeight);

  switch (item) {
    case "#":
      drawWall(blockWidth * j, blockHeight * i, blockWidth, blockHeight);
      break;

    case "S":
      drawMan(blockWidth * j, blockHeight * i, blockWidth, blockHeight);
      break;

    case "$":
      drawManOnPoint(blockWidth * j, blockHeight * i, blockWidth, blockHeight);
      break;

    case "Z":
      drawBox(blockWidth * j, blockHeight * i, blockWidth, blockHeight);
      break;

    case "O":
      drawEndPoint(blockWidth * j, blockHeight * i, blockWidth, blockHeight);
      break;

    case "%":
      drawBoxOnEndPoint(
        blockWidth * j,
        blockHeight * i,
        blockWidth,
        blockHeight
      );
      break;

    default:
      break;
  }
}

function drawWall(offsetX, offsetY, width, height) {
  ctx.fillStyle = "black";
  ctx.fillRect(offsetX + width / 10, offsetY + height / 10, width - width / 5, height - height / 5);
}

function drawMan(offsetX, offsetY, width, height) {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(
    offsetX + width / 2,
    offsetY + height / 2,
    width / 2 - width / 4,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.closePath();
}

function drawManOnPoint(offsetX, offsetY, width, height) {
  drawEndPoint(offsetX, offsetY, width, height);
  drawMan(offsetX, offsetY, width, height);
}

function drawBox(offsetX, offsetY, width, height) {
  ctx.fillStyle = "#8b512a";
  ctx.fillRect(offsetX + width / 4, offsetY + height / 4, width - width / 2, height - height / 2);
}

function drawEndPoint(offsetX, offsetY, width, height) {
  ctx.fillStyle = "green";
  ctx.fillRect(offsetX + width / 10, offsetY + height / 10, width - width / 5, height - height / 5);
}

function drawBoxOnEndPoint(offsetX, offsetY, width, height) {
  drawEndPoint(offsetX, offsetY, width, height);
  drawBox(offsetX, offsetY, width, height);
}

textarea.addEventListener("input", () => {
  currentLevel = textarea.value.split("\n")
  drawLevel(currentLevel)
})

canvas.addEventListener("click", () => {
  moves = ""
  currentLevel = levels[i].split("\n")
  drawLevel(currentLevel)
  i++;
  if (i == levels.length) i = 0
})

function move(type, direction) {
  prevLevel = { ...currentLevel }

  if (type == 0) type = 1;

  let nextPos = man.map((x) => x);
  let nextNextPos = man.map((x) => x);
  let tmpPos = man.map((x) => x);
  let tmpDir;

  switch (direction) {
    case "up":
    case "G":
      nextPos[0] -= 1;
      nextNextPos[0] -= 2;
      tmpDir = "G"
      break;

    case "down":
    case "D":
      nextPos[0] += 1;
      nextNextPos[0] += 2;
      tmpDir = "D"
      break;

    case "left":
    case "L":
      nextPos[1] -= 1;
      nextNextPos[1] -= 2;
      tmpDir = "L"
      break;

    case "right":
    case "R":
      nextPos[1] += 1;
      nextNextPos[1] += 2;
      tmpDir = "R"
      break;

    default:
      break;
  }

  if (currentLevel[nextPos[0]][nextPos[1]] == "Z" || currentLevel[nextPos[0]][nextPos[1]] == "%")
    moves += type
  else moves += "0"

  moves += tmpDir;

  switch (currentLevel[nextPos[0]][nextPos[1]]) {
    case ".":
    case "O":
      if (currentLevel[nextPos[0]][nextPos[1]] == ".")
        currentLevel[nextPos[0]] = setCharAt(currentLevel[nextPos[0]], nextPos[1], 'S');
      else
        currentLevel[nextPos[0]] = setCharAt(currentLevel[nextPos[0]], nextPos[1], '$');

      if (currentLevel[man[0]][man[1]] == "S")
        currentLevel[man[0]] = setCharAt(currentLevel[man[0]], man[1], '.');
      else
        currentLevel[man[0]] = setCharAt(currentLevel[man[0]], man[1], 'O');

      break;

    case "Z":
    case "%":
      if (type == 1 && (currentLevel[nextNextPos[0]][nextNextPos[1]] == "." || currentLevel[nextNextPos[0]][nextNextPos[1]] == "O")) {
        if (currentLevel[man[0]][man[1]] == "S")
          currentLevel[man[0]] = setCharAt(currentLevel[man[0]], man[1], '.');
        else
          currentLevel[man[0]] = setCharAt(currentLevel[man[0]], man[1], 'O');

        if (currentLevel[nextPos[0]][nextPos[1]] == "Z")
          currentLevel[nextPos[0]] = setCharAt(currentLevel[nextPos[0]], nextPos[1], 'S');
        else
          currentLevel[nextPos[0]] = setCharAt(currentLevel[nextPos[0]], nextPos[1], '$');

        if (currentLevel[nextNextPos[0]][nextNextPos[1]] == ".")
          currentLevel[nextNextPos[0]] = setCharAt(currentLevel[nextNextPos[0]], nextNextPos[1], 'Z');
        else
          currentLevel[nextNextPos[0]] = setCharAt(currentLevel[nextNextPos[0]], nextNextPos[1], '%');
      }
      else if (type == 2) {
        if (currentLevel[man[0]][man[1]] == "S")
          currentLevel[man[0]] = setCharAt(currentLevel[man[0]], man[1], 'Z');
        else
          currentLevel[man[0]] = setCharAt(currentLevel[man[0]], man[1], '%');

        if (currentLevel[nextPos[0]][nextPos[1]] == "Z")
          currentLevel[nextPos[0]] = setCharAt(currentLevel[nextPos[0]], nextPos[1], 'S');
        else currentLevel[nextPos[0]] = setCharAt(currentLevel[nextPos[0]], nextPos[1], '$');
      }
      break;
  }

  drawLevel(currentLevel, prevLevel)
  if (man[0] == tmpPos[0] && man[1] == tmpPos[1])
    moves = moves.substring(0, moves.length - 2)

  textareaB.value = moves;
}

document.addEventListener(
  "keypress",
  (event) => {
    const key = event.key;

    switch (key) {
      case "w": move(1, "up")
        break;
      case "a": move(1, "left")
        break;
      case "s": move(1, "down")
        break;
      case "d": move(1, "right")
        break;
      case "W": move(2, "up")
        break;
      case "A": move(2, "left")
        break;
      case "S": move(2, "down")
        break;
      case "D": move(2, "right")
        break;
    }

  },
  false
);

function executeScript(script) {
  moves = "";
  for (let i = 0; i < script.length; i += 2)
    move(script[i], script[i + 1])
}

function reloadLevel() {
  currentLevel = levels[i - 1].split("\n");
  drawLevel(currentLevel);
  moves = ""
  textareaB.value = ""
}

document.getElementById("execute-script").addEventListener("click", () => {
  executeScript(textareaB.value)
})

document.getElementById("undo-move").addEventListener("click", () => {
  let tmp = moves.substring(0, moves.length - 2);
  reloadLevel()
  executeScript(tmp)
})

document.getElementById("reload-level").addEventListener("click", () => {
  reloadLevel()
})

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}