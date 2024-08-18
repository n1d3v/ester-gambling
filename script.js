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

    $(document).ready(function() {
        console.log("You aren't here to cheat, right?");

        let money = 100;
        const spinCost = 20;
        const jackpotPrize = 1000;
        const replenishAmount = 50;
        let replenishClicks = 0;
        const maxReplenishClicks = 5;
        let spinning = false;

        function updateMoneyDisplay() {
            $("#money").text(`money $${money}`);
            if (money <= 10) {
                $("#spin-button").prop("disabled", true).addClass("disabled");
            } else {
                $("#spin-button").prop("disabled", false).removeClass("disabled");
            }

            if (money <= 10 && replenishClicks < maxReplenishClicks) {
                $("#replenish-button").show();
            } else {
                $("#replenish-button").hide();
            }
        }

        $("#spin-button").on("click", function() {
            if (spinning) return;

            if (money < spinCost) {
                alert("broke bitch cant continue gambling, you can just refresh or smmth");
                updateMoneyDisplay();
                return;
            }

            money -= spinCost;
            updateMoneyDisplay();
            spinning = true;

            let $reel1 = $("#reel1"),
                $reel2 = $("#reel2"),
                $reel3 = $("#reel3"),
                $resultMessage = $("#result-message"),
                messages = ["fuck you imagine not winning", "your fucking awful", "you should jump", "by your standards, just keep going.", "99% of gamblers quit before they win big!!"];
            $resultMessage.text("");
            let symbols = ["7", "BAR", "\u{1F352}", "\u{1F48E}", "1", "2", "3", "4", "5", "6"];

            function spinReel($reel, delay, spins) {
                return new Promise(resolve => {
                    let count = 0;

                    function animate() {
                        count++;
                        $reel.css("transform", "translateY(-60px)");
                        setTimeout(() => {
                            $reel.append($reel.children().first());
                            $reel.css("transform", "translateY(0)");
                            if (count < spins) {
                                setTimeout(animate, delay);
                            } else {
                                $reel.children().each((index, child) => {
                                    $(child).text(symbols[Math.floor(w.random() * symbols.length)]);
                                });
                                resolve($reel.children().eq(1).text());
                            }
                        }, 100);
                    }
                    animate();
                });
            }

            function playSoundFX() {
                $("#winfx-sound")[0].play();
                setTimeout(() => {
                    $("#coins-sound")[0].play();
                }, 500);
            }

            function playLoseFX() {
                $("#lose-sound")[0].play();
            }

            async function spin() {
                let result1 = await spinReel($reel1, 100, 10),
                    result2 = await spinReel($reel2, 100, 10),
                    result3 = await spinReel($reel3, 100, 10);
                if (checkWin(result1, result2, result3)) {
                    $resultMessage.text("777 big win");
                    money += jackpotPrize;
                    playSoundFX();
                } else {
                    playLoseFX()
                    $resultMessage.html(messages[Math.floor(Math.random() * messages.length)]);
                }
                updateMoneyDisplay();
                spinning = false;
            }

            function checkWin(result1, result2, result3) {
                let winningPatterns = [
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
                return winningPatterns.some(pattern => pattern[0] === result1 && pattern[1] === result2 && pattern[2] === result3);
            }

            spin();
        });

        $("#replenish-button").on("click", function() {
            if (money <= 10 && replenishClicks < maxReplenishClicks) {
                money += replenishAmount;
                replenishClicks++;
                updateMoneyDisplay();
            }
            if (replenishClicks >= maxReplenishClicks) {
                $(this).hide();
            }
        });

        updateMoneyDisplay();
    });
})();
