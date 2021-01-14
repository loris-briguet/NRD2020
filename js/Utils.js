function checkLevelState(np1, a1, np2, a2, np3, a3, np4, a4) {
  for (let a = 0; a < polygoneTableP1.length; a++) {
    for (let b = 0; b < polygoneTableP1.length; b++) {
      if (player == "p1") {
        if (
          polygoneTableP1[a].np == np1 &&
          globAngle - polygoneTableP1[a].rot == a1
        ) {
          if (
            polygoneTableP1[b].np == np2 &&
            globAngle - polygoneTableP1[b].rot == a2
          ) {
            console.log("p1 is done");
            lvl.p1Finished == true;
            SEND_MESSAGE(MAINBASE + "/DATA/lvl/p1Finished", true);
          }
        }
      } else if (player == "p2") {
        if (
          polygoneTableP1[a].np == np3 &&
          globAngle - polygoneTableP1[a].rot == a3
        ) {
          if (
            polygoneTableP1[b].np == np4 &&
            globAngle - polygoneTableP1[b].rot == a4
          ) {
            console.log("p2 is done");
            lvl.p2Finished == true;
            SEND_MESSAGE(MAINBASE + "/DATA/lvl/p2Finished", true);
          }
        }
      }
    }
  }
}

function restart() {
  var restartButton = document.getElementById("restart");
  restartButton.addEventListener("mouseup", (e) => {
    console.log("restarted");
    polygoneTableP1 = [];
    polygoneTableP2 = [];
    lvl.shapesP1 = {
      octo: sLvl[0],
      square: sLvl[1],
      tri: sLvl[2],
      line: sLvl[3],
    };
    lvl.shapesP2 = {
      octo: sLvl[4],
      square: sLvl[5],
      tri: sLvl[6],
      line: sLvl[7],
    };
    globAngle = 0;
    SEND_MESSAGE(MAINBASE + "/DATA/angle", globAngle);
    SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
    SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
    SEND_MESSAGE(MAINBASE + "/DATA/p1/", polygoneTableP2);
    SEND_MESSAGE(MAINBASE + "/DATA/p2/", polygoneTableP2);
  });
}

function nextLevel() {
  let levelUi = document.getElementById("level");

  levelUi.addEventListener("mouseup", (e) => {
    if (lvl.finished == true) {
      if ((player = "p1")) {
        SEND_MESSAGE(MAINBASE + "/DATA/lvl/num", lvl.num + 1);
      }
      console.log("next level");
      polygoneTableP1 = [];
      polygoneTableP2 = [];
      globAngle = 0;
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/p1Finished", false);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/p2Finished", false);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/finished", false);
      SEND_MESSAGE(MAINBASE + "/DATA/angle", globAngle);
      SEND_MESSAGE(MAINBASE + "/DATA/p1/", polygoneTableP2);
      SEND_MESSAGE(MAINBASE + "/DATA/p2/", polygoneTableP2);
    }
  });
}

function stepRotate(lvlRot, rotSense) {
  if (rotSense == 1) {
    t.angle = 360 / lvlRot;
  } else if (rotSense == -1) {
    t.angle = (360 / lvlRot) * -1;
  }
}

function readPath(pathStr) {
  let res = pathStr
    .split(" ")
    .filter((txt) => txt.length > 1)
    .map((coords) => {
      let [x, y] = coords.split(",");

      x = x / 100 - 0.5;
      y = y / 100 - 0.5;

      return { x, y };
    });
  return res;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
let drawActive = false;
function mousePressed() {
  if (drawActive == true) {
    SHAPE_POINTS.push({ x: mouseX, y: mouseY });
    console.log(SHAPE_POINTS);
  }
}
