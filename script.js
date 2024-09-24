(() => {
    function encode(data) {
        return btoa(JSON.stringify(data));
    }

    function decode(data) {
        try {
            return JSON.parse(atob(data));
        } catch (e) {
            console.error("error decoding data", e);
            return null;
        }
    }

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
        console.log("you aren't here to cheat, right?");

        function loadMoney() {
            const encodedMoney = localStorage.getItem('money');
            const decodedMoney = decode(encodedMoney);
            return decodedMoney && !isNaN(decodedMoney) ? parseInt(decodedMoney) : 100;
        }

        function saveMoney(amount) {
            localStorage.setItem('money', encode(amount));
        }

        function playTaxFX() {
            $("#tax-sound")[0].play();
        }

        let money = loadMoney();
        const spinCost = 10;
        const jackpotPrize = 1000;
        const robberySuccessRewardMin = 100;
        const robberySuccessRewardMax = 500;
        const robberyFailureReward = 50;
        let replenishClicks = 0;
        const maxReplenishClicks = 10;
        let spinning = false;
        let taxInterval = null;
        let inJail = false;
        const taxPenaltyTime = 30000;
        const successfulRunReward = 100;

        function updateMoneyDisplay() {
            $("#money").text(`money $${money}`);
            saveMoney(money);

            if (money <= 10) {
                $("#spin-button").prop("disabled", true).addClass("disabled");
            } else {
                $("#spin-button").prop("disabled", false).removeClass("disabled");
            }

            $("#rob-button").toggle(money <= 10 && replenishClicks < maxReplenishClicks);

            if (inJail) {
                $("#spin-button").prop("disabled", true).addClass("disabled");
            }
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function startTaxInterval() {
            if (money > 0) {
                taxInterval = setInterval(async () => {
                    let taxAmount = Math.floor(Math.random() * Math.min(money, 100)) + 1;

                    if (money < taxAmount) {
                        let outrunIRS = confirm("are you sure you want to try to outrun the IRS? (ok to try to outrun, cancel to go to jail)");
                        if (outrunIRS) {
                            alert("you managed to outrun the IRS... this time. no money was deducted. +$100 for swag");
                            money += successfulRunReward;
                        } else {
                            alert("you failed to outrun the IRS. you're going to jail. >:(");
                            inJail = true;
                            updateMoneyDisplay();
                            setTimeout(() => {
                                alert("you're out of jail. run better next time.");
                                inJail = false;
                                updateMoneyDisplay();
                            }, taxPenaltyTime);
                        }
                    } else {
                        playTaxFX();
                        await delay(3000);

                        let userGuess = prompt(`tax time :3 your amount to pay is just guess :>`);

                        if (userGuess === null) {
                            alert("you little bitch, how dare you try to cancel tax >:(");
                            money -= taxAmount;
                        } else {
                            userGuess = parseInt(userGuess);
                            if (userGuess > money) {
                                alert("you tried to pay more than you have! you're going to jail for making up non-existent money. >:(");
                                inJail = true;
                                updateMoneyDisplay();
                                setTimeout(() => {
                                    alert("you're out of jail. guess the right amount next time.");
                                    inJail = false;
                                    updateMoneyDisplay();
                                }, taxPenaltyTime);
                            } else if (userGuess === money) {
                                alert("you smart mf, you're going to jail for that.");
                                inJail = true;
                                updateMoneyDisplay();
                                setTimeout(() => {
                                    alert("you're out of jail!");
                                    inJail = false;
                                    updateMoneyDisplay();
                                }, taxPenaltyTime);
                            } else if (userGuess >= taxAmount) {
                                alert(`you paid your taxes!!!! you paid: $${taxAmount}. +$100 for the IRS being happy.`);
                                money += successfulRunReward;
                                money -= taxAmount;
                                saveMoney(money);
                            } else {
                                alert(`you guessed too low, it was: $${taxAmount}. do you want try to outrun the IRS?`);
                                let outrunIRS = confirm("are you sure you want to try to outrun the IRS? (ok to try to outrun, cancel to go to jail");
                                if (outrunIRS) {
                                    alert("you managed to outrun the IRS... this time. no money was deducted. +$100 for swag");
                                    money += successfulRunReward;
                                } else {
                                    alert("you failed to outrun the IRS. you're going to jail for making up non-existent money. >:(");
                                    inJail = true;
                                    updateMoneyDisplay();
                                    setTimeout(() => {
                                        alert("you're out of jail. guess the right amount next time.");
                                        inJail = false;
                                        updateMoneyDisplay();
                                    }, taxPenaltyTime);
                                }
                            }
                        }
                        updateMoneyDisplay();
                    }
                }, 120000);
            }
        }

        $("#spin-button").on("click", function() {
            if (spinning || inJail) return;

            if (money < spinCost) {
                alert("broke bitch can't continue gambling. you can refresh or wait for taxes and pray you get money.");
                updateMoneyDisplay();
                return;
            }

            money -= spinCost;
            saveMoney(money);
            updateMoneyDisplay();
            spinning = true;

            let $reel1 = $("#reel1"),
                $reel2 = $("#reel2"),
                $reel3 = $("#reel3"),
                $resultMessage = $("#result-message"),
                messages = ["imagine not winning", "you're awful", "you should try again", "by your standards, just keep going.", "99% of gamblers quit before they win big!!"];
            $resultMessage.text("");
            let symbols = ["7", "BAR", "\u{1F352}", "\u{1F48E}", "1", "2", "3", "4", "5", "6"];

            function spinReel($reel, delay, spins) {
                return new Promise(resolve => {
                    const slotHeight = $reel.children().first().outerHeight();
                    const totalHeight = slotHeight * $reel.children().length;
                    let count = 0;
                    
                    let sequence = [0, -60, -120, -180];
                    let currentIndex = 0;
                    
                    const clickSound = document.getElementById("click-sound");
                    clickSound.volume = 0.1;
            
                    function playClickSound() {
                        clickSound.currentTime = 0;
                        clickSound.play();
                    }
            
                    function updatePosition() {
                        if (currentIndex >= sequence.length) {
                            $reel.css("transform", "translateY(0)");
                            $reel.append($reel.children().first());
                            setTimeout(() => {
                                if (count < spins) {
                                    count++;
                                    currentIndex = 0;
                                    updatePosition();
                                } else {
                                    $reel.children().each((index, child) => {
                                        $(child).text(symbols[Math.floor(w.random() * symbols.length)]);
                                    });
                                    resolve($reel.children().eq(1).text());
                                }
                            }, delay);
                        } else {
                            $reel.css("transform", `translateY(${sequence[currentIndex]}px)`);
                            playClickSound();
                            currentIndex++;
                            setTimeout(updatePosition, delay);
                        }
                    }
            
                    updatePosition();
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
                let result1 = await spinReel($reel1, 100, 3),
                    result2 = await spinReel($reel2, 100, 3),
                    result3 = await spinReel($reel3, 100, 3);
                if (checkWin(result1, result2, result3)) {
                    $resultMessage.text("777 big win");
                    money += jackpotPrize;
                    saveMoney(money);
                    playSoundFX();
                } else {
                    playLoseFX();
                    $resultMessage.html(messages[Math.floor(Math.random() * messages.length)]);
                }
                updateMoneyDisplay();
                spinning = false;
            }

            function checkWin(result1, result2, result3) {
                const winningPatterns = {
                    "BAR_BAR_🍒": true,
                    "BAR_🍒_BAR": true,
                    "🍒_BAR_🍒": true,
                    "🍒_BAR_BAR": true,
                    "🍒_🍒_🍒": true,
                    "7_7_7": true,
                    "BAR_BAR_BAR": true,
                    "1_1_1": true,
                    "2_2_2": true,
                    "3_3_3": true,
                    "4_4_4": true,
                    "5_5_5": true,
                    "6_6_6": true,
                    "💎_💎_💎": true
                };
                return winningPatterns[`${result1}_${result2}_${result3}`] || false;
            }

            spin();
        });

        $("#rob-button").on("click", function() {
            if (inJail) {
                alert("you're in jail! no robbing banks for you.");
                return;
            }

            const successChance = 0.25;
            const isSuccess = Math.random() < successChance;

            if (isSuccess) {
                const reward = Math.floor(Math.random() * (robberySuccessRewardMax - robberySuccessRewardMin + 1)) + robberySuccessRewardMin;
                money += reward;
                alert(`success! you robbed the bank and got $${reward}.`);
            } else {
                money += robberyFailureReward;
                alert(`you failed! you tried to rob the bank but got $${robberyFailureReward} for trying.`);
            }

            saveMoney(money);
            updateMoneyDisplay();
        });

        startTaxInterval();
        updateMoneyDisplay();
    });
})();
