const ActivationFunctions = require('./ActivationFunctions');

class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes, activationFunctions, initializeWeights = true) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;
    this.activationFunctions = activationFunctions;

    // Inicialize os pesos e bias aqui
    this.weights = [];
    this.biases = [];

    if (initializeWeights) {
      // Inicializando os pesos e bias das camadas ocultas
      let previousLayerNodes = this.inputNodes;
      for (let i = 0; i < this.hiddenNodes.length; i++) {
        this.weights.push(this.createRandomMatrix(this.hiddenNodes[i], previousLayerNodes));
        this.biases.push(this.createRandomMatrix(this.hiddenNodes[i], 1));
        previousLayerNodes = this.hiddenNodes[i];
      }

      // Inicializando os pesos e bias da camada de saída
      this.weights.push(this.createRandomMatrix(this.outputNodes, previousLayerNodes));
      this.biases.push(this.createRandomMatrix(this.outputNodes, 1));
    }
  }

  createRandomMatrix(rows, cols) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.random() * 2 - 1);
      }
      matrix.push(row);
    }
    return matrix;
  }

  static createRandom(inputNodes = 20, hiddenNodes = [10], outputNodes = 2) {

    const selectedActivationFunctions = {};

    // Selecionando funções de ativação aleatórias para cada camada oculta e a camada de saída
    for (let i = 0; i < hiddenNodes.length; i++) {
      const randomName = ActivationFunctions.getRandomFunctionName();
      selectedActivationFunctions['hidden_' + i] = {
        name: randomName,
        ...ActivationFunctions.getFunctionByName(randomName),
      };
    }
    const randomName = ActivationFunctions.getRandomFunctionName();
    selectedActivationFunctions['output'] = {
      name: randomName,
      ...ActivationFunctions.getFunctionByName(randomName),
    };

    return new NeuralNetwork(inputNodes, hiddenNodes, outputNodes, selectedActivationFunctions, true);
  }

  static createFrom(parentNetwork) {
    // Crie uma nova rede neural com os mesmos parâmetros da rede fornecida
    const childNetwork = new NeuralNetwork(
      parentNetwork.inputNodes,
      parentNetwork.hiddenNodes,
      parentNetwork.outputNodes,
      parentNetwork.activationFunctions,
      false
    );

    // Use a função mutate para obter novos pesos e bias
    const { weights, biases } = this.mutate(parentNetwork);

    // Atribua os novos pesos e bias à nova rede
    childNetwork.weights = weights;
    childNetwork.biases = biases;
    //console.log('Mutação realizada.')
    return childNetwork;
  }

  static import(network) {
    const activationFunctions = {};

    // Selecionando funções de ativação aleatórias para cada camada oculta e a camada de saída
    for (let i = 0; i < network.hiddenNodes.length; i++) {
      const functionName = network.activationFunctions['hidden_' + i].name;
      activationFunctions['hidden_' + i] = {
        name: functionName,
        ...ActivationFunctions.getFunctionByName(functionName),
      };
    }
    const functionName = network.activationFunctions['output'].name;
    activationFunctions['output'] = {
      name: functionName,
      ...ActivationFunctions.getFunctionByName(functionName),
    };

    // Crie uma nova rede neural com os mesmos parâmetros da rede fornecida
    const importedNetwork = new NeuralNetwork(
      network.inputNodes,
      network.hiddenNodes,
      network.outputNodes,
      activationFunctions,
      false
    );

    importedNetwork.weights = network.weights;
    importedNetwork.biases = network.biases;

    return importedNetwork;
  }

  static mutate(network, mutationRate = 0.1, mutationRange = 0.1) {
    function mutateValue(value) {
      if (Math.random() < mutationRate) {
        const mutation = mutationRange * (Math.random() * 2 - 1);
        return value + mutation;
      }
      return value;
    }

    // Clone and mutate weights
    const mutatedWeights = network.weights.map(layer =>
      layer.map(row => row.map(value => mutateValue(value)))
    );

    // Clone and mutate biases
    const mutatedBiases = network.biases.map(layer =>
      layer.map(row => [mutateValue(row[0])])
    );

    return { weights: mutatedWeights, biases: mutatedBiases };
  }

  static crossover(parentA, parentB) {
    // Implemente o crossover entre duas redes neurais aqui
  }
}

module.exports = NeuralNetwork;
