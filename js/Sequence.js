class Sequence {
  constructor(x, y, level, size, color, rc, mult, seq0) {
    this.x = x;
    this.y = y;
    this.div = level.steps;
    this.size = size;
    this.color = color;
    this.rc = rc;
    this.mult = mult;
    this.done = level.finished;
    this.seq0 = seq0;
    this.angle = 360 / this.div;
  }

  show(step = 1) {
    noFill();
    stroke("#0f0f0f");
    strokeWeight((this.rc / 4) * this.mult);
    ellipse(0, 0, this.size * 2);

    for (var i = 0; i < this.div; i++) {
      let yCircle = this.y + sin(this.angle * i) * this.size;
      let xCircle = this.x - cos(this.angle * i) * this.size;
      if (this.done == true) {
        if (step % this.div == i) {
          strokeWeight((this.rc / 4) * this.mult);
          stroke(this.color);
          noFill();
        } else {
          fill(this.color);
          noStroke();
        }
      } else {
        if (i == this.seq0 && this.mult != 4) {
          strokeWeight((this.rc / 4) * this.mult);
          stroke(this.color);
          noFill();
        } else {
          fill(this.color);
          noStroke();
        }
      }

      ellipse(yCircle, xCircle, this.rc * this.mult);
    }
  }
}
