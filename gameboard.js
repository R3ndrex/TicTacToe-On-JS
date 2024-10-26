class Cell {
    symbol;
    constructor(symbol = "") {
        this.symbol = symbol;
    }
}

class Gameboard {
    #BOARD_LENGTH = 9;
    #board = [];
    #winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    constructor() {
        events.on("Winner", () => this.#initBoard());
        events.on("Tie", () => this.#initBoard());
        this.#initBoard();
    }

    #initBoard() {
        this.#board = [];
        for (let i = 0; i < this.#BOARD_LENGTH; i++) {
            this.#board.push(new Cell());
        }
    }

    setBoard(index, symbol) {
        this.#board[index] = new Cell(symbol);
    }

    get board() {
        return this.#board;
    }

    get pattern() {
        return this.#winPatterns;
    }
}
