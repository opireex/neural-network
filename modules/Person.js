class Person {
    constructor(consciousness) {
      this.consciousness = consciousness;
      this.score = 0;
      this.bank = 100;
      this.played = 0;
      this.lived = 0;
      this.won = 0;
      this.lost = 0;
    }
  
    isDead() {
      return this.score <= -10 || this.bank <= 0;
    }

    kill() {
      this.score = -100;
      this.bank = 0;
    }
  
    updateScore(points) {
      this.score += points;
      this.lived += 1;
    }

    updateBank(value) {
      if(value > 0) {
        this.won += 1;
      } else {
        this.lost += 1;
      }
      this.bank += value;
      this.played += 1;
    }
  }
  
  module.exports = Person;
  