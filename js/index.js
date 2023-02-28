const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let currentLevel = levels[0].split("\n");

for (let i = 0; i < currentLevel.length; i++)
  for (let j = 0; j < currentLevel[i].length; j++)
    drawBlock(currentLevel[i][j], i, j);

function drawBlock(item, i, j) {
  const blockWidth = canvas.width / currentLevel[i].length;
  const blockHeight = canvas.height / currentLevel.length;

  switch (item) {
    case "#":
      drawWall(blockWidth * j, blockHeight * i, blockWidth, blockHeight);
      break;

    default:
      break;
  }
}

function drawWall(offsetX, offsetY, width, height) {
  ctx.fillRect(offsetX + 5, offsetY + 5, width - 10, height - 10);
}
