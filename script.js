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

        let player1 = playerCreate("First Player", "x");
        let player2 = playerCreate("Second Player", "o");

        function setPlayers(
            name1 = "First Player",
            name2 = "Second Player",
            symbol1 = "x",
            symbol2 = "o"
        ) {
            player1 = playerCreate(name1, symbol1);
            player2 = playerCreate(name2, symbol2);
            playingPlayer = player1;
        }

        let playingPlayer = player1;

        function play(place) {
            playingPlayer.play(place);
            CheckWin(playingPlayer.getSymbol());
        }

        function CheckWin(symbol) {
            if (
                CheckWinPatterns(
                    gameboard.GetBoard(),
                    gameboard.getPatterns(),
                    symbol
                )
            ) {
                playingPlayer = player1;
                events.emit("Player Won", symbol);
            } else if (CheckTie(gameboard.GetBoard())) {
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
        return { play, setPlayers };
    })();

    const startButton = document.querySelector(".start");
    startButton.addEventListener("click", () => {
        const name1 = document
            .querySelector("input[name='player1_name']")
            .value.trim();
        const name2 = document
            .querySelector("input[name='player2_name']")
            .value.trim();
        const symbol1 = document
            .querySelector("input[name='player1_symbol']")
            .value.trim();
        const symbol2 = document
            .querySelector("input[name='player2_symbol']")
            .value.trim();
        updateScreen();
        InputHandlerNames(name1, name2, symbol1, symbol2);
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

    function InputHandlerNames(name1, name2, symbol1, symbol2) {
        symbol1 = symbol1 ? symbol1 : "x";
        symbol2 = symbol2 ? symbol2 : "o";
        name1 = name1 ? name1 : "First Player";
        name2 = name2 ? name2 : "Second Player";
        GameController.setPlayers(name1, name2, symbol1, symbol2);
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
