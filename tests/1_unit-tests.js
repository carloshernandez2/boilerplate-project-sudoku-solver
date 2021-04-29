const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const examples = require('../controllers/puzzle-strings')
let solver = new Solver();

suite('UnitTests', () => {

  test('Logic handles a valid puzzle string of 81 characters', function () {
    const result = solver.validate(examples[0][0])
    const expected = true
    assert.strictEqual(result, expected);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
    const badExample = examples[0][0].replace(/[.]/, '?')
    const result = solver.validate(badExample)
    const expected = { error: "Invalid characters in puzzle" }
    assert.deepStrictEqual(result, expected);
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    const badExample = examples[0][0].replace(/[.]/, '')
    const result = solver.validate(badExample)
    const expected = { error: "Expected puzzle to be 81 characters long" }
    assert.deepStrictEqual(result, expected);
  });

  test('Logic handles a valid row placement', function () {
    const example = examples[0][0]
    const result = solver.checkRegionPlacement(example,'A', '2', '3')
    const expected = true
    assert.strictEqual(result, expected);
  });

  test('Logic handles an invalid row placement', function () {
    const example = examples[0][0]
    const result = solver.checkRegionPlacement(example,'A', '7', '5')
    const expected = { valid: false, conflict: ["row"] }
    assert.deepStrictEqual(result, expected);
  });

  test('Logic handles a valid column placement', function () {
    const example = examples[1][0]
    const result = solver.checkRegionPlacement(example,'C', '1', '1')
    const expected = true
    assert.strictEqual(result, expected);
  });

  test('Logic handles an invalid column placement', function () {
    const example = examples[1][0]
    const result = solver.checkRegionPlacement(example,'C', '1', '6')
    const expected = { valid: false, conflict: ["column"] }
    assert.deepStrictEqual(result, expected);
  });

  test('Logic handles a valid region (3x3 grid) placement', function () {
    const example = examples[2][0]
    const result = solver.checkRegionPlacement(example,'A', '1', '1')
    const expected = true
    assert.strictEqual(result, expected);
  });

  test('Logic handles an invalid region (3x3 grid) placement', function () {
    const example = examples[2][0]
    const result = solver.checkRegionPlacement(example,'C', '1', '8')
    const expected = { valid: false, conflict: ["region"] }
    assert.deepStrictEqual(result, expected);
  });

  test('Valid puzzle strings pass the solver', function () {
    const result = solver.solve(examples[3][0]).solution
    const expected = examples[3][1]
    assert.strictEqual(result, expected);
  });

  test('Invalid puzzle strings fail the solver', function () {
    const badExample = examples[3][0].replace(/[.]/, '?')
    const result = solver.solve(badExample)
    assert.property(result, 'error');
  });

  test('Solver returns the expected solution for an incomplete puzzle', function () {
    const result = solver.solve(examples[4][0]).solution
    const expected = examples[4][1]
    assert.strictEqual(result, expected);
  });

});
