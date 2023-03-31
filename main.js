const Person = require('./modules/Person');
const Consciousness = require('./modules/Consciousness');
const NeuralNetwork = require('./modules/NeuralNetwork');
const Brain = require('./modules/Brain');
const Evolution = require('./modules/Evolution');
const Array = require('./modules/crash/Array');
const PopulationFileManager = require('./modules/PopulationFileManager');
const path = require('path');


const serverSeed = '42bfb688c8df9522660ef6c46859dec8fba0bc5907bbedb63bd4be01bc63b95e';
const amount = 1000000;

let array = new Array(serverSeed, amount);

const bestPopulation = new Evolution([]);

const bestNetworkFilePath = path.resolve(__dirname, 'best-network', 'bestNetwork.json');
const loadedBestNetwork = PopulationFileManager.loadBestNetwork(bestNetworkFilePath);
if (loadedBestNetwork) {
  const bestNetwork = NeuralNetwork.import(loadedBestNetwork);
  const brain = new Brain(bestNetwork);
  const consciousness = new Consciousness(brain);
  const bestPerson = new Person(consciousness);
  bestPopulation.addPerson(bestPerson);
  //console.log(Evolution.getBestPerson(bestPopulation.population).consciousness.brain.network.activationFunctions);

  console.log('Network imported!');
}

const populationSize = 1000;

const inputNodes = 20;
const hiddenNodes = [10];
const outputNodes = 2;

const objective = 2;

function createInitialPopulation() {
  const population = [];
  const bestPersonExists = bestPopulation.population.length > 0;
  const bestPerson = bestPersonExists ? Evolution.getBestPerson(bestPopulation.population) : null;

  for (let i = 0; i < populationSize; i++) {
    let network;

    if (bestPersonExists) {
      network = NeuralNetwork.createFrom(bestPerson.consciousness.brain.network);
    } else {
      network = NeuralNetwork.createRandom(inputNodes, hiddenNodes, outputNodes);
    }

    const brain = new Brain(network);
    const consciousness = new Consciousness(brain);
    const person = new Person(consciousness);
    population.push(person);
  }
  return population;
}


function runGeneration(population) {
  for (const person of population) {
    const inputs = array.result.slice(array.result.length - 20, array.result.length - 1);
    const decision = person.consciousness.makeDecision(inputs);

    let isCorrect = false;
    if (decision) {
      if (decision === 'yes') {
        if (array.result[array.result.length - 21] >= objective) {
          isCorrect = true;
          person.updateBank(objective - 1);
        } else {
          isCorrect = false;
          person.updateBank(-1);
        }
      }
      if (decision === 'no') {
        isCorrect = array.result[array.result.length - 21] < objective ? true : false;
      }
    } else {
      person.kill();
    }

    if (isCorrect) {
      person.updateScore(1);
    } else {
      person.updateScore(-1);
    }

    if (person.isDead()) {
      resetPerson(person);
    }
  }
}

function resetPerson(person) {
  let newNetwork;

  if (bestPopulation.population.length > 0) {
    const bestPerson = Evolution.getBestPerson(bestPopulation.population);
    newNetwork = NeuralNetwork.createFrom(bestPerson.consciousness.brain.network);
  } else {
    newNetwork = NeuralNetwork.createRandom(inputNodes, hiddenNodes, outputNodes);
  }

  const newBrain = new Brain(newNetwork);
  const newConsciousness = new Consciousness(newBrain);

  person.consciousness = newConsciousness;
  person.score = 0;
  person.bank = 100;
  person.played = 0;
  person.won = 0;
  person.lost = 0;
  person.lived = 0;
}

function generateNewArray() {
  return new Array(serverSeed, amount);
}

async function runSimulation(numGenerations) {
  const population = createInitialPopulation();

  for (let i = 0; i < numGenerations; i++) {
    if (array.result.length < 21) {
      array = generateNewArray();
    }
    runGeneration(population);
    array.result.pop();
  }
  bestPopulation.addPerson(Evolution.getBestPerson(population));
}

(async () => {
  for (let i = 0; i < 1000; i++) {
    await runSimulation(10000);
    console.log(Evolution.getBestPerson(bestPopulation.population));
    PopulationFileManager.saveBestNetwork(bestNetworkFilePath, bestPopulation.population);
    console.log('Best Network Saved!')
  }
})();
