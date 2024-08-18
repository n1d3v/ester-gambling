(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/xorshift/xorshift.js
  var require_xorshift = __commonJS({
    "node_modules/xorshift/xorshift.js"(exports, module) {
      function XorShift(seed) {
        if (!(this instanceof XorShift) || this === module.exports) {
          return new XorShift(seed);
        }
        if (!Array.isArray(seed) || seed.length !== 4) {
          throw new TypeError("seed must be an array with 4 numbers");
        }
        this._state0U = seed[0] | 0;
        this._state0L = seed[1] | 0;
        this._state1U = seed[2] | 0;
        this._state1L = seed[3] | 0;
      }
      XorShift.prototype.randomint = function() {
        var s1U = this._state0U, s1L = this._state0L;
        var s0U = this._state1U, s0L = this._state1L;
        var sumL = (s0L >>> 0) + (s1L >>> 0);
        var resU = s0U + s1U + (sumL / 2 >>> 31) >>> 0;
        var resL = sumL >>> 0;
        this._state0U = s0U;
        this._state0L = s0L;
        var t1U = 0, t1L = 0;
        var t2U = 0, t2L = 0;
        var a1 = 23;
        var m1 = 4294967295 << 32 - a1;
        t1U = s1U << a1 | (s1L & m1) >>> 32 - a1;
        t1L = s1L << a1;
        s1U = s1U ^ t1U;
        s1L = s1L ^ t1L;
        t1U = s1U ^ s0U;
        t1L = s1L ^ s0L;
        var a2 = 18;
        var m2 = 4294967295 >>> 32 - a2;
        t2U = s1U >>> a2;
        t2L = s1L >>> a2 | (s1U & m2) << 32 - a2;
        t1U = t1U ^ t2U;
        t1L = t1L ^ t2L;
        var a3 = 5;
        var m3 = 4294967295 >>> 32 - a3;
        t2U = s0U >>> a3;
        t2L = s0L >>> a3 | (s0U & m3) << 32 - a3;
        t1U = t1U ^ t2U;
        t1L = t1L ^ t2L;
        this._state1U = t1U;
        this._state1L = t1L;
        return [resU, resL];
      };
      XorShift.prototype.random = function() {
        var t2 = this.randomint();
        return t2[0] * 23283064365386963e-26 + (t2[1] >>> 12) * 2220446049250313e-31;
      };
      function getRandomSeed() {
        return Math.random() * Math.pow(2, 32);
      }
      module.exports = new XorShift([
        getRandomSeed(),
        getRandomSeed(),
        getRandomSeed(),
        getRandomSeed()
      ]);
      module.exports.XorShift = XorShift;
    }
  });

  // <stdin>
  var xorshift = require_xorshift();
  console.log("You aren't here to cheat, right?");
  for (let i = 0; i < 1024; i++) {
    xorshift.random();
  }
  document.getElementById("spin-button").addEventListener("click", function() {
    const reel1 = document.getElementById("reel1");
    const reel2 = document.getElementById("reel2");
    const reel3 = document.getElementById("reel3");
    const resultMessage = document.getElementById("result-message");
    const loseMessages = [
      "fuck you imagine not winning",
      "your fucking awful",
      "you should jump",
      "by your standards, just keep going."
    ];
    resultMessage.textContent = "";
    const symbols = ["7", "BAR", "\u{1F352}", "\u{1F48E}", "1", "2", "3", "4", "5", "6"];
    function spinReel(reel, delay, spins) {
      return new Promise((resolve) => {
        let currentSpin = 0;
        function spin() {
          currentSpin++;
          reel.style.transform = `translateY(-60px)`;
          setTimeout(() => {
            reel.appendChild(reel.firstElementChild);
            reel.style.transform = "translateY(0)";
            if (currentSpin < spins) {
              setTimeout(spin, delay);
            } else {
              for (let i = 0; i < reel.children.length; i++) {
                reel.children[i].textContent = symbols[Math.floor(xorshift.random() * symbols.length)];
              }
              resolve(reel.children[1].textContent);
            }
          }, 100);
        }
        spin();
      });
    }
    function playJackpotSound() {
      winfxSound.play();
      setTimeout(() => {
        coinsSound.play();
      }, 500);
    }
    async function spinAllReels() {
      const result1 = await spinReel(reel1, 100, 10);
      const result2 = await spinReel(reel2, 100, 10);
      const result3 = await spinReel(reel3, 100, 10);
      const isJackpot = checkJackpot(result1, result2, result3);
      if (isJackpot) {
        resultMessage.textContent = "777 big win";
        playJackpotSound();
      } else {
        resultMessage.innerHTML = loseMessages[Math.floor(Math.random() * loseMessages.length)];
      }
    }
    function checkJackpot(r1, r2, r3) {
      const jackpots = [
        ["BAR", "BAR", "\u{1F352}"],
        ["BAR", "\u{1F352}", "BAR"],
        ["\u{1F352}", "BAR", "\u{1F352}"],
        ["\u{1F352}", "\u{1F352}", "BAR"],
        ["\u{1F352}", "\u{1F352}", "\u{1F352}"],
        ["7", "7", "7"],
        ["BAR", "BAR", "BAR"],
        ["1", "1", "1"],
        ["2", "2", "2"],
        ["3", "3", "3"],
        ["4", "4", "4"],
        ["5", "5", "5"],
        ["6", "6", "6"],
        ["\u{1F48E}", "\u{1F48E}", "\u{1F48E}"]
      ];
      for (let i = 0; i < jackpots.length; i++) {
        const spinythingy = jackpots[i];
        if (spinythingy[0] === r1 && spinythingy[1] === r2 && spinythingy[2] === r3) {
          return true;
        }
      }
      return false;
    }
    spinAllReels();
  });
})();
