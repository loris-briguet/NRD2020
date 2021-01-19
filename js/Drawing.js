function updatePolys(lvl) {
  if (player == "p1") {
    drawPolys("octo", lvl.shapesP1.octo, 8, blue[0]);
    drawPolys("square", lvl.shapesP1.square, 4, yel[0]);
    drawPolys("triangle", lvl.shapesP1.tri, 3, orn[0]);
    drawPolys("line", lvl.shapesP1.line, 2, red[0]);
    console.log("called update p1");
  } else if (player == "p2") {
    drawPolys("octo", lvl.shapesP2.octo, 8, blue[0]);
    drawPolys("square", lvl.shapesP2.square, 4, yel[0]);
    drawPolys("triangle", lvl.shapesP2.tri, 3, orn[0]);
    drawPolys("line", lvl.shapesP2.line, 2, red[0]);
    console.log("called update p2");
  }
}

function drawPolys(id, sNum, nP, col) {
  let shapeSelect = document.getElementById(id);
  shapeSelect.addEventListener("mouseup", (e) => {
    console.log("called draw");
    addShapeToSeq(sNum, nP, col);
    if (sNum > 0) {
      sNum -= 1;
    }
    if (player == "p1") {
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1/" + id, sNum);
    } else if (player == "p2") {
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2/" + id, sNum);
    }
  });
}

function addShapeToSeq(numOfShapesId, nPoints, col) {
  if (numOfShapesId > 0) {
    console.log("called add");
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

    if (north <= 0) {
      north = lvl.steps - 1;
    } else {
      north -= 1;
    }
    SEND_MESSAGE(MAINBASE + "/DATA/north", north);
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
