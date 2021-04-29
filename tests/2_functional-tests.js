const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const examples = require('../controllers/puzzle-strings')

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: examples[0][0] })
      .end(function (err, res) {
        const expected = { solution: examples[0][1] }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: undefined })
      .end(function (err, res) {
        const expected = { error: 'Required field missing' }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: examples[0][0].replace(/[.]/, '?') })
      .end(function (err, res) {
        const expected = { error: "Invalid characters in puzzle" }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: examples[0][0].replace(/[.]/g, '6') })
      .end(function (err, res) {
        const expected = { error: "Puzzle cannot be solved" }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: 'A2', value: '3' })
      .end(function (err, res) {
        const expected = { valid: true }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: 'A7', value: '5' })
      .end(function (err, res) {
        const expected = { valid: false, conflict: ["row"] }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: 'B1', value: '3' })
      .end(function (err, res) {
        const expected = { valid: false, conflict: ["row", "column"] }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: 'B1', value: '2' })
      .end(function (err, res) {
        const expected = { valid: false, conflict: ["row", "column", "region"] }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: undefined, value: '2' })
      .end(function (err, res) {
        const expected = { error: 'Required field(s) missing' }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });
  
  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: undefined, value: '2' })
      .end(function (err, res) {
        const expected = { error: 'Required field(s) missing' }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0].replace(/[.]/, '?'), coordinate: 'A2', value: '2' })
      .end(function (err, res) {
        const expected = { error: 'Invalid characters in puzzle' }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });
  
  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0].replace(/[.]/, ''), coordinate: 'A2', value: '2' })
      .end(function (err, res) {
        const expected = { error: 'Expected puzzle to be 81 characters long' }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });
  
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: 'J2', value: '2' })
      .end(function (err, res) {
        const expected = { error: 'Invalid coordinate'}
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: examples[0][0], coordinate: 'A2', value: '10' })
      .end(function (err, res) {
        const expected = { error: 'Invalid value' }
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.deepStrictEqual(res.body, expected)
        done();
      });
  });
});

