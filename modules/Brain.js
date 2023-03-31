class Brain {
    constructor(network) {
      this.network = network;
    }
  
    predict(inputs) {
        let inputMatrix = [inputs];
        let outputMatrix = this.forwardPropagation(inputMatrix, this.network);
    
        // Compare os valores dos dois primeiros nós de saída
        const output1 = outputMatrix[0][0];
        const output2 = outputMatrix[0][1];
    
        // Retorne true, false ou undefined de acordo com a comparação dos nós de saída
        if (output1 > output2) {
          return 'yes';
        } else if (output1 < output2) {
          return 'no';
        } else {
          return false;
        }
    }

    forwardPropagation(inputMatrix, network) {
      let layerOutputs = inputMatrix;
  
      for (let i = 0; i < network.weights.length; i++) {
        const weightMatrix = network.weights[i];
        const biasMatrix = network.biases[i];
  
        layerOutputs = this.multiplyMatrices(layerOutputs, this.transposeMatrix(weightMatrix));
        layerOutputs = this.addMatrices(layerOutputs, biasMatrix);
  
        const activationFunction = i < network.hiddenNodes.length ?
          network.activationFunctions['hidden_' + i].func :
          network.activationFunctions['output'].func;
  
        layerOutputs = layerOutputs.map(row => row.map(activationFunction));
      }
  
      return layerOutputs;
    }
  
    multiplyMatrices(a, b) {
      const result = new Array(a.length).fill(0).map(row => new Array(b[0].length).fill(0));
  
      return result.map((row, i) => {
        return row.map((val, j) => {
          return a[i].reduce((sum, elm, k) => sum + (elm * b[k][j]), 0);
        });
      });
    }
  
    addMatrices(a, b) {
        return a.map((row, i) => {
          return row.map((val, j) => {
            return val + b[i][0];
          });
        });
      }
  
    transposeMatrix(matrix) {
      return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }
  }
  
  module.exports = Brain;
  