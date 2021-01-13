let sLvl1 = [1, 0, 0, 1, 0, 1, 1, 0];
let sLvl2 = [0, 1, 0, 1, 1, 1, 1, 0];

let lvl = {
  num: 1,
  steps: 8,
  finished: false,
  p1Finished: false,
  p2Finished: false,
  shapesP1: {
    octo: sLvl1[0],
    square: sLvl1[1],
    tri: sLvl1[2],
    line: sLvl1[3],
  },
  shapesP2: {
    octo: sLvl1[4],
    square: sLvl1[5],
    tri: sLvl1[6],
    line: sLvl1[7],
  },
};

let player = "p1";
let MAINBASE = "PUZZLELORIS";
let ID;

let polygoneTableP1 = [];
let polygoneTableP2 = [];

let globAngle = 0;

let beige = ["rgba(240,235,210,1)", "rgba(240,235,210,0.4)"];
let blue = ["rgba(0,65,115,1)", "rgba(0,65,115,0.4)"];
let red = ["rgba(175,0,0,1)", "rgba(175,0,0,0.4)"];
let orn = ["rgba(235,100,1,1)", "rgba(235,100,0,0.4)"];
let yel = ["rgba(235,180,0,1)", "rgba(235,180,0,0.4)"];

let myFont;
let seq0 = 0;
let north;
var r;
let rc = 12.5;

let loopBeat;
let bassSynth;
let masterClock;

let t = {
  angle: 0,
  stepSize: 0,
  rotNorm: 1,
  rotOp: -1,
  smoothAngle: 0,
};

let v = [717, 364, 543, 435, 542, 607, 717, 783, 889, 783, 964, 611];
//let v = [];

function preload() {
  myFont = loadFont("./font/Akkurat.woff");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont(myFont);
  rectMode(CENTER);
  angleMode(DEGREES);
  restart();
  nextLevel();

  const urlParameter = new URLSearchParams(window.location.search);
  ID = urlParameter.get("player");
  player = ID;

  //  Listener pour changement de data player 1 ou 2
  if (player == "p1") {
    SEND_MESSAGE(MAINBASE + "/DATA/", null);
    DATABASE.ref(MAINBASE + "/DATA/p2/shapes").on("value", (snapshot) => {
      const allData = snapshot.val();
      polygoneTableP2 = allData;
    });
    //player 1 sending level info
    SEND_MESSAGE(MAINBASE + "/DATA/lvl", lvl);

    //player 1 grabbing level info
    DATABASE.ref(MAINBASE + "/DATA/lvl").on("value", (snapshot) => {
      let lvlInfo = snapshot.val();
      lvl = lvlInfo;
    });
  } else if (player == "p2") {
    DATABASE.ref(MAINBASE + "/DATA/p1/shapes").on("value", (snapshot) => {
      const allData = snapshot.val();
      polygoneTableP2 = allData;
    });
    //player 2 grabbing level info
    DATABASE.ref(MAINBASE + "/DATA/lvl").on("value", (snapshot) => {
      let lvlInfo = snapshot.val();
      lvl = lvlInfo;
    });
  }
  //updating angle Both player
  DATABASE.ref(MAINBASE + "/DATA/angle").on("value", (snapshot) => {
    const allData = snapshot.val();
    globAngle = allData;
  });
  DATABASE.ref(MAINBASE + "/DATA/north").on("value", (snapshot) => {
    const allData = snapshot.val();
    north = allData;
  });

  if (player == "p1") {
    drawPolys("octo", lvl.shapesP1.octo, 8, blue[0]);
    drawPolys("square", lvl.shapesP1.square, 4, yel[0]);
    drawPolys("triangle", lvl.shapesP1.tri, 3, orn[0]);
    drawPolys("line", lvl.shapesP1.line, 2, red[0]);
  } else if (player == "p2") {
    drawPolys("octo", lvl.shapesP2.octo, 8, blue[0]);
    drawPolys("square", lvl.shapesP2.square, 4, yel[0]);
    drawPolys("triangle", lvl.shapesP2.tri, 3, orn[0]);
    drawPolys("line", lvl.shapesP2.line, 2, red[0]);
  }

  bassSynth = new Tone.MembraneSynth().toMaster();
  loopBeat = new Tone.Loop(song, "4n");
  Tone.Transport.bpm.value = "125";
  Tone.Transport.start();
  loopBeat.start(0);
}

function song(time) {
  if (lvl.finished == "toChange!") {
    bassSynth.triggerAttackRelease("C2", "8n", time);
  }
}

