class Polygon {
  constructor(x, y, radius, nPoints, color, div, rot, mult, bool) {
    this.x = x;
    this.y = y;
    this.r = radius;
    this.np = nPoints;
    this.c = color;
    this.d = div;
    this.rot = rot;
    this.mult = mult;

    if (bool != false) {
      if (this.np == 2) {
        this.rot += 90;
      } else if (this.np == 3) {
        this.rot += 135;
      } else if (this.np == 4) {
        this.rot -= 45;
      }
    } else {
    }
  }

  show() {
    let triOffset = 0;
    if (this.np == 3 && this.d == 32) {
      triOffset = 360 / this.d;
    }

    let angle = (360 / this.d) * Math.ceil(this.d / this.np) + triOffset;

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

    for (let a = 0; a < 360; a += angle) {
      let sx = 0 + cos(a) * this.r;
      let sy = 0 + sin(a) * this.r;
      vertex(sx, sy);
    }

    endShape(CLOSE);
    pop();
  }
}
