class SudokuSolver {
  format(puzzleString) {
    const puzzle = {},
      puzzleGroups = puzzleString.match(/.{9}/g);
    puzzleGroups.forEach((element, i) => {
      puzzle[String.fromCharCode(65 + i)] = element.split("");
    });
    return puzzle;
  }

  stringify(puzzle) {
    let result = "";
    for (const string in puzzle) {
      result += puzzle[string].join("");
    }
    return result;
  }

  insert(puzzleString, row, column, value) {
    const puzzle = this.format(puzzleString);
    if (!puzzle[row]) return { error: "Invalid coordinate" };
    if (!puzzle[row][column - 1]) return { error: "Invalid coordinate" };
    if (!/^[1-9]$/.test(value)) return { error: "Invalid value" };
    puzzle[row][column - 1] = value;
    const result = this.stringify(puzzle);
    const badColPlacement = this.checkColPlacement(puzzle);
    const badRowPlacement = this.checkRowPlacement(puzzle);
    return {
      error:
        badColPlacement && badRowPlacement
          ? { valid: false, conflict: ["row", "column"] }
          : badColPlacement || badRowPlacement || null,
      puzzle: result,
    };
  }

  repeatedNums(groups) {
    return groups.find((array) => {
      const numbers = array.join("").match(/[\d]/g);
      const set = new Set(numbers);
      return set.size < numbers?.length;
    });
  }

  validate(puzzleString) {
    if (!puzzleString) return { error: "Required field missing" };
    const notValidCharacters = puzzleString.split("").find((element) => {
        return !/^[1-9.]$/.test(element);
      }),
      notEnough = puzzleString.split("").length !== 81;
    if (notValidCharacters) return { error: "Invalid characters in puzzle" };
    if (notEnough) return { error: "Expected puzzle to be 81 characters long" };
    return true;
  }

  checkRowPlacement(puzzle) {
    const columns = [];
    for (const row in puzzle) {
      columns.push(puzzle[row]);
    }
    return this.repeatedNums(columns)
      ? { valid: false, conflict: ["row"] }
      : false;
  }

  checkColPlacement(puzzle) {
    const rows = [];
    for (const row in puzzle) {
      puzzle[row].forEach((char, i) => {
        if (typeof rows[i] === "undefined") rows[i] = [];
        rows[i].push(char);
      });
    }
    return this.repeatedNums(rows)
      ? { valid: false, conflict: ["column"] }
      : false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const status = this.validate(puzzleString);
    if (status === true) {
      const { puzzle, error } = this.insert(puzzleString, row, column, value);
      if (error === "Invalid coordinate" || error === "Invalid value")
        return { error };
      let counter = 0;
      const regions = [];
      puzzle.match(/.{3}/g).forEach((element, i) => {
        const region = (i % 3) + counter;
        if (typeof regions[region] === "undefined") regions[region] = [];
        regions[region] = [...regions[region], ...element.split("")];
        if ((i + 1) % 9 === 0) counter += 3;
      });
      return error && this.repeatedNums(regions)
        ? { valid: false, conflict: [...error.conflict, "region"] }
        : error
        ? error
        : this.repeatedNums(regions)
        ? { valid: false, conflict: ["region"] }
        : true;
    } else {
      return status;
    }
  }

  fillOnePossibility(puzzleString) {
    const puzzle = this.format(puzzleString);
    let lasString = "";
    let currentString = puzzleString;
    let error = null;
    loop: while (!this.solved(puzzle)) {
      lasString = this.stringify(puzzle);
      for (const key in puzzle) {
        for (let i = 0; i < puzzle[key].length; i++) {
          if (puzzle[key][i] === ".") {
            const possibilities = [];
            for (let value = 1; value < 10; value++) {
              const string = this.stringify(puzzle);
              const possible = this.checkRegionPlacement(
                string,
                key,
                `${i + 1}`,
                `${value}`
              );
              if (possible === true) possibilities.push(value);
            }
            if (possibilities.length === 1)
              puzzle[key][i] = `${possibilities[0]}`;
            if (possibilities.length === 0) {
              error = { error: "Puzzle cannot be solved" };
              break loop;
            }
          }
        }
      }
      currentString = this.stringify(puzzle);
      if (lasString === currentString) {
        error = { error: "Too many possibilities" };
        break;
      }
    }
    return { error, currentString };
  }

  solved(puzzle) {
    let solved = true;
    for (const key in puzzle) {
      const numbers = puzzle[key].join("").match(/[\d]/g);
      const set = new Set(numbers);
      if (set.size !== 9) {
        solved = false;
        break;
      }
    }
    return solved;
  }

  nextEmptySpot(puzzle) {
    for (let row in puzzle) {
      for (let col = 0; col < puzzle[row].length; col++) {
        if (puzzle[row][col] === ".") {
          return { row, col };
        }
      }
    }
    return { row: -1, col: -1 };
  }

  simpleApproach(puzzle) {
    let emptySpot = this.nextEmptySpot(puzzle);
    let puzzleString = this.stringify(puzzle);
    let { row } = emptySpot;
    let { col } = emptySpot;

    // there is no more empty spots
    if (row === -1) {
      return puzzle;
    }

    for (let num = 1; num <= 9; num++) {
      if (
        this.checkRegionPlacement(puzzleString, row, `${col + 1}`, `${num}`) ===
          true &&
        this.solved(puzzle)
      ) {
        return puzzle;
      }
      if (
        this.checkRegionPlacement(puzzleString, row, `${col + 1}`, `${num}`) ===
        true
      ) {
        puzzle[row][col] = `${num}`;
        this.simpleApproach(puzzle);
      }
    }

    if (this.nextEmptySpot(puzzle).row !== -1) puzzle[row][col] = ".";

    return puzzle;
  }

  solve(puzzleString) {
    const status = this.validate(puzzleString);
    if (status === true) {
      const { currentString, error } = this.fillOnePossibility(puzzleString);
      const puzzle = this.format(currentString);
      if (error) {
        if (error.error === "Too many possibilities") {
          const isSolved = this.solved(this.simpleApproach(puzzle));
          if (isSolved)
            return { solution: this.stringify(this.simpleApproach(puzzle)) };
          else return { error: "Puzzle cannot be solved" };
        }
        return error;
      }
      return { solution: currentString };
    } else {
      return status;
    }
  }
}

module.exports = SudokuSolver;
