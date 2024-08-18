(() => {
    var A = (t, n) => () => (n || t((n = {
        exports: {}
    }).exports, n), n.exports);
    var B = A((x, v) => {
        function f(t) {
            if (!(this instanceof f) || this === v.exports) return new f(t);
            if (!Array.isArray(t) || t.length !== 4) throw new TypeError("seed must be an array with 4 numbers");
            this._state0U = t[0] | 0, this._state0L = t[1] | 0, this._state1U = t[2] | 0, this._state1L = t[3] | 0
        }
        f.prototype.randomint = function() {
            var t = this._state0U,
                n = this._state0L,
                c = this._state1U,
                l = this._state1L,
                d = (l >>> 0) + (n >>> 0),
                F = c + t + (d / 2 >>> 31) >>> 0,
                p = d >>> 0;
            this._state0U = c, this._state0L = l;
            var r = 0,
                o = 0,
                m = 0,
                e = 0,
                a = 23,
                u = 4294967295 << 32 - a;
            r = t << a | (n & u) >>> 32 - a, o = n << a, t = t ^ r, n = n ^ o, r = t ^ c, o = n ^ l;
            var i = 18,
                h = 4294967295 >>> 32 - i;
            m = t >>> i, e = n >>> i | (t & h) << 32 - i, r = r ^ m, o = o ^ e;
            var s = 5,
                y = 4294967295 >>> 32 - s;
            return m = c >>> s, e = l >>> s | (c & y) << 32 - s, r = r ^ m, o = o ^ e, this._state1U = r, this._state1L = o, [F, p]
        };
        f.prototype.random = function() {
            var t = this.randomint();
            return t[0] * 23283064365386963e-26 + (t[1] >>> 12) * 2220446049250313e-31
        };

        function g() {
            return Math.random() * Math.pow(2, 32)
        }
        v.exports = new f([g(), g(), g(), g()]);
        v.exports.XorShift = f
    });
    var w = B();
    console.log("You aren't here to cheat, right?");
    for (let t = 0; t < 1024; t++) w.random();

    let money = 100;
    const spinCost = 20;
    const jackpotPrize = 1000;
    const replenishAmount = 50;
    let replenishClicks = 0;
    const maxReplenishClicks = 5;

    function updateMoneyDisplay() {
        document.getElementById("money").textContent = `money $${money}`;
        if (money <= 10 && replenishClicks < maxReplenishClicks) {
            document.getElementById("replenish-button").style.display = "inline";
        } else {
            document.getElementById("replenish-button").style.display = "none";
        }
    }

    document.getElementById("spin-button").addEventListener("click", function() {
        if (money < spinCost) {
            alert("broke bitch cant continue gambling, you can just refresh or smmth");
            updateMoneyDisplay();
            return;
        }

        money -= spinCost;
        updateMoneyDisplay();

        let t = document.getElementById("reel1"),
            n = document.getElementById("reel2"),
            c = document.getElementById("reel3"),
            l = document.getElementById("result-message"),
            d = ["fuck you imagine not winning", "your fucking awful", "you should jump", "by your standards, just keep going.", "99% of gamblers quit before they win big!!"];
        l.textContent = "";
        let F = ["7", "BAR", "\u{1F352}", "\u{1F48E}", "1", "2", "3", "4", "5", "6"];

        function p(e, a, u) {
            return new Promise(i => {
                let h = 0;

                function s() {
                    h++, e.style.transform = "translateY(-60px)", setTimeout(() => {
                        if (e.appendChild(e.firstElementChild), e.style.transform = "translateY(0)", h < u) setTimeout(s, a);
                        else {
                            for (let y = 0; y < e.children.length; y++) e.children[y].textContent = F[Math.floor(w.random() * F.length)];
                            i(e.children[1].textContent)
                        }
                    }, 100)
                }
                s()
            })
        }

        function r() {
            winfxSound.play(), setTimeout(() => {
                coinsSound.play()
            }, 500)
        }
        async function o() {
            let e = await p(t, 100, 10),
                a = await p(n, 100, 10),
                u = await p(c, 100, 10);
            if (m(e, a, u)) {
                l.textContent = "777 big win";
                money += jackpotPrize;
                r();
            } else {
                l.innerHTML = d[Math.floor(Math.random() * d.length)];
            }
            updateMoneyDisplay();
        }

        function m(e, a, u) {
            let i = [
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
            for (let h = 0; h < i.length; h++) {
                let s = i[h];
                if (s[0] === e && s[1] === a && s[2] === u) return !0
            }
            return !1
        }
        o();
    });

    document.getElementById("replenish-button").addEventListener("click", function() {
        if (money <= 10 && replenishClicks < maxReplenishClicks) {
            money += replenishAmount;
            replenishClicks++;
            updateMoneyDisplay();
        }
        if (replenishClicks >= maxReplenishClicks) {
            document.getElementById("replenish-button").style.display = "none";
        }
    });

    updateMoneyDisplay();
})();
