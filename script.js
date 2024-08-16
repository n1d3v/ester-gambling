
// this is shamelessly stolen
// from https://raw.githubusercontent.com/AndreasMadsen/xorshift/master/xorshift.js

/**
 * Create a pseudorandom number generator, with a seed.
 * @param {array} seed "128-bit" integer, composed of 4x32-bit
 * integers in big endian order.
 */
function XorShift(seed) {
  // Note the extension, this === module.exports is required because
  // the `constructor` function will be used to generate new instances.
  // In that case `this` will point to the default RNG, and `this` will
  // be an instance of XorShift.
  if (!(this instanceof XorShift) || this === module.exports) {
    return new XorShift(seed);
  }

  if (!Array.isArray(seed) || seed.length !== 4) {
    throw new TypeError('seed must be an array with 4 numbers');
  }

  // uint64_t s = [seed ...]
  this._state0U = seed[0] | 0;
  this._state0L = seed[1] | 0;
  this._state1U = seed[2] | 0;
  this._state1L = seed[3] | 0;
}

/**
 * Returns a 64bit random number as a 2x32bit array
 * @return {array}
 */
XorShift.prototype.randomint = function() {
  // uint64_t s1 = s[0]
  var s1U = this._state0U, s1L = this._state0L;
  // uint64_t s0 = s[1]
  var s0U = this._state1U, s0L = this._state1L;

  // result = s0 + s1
  var sumL = (s0L >>> 0) + (s1L >>> 0);
  var resU = (s0U + s1U + (sumL / 2 >>> 31)) >>> 0;
  var resL = sumL >>> 0;

  // s[0] = s0
  this._state0U = s0U;
  this._state0L = s0L;

  // - t1 = [0, 0]
  var t1U = 0, t1L = 0;
  // - t2 = [0, 0]
  var t2U = 0, t2L = 0;

  // s1 ^= s1 << 23;
  // :: t1 = s1 << 23
  var a1 = 23;
  var m1 = 0xFFFFFFFF << (32 - a1);
  t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
  t1L = s1L << a1;
  // :: s1 = s1 ^ t1
  s1U = s1U ^ t1U;
  s1L = s1L ^ t1L;

  // t1 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  // :: t1 = s1 ^ s0
  t1U = s1U ^ s0U;
  t1L = s1L ^ s0L;
  // :: t2 = s1 >> 18
  var a2 = 18;
  var m2 = 0xFFFFFFFF >>> (32 - a2);
  t2U = s1U >>> a2;
  t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
  // :: t1 = t1 ^ t2
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;
  // :: t2 = s0 >> 5
  var a3 = 5;
  var m3 = 0xFFFFFFFF >>> (32 - a3);
  t2U = s0U >>> a3;
  t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
  // :: t1 = t1 ^ t2
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;

  // s[1] = t1
  this._state1U = t1U;
  this._state1L = t1L;

  // return result
  return [resU, resL];
};

/**
 * Returns a random number normalized [0, 1), just like Math.random()
 * @return {number}
 */
XorShift.prototype.random = function() {
  var t2 = this.randomint();
  // Math.pow(2, -32) = 2.3283064365386963e-10
  // Math.pow(2, -52) = 2.220446049250313e-16
  return t2[0] * 2.3283064365386963e-10 + (t2[1] >>> 12) * 2.220446049250313e-16;
};

// Seed with Math.random() by default to prevent seed collision
function getRandomSeed() {
    return (Date.now()/2000000000000) * Math.pow(2, 32);
}

const miau = new XorShift([
  getRandomSeed(),
  getRandomSeed(),
  getRandomSeed(),
  getRandomSeed()
]);

// end of stolen shit

document.getElementById('spin-button').addEventListener('click', function() {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const resultMessage = document.getElementById('result-message');

    resultMessage.textContent = "";

    const symbols = ['7', 'BAR', '🍒', '💎', '1', '2', '3', '4', '5', '6'];

    function spinReel(reel, delay, spins) {
        return new Promise(resolve => {
            let currentSpin = 0;

            function spin() {
                currentSpin++;
                reel.style.transform = `translateY(-60px)`;
                setTimeout(() => {
                    reel.appendChild(reel.firstElementChild);
                    reel.style.transform = 'translateY(0)';

                    if (currentSpin < spins) {
                        setTimeout(spin, delay);
                    } else {
                        for (let i = 0; i < reel.children.length; i++) {
                            reel.children[i].textContent = symbols[Math.floor(miau.random() * symbols.length)];
                        }
                        resolve(reel.children[1].textContent);
                    }
                }, 100);
            }

            spin();
        });
    }

    async function spinAllReels() {
        const result1 = await spinReel(reel1, 100, 10);
        const result2 = await spinReel(reel2, 100, 10);
        const result3 = await spinReel(reel3, 100, 10);

        const isJackpot = checkJackpot(result1, result2, result3);
        if (isJackpot) {
            resultMessage.textContent = "777 big win";
        } else {
            resultMessage.textContent = "your just fucking horrible arent you";
        }
    }

    function checkJackpot(r1, r2, r3) {
        const jackpots = [
            ['BAR', 'BAR', '🍒'],
            ['BAR', '🍒', 'BAR'],
            ['1', '1', '1'],
            ['2', '2', '2'],
            ['3', '3', '3'],
            ['4', '4', '4'],
            ['5', '5', '5'],
            ['6', '6', '6'],
            ['7', '7', '7'],
            ['BAR', 'BAR', 'BAR'],
            ['🍒', '🍒', 'BAR'],
            ['🍒', 'BAR', '🍒'],
            ['🍒', '🍒', '🍒']
        ];

        return jackpots.some(jackpot => jackpot[0] === r1 && jackpot[1] === r2 && jackpot[2] === r3);
    }
    spinAllReels();
});
