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

  updatePolys(lvl);

  const reverb = new Tone.Freeverb().toDestination();
  const autoWah = new Tone.AutoWah(50, 6, -30).connect(reverb);
  const FeedbackDelay = new Tone.FeedbackDelay("8n", 0.5).connect(autoWah);
  bassSynth1 = new Tone.MetalSynth().toMaster();
  bassSynth2 = new Tone.FMSynth().connect(reverb);
  bassSynth3 = new Tone.MembraneSynth().toMaster();
  bassSynth4 = new Tone.MonoSynth().connect(FeedbackDelay);
  loopBeat = new Tone.Loop(song, "1m");
  Tone.Transport.bpm.value = "500";
  Tone.Transport.start();
  loopBeat.start(0);
  masterClock = 0;
}

function song(time) {
  let seqMel = ["F2", "C2", "B2", "B1", "E1", "C2", "F3", "B1"];
  if (lvl.finished == true) {
    bassSynth3.triggerAttackRelease("C1", "4m", time, 0.7);
    if (masterClock % 2 == 0) {
      bassSynth4.triggerAttackRelease(seqMel[masterClock], "1m", time, 0.4);
    }

    if (masterClock == 1 || masterClock == 4 || masterClock == 7) {
      bassSynth1.triggerAttackRelease("F#1", "1m", time, 0.2);
    }

    if (masterClock == 2) {
      bassSynth2.triggerAttackRelease("E5", "1m", time, 0.5);
    }
    if (masterClock == 6) {
      bassSynth2.triggerAttackRelease("F5", "1m", time, 0.5);
    }

    masterClock = (masterClock + 1) % 8;
  }
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
  sequenceP1.show(masterClock);
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
