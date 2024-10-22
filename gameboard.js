/*global events*/
/*global gameboard*/
const gameboard = (function () {
    const cellCreate = function () {
        let value = "";
        const getData = () => value;
        const changeData = (symbol) => (value = symbol);
        return { changeData, getData };
    };

    const BOARD_LENGTH = 9;
    let board = [];
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    function initBoard() {
        board = [];
        for (let i = 0; i < BOARD_LENGTH; i++) {
            board.push(cellCreate());
        }
    }
    const GetBoard = () => board;
    const getPatterns = () => winPatterns;
    events.on("Winner", initBoard);
    events.on("Tie", initBoard);

    function setBoard(index, symbol) {
        board[index].changeData(symbol);
    }

    initBoard();
    return { setBoard, GetBoard, getPatterns };
})();