function draw() {
  background("#111111");
  r = width / 4;
  t.smoothAngle = lerp(t.smoothAngle, globAngle, 0.1);
  //////////// UI ////////////////
  /////side polys
  let sideUiFull = new SideUiFull(player);
  sideUiFull.show();

  /////Level
  let levelUi = document.getElementById("level");
  let allUi = document.querySelectorAll("p");
  if (lvl.finished == true) {
    allUi.forEach(function (n) {
      n.classList.add("hidden");
    });
    levelUi.innerText = "Next level";
  } else if (lvl.finished == false) {
    levelUi.innerText = "level " + lvl.num;
    allUi.forEach(function (n) {
      n.classList.remove("hidden");
    });
  }

  //////////// SHAPES TO FIND ////////////////
  beginShape();
  noStroke();
  fill(beige[0]);
  for (let i = 0; i < v.length; i += 2) {
    vertex(v[i], v[i + 1]);
  }
  endShape(CLOSE);

  //////////// SEQUENCER ////////////////
  push();
  translate(width / 2, height / 2);
  rotate(t.smoothAngle);
  let sequenceP1 = new Sequence(0, 0, lvl, r, beige[0], rc, 2, north);
  sequenceP1.show();
  if (polygoneTableP2 != undefined) {
    for (let i = 0; i < polygoneTableP2.length; i++) {
      let pt = polygoneTableP2;
      new Polygon(
        0,
        0,
        r,
        pt[i].np,
        pt[i].c,
        lvl.steps,
        pt[i].rot,
        1,
        false
      ).show();
    }
  }
  for (let i = 0; i < polygoneTableP1.length; i++) {
    polygoneTableP1[i].show();
  }

  for (let a = 0; a < polygoneTableP1.length; a++) {
    for (let b = 0; b < polygoneTableP1.length; b++) {
      if (player == "p1") {
        if (
          polygoneTableP1[a].np == 8 &&
          globAngle - polygoneTableP1[a].rot == 180
        ) {
          if (
            polygoneTableP1[b].np == 2 &&
            globAngle - polygoneTableP1[b].rot == 135
          ) {
            console.log("p1 is done");
            lvl.p1Finished == true;
            SEND_MESSAGE(MAINBASE + "/DATA/lvl/p1Finished", true);
          }
        }
      } else if (player == "p2") {
        if (
          polygoneTableP1[a].np == 4 &&
          globAngle - polygoneTableP1[a].rot == 315
        ) {
          if (
            polygoneTableP1[b].np == 3 &&
            globAngle - polygoneTableP1[b].rot == 180
          ) {
            console.log("p2 is done");
            lvl.p2Finished == true;
            SEND_MESSAGE(MAINBASE + "/DATA/lvl/p2Finished", true);
          }
        }
      }
    }
  }

  //Check if level is done
  if (lvl.p1Finished == true && lvl.p2Finished == true) {
    SEND_MESSAGE(MAINBASE + "/DATA/lvl/finished", true);
    console.log("both player done");
  }
  pop();
}

function drawPolys(id, sNum, nP, col) {
  let shapeSelect = document.getElementById(id);
  shapeSelect.addEventListener("mouseup", (e) => {
    addShapeToSeq(sNum, nP, col);
    if (sNum > 0) {
      sNum -= 1;
    }
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
      new Polygon(0, 0, r, nPoints, col, lvl.steps, -globAngle, 1)
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

function stepRotate(lvlRot, rotSense) {
  if (rotSense == 1) {
    t.angle = 360 / lvlRot;
  } else if (rotSense == -1) {
    t.angle = (360 / lvlRot) * -1;
  }
}

function nextLevel() {
  let levelUi = document.getElementById("level");

  levelUi.addEventListener("mouseup", (e) => {
    if (lvl.finished == true) {
      console.log("next level");
      polygoneTableP1 = [];
      polygoneTableP2 = [];
      lvl.shapesP1 = {
        octo: 1,
        square: 0,
        tri: 0,
        line: 1,
      };
      lvl.shapesP2 = {
        octo: 0,
        square: 1,
        tri: 1,
        line: 0,
      };
      globAngle = 0;
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/p1Finished", false);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/p2Finished", false);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/finished", false);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/num", lvl.num + 1);
      SEND_MESSAGE(MAINBASE + "/DATA/angle", globAngle);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
      SEND_MESSAGE(MAINBASE + "/DATA/p1/", polygoneTableP2);
      SEND_MESSAGE(MAINBASE + "/DATA/p2/", polygoneTableP2);
    }
  });
}

function restart() {
  var restartButton = document.getElementById("restart");
  restartButton.addEventListener("mouseup", (e) => {
    console.log("restarted");
    polygoneTableP1 = [];
    polygoneTableP2 = [];
    lvl.shapesP1 = {
      octo: sLvl2[0],
      square: sLvl2[1],
      tri: sLvl2[2],
      line: sLvl2[3],
    };
    lvl.shapesP2 = {
      octo: sLvl2[4],
      square: sLvl2[5],
      tri: sLvl2[6],
      line: sLvl2[7],
    };
    globAngle = 0;
    SEND_MESSAGE(MAINBASE + "/DATA/angle", globAngle);
    SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
    SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
    SEND_MESSAGE(MAINBASE + "/DATA/p1/", polygoneTableP2);
    SEND_MESSAGE(MAINBASE + "/DATA/p2/", polygoneTableP2);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

////// Get mouse pos on click
let drawActive = false;
function mousePressed() {
  if (drawActive == true) {
    v.push(mouseX, mouseY);
    console.log(v);
  }
}

//390
