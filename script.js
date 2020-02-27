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
xRotaion = 0
yRotaion = 0

// opation functions
// opation functions
// opation functions

function vecVecAdd(vec1, vec2) {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]]
}

function vecVecSub(vec1, vec2) {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]]
}

function vecIntMul(vec, int) {
  return [vec[0] * int, vec[1] * int, vec[2] * int]
}

function vecIntDiv(vec, int) {
  return [vec[0] / int, vec[1] / int, vec[2] / int]
}

function vecVecDot(vec1, vec2) {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2]
}

function vecDis(vec) {
  return Math.sqrt(vecDot(vec, vec))
}

function vecNorm(vec) {
  let distance = vecDis(vec)
  return vecIntDiv(vec, distance)
}

function vecVecCross(vec1, vec2) {
  return [
    vec1[1] * vec2[2] - vec1[2] * vec2[1],
    vec1[2] * vec2[0] - vec1[0] * vec2[2],
    vec1[0] * vec2[1] - vec1[1] * vec2[0]
  ]
}

function vecMatMul(vec, mat) {
  if (vec[3] == null) {
    let v3 = 1
  } else {
    let v3 = vec[3]
  }
  let x = vec[0] * mat[0][0] + vec[1] * mat[1][0] + vec[2] * mat[2][0] + v3 * mat[3][0]
  let y = vec[0] * mat[0][1] + vec[1] * mat[1][1] + vec[2] * mat[2][1] + v3 * mat[3][1]
  let z = vec[0] * mat[0][2] + vec[1] * mat[1][2] + vec[2] * mat[2][2] + v3 * mat[3][2]
  let w = vec[0] * mat[0][3] + vec[1] * mat[1][3] + vec[2] * mat[2][3] + v3 * mat[3][3]
  return [x, y, z, w]
}

function matMatMul(mat1, mat2) {
  let matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
  for (c = 0; c < 4; c++) {
    for (r = 0; r < 4; r++) {
      matrix[r][c] = mat1[r][0] * mat2[0][c] + mat1[r][1] * mat2[1][c] + mat1[r][2] * mat2[2][c] + mat1[r][3] * mat2[3][c];
    }
  }
  return matrix
}

function PointAt(position, target, up) {
  let forward = vecNorm(vecSub(target, position))
  let newUp = vecNorm(vecVecSub(up, vecIntMul(forward, vecVecDot(up, forward))))
  let right = vecVecCross(newUp, forward)
  return [
    [right[0], right[1], right[2], 0],
    [newUp[0], newUp[1], newUp[2], 0],
    [forward[0], forward[1], forward[2], 0],
    [position[0], position[1], position[2], 1],
  ]
}

function LookAt(mat) {
  return [
    [mat[0][0], mat[1][0], mat[2][0], 0],
    [mat[0][1], mat[1][1], mat[2][1], 0],
    [mat[0][2], mat[1][2], mat[2][2], 0],
    [
      -(mat[3][0] * mat[0][0] + mat[3][1] * mat[0][1] + mat[3][2] * mat[0][2]),
      -(mat[3][0] * mat[1][0] + mat[3][1] * mat[1][1] + mat[3][2] * mat[1][2]),
      -(mat[3][0] * mat[2][0] + mat[3][1] * mat[2][1] + mat[3][2] * mat[2][2]),
      1
    ],
  ]
}

// rotation functions
// rotation functions
// rotation functions

function rotMatx(theta) {
  return [
    [1, 0, 0, 0],
    [0, Math.cos(theta), Math.sin(theta), 0],
    [0, -Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 0, 1]
  ]
}

function rotMatz(theta) {
  return [
    [Math.cos(theta), Math.sin(theta), 0, 0],
    [-Math.sin(theta), Math.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]
}

function rotMaty(theta) {
  return [
    [Math.cos(theta), 0, Math.sin(theta), 0],
    [0, 1, 0, 0],
    [-Math.sin(theta), 0, Math.cos(theta), 0],
    [0, 0, 0, 1]
  ]
}

// 3D function
// 3D function
// 3D function

function 3D() {
  worldMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
  ]
  up = [0, 1, 0]
  target = [0, 0, 1]
}

// mainloop
// mainloop
// mainloop

mainloop = () => {
  windowInfo()
  keyToMovement()
  fillScreen("black")
  3D()
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