
import { boardToSolve } from "./board.js";

class Sudoku {
    board;
    size;
    selectedCell;
    constructor(board) {
        this.board = board;
        this.size = 9;
        this.selectedCell = null;
    }
    initGrid() {
        let gridElement = document.getElementById("grid");
        gridElement.innerHTML = '';

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute("data-row", i);
                cell.setAttribute("data-col", j);

                let input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                input.addEventListener("input", (event) => this.inputChanged(event, i, j));
                input.addEventListener("click", () => this.cellClicked(i, j));
                input.value = this.board[i][j] == 0 ? "" : this.board[i][j];

                cell.appendChild(input);
                gridElement.appendChild(cell);
            }
        }
    }
    solve() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] == 0) {
                    for (let num = 1; num <= this.size; num++) {
                        if (this.isValid(row, col, num)) {
                            this.board[row][col] = num;
                            if (this.solve()) {
                                return true;
                            }
                            this.board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    isValid(row, col, num) {
        // check if num is already in the row
        for (let i = 0; i < this.size; i++) {
            if (this.board[row][i] == num && i != col) {
                return false;
            }
        }

        // check if num is already in the column
        for (let i = 0; i < this.size; i++) {
            if (this.board[i][col] == num && i != row) {
                return false;
            }
        }

        // check if num is already in the 3x3 sub grids
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (this.board[i][j] == num && (i != row || j != col)) {
                    return false;
                }
            }
        }

        return true;
    }

    printBoardToLog() {
        for (let i = 0; i < this.size; i++) {
            console.log(this.board[i].join(' '));
        }
    }

    printSolvedBoard() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let input = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"] input`);
                input.value = this.board[i][j] == 0 ? "" : this.board[i][j];
            }
        }
    }
    cellClicked(row, col) {
        if (this.selectedCell != null) {
            let prevRow = this.selectedCell.row;
            let prevCol = this.selectedCell.col;
            let prevInput = document.querySelector(`.cell[data-row="${prevRow}"][data-col="${prevCol}"] input`);
            prevInput.blur();
        }
        // set focus on curr cell
        let input = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"] input`);
        input.focus();

        this.selectedCell = { row, col };
    }

    inputChanged(event, row, col) {
        let value = parseInt(event.target.value);
        if (!isNaN(value) && value >= 1 && value <= 9) {
            this.board[row][col] = value;
            this.checkWin();
        } else {
            this.board[row][col] = 0;
        }
    }

    checkWin() {
        let status = document.getElementById("status");
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] == 0) {
                    return false;
                }
                if (this.isValid(i, j, this.board[i][j]) == false) {
                    status.innerHTML = " Sorry, you are wrong";
                    return false;
                }
            }
        }
        status.innerHTML = " Congratulation, you aced it!"
        return true;
    }

    restartGame() {
        this.board = boardToSolve();
        this.initGrid();
    }

    saveToLocalStorage() {
        let boardJson = JSON.stringify(this.board);
        localStorage.setItem("sudoku", boardJson);
    }

    loadFromLocalStorage() {
        let boardStorage = JSON.parse(localStorage.getItem("sudoku")) || [];
        if (boardStorage.length == 0) {
            this.restartGame();
        } else {
            this.board = boardStorage;
            this.initGrid();
        }
    }
}




// main
let sudoku = new Sudoku(boardToSolve());
sudoku.initGrid();

let solveBtn = document.getElementById("solve");
solveBtn.addEventListener("click", solveSudoku);

let restartBtn = document.getElementById("restart");
restartBtn.addEventListener("click", () => { sudoku.restartGame(); });

let saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", () => { sudoku.saveToLocalStorage(); });

let loadBtn = document.getElementById("load");
loadBtn.addEventListener("click", () => { sudoku.loadFromLocalStorage(); });

function solveSudoku() {
    if (sudoku.solve()) {
        sudoku.printSolvedBoard();
    } else {
        alert("no solution exist");
    }
}

