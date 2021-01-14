class SideUiFull {
  constructor(player, lvl) {
    this.player = player;
    this.lvl = lvl;
  }
  show() {
    if (lvl.finished == false) {
      if (this.player == "p1") {
        let sideOcto = new SideUi(
          "octo",
          blue[0],
          blue[1],
          this.lvl.shapesP1.octo,
          8
        );
        sideOcto.show();
        let sideSq = new SideUi(
          "square",
          yel[0],
          yel[1],
          this.lvl.shapesP1.square,
          4
        );
        sideSq.show();
        let sideTri = new SideUi(
          "triangle",
          orn[0],
          orn[1],
          this.lvl.shapesP1.tri,
          3
        );
        sideTri.show();
        let sideLine = new SideUi(
          "line",
          red[0],
          red[1],
          this.lvl.shapesP1.line,
          2
        );
        sideLine.show();
      } else if (this.player == "p2") {
        let sideOcto = new SideUi(
          "octo",
          blue[0],
          blue[1],
          this.lvl.shapesP2.octo,
          8
        );
        sideOcto.show();
        let sideSq = new SideUi(
          "square",
          yel[0],
          yel[1],
          this.lvl.shapesP2.square,
          4
        );
        sideSq.show();
        let sideTri = new SideUi(
          "triangle",
          orn[0],
          orn[1],
          this.lvl.shapesP2.tri,
          3
        );
        sideTri.show();
        let sideLine = new SideUi(
          "line",
          red[0],
          red[1],
          this.lvl.shapesP2.line,
          2
        );
        sideLine.show();
      }
    }
  }
}
