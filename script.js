canvas = document.getElementById('canvas')
ctx = canvas.getContext("2d")
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mousedown", function () { click = true });
canvas.addEventListener("mouseup", function () { click = false });
canvas.requestPointerLock();
canvas.onclick = function () { canvas.requestPointerLock() }

camera = [0, 0, 0]
lookDirection = [0, 0, 0]
meshList = []
fNear = 0.1
fFar = 1000
fFov = 90
fFovRad = 1 / Math.tan(fFov / 360 * Math.PI)
xRotation = 0
yRotation = 0
times = []
keyId = []
keyPressed = []
click = false
mode = true
screenWidth = -1
screenHeight = -1
mousex = 0
mousey = 0
windowInfo()

// 3D function
// 3D function
// 3D function

function ToDrawQueue(meshObject, rotationMatrix, translationMatrix) {
  object = copyArray(meshList[meshObject])
  worldMatrix = matMatMul(rotationMatrix, translationMatrix)
  lookDirection = vecMatMul([0, 0, 1], matRotationy(yRotation))
  target = vecVecAdd(camera, lookDirection)
  cameraMatrix = pointAt(camera, target, [0, 1, 0])
  viewMatrix = lookAt(cameraMatrix)
  for (let i = 0; i < object.length; i++) {
    currentTriangle = copyArray(object[i])
    currentTriangle[0] = vecMatMul(currentTriangle[0], worldMatrix)
    currentTriangle[1] = vecMatMul(currentTriangle[1], worldMatrix)
    currentTriangle[2] = vecMatMul(currentTriangle[2], worldMatrix)
    line1 = vecVecSub(currentTriangle[1], currentTriangle[0])
    line2 = vecVecSub(currentTriangle[2], currentTriangle[0])
    normal = vecNorm(vecVecCross(line1, line2))
    cameraRay = vecVecSub(currentTriangle[0], camera)
    if (vecVecDot(normal, cameraRay) < 0) {
      light = vecNorm([-1, -1, -1])
      scaledLight = Math.floor((vecVecDot(light, normal) + 1) / 2 * 235) + 20
      color = scaledLight.toString(16).toUpperCase()
      if (color.length == 1) {
        color = "0" + color
      }
      currentTriangle[0] = vecMatMul(currentTriangle[0], viewMatrix)
      currentTriangle[1] = vecMatMul(currentTriangle[1], viewMatrix)
      currentTriangle[2] = vecMatMul(currentTriangle[2], viewMatrix)
      rotationxMatrix = matRotationx(xRotation)
      currentTriangle[0] = vecMatMul(currentTriangle[0], rotationxMatrix)
      currentTriangle[1] = vecMatMul(currentTriangle[1], rotationxMatrix)
      currentTriangle[2] = vecMatMul(currentTriangle[2], rotationxMatrix)
      nClippedTriangles = 0
      clipped = [[], []]
      nClippedTriangles = triClip([0, 0, fNear], [0, 0, 1], currentTriangle);
      for (n = 0; n < nClippedTriangles; n++) {
        currentTriangle = copyArray(clipped[n])
        currentTriangle[0] = vecMatMul(currentTriangle[0], projectionMatrix)
        currentTriangle[1] = vecMatMul(currentTriangle[1], projectionMatrix)
        currentTriangle[2] = vecMatMul(currentTriangle[2], projectionMatrix)
        currentTriangle[0] = vecIntDiv(currentTriangle[0], currentTriangle[0][3])
        currentTriangle[1] = vecIntDiv(currentTriangle[1], currentTriangle[1][3])
        currentTriangle[2] = vecIntDiv(currentTriangle[2], currentTriangle[2][3])
        currentTriangle[0][0] *= halfWidth
        currentTriangle[0][1] *= halfHeight
        currentTriangle[1][0] *= halfWidth
        currentTriangle[1][1] *= halfHeight
        currentTriangle[2][0] *= halfWidth
        currentTriangle[2][1] *= halfHeight
        renderQueue.push([currentTriangle, color, currentTriangle[0][2] + currentTriangle[1][2] + currentTriangle[2][2]])
      }
    }
  }
}

// draw function
// draw function
// draw function

function drawQueue() {
  for (let i = 0; i < renderQueue.length; i++) {
    object = copyArray(renderQueue[i])
    currentTriangle = object[0]
    color = object[1]
    color = "#" + color + color + color
    shape(color, true, [
      -currentTriangle[0][0], currentTriangle[0][1],
      -currentTriangle[1][0], currentTriangle[1][1],
      -currentTriangle[2][0], currentTriangle[2][1]
    ])
  }
}

