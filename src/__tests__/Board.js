"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Board_1 = require("../Board");
describe("Board", function () {
    for (var i = 0; i < 300; i++) {
        test("should be true", function () {
            var board = new Board_1.Board();
            board.generateRandomPlacement();
            expect(board.boardIsValid()).toBe(true);
        });
    }
});
