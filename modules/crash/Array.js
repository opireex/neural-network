const crypto = require('crypto');

class Array {
    constructor(serverSeed, amount) {
        this.result = [];
        this.serverSeed = serverSeed;
        this.clientSeed = '0000000000000000000415ebb64b0d51ccee0bb55826e43846e5bea777d91966';
        this.amount = amount;
        this.chain = [serverSeed];
        this.init();
    }

    getChain() {
        for (let i = 0; i < this.amount; i++) {
            this.chain.push(
            crypto
                .createHash("sha256")
                .update(this.chain[this.chain.length - 1])
                .digest("hex")
            );
        }
    }

    divisible(hash, mod) {
        let val = 0;
  
        let o = hash.length % 4;
        for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
          val =
            ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) %
            mod;
        }
  
        return val === 0;
    }

    getPoint(hash) {
        // In 1 of 15 games the game crashes instantly.
        if (this.divisible(hash, 15)) return 0;
  
        // Use the most significant 52-bit from the hash to calculate the crash point
        let h = parseInt(hash.slice(0, 52 / 4), 16);
        let e = Math.pow(2, 52);
  
        const point = (
          Math.floor((100 * e - h) / (e - h)) / 100
        ).toFixed(2);
  
        return point;
    }

    init() {
        this.getChain();
        this.chain.map((seed, index) => {
            const hash = crypto
              .createHmac("sha256", seed)
              .update(this.clientSeed)
              .digest("hex");

            const point = this.getPoint(hash);
            this.result.push(Number(point));
        });
    }
}

module.exports = Array;