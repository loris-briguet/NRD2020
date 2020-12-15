class Synth {
  constructor() {
    this.loopBeat;
    this.bassSynth;
    setup();
  }

  setup() {}

  song(time) {
    this.bassSynth.triggerAttackRelease("C2", "8n", time);
  }
}
