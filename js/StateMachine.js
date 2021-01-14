function stateMachine() {
  switch (lvl.num) {
    case 1:
      SHAPE_POINTS = readPath(
        "64.7,64.6 56.1,85.4 35.4,85.4 14.7,64.7 14.7,43.9 35.5,35.3 	"
      );
      checkLevelState(8, 180, 2, 135, 4, 315, 3, 180);
      sLvl = [1, 0, 0, 1, 0, 1, 1, 0];
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
      break;
    case 2:
      SHAPE_POINTS = readPath(
        "70.7,50 60.4,75 35.4,64.6 20.7,29.3 35.4,14.6 56.1,14.6 	"
      );
      checkLevelState(8, 180, 2, 135, 4, 315, 3, 180);
      sLvl = [0, 1, 0, 1, 1, 0, 1, 0];
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
      break;
    case 3:
      SHAPE_POINTS = readPath(
        "70.7,50 60.4,75 35.4,64.6 20.7,29.3 35.4,14.6 56.1,14.6 	"
      );
      checkLevelState(8, 180, 2, 135, 4, 315, 3, 180);
      sLvl = [0, 0, 1, 1, 1, 1, 0, 0];
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
      break;
    case 4:
      SHAPE_POINTS = readPath(
        "70.7,50 60.4,75 35.4,64.6 20.7,29.3 35.4,14.6 56.1,14.6 	"
      );
      checkLevelState(8, 180, 2, 135, 4, 315, 3, 180);
      sLvl = [1, 0, 1, 0, 0, 1, 0, 1];
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
      break;
    case 5:
      SHAPE_POINTS = readPath(
        "70.7,50 60.4,75 35.4,64.6 20.7,29.3 35.4,14.6 56.1,14.6 	"
      );
      checkLevelState(8, 180, 2, 135, 4, 315, 3, 180);
      sLvl = [0, 1, 1, 0, 1, 0, 0, 1];
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
      break;
    case 6:
      SHAPE_POINTS = readPath(
        "70.7,50 60.4,75 35.4,64.6 20.7,29.3 35.4,14.6 56.1,14.6 	"
      );
      checkLevelState(8, 180, 2, 135, 4, 315, 3, 180);
      sLvl = [1, 1, 0, 0, 0, 0, 1, 1];
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP2", lvl.shapesP2);
      SEND_MESSAGE(MAINBASE + "/DATA/lvl/shapesP1", lvl.shapesP1);
  }
}