// mainloop
// mainloop
// mainloop

tick = 0
mainloop = () => {
  tick += 0.1
  windowInfo()
  keyToMovement()
  fillScreen("black")
  renderQueue = []
  ToDrawQueue(1, matMatMul(matRotationx(0), matRotationy(0)), [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [10, -20, 0, 1]
  ])
  // x translation has to be negative
  ToDrawQueue(0, matMatMul(matRotationx(-xRotation), matRotationy(yRotation)), [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 20, 1]
  ])
  ToDrawQueue(0, matMatMul(matMatMul(matRotationz(tick), matRotationy(Math.PI / 2)), matRotationy(-Math.PI / 6)), [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [-10, -15, -35, 1]
  ])
  ToDrawQueue(0, matMatMul(matMatMul(matRotationz(Math.PI / 2 - tick), matRotationy(Math.PI / 2)), matMatMul(matRotationz(Math.PI / 6), matRotationy(-Math.PI / 4))), [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [10, -10, -50, 1]
  ])
  renderQueue = mergeSort(renderQueue)
  drawQueue()
  text(-halfWidth + 5, halfHeight - 15, getFPS() + " FPS", 15, "white")
  request = requestAnimationFrame(mainloop)
}

// fps function
// fps function
// fps function

function getFPS() {
  now = performance.now()
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift()
  }
  times.push(now)
  return times.length
}

// clipping functions
// clipping functions
// clipping functions

function vecIntPlane(planePoint, planeNormal, lineStart, lineEnd) {
  let planeNorm = vecNorm(planeNormal)
  let planeDot = -vecVecDot(planeNorm, planePoint);
  let ad = vecVecDot(lineStart, planeNorm);
  let bd = vecVecDot(lineEnd, planeNorm);
  let t = (-planeDot - ad) / (bd - ad);
  let lineStartToEnd = vecVecSub(lineEnd, lineStart);
  let lineToIntersect = vecIntMul(lineStartToEnd, t);
  return vecVecAdd(lineStart, lineToIntersect)
}

function dist(planePoint, planeNormal, point) {
  return (planeNormal[0] * point[0] + planeNormal[1] * point[1] + planeNormal[2] * point[2] - vecVecDot(planeNormal, planePoint));
};

function triClip(planePoint, planeNormal, in_tri) {
  planeNormal = vecNorm(planeNormal);
  inside_points = [0, 0, 0]
  nInsidePointCount = 0
  outside_points = [0, 0, 0]
  nOutsidePointCount = 0
  d0 = dist(planePoint, planeNormal, in_tri[0]);
  d1 = dist(planePoint, planeNormal, in_tri[1]);
  d2 = dist(planePoint, planeNormal, in_tri[2]);
  if (d0 >= 0) {
    inside_points[nInsidePointCount++] = in_tri[0];
  } else {
    outside_points[nOutsidePointCount++] = in_tri[0];
  }
  if (d1 >= 0) {
    inside_points[nInsidePointCount++] = in_tri[1];
  } else {
    outside_points[nOutsidePointCount++] = in_tri[1];
  }
  if (d2 >= 0) {
    inside_points[nInsidePointCount++] = in_tri[2];
  } else {
    outside_points[nOutsidePointCount++] = in_tri[2];
  }
  if (nInsidePointCount == 0) {
    return 0
  }
  if (nInsidePointCount == 3) {
    clipped[0] = in_tri;
    return 1;
  }
  if (nInsidePointCount == 1 && nOutsidePointCount == 2) {
    clipped[0][0] = inside_points[0];
    clipped[0][1] = vecIntPlane(planePoint, planeNormal, inside_points[0], outside_points[0]);
    clipped[0][2] = vecIntPlane(planePoint, planeNormal, inside_points[0], outside_points[1]);
    return 1;
  }
  if (nInsidePointCount == 2 && nOutsidePointCount == 1) {
    clipped[0][0] = inside_points[0];
    clipped[0][1] = inside_points[1];
    clipped[0][2] = vecIntPlane(planePoint, planeNormal, inside_points[0], outside_points[0]);
    clipped[1][0] = inside_points[1];
    clipped[1][1] = clipped[0][2];
    clipped[1][2] = vecIntPlane(planePoint, planeNormal, inside_points[1], outside_points[0]);
    return 2;
  }
}

// sort function
// sort function
// sort function

