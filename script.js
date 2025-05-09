/**
 * Get the canvas element and its 2D rendering context.
 */
const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");

/**
 * Get references to UI controls for color, radius, and clear button.
 */
const colorPicker = document.getElementById("colorPicker");
const radiusInput = document.getElementById("radiusInput");
const clearBtn = document.getElementById("clearBtn");

/**
 * Get references to elements displaying selected circle properties.
 */
const circlePosition = document.getElementById("circlePosition");
const circleRadius = document.getElementById("circleRadius");
const circleColor = document.getElementById("circleColor");

/**
 * Array to store all circles on the canvas.
 * Each circle is an object with x, y, radius, and color properties.
 */
let circles = [];

/**
 * Index of the currently selected circle in the circles array.
 * Null if no circle is selected.
 */
let selectedCircleIndex = null;

/**
 * Flag to indicate if a circle is currently being dragged.
 */
let isDragging = false;

/**
 * Offset values to maintain cursor position relative to circle center during dragging.
 */
let offsetX, offsetY;

/**
 * Handle click event on the canvas.
 * If clicking on an existing circle, select it.
 * Otherwise, create a new circle at the click position with selected color and radius.
 */
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

/**
 * Handle mousedown event to start dragging if clicking inside the selected circle.
 */
canvas.addEventListener("mousedown", function (e) {
  const { x, y } = getMousePos(e);
  if (selectedCircleIndex !== null && isInsideCircle(circles[selectedCircleIndex], x, y)) {
    isDragging = true;
    offsetX = x - circles[selectedCircleIndex].x;
    offsetY = y - circles[selectedCircleIndex].y;
  }
});

/**
 * Handle mousemove event to update the position of the dragged circle.
 */
canvas.addEventListener("mousemove", function (e) {
  if (isDragging && selectedCircleIndex !== null) {
    const { x, y } = getMousePos(e);
    circles[selectedCircleIndex].x = x - offsetX;
    circles[selectedCircleIndex].y = y - offsetY;
    drawCircles();
    updateCircleInfo();
  }
});

/**
 * Handle mouseup event to stop dragging.
 */
canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

/**
 * Handle keydown event to delete the selected circle when Delete key is pressed.
 */
window.addEventListener("keydown", function (e) {
  if (e.key === "Delete" && selectedCircleIndex !== null) {
    circles.splice(selectedCircleIndex, 1);
    selectedCircleIndex = null;
    drawCircles();
    updateCircleInfo();
  }
});

/**
 * Handle mouse wheel event to resize the selected circle.
 * Scroll up to increase radius, scroll down to decrease radius (minimum radius 5).
 */
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

/**
 * Handle click event on the clear button to remove all circles.
 */
clearBtn.addEventListener("click", function () {
  circles = [];
  selectedCircleIndex = null;
  drawCircles();
  updateCircleInfo();
});

/**
 * Get mouse position relative to the canvas.
 * @param {MouseEvent} e - The mouse event.
 * @returns {Object} The x and y coordinates.
 */
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

/**
 * Find the index of the circle that contains the point (x, y).
 * Returns -1 if no circle contains the point.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {number} The index of the circle or -1.
 */
function findCircleIndex(x, y) {
  for (let i = circles.length - 1; i >= 0; i--) {
    if (isInsideCircle(circles[i], x, y)) {
      return i;
    }
  }
  return -1;
}

/**
 * Check if the point (x, y) is inside the given circle.
 * @param {Object} circle - The circle object.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {boolean} True if inside, false otherwise.
 */
function isInsideCircle(circle, x, y) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

/**
 * Clear the canvas and redraw all circles.
 * The selected circle is filled in red, others in their own color.
 */
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

/**
 * Update the displayed properties of the selected circle.
 * Shows position, radius, and color.
 * If no circle is selected, shows N/A.
 */
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

/**
 * Touch support for mobile devices.
 * Handles touchstart, touchmove, and touchend events similarly to mouse events.
 */
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

/**
 * Get touch position relative to the canvas.
 * @param {Touch} touch - The touch object.
 * @returns {Object} The x and y coordinates.
 */
function getTouchPos(touch) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}
