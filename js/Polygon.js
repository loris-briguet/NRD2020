class Polygon {
  constructor(x, y, radius, nPoints, color, div, rot, mult) {

    this.x = x;
    this.y = y;
    this.r = radius;
    this.np = nPoints;
    this.c = color;
    this.d = div;
    this.rot = -rot;
    if (this.np == 2) {
      this.rot = this.rot - 90;
    } else if (this.np == 3) {
      this.rot = this.rot + 135;
    } else if (this.np == 4) {
      this.rot = this.rot + 45;
    }
    this.mult = mult;
  }

  show() {
    this.triOffset = 0;
    if (this.np == 3 && this.d == 32) {
      this.triOffset = 360 / this.d;
    }

    this.angle = (360 / this.d) * Math.ceil(this.d / this.np) + this.triOffset;

    push();

    beginShape();
    noFill();
    strokeWeight(6 * this.mult);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    rectMode(CENTER);
    translate(this.x, this.y);
    rotate(this.rot);

    stroke(this.c);

    for (this.a = 0; this.a < 360; this.a += this.angle) {
      this.sx = 0 + cos(this.a) * this.r;
      this.sy = 0 + sin(this.a) * this.r;
      vertex(this.sx, this.sy);
    }

    endShape(CLOSE);
    pop();
  }
}
