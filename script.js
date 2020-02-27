canvas = document.getElementById('canvas')
ctx = canvas.getContext("2d")
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mousedown", function () { click = true });
canvas.addEventListener("mouseup", function () { click = false });
canvas.requestPointerLock();
canvas.onclick = function () { canvas.requestPointerLock() }

keyId = []
keyPressed = []
meshList = []
click = false
mode = true
mousex = 0
mousey = 0

// mainloop
// mainloop
// mainloop

mainloop = () => {
  windowInfo()
  keyToMovement()
  fillScreen("black")
  shape("white", true, [mousex, mousey, 10 + mousex, 10 + mousey, 20 + mousex, mousey, 10 + mousex, mousey - 10])
  request = requestAnimationFrame(mainloop)
}

// user functions
// user functions
// user functions

function keyToMovement() {
  k = keyId.indexOf("KeyW")
  c = keyId.indexOf("ArrowUp")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
    }
  }
  k = keyId.indexOf("keyPressed")
  c = keyId.indexOf("ArrowDown")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
    }
  }
  k = keyId.indexOf("KeyA")
  c = keyId.indexOf("ArrowLeft")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
    }
  }
  k = keyId.indexOf("KeyD")
  c = keyId.indexOf("ArrowRight")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
    }
  }
  k = keyId.indexOf("ShiftLeft")
  if (k > -1) {
    if (keyPressed[k]) {
    }
  }
  k = keyId.indexOf("Space")
  if (k > -1) {
    if (keyPressed[k]) {
    }
  }
}

function mouseMove(e) {
  mousex += e.movementX
  mousey -= e.movementY
}

function keyDown(e) {
  key = e.code
  e.preventDefault()
  // if (key == "Space") {
  //   mode = !mode
  // }
  if (keyId.includes(key)) {
    k = keyId.indexOf(key)
    if (!keyPressed[k]) {
      keyPressed[k] = true
    }
  } else {
    keyId.push(key)
    keyPressed.push(true)
  }
}

function keyUp(e) {
  key = e.code
  e.preventDefault()
  k = keyId.indexOf(key)
  if (keyPressed[k]) {
    keyPressed[k] = false
  }
}

function windowInfo() {
  screenWidth = window.innerWidth
  screenHeight = window.innerHeight
  halfWidth = screenWidth / 2
  halfHeight = screenHeight / 2
  document.getElementById('canvas').width = screenWidth
  document.getElementById('canvas').height = screenHeight
}

// drawing functions
// drawing functions
// drawing functions

function shape(color, option, points) {
  ctx.beginPath();
  ctx.moveTo(points[0] + halfWidth, halfHeight - points[1]);
  for (let i = 2; i < points.length; i += 2) {
    ctx.lineTo(points[i] + halfWidth, halfHeight - points[i + 1]);
  }
  ctx.closePath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.stroke();
  if (option) {
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function text(x, y, text, size, color) {
  ctx.font = size + 'px'
  ctx.fillStyle = color
  ctx.fillText(text, x + halfWidth, halfHeight - y)
}

function fillScreen(color) {
  ctx.beginPath();
  ctx.rect(0, 0, screenWidth, screenHeight);
  ctx.fillStyle = color;
  ctx.fill();
}

// mesh functions
// mesh functions
// mesh functions

function loadMesh(filename) {
  $.ajax({
    url: filename,
    async: false,
    dataType: 'text'
  }).done(function (data) {
    meshList.push(loadMeshData(data))
  })
}

$(document).ready(function () {
  loadMesh('mesh.doc')
  mainloop()
});

function loadMeshData(string) {
  var lines = string.split("\n");
  var positions = [];
  var triangles = [];

  for (var i = 0; i < lines.length; i++) {
    var parts = lines[i].trimRight().split(' ');
    if (parts.length > 0) {
      switch (parts[0]) {
        case 'v':
          positions.push([
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          ]);
          break;
        case 'f': {
          if (parts.length == 4) {
            triangles.push([
              positions[parts[1] - 1],
              positions[parts[2] - 1],
              positions[parts[3] - 1]
            ]);
          } else if (parts.length == 5) {
            triangles.push([
              positions[parts[1] - 1],
              positions[parts[2] - 1],
              positions[parts[3] - 1]
            ]);
            triangles.push([
              positions[parts[3] - 1],
              positions[parts[4] - 1],
              positions[parts[1] - 1]
            ]);
          }
          break;
        }
      }
    }
  }
  return triangles
}