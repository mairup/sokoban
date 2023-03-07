const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const textarea = document.getElementById("a");
let i = 1;
let man = [0, 0];

let currentLevel = levels[0].split("\n");
drawLevel(currentLevel);

function drawLevel(level) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  textarea.value = "";
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
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
    console.log(man);
  }

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
  ctx.fillStyle = "black";
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
  currentLevel = levels[i].split("\n")
  drawLevel(currentLevel)
  i++;
  if (i == 21) i = 0
})

function move(type, direction) {
  let nextPos = [0, 0];
  nextPos[0] = man[0];
  nextPos[1] = man[1];

  let nextNextPos = [0, 0];
  nextNextPos[0] = man[0];
  nextNextPos[1] = man[1];

  switch (direction) {
    case "up":
      nextPos[0] -= 1;
      nextNextPos[0] -= 2;

      break;

    case "down":
      nextPos[0] += 1;
      nextNextPos[0] += 2;

      break;

    case "left":
      nextPos[1] -= 1;
      nextNextPos[1] -= 2;

      break;

    case "right":
      nextPos[1] += 1;
      nextNextPos[1] += 2;

      break;

    default:
      break;
  }

  console.log("currentLevel[" + man[0] + "][" + man[1] + "]");
  console.log("currentLevel[" + nextPos[0] + "][" + nextPos[1] + "]");
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

      console.log(currentLevel[man[0]][man[1]]);

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

  drawLevel(currentLevel)
  console.log(currentLevel[man[0]][man[1]]);
}

document.addEventListener(
  "keypress",
  (event) => {
    const keyName = event.key;

    if (keyName === "w")
      move(1, "up")
    else if (keyName === "a")
      move(1, "left")
    else if (keyName === "s")
      move(1, "down")
    else if (keyName === "d")
      move(1, "right")
    else if (keyName === "W")
      move(2, "up")
    else if (keyName === "A")
      move(2, "left")
    else if (keyName === "S")
      move(2, "down")
    else if (keyName === "D")
      move(2, "right")

  },
  false
);

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}