const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const textareaB = document.getElementById("b");
const levelNum2 = document.getElementById("levelNum2");
let levelNum = { value: 0 };
levelNum2.innerText = 1;
let man = [0, 0];
let moves = "";
let prevMoves = [];

let currentLevel = levels[0].split("\n");
drawLevel(currentLevel);

function drawLevel(level, prevLevel) {
  currentLevel = level
  if (!prevLevel)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      if (!prevLevel)
        drawBlock(level[i][j], i, j);
      else if (prevLevel[i][j] != level[i][j])
        drawBlock(level[i][j], i, j);
    }
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
    width / 2 - width / 5,
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

function move(type, direction) {

  prevLevel = { ...currentLevel }

  prevMoves.push([...currentLevel])

  if (type == 0) type = 1;

  let nextPos = { ...man }
  let nextNextPos = { ...man }
  let tmpPos = { ...man }
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
  if (man[0] == tmpPos[0] && man[1] == tmpPos[1]) {
    moves = moves.substring(0, moves.length - 2)
    prevMoves.pop();
    textareaB.value = moves;
  }


  textareaB.value = moves;

  if (checkCompletion())
    Swal.fire({
      title: 'Level completed',
      text: 'Total moves: ' + moves.length / 2,
      icon: 'success',
      confirmButtonText: 'Ok',
      confirmButtonColor: "#a5dc86",
    })
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

function reloadLevel() {
  currentLevel = levels[levelNum.value].split("\n");
  drawLevel(currentLevel);
  moves = "";
  prevMoves = [];
  textareaB.value = "";
}

function executeScript(script) {
  moves = "";
  prevMoves = [];
  for (let i = 0; i < script.length; i += 2)
    move(script[i], script[i + 1])
}

document.getElementById("execute-script").addEventListener("click", () => {
  executeScript(textareaB.value)
})

document.getElementById("undo-move").addEventListener("click", () => {
  if (prevMoves[prevMoves.length - 1]) {
    moves = moves.substring(0, moves.length - 2);
    textareaB.value = moves;
    drawLevel(prevMoves[prevMoves.length - 1], [...currentLevel])
    prevMoves.pop()
  }
})

document.getElementById("reload-level").addEventListener("click", () => {
  reloadLevel()
})

/* textarea.addEventListener("input", () => {
  currentLevel = textarea.value.split("\n")
  drawLevel(currentLevel)
}) */

levelNum.oninput = () => {
  if (levelNum.value >= levels.length || levelNum.value < 0) levelNum.value = 0
  levelNum2.innerText = levelNum.value + 1
  moves = ""
  prevMoves = []
  currentLevel = levels[levelNum.value].split("\n")
  drawLevel(currentLevel)
  textareaB.value = moves
}


document.getElementById("expand-button").addEventListener("click", () => {
  document.getElementById("side-container").classList.toggle("expanded-side-container");
  document.getElementById("main-container").classList.toggle("expanded-main-container")
})

document.getElementById("lower-level").addEventListener("click", () => {
  levelNum.value -= 1;
  if (levelNum.value >= levels.length || levelNum.value < 0) levelNum.value = 0
  levelNum2.innerText = levelNum.value + 1
  moves = ""
  prevMoves = []
  currentLevel = levels[levelNum.value].split("\n")
  drawLevel(currentLevel)
  textareaB.value = moves

})

document.getElementById("higher-level").addEventListener("click", () => {
  levelNum.value += 1;
  if (levelNum.value >= levels.length || levelNum.value < 0) levelNum.value = 0
  levelNum2.innerText = levelNum.value + 1
  moves = ""
  prevMoves = []
  currentLevel = levels[levelNum.value].split("\n")
  drawLevel(currentLevel)
  textareaB.value = moves

})

function checkCompletion() {
  let b = true;
  for (i = 0; i < currentLevel.length; i++)
    if (currentLevel[i].includes("Z")) b = false
  return b;
}

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}