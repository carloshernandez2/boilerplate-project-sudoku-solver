const SudokuSolver = require("../controllers/sudoku-solver");
const examples = require('../controllers/puzzle-strings')
const solver = new SudokuSolver();

const puzzle = {
  A: ["9", ".", "6", "6", ".", ".", ".", ".", "1"],
  B: [".", ".", ".", ".", ".", ".", ".", ".", "."],
  C: [".", ".", ".", "6", ".", ".", ".", ".", "."],
  D: [".", ".", ".", "6", ".", ".", ".", ".", "."],
  E: [".", ".", ".", ".", ".", ".", ".", ".", "."],
  F: [".", ".", ".", ".", ".", ".", ".", ".", "."],
  G: [".", ".", ".", ".", ".", ".", ".", ".", "."],
  H: [".", ".", ".", ".", ".", ".", ".", ".", "."],
  I: [".", ".", ".", ".", ".", ".", ".", ".", "."],
};

const nextEmptySpot = (puzzle) => {
  for (let row in puzzle) {
    for (let col = 0; col < puzzle[row].length; col++) {
      if (puzzle[row][col] === ".") {
        return { row, col };
      }
    }
  }
  return { row: -1, col: -1 };
};

const simpleApproach = (puzzle) => {
  let emptySpot = nextEmptySpot(puzzle);
  let puzzleString = solver.stringify(puzzle);
  let { row } = emptySpot;
  let { col } = emptySpot;

  // there is no more empty spots
  if (row === -1) {
    return puzzle;
  }

  for (let num = 1; num <= 9; num++) {
    if (solver.checkRegionPlacement(puzzleString, row, `${col + 1}`, `${num}`) === true && solver.solved(puzzle)) {
      return puzzle
    }
    if (
      solver.checkRegionPlacement(puzzleString, row, `${col + 1}`, `${num}`) === true
    ) {
      puzzle[row][col] = `${num}`;
      simpleApproach(puzzle);
    }
  }

  if (nextEmptySpot(puzzle).row !== -1) puzzle[row][col] = ".";

  return puzzle;
};

console.log(simpleApproach(solver.format(examples[0][0].replace(/[.]/g, '6'))))