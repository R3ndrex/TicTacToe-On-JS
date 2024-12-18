class Player {
    #symbol = "";
    #name;
    #gameboard;
    constructor(name, symbol, gameboard) {
        this.#name = name;
        this.#symbol = symbol;
        this.#gameboard = gameboard;
        events.on("Player Won", (winnerSymbol) => {
            if (this.symbol === winnerSymbol) events.emit("Winner", this.#name);
        });
    }

    play(cellIndex) {
        this.#gameboard.setBoard(cellIndex, this.symbol);
    }

    get symbol() {
        return this.#symbol;
    }
}

class GameController {
    #player1; //new Player("First Player", "x");
    #player2; //new Player("Second Player", "o");
    #playingPlayer;
    constructor(player1, player2, gameboard) {
        this.#player1 = player1;
        this.#player2 = player2;
        this.gameboard = gameboard;
    }

    setPlayers(
        name1 = "First Player",
        name2 = "Second Player",
        symbol1 = "x",
        symbol2 = "o"
    ) {
        events.emit("Reset");
        this.#player1 = new Player(name1, symbol1, this.gameboard);
        this.#player2 = new Player(name2, symbol2, this.gameboard);
        this.#playingPlayer = this.#player1;
    }

    play(cellIndex) {
        this.#playingPlayer.play(cellIndex);
        this.#CheckWin(this.#playingPlayer.symbol);
    }

    #CheckWin(symbol) {
        if (
            GameController.#CheckWinPatterns(
                this.gameboard.board,
                this.gameboard.pattern,
                symbol
            )
        ) {
            this.#playingPlayer = this.#player1;
            events.emit("Player Won", symbol);
        } else if (GameController.#CheckTie(this.gameboard.board)) {
            this.#playingPlayer = this.#player1;
            events.emit("Tie");
        } else {
            this.#changePlayer();
        }
    }

    #changePlayer() {
        this.#playingPlayer =
            this.#playingPlayer === this.#player1
                ? this.#player2
                : this.#player1; // change player
    }

    static #CheckTie(board) {
        return board.every((element) => element.symbol !== ""); // if all cells on board are not empty
    }

    static #CheckWinPatterns(board, pattern, symbol) {
        return pattern.some((pattern) =>
            pattern.every((index) => board[index].symbol === symbol)
        );
    }
}

class ScreenController {
    constructor(form, GameController, gameboard) {
        this.gameController = GameController;
        this.form = form;
        this.gameboard = gameboard;
        this.board = document.querySelector(".board");
        this.#formSubmitHandler(this.form);
        this.#GameResultHandler(events);
    }
    #GameResultHandler(eventHandler) {
        eventHandler.on("Winner", (playerName) => {
            const p = document.querySelector("p");
            p.textContent = `${playerName} has Won!`;
        });

        eventHandler.on("Tie", () => {
            const p = document.querySelector("p");
            p.textContent = `Its a Tie!`;
        });
    }

    #formSubmitHandler(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
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
            this.#inputHandlerNames(name1, name2, symbol1, symbol2);
            this.#updateScreen(this.board);
        });
    }

    #updateScreen(board) {
        board.innerHTML = "";
        this.#renderBoard(board); // reset board and render based on gameboard
        this.#clickHandlerBoard(); // buttons click events
    }

    #renderBoard(board) {
        const gboard = gameboard.board;
        for (let i = 0; i < gboard.length; i++) {
            const cell = document.createElement("button");
            cell.setAttribute("type", "button");
            cell.textContent = gboard[i].symbol;
            if (cell.textContent !== "") {
                cell.disabled = true;
            }
            cell.setAttribute("data-id", i);
            board.appendChild(cell);
        }
    }

    #clickHandlerBoard() {
        const cells = document.querySelectorAll(".board>button");
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", () => {
                this.gameController.play(i);
                this.#updateScreen(this.board);
            });
        }
    }

    #inputHandlerNames(name1, name2, symbol1, symbol2) {
        symbol1 = symbol1[0];
        symbol2 = symbol2[0];
        name1 = name1 || "First Player";
        symbol1 = symbol1 || "x";
        if (name2 === "" || name2 === name1) {
            name2 = "Second Player";
        }
        if (name2 === name1) {
            name2 = "Player 2";
        }
        if (symbol2 === "" || symbol2 === symbol1) {
            symbol2 = "o";
        }
        if (symbol2 === symbol1) {
            symbol2 = "?";
        }

        this.gameController.setPlayers(name1, name2, symbol1, symbol2);
    }
}

const gameboard = new Gameboard();
const gamecontroller = new GameController(
    new Player("First Player", "x", gameboard),
    new Player("Second Player", "o", gameboard),
    gameboard
);
const screenController = new ScreenController(
    document.querySelector("form"),
    gamecontroller,
    gameboard
);
