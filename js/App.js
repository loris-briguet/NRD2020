let sLvl = [1, 0, 0, 1, 0, 1, 1, 0];

let lvl = {
  num: 1,
  steps: 8,
  finished: false,
  p1Finished: false,
  p2Finished: false,
  shapesP1: {
    octo: sLvl[0],
    square: sLvl[1],
    tri: sLvl[2],
    line: sLvl[3],
  },
  shapesP2: {
    octo: sLvl[4],
    square: sLvl[5],
    tri: sLvl[6],
    line: sLvl[7],
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
var RADIUS;
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

let SHAPE_POINTS = readPath(
  "64.7,64.6 56.1,85.4 35.4,85.4 14.7,64.7 14.7,43.9 35.5,35.3 	"
);

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
  // bassSynth = new Tone.MembraneSynth().toMaster();
  // loopBeat = new Tone.Loop(song, "4n");
  // Tone.Transport.bpm.value = "125";
  // Tone.Transport.start();
  // loopBeat.start(0);
}

function song(time) {
  // if (lvl.finished == true) {
  //   loopBeat.start(0);
  //   if (time % 4 == 0) {
  //     bassSynth.triggerAttackRelease("C4", "8n", time);
  //   }
  //   bassSynth.triggerAttackRelease("C2", "8n", time);
  // } else {
  //   loopBeat.stop(0);
  // }
}

function draw() {
  background("#111111");
  RADIUS = width / 4;
  t.smoothAngle = lerp(t.smoothAngle, globAngle, 0.1);
  //////////// UI ////////////////
  /////side polys
  let sideUiFull = new SideUiFull(player, lvl);
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
  push();
  translate(width / 2, height / 2);

  findShape();

  rotate(t.smoothAngle);
  let sequenceP1 = new Sequence(0, 0, lvl, RADIUS, beige[0], rc, 2, north);
  sequenceP1.show();
  if (polygoneTableP2 != undefined) {
    for (let i = 0; i < polygoneTableP2.length; i++) {
      let pt = polygoneTableP2;
      new Polygon(
        0,
        0,
        RADIUS,
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
  pop();

  //Check if level is done
  if (lvl.p1Finished == true && lvl.p2Finished == true) {
    SEND_MESSAGE(MAINBASE + "/DATA/lvl/finished", true);
    console.log("both player done");
  }
  stateMachine();
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
}
