class ActivationFunctions {
    static functions = {
      relu: {
        func: x => Math.max(0, x),
        derivative: x => (x > 0 ? 1 : 0),
      },
      leakyRelu: {
        func: x => (x > 0 ? x : 0.01 * x),
        derivative: x => (x > 0 ? 1 : 0.01),
      },
      sigmoid: {
        func: x => 1 / (1 + Math.exp(-x)),
        derivative: x => {
          const sigmoid = 1 / (1 + Math.exp(-x));
          return sigmoid * (1 - sigmoid);
        },
      },
      perceptron: {
        func: x => (x > 0 ? 1 : 0),
        derivative: x => 0,
      },
      tanh: {
        func: x => Math.tanh(x),
        derivative: x => {
          const tanh = Math.tanh(x);
          return 1 - tanh * tanh;
        },
      },
    };
  
    static getRandomFunctionName() {
      const keys = Object.keys(ActivationFunctions.functions);
      return keys[Math.floor(Math.random() * keys.length)];
    }
  
    static getFunctionByName(name) {
      return ActivationFunctions.functions[name];
    }
  }
  
  module.exports = ActivationFunctions;
  