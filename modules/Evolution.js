class Evolution {
    constructor(population) {
        this.population = population;
    }

    addPerson(person) {
        if (this.population.length >= 100) {
          const worstPerson = Evolution.getWorstPerson(this.population);
    
          // Verifica se a nova pessoa é melhor que a pior pessoa na população
          const isNewPersonBetter =
            person.bank - 100 > worstPerson.bank - 100 ||
            ((person.bank - 100) === (worstPerson.bank - 100) && (person.played !== 0 && (person.played < worstPerson.played))) ||
            ((person.bank - 100) === (worstPerson.bank - 100) && (person.played !== 0 && (person.played < worstPerson.played)) && person.score > worstPerson.score);
    
          if (isNewPersonBetter) {
            // Remove a pior pessoa e adiciona a nova pessoa
            const worstPersonIndex = this.population.indexOf(worstPerson);
            this.population.splice(worstPersonIndex, 1);
            this.population.push(person);
          }
        } else {
          this.population.push(person);
        }
    }

    // Função para obter a melhor pessoa na população
    static getBestPerson(population) {
      let bestPerson = null;
      let bestScore = -Infinity;
      let bestBank = -Infinity;
      let bestPlayed = Infinity;
  
      for (const person of population) {
        const { consciousness, score, bank, played } = person;
  
        const isBetter =
          bank - 100 > bestBank ||
          ((bank - 100) === bestBank && (played !== 0 && (played < bestPlayed))) ||
          ((bank - 100) === bestBank && (played !== 0 && (played < bestPlayed)) && score > bestScore);
  
        if (isBetter) {
          bestScore = score;
          bestBank = (bank - 100);
          bestPlayed = played;
          bestPerson = person;
        }
      }
  
      return bestPerson;
    }

    static getWorstPerson(population) {
        let worstPerson = null;
        let worstScore = Infinity;
        let worstBank = Infinity;
        let worstPlayed = -Infinity;
    
        for (const person of population) {
          const { consciousness, score, bank, played } = person;
    
          const isWorse =
            bank - 100 < worstBank ||
            ((bank - 100) === worstBank && (played !== 0 && (played > worstPlayed))) ||
            ((bank - 100) === worstBank && (played !== 0 && (played > worstPlayed)) && score < worstScore);
    
          if (isWorse) {
            worstScore = score;
            worstBank = (bank - 100);
            worstPlayed = played;
            worstPerson = person;
          }
        }
    
        return worstPerson;
    }
  }
  
  module.exports = Evolution;
  