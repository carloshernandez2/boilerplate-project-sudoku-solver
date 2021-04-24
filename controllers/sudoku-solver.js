class SudokuSolver {
  format(puzzleString) {
    const puzzle = {},
      puzzleGroups = puzzleString.match(/.{9}/g);
    puzzleGroups.forEach((element, i) => {
      puzzle[String.fromCharCode(65 + i)] = element;
    });
    console.log(puzzle);
  }

  validate(puzzleString) {
    const notValidCharacters = puzzleString.split("").find((element) => {
        return !/^[\d.]$/.test(element);
      }),
      notEnough = puzzleString.split("").length !== 81;
    if (notValidCharacters || notEnough) return false;
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
