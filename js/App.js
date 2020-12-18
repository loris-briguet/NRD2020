const lvl = {
  num: 1,
  steps: 8,
  rot: 1,
  finished: false,
  shapes: {
    octo: 1,
    square: 1,
    tri: 1,
    line: 2,
  },
};

let polygoneTableP1 = [];
let polygoneTableP2 = [];

let beige = ["rgba(240,235,210,1)", "rgba(240,235,210,0.4)"];
let blue = ["rgba(0,65,115,1)", "rgba(0,65,115,0.4)"];
let red = ["rgba(175,0,0,1)", "rgba(175,0,0,0.4)"];
let orange = ["rgba(235,100,1,1)", "rgba(235,100,0,0.4)"];
let yellow = ["rgba(235,180,0,1)", "rgba(235,180,0,0.4)"];

let myFont;
let seq0 = 0;
var r;
let ID;

let loopBeat;
let bassSynth;
let masterClock;

let t = {
  angle: 0,
  currTurn: 0,
  turns: 6,
  min: 0,
  max: 360,
  smoothAngle: 0,

  turn: function (turns) {
    let moveAngle = (this.max / lvl.steps) * turns;
    this.currTurn -= Math.abs(turns);
    this.currTurn = constrain(this.currTurn, 0, this.turns);
    this.angle += moveAngle;
  },

  update: function () {
    this.smoothAngle = lerp(this.smoothAngle, this.angle, 0.1);
  },

  init: function (currTurn, turns, _min, _max) {
    this.currTurn = currTurn;
    this.turns = turns;
    this.currTurn = currTurn;
    this.min = _min;
    this.max = _max;
    this.angle = map(currTurn, 0, turns, _min, _max);
    this.smoothAngle = this.angle;
  },
};

let MAINBASE = "PUZZLELORIS";

const FIREBASE_DATA = {
  lvl,
  drawnShapes: [],
  globalAngle: 0,
};

function preload() {
  myFont = loadFont("./font/Akkurat.woff");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont(myFont);
  rectMode(CENTER);
  angleMode(DEGREES);
  t.init(lvl.rot, lvl.rot, 0, 360);
  arrowEvents();
  drawPolys();
  // bassSynth = new Tone.MembraneSynth().toMaster();

  // loopBeat = new Tone.Loop(song, "4n");

  // Tone.Transport.bpm.value = "125";
  // Tone.Transport.start();
  // loopBeat.start(0);

  // const urlParameter = new URLSearchParams(window.location.search);
  // ID = urlParameter.get("nom");

  DATABASE.ref(MAINBASE + "/DATA/").on("value", (snapshot) => {
    const allData = snapshot.val();
    console.log(allData);
  });

  DATABASE.ref(MAINBASE + "/DATA/drawnShapes").on("value", (snapshot) => {
    const allData = snapshot.val();
    console.log(allData);
  });
}

// function song(time) {
//   bassSynth.triggerAttackRelease("C2", "8n", time);
// }

function draw() {
  background("#111111");
  r = width / 4;
  let rc = 12.5;
  t.update();

  //////////// UI ////////////////
  /////visu player 2
  push();
  translate(width / 9, height - height / 6);
  scale(0.25);
  tint(255, 126);
  rotate(-t.smoothAngle);
  let sequenceP2 = new Sequence(0, 0, lvl, r, beige[0], rc, 4, seq0);
  sequenceP2.show();
  for (let i = 0; i < polygoneTableP2.length; i++) {
    polygoneTableP2[i].show();
  }
  pop();

  /////side polys
  let sideOcto = new SideUi("octo", blue[0], blue[1], lvl.shapes.octo, 8);
  sideOcto.show();
  let sideSq = new SideUi("square", yellow[0], yellow[1], lvl.shapes.square, 4);
  sideSq.show();
  let sideTri = new SideUi("triangle", orange[0], orange[1], lvl.shapes.tri, 3);
  sideTri.show();
  let sideLine = new SideUi("line", red[0], red[1], lvl.shapes.line, 2);
  sideLine.show();

  //////////// SEQUENCER ////////////////
  push();
  translate(width / 2, height / 2);
  rotate(t.smoothAngle);
  let sequenceP1 = new Sequence(0, 0, lvl, r, beige[0], rc, 2, seq0);
  sequenceP1.show();
  for (let i = 0; i < polygoneTableP1.length; i++) {
    polygoneTableP1[i].show();
  }
  if (lvl.rot <= 0) {
    arrowLeft.style = "opacity: 40%; cursor: default !important";
    arrowRight.style = "opacity: 40%; cursor: default !important";
  }
  pop();
}

function arrowEvents() {
  var arrowLeft = document.getElementById("arrowLeft");
  var arrowRight = document.getElementById("arrowRight");
  var uiRot = document.getElementById("uiRot");
  uiRot.textContent = "Rotations: " + lvl.rot;

  arrowLeft.addEventListener("mouseup", (e) => {
    if (lvl.rot > 0) {
      t.turn(-1);
      lvl.rot -= 1;
      uiRot.textContent = "Rotations: " + lvl.rot;
      if (seq0 >= lvl.steps - 1) {
        seq0 = 0;
      } else {
        seq0 += 1;
      }
    }
    FIREBASE_DATA.globalAngle = t.smoothAngle;
    updateFireBase();
  });

  arrowRight.addEventListener("mouseup", (e) => {
    if (lvl.rot > 0) {
      lvl.rot -= 1;
      t.turn(1);
      uiRot.textContent = "Rotations: " + lvl.rot;
      if (seq0 <= 0) {
        seq0 = lvl.steps - 1;
      } else {
        seq0 -= 1;
      }
    }
    FIREBASE_DATA.globalAngle = t.smoothAngle;
    updateFireBase();
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
    polygoneTableP1.push(
      new Polygon(0, 0, r, nPoints, col, lvl.steps, t.angle, 1)
    );

    FIREBASE_DATA.drawnShapes.push({
      points: nPoints,
      color: col,
      angle: t.angle,
    });
    updateFireBase();

    t.turn(1);
    if (seq0 <= 0) {
      seq0 = 7;
    } else {
      seq0 -= 1;
    }
  }
}

function updateFireBase() {
  SEND_MESSAGE(MAINBASE + "/DATA/", FIREBASE_DATA);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//390
