let lvl = {
  num: 1,
  steps: 8,
  rot: 1,
  finished: false,
  p1Finished: false,
  p2Finished: false,
  shapes: {
    octo: 1,
    square: 1,
    tri: 0,
    line: 1,
  },
};

let player = "p1";
let MAINBASE = "PUZZLELORIS";
let ID;

let polygoneTableP1 = [];
let polygoneTableP2 = [];

let globAngle = 0;
let anglediv = 1;
let shapeAngle = 0;

let beige = ["rgba(240,235,210,1)", "rgba(240,235,210,0.4)"];
let blue = ["rgba(0,65,115,1)", "rgba(0,65,115,0.4)"];
let red = ["rgba(175,0,0,1)", "rgba(175,0,0,0.4)"];
let orange = ["rgba(235,100,1,1)", "rgba(235,100,0,0.4)"];
let yellow = ["rgba(235,180,0,1)", "rgba(235,180,0,0.4)"];

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

function stepRotate(lvlRot, rotSense) {
  if (rotSense == 1) {
    t.angle = 360 / lvlRot;
  } else if (rotSense == -1) {
    t.angle = (360 / lvlRot) * -1;
  }
}

function preload() {
  myFont = loadFont("./font/Akkurat.woff");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont(myFont);
  rectMode(CENTER);
  angleMode(DEGREES);
  arrowEvents();
  drawPolys();

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

  bassSynth = new Tone.MembraneSynth().toMaster();
  loopBeat = new Tone.Loop(song, "4n");
  Tone.Transport.bpm.value = "125";
  Tone.Transport.start();
  loopBeat.start(0);
}

function song(time) {
  if (lvl.finished == true) {
    bassSynth.triggerAttackRelease("C2", "8n", time);
  }
}

function draw() {
  console.log(anglediv);
  console.log(globAngle);
  background("#111111");
  r = width / 4;
  t.smoothAngle = lerp(t.smoothAngle, globAngle, 0.1);
  //////////// UI ////////////////
  /////visu player 2
  push();
  translate(width / 9, height - height / 6);
  scale(0.25);
  tint(255, 126);

  rotate(t.smoothAngle);
  let sequenceP2 = new Sequence(0, 0, lvl, r, beige[0], rc, 4, north);
  sequenceP2.show();
  if (polygoneTableP2 != undefined) {
    for (let i = 0; i < polygoneTableP2.length; i++) {
      let pt2 = polygoneTableP2;
      new Polygon(
        0,
        0,
        r,
        pt2[i].np,
        pt2[i].c,
        lvl.steps,
        pt2[i].rot,
        4,
        false,
        shapeAngle
      ).show();
      // console.log(
      //   "angle:" + t.angle + ", globAngle:" + globAngle + "pt2a:" + pt2[i].rot
      // );
    }
  }
  pop();

  /////side polys
  if (lvl.finished == false) {
    let sideOcto = new SideUi("octo", blue[0], blue[1], lvl.shapes.octo, 8);
    sideOcto.show();
    let sideSq = new SideUi(
      "square",
      yellow[0],
      yellow[1],
      lvl.shapes.square,
      4
    );
    sideSq.show();
    let sideTri = new SideUi(
      "triangle",
      orange[0],
      orange[1],
      lvl.shapes.tri,
      3
    );
    sideTri.show();
    let sideLine = new SideUi("line", red[0], red[1], lvl.shapes.line, 2);
    sideLine.show();
  }

  //////////// SEQUENCER ////////////////
  push();
  translate(width / 2, height / 2);
  rotate(t.smoothAngle);
  let sequenceP1 = new Sequence(0, 0, lvl, r, beige[0], rc, 2, north);
  sequenceP1.show();
  for (let i = 0; i < polygoneTableP1.length; i++) {
    polygoneTableP1[i].show();
  }
  if (lvl.rot <= 0) {
    arrowLeft.style = "opacity: 40%; cursor: default !important";
    arrowRight.style = "opacity: 40%; cursor: default !important";
  }
  pop();

  //Check if level is done
  if (player == "p1" && 0 == 1) {
    lvl.p1Finished == true;
  } else if (player == "p2" && 0 == 1) {
    lvl.p2Finished == true;
  }
  if (lvl.p1Finished == true && lvl.p2Finished) {
    lvl.finished = true;
  }
}

function arrowEvents() {
  var arrowLeft = document.getElementById("arrowLeft");
  var arrowRight = document.getElementById("arrowRight");
  var uiRot = document.getElementById("uiRot");
  uiRot.textContent = "Rotations: " + lvl.rot;

  arrowLeft.addEventListener("mouseup", (e) => {
    if (lvl.rot > 0) {
      stepRotate(lvl.steps, -1);
      lvl.rot -= 1;
      anglediv -= 1;
      uiRot.textContent = "Rotations: " + lvl.rot;
      if (seq0 >= lvl.steps - 1) {
        seq0 = 0;
      } else {
        seq0 += 1;
      }
    }
    SEND_MESSAGE(MAINBASE + "/DATA/angle", globAngle + t.angle);
  });

  arrowRight.addEventListener("mouseup", (e) => {
    if (lvl.rot > 0) {
      stepRotate(lvl.steps, 1);
      lvl.rot -= 1;
      anglediv += 1;
      uiRot.textContent = "Rotations: " + lvl.rot;
      if (seq0 <= 0) {
        seq0 = lvl.steps - 1;
      } else {
        seq0 -= 1;
      }
    }
    SEND_MESSAGE(MAINBASE + "/DATA/angle", globAngle + t.angle);
  });
}

function drawPolys() {
  let octoSelect = document.getElementById("octo");
  octoSelect.addEventListener("mouseup", (e) => {
    addShapeToSeq(lvl.shapes.octo, 8, blue[0]);
    if (lvl.shapes.octo > 0) {
      lvl.shapes.octo -= 1;
    }
  });
  let squareSelect = document.getElementById("square");
  squareSelect.addEventListener("mouseup", (e) => {
    addShapeToSeq(lvl.shapes.square, 4, yellow[0]);
    if (lvl.shapes.square > 0) {
      lvl.shapes.square -= 1;
    }
  });
  let triangleSelect = document.getElementById("triangle");
  triangleSelect.addEventListener("mouseup", (e) => {
    addShapeToSeq(lvl.shapes.tri, 3, orange[0]);
    if (lvl.shapes.tri > 0) {
      lvl.shapes.tri -= 1;
    }
  });
  let lineSelect = document.getElementById("line");
  lineSelect.addEventListener("mouseup", (e) => {
    addShapeToSeq(lvl.shapes.line, 2, red[0]);
    if (lvl.shapes.line > 0) {
      lvl.shapes.line -= 1;
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
    anglediv += 1;
    shapeAngle = globAngle / anglediv;
    polygoneTableP1.push(
      new Polygon(
        0,
        0,
        r,
        nPoints,
        col,
        lvl.steps,
        t.angle,
        1,
        true,
        shapeAngle
      )
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
//390
