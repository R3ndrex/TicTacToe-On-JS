/*global gameboard*/
/*global events*/
const ScreenController = (function () {
    const GameController = (function () {
        const playerCreate = function (name, symbol) {
            function play(place) {
                gameboard.setBoard(place, symbol);
            }
            function getSymbol() {
                return symbol;
            }
            events.on("Player Won", function (winnerSymbol) {
                if (symbol === winnerSymbol) events.emit("Winner", name);
            });
            return { play, getSymbol };
        };

        const player1 = playerCreate("First Player", "x");
        const player2 = playerCreate("Second Player", "o");
        let playingPlayer = player1;

        function play(place) {
            playingPlayer.play(place);
            CheckWin(playingPlayer.getSymbol());
            // change player
        }

        function CheckWin(symbol) {
            if (
                CheckWinPatterns(
                    gameboard.GetBoard(),
                    gameboard.getPatterns(),
                    symbol
                )
            ) {
                console.log("1" + player1.getSymbol()); //1x
                console.log("2" + player2.getSymbol()); //2o
                playingPlayer = player1;
                events.emit("Player Won", symbol);
            } else if (CheckTie(gameboard.GetBoard())) {
                console.log("1" + player1.getSymbol()); //1x
                console.log("2" + player2.getSymbol()); //2o
                playingPlayer = player1;
                events.emit("Tie");
            } else {
                playingPlayer = playingPlayer === player1 ? player2 : player1;
            }
        }

        function CheckTie(board) {
            return board.every((element) => element.getData() !== "");
        }

        function CheckWinPatterns(board, pattern, symbol) {
            return pattern.some((pattern) =>
                pattern.every((index) => board[index].getData() === symbol)
            );
        }
        return { play, playerCreate };
    })();

    const startButton = document.querySelector(".start");
    startButton.addEventListener("click", () => {
        const name1 = document.querySelector("input[name='player1']").value;
        const name2 = document.querySelector("input[name='player2']").value;
        updateScreen();
        InputHandlerNames(name1, name2);
    });

    function updateScreen() {
        const board = document.querySelector(".board");
        board.innerHTML = "";
        renderBoard(board);
        ClickHandlerBoard();
    }

    function renderBoard(board) {
        const gboard = gameboard.GetBoard();
        for (let i = 0; i < gboard.length; i++) {
            const cell = document.createElement("button");
            cell.textContent = gboard[i].getData();
            if (cell.textContent !== "") {
                cell.disabled = true;
            }
            cell.setAttribute("data-id", i);
            board.appendChild(cell);
        }
    }

    function ClickHandlerBoard() {
        const cells = document.querySelectorAll(".board>button");
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", () => {
                GameController.play(i);
                updateScreen();
            });
        }
    }

    function InputHandlerNames(name1, name2) {
        if (name1.trim() !== "") {
            GameController.player1 = GameController.playerCreate(name1, "x");
        }
        if (name1.trim() !== "") {
            GameController.player2 = GameController.playerCreate(name2, "o");
        }
    }

    events.on("Winner", (playerName) => {
        const p = document.querySelector("p");
        p.textContent = `${playerName} has Won!`;
    });
    events.on("Tie", () => {
        const p = document.querySelector("p");
        p.textContent = `Its a Tie!`;
    });

    return { updateScreen, ClickHandlerBoard };
})();
