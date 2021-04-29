"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) res.send({ error: 'Required field(s) missing' })
    const check = solver.checkRegionPlacement(
      puzzle,
      coordinate[0],
      coordinate[1],
      value
    );
    if (check === true) {
      res.send({ valid: true });
    } else {
      res.send(check);
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    const result = solver.solve(puzzle);
    if (typeof result === "string") {
      res.send(result);
    } else {
      res.send(result);
    }
  });
};
