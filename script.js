const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const radiusInput = document.getElementById("radiusInput");
const clearBtn = document.getElementById("clearBtn");

const circlePosition = document.getElementById("circlePosition");
const circleRadius = document.getElementById("circleRadius");
const circleColor = document.getElementById("circleColor");

let circles = [];
let selectedCircleIndex = null;
let isDragging = false;
let offsetX, offsetY;

canvas.addEventListener("click", function (e) {
  const { x, y } = getMousePos(e);
  const clickedIndex = findCircleIndex(x, y);
  if (clickedIndex !== -1) {
    selectedCircleIndex = clickedIndex;
  } else {
    const color = colorPicker.value;
    const radius = parseInt(radiusInput.value, 10) || 20;
    circles.push({ x, y, radius, color });
    selectedCircleIndex = circles.length - 1;
  }
  drawCircles();
  updateCircleInfo();
});

canvas.addEventListener("mousedown", function (e) {
  const { x, y } = getMousePos(e);
  if (selectedCircleIndex !== null && isInsideCircle(circles[selectedCircleIndex], x, y)) {
    isDragging = true;
    offsetX = x - circles[selectedCircleIndex].x;
    offsetY = y - circles[selectedCircleIndex].y;
  }
});

canvas.addEventListener("mousemove", function (e) {
  if (isDragging && selectedCircleIndex !== null) {
    const { x, y } = getMousePos(e);
    circles[selectedCircleIndex].x = x - offsetX;
    circles[selectedCircleIndex].y = y - offsetY;
    drawCircles();
    updateCircleInfo();
  }
});

canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Delete" && selectedCircleIndex !== null) {
    circles.splice(selectedCircleIndex, 1);
    selectedCircleIndex = null;
    drawCircles();
    updateCircleInfo();
  }
});

canvas.addEventListener("wheel", function (e) {
  if (selectedCircleIndex !== null) {
    e.preventDefault();
    let circle = circles[selectedCircleIndex];
    if (e.deltaY < 0) {
      circle.radius += 2;
    } else {
      circle.radius = Math.max(5, circle.radius - 2);
    }
    drawCircles();
    updateCircleInfo();
  }
});

clearBtn.addEventListener("click", function () {
  circles = [];
  selectedCircleIndex = null;
  drawCircles();
  updateCircleInfo();
});

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function findCircleIndex(x, y) {
  for (let i = circles.length - 1; i >= 0; i--) {
    if (isInsideCircle(circles[i], x, y)) {
      return i;
    }
  }
  return -1;
}

function isInsideCircle(circle, x, y) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach((circle, index) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = index === selectedCircleIndex ? "red" : circle.color;
    ctx.fill();
    ctx.closePath();
  });
}

function updateCircleInfo() {
  if (selectedCircleIndex !== null) {
    const circle = circles[selectedCircleIndex];
    circlePosition.textContent = `Position: (${Math.round(circle.x)}, ${Math.round(circle.y)})`;
    circleRadius.textContent = `Radius: ${circle.radius}`;
    circleColor.textContent = `Color: ${circle.color}`;
  } else {
    circlePosition.textContent = "Position: N/A";
    circleRadius.textContent = "Radius: N/A";
    circleColor.textContent = "Color: N/A";
  }
}

// Touch support for mobile devices
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  const touch = e.touches[0];
  const { x, y } = getTouchPos(touch);
  const clickedIndex = findCircleIndex(x, y);
  if (clickedIndex !== -1) {
    selectedCircleIndex = clickedIndex;
  } else {
    const color = colorPicker.value;
    const radius = parseInt(radiusInput.value, 10) || 20;
    circles.push({ x, y, radius, color });
    selectedCircleIndex = circles.length - 1;
  }
  drawCircles();
  updateCircleInfo();
}, { passive: false });

canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  if (selectedCircleIndex !== null) {
    const touch = e.touches[0];
    const { x, y } = getTouchPos(touch);
    circles[selectedCircleIndex].x = x;
    circles[selectedCircleIndex].y = y;
    drawCircles();
    updateCircleInfo();
  }
}, { passive: false });

canvas.addEventListener("touchend", function (e) {
  e.preventDefault();
  isDragging = false;
}, { passive: false });

function getTouchPos(touch) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}