function mergeSort(arr) {
  let len = arr.length, middle, left, right
  if (len < 2) {
    return arr
  }
  middle = Math.floor(len / 2)
  left = arr.slice(0, middle)
  right = arr.slice(middle)
  return merge(mergeSort(left), mergeSort(right))

}

function merge(left, right) {
  let result = [], i = 0, j = 0
  while (i < left.length && j < right.length) {
    if (left[i][2] > right[j][2]) {
      result.push(left[i++])
    } else {
      result.push(right[j++])
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j))
}

// operation functions
// operation functions
// operation functions

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
  return Math.sqrt(vecVecDot(vec, vec))
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
    v3 = 1
  } else {
    v3 = vec[3]
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

function pointAt(position, target, up) {
  let forward = vecNorm(vecVecSub(target, position))
  let newUp = vecNorm(vecVecSub(up, vecIntMul(forward, vecVecDot(up, forward))))
  let right = vecVecCross(newUp, forward)
  return [
    [right[0], right[1], right[2], 0],
    [newUp[0], newUp[1], newUp[2], 0],
    [forward[0], forward[1], forward[2], 0],
    [position[0], position[1], position[2], 1],
  ]
}

function lookAt(mat) {
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

function matRotationx(theta) {
  return [
    [1, 0, 0, 0],
    [0, Math.cos(theta), Math.sin(theta), 0],
    [0, -Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 0, 1]
  ]
}

function matRotationz(theta) {
  return [
    [Math.cos(theta), Math.sin(theta), 0, 0],
    [-Math.sin(theta), Math.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]
}

function matRotationy(theta) {
  return [
    [Math.cos(theta), 0, Math.sin(theta), 0],
    [0, 1, 0, 0],
    [-Math.sin(theta), 0, Math.cos(theta), 0],
    [0, 0, 0, 1]
  ]
}

// copy function
// copy function
// copy function

function copyArray(array) {
  return JSON.parse(JSON.stringify(array))
}

// user functions
// user functions
// user functions

function keyToMovement() {
  let sen = 0.5
  let forward = vecIntMul(lookDirection, sen)
  k = keyId.indexOf("KeyW")
  c = keyId.indexOf("ArrowUp")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
      camera[0] += forward[0]
      camera[2] += forward[2]
    }
  }
  k = keyId.indexOf("KeyS")
  c = keyId.indexOf("ArrowDown")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
      camera[0] -= forward[0]
      camera[2] -= forward[2]
    }
  }
  k = keyId.indexOf("KeyA")
  c = keyId.indexOf("ArrowLeft")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
      camera[0] += forward[2]
      camera[2] -= forward[0]
    }
  }
  k = keyId.indexOf("KeyD")
  c = keyId.indexOf("ArrowRight")
  if ((k > -1) || (c > -1)) {
    if ((keyPressed[k]) || (keyPressed[c])) {
      camera[0] -= forward[2]
      camera[2] += forward[0]
    }
  }
  k = keyId.indexOf("ShiftLeft")
  if (k > -1) {
    if (keyPressed[k]) {
      camera[1] -= sen
    }
  }
  k = keyId.indexOf("Space")
  if (k > -1) {
    if (keyPressed[k]) {
      camera[1] += sen
    }
  }
}

function mouseMove(e) {
  mousex += e.movementX
  mousey -= e.movementY
  xRotation = mousey / 100
  yRotation = mousex / 100
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
  if ((window.innerWidth != screenWidth) || (window.innerHeight != screenHeight)) {
    screenWidth = window.innerWidth
    screenHeight = window.innerHeight
    projectionMatrix = [
      [screenHeight / screenWidth * fFovRad, 0, 0, 0],
      [0, fFovRad, 0, 0],
      [0, 0, fFar / (fFar - fNear), 1],
      [0, 0, (-fFar * fNear) / (fFar - fNear), 0]
    ]
    halfWidth = screenWidth / 2
    halfHeight = screenHeight / 2
    document.getElementById('canvas').width = screenWidth
    document.getElementById('canvas').height = screenHeight
  }
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
    meshList = loadMeshData(data)
  })
}

$(document).ready(function () {
  loadMesh('mesh.doc')
  mainloop()
});

function loadMeshData(string) {
  let meshList = []
  let lines = string.split("\n");
  let positions = [];
  let triangles = [];
  for (let i = 0; i < lines.length; i++) {
    let parts = lines[i].trimRight().split(' ');
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
        case 'push': {
          meshList.push(triangles)
          positions = [];
          triangles = []
        }
      }
    }
  }
  return meshList
}