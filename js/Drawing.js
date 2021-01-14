function drawPolys(id, sNum, nP, col) {
  let shapeSelect = document.getElementById(id);
  shapeSelect.addEventListener("mouseup", (e) => {
    addShapeToSeq(sNum, nP, col);
    shapeCounter(sNum);
  });
}

function shapeCounter(nShapes) {
  if (nShapes > 0) {
    nShapes -= 1;
  }
}

function addShapeToSeq(numOfShapesId, nPoints, col) {
  if (numOfShapesId > 0) {
    polygoneTableP1.push(
      new Polygon(0, 0, RADIUS, nPoints, col, lvl.steps, -globAngle, 1)
    );

    if (player == "p1") {
      SEND_MESSAGE(MAINBASE + "/DATA/p1/shapes", polygoneTableP1);
    } else if (player == "p2") {
      SEND_MESSAGE(MAINBASE + "/DATA/p2/shapes", polygoneTableP1);
    }

    stepRotate(lvl.steps, 1);
    SEND_MESSAGE(MAINBASE + "/DATA/angle", globAngle + t.angle);

    if (seq0 <= 0) {
      seq0 = lvl.steps - 1;
    } else {
      seq0 -= 1;
    }
    SEND_MESSAGE(MAINBASE + "/DATA/north", seq0);
  }
}

function findShape() {
  push();
  scale(RADIUS * 2);
  beginShape();
  noStroke();
  fill(beige[0]);

  for (let { x, y } /*destructuring ES6*/ of SHAPE_POINTS) {
    vertex(x, y);
  }

  endShape(CLOSE);
  pop();
}
