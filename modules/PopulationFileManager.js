const Evolution = require('./Evolution');
const fs = require('fs');

class PopulationFileManager {
  static saveBestNetwork(filePath, bestPopulation) {
    if (bestPopulation.length === 0) {
      return;
    }

    const bestPerson = Evolution.getBestPerson(bestPopulation);
    const bestNetwork = bestPerson.consciousness.brain.network;
    const data = JSON.stringify(bestNetwork);
    fs.writeFileSync(filePath, data);
  }

  static loadBestNetwork(filePath) {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
}

module.exports = PopulationFileManager;
