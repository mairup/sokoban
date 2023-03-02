const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const textarea = document.getElementById("a");

let currentLevel = levels[0].split("\n");

function drawLevel(level) {
  for (let i = 0; i < level.length; i++)
    for (let j = 0; j < level[i].length; j++)
      drawBlock(level[i][j], i, j);
}


function drawBlock(item, i, j) {
  const blockWidth = canvas.width / currentLevel[i].length;
  const blockHeight = canvas.height / currentLevel.length;

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentLevel = textarea.value.split("\n")
  drawLevel(currentLevel)
})