import { Board } from "../Board";

describe("Board.createRandomBoard()", () => {
    test("Create a valid board - 1000 iterations", () => {
        let allAreValid: boolean = true;
        for (let i = 0; i < 1000; i++) {
            const board = new Board();
            board.createRandomBoard();
            const currentIsValid = board.boardIsValid();
            if (!currentIsValid) {
                allAreValid = false;
            }
        }
        expect(allAreValid).toBe(true);
    });
});
