class SideUi {
  constructor(id, col1, col2, numOfShapes, nPoints) {
    this.id = id;
    this.col1 = col1;
    this.col2 = col2;
    this.nShapes = numOfShapes;
    this.nPoints = nPoints;
    this.divCol;
  }

  show() {
    let divX =
      document.getElementById(this.id).getBoundingClientRect().left +
      document.getElementById(this.id).offsetWidth / 2;
    let divY =
      document.getElementById(this.id).getBoundingClientRect().top +
      document.getElementById(this.id).offsetHeight / 2;
    let divT = document.getElementById(this.id).firstElementChild;

    if (this.nShapes > 0) {
      this.divCol = this.col1;
    } else {
      this.divCol = this.col2;
    }

    let sidePoly = new Polygon(
      divX,
      divY,
      r / 4.5,
      this.nPoints,
      this.divCol,
      lvl.steps,
      0,
      1
    );

    sidePoly.show();
    divT.textContent = this.nShapes + "x";
    divT.style.color = this.divCol;
  }
}
