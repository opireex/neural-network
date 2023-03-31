class Consciousness {
  constructor(brain) {
    this.brain = brain;
  }

  makeDecision(inputs) {
    return this.brain.predict(inputs);
  }
}

module.exports = Consciousness;
