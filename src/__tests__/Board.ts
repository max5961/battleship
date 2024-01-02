import { Board } from "../Board";

describe("Board", () => {
    test("Board.generateRandomPlacement() should create a valid board - 1000 iterations", () => {
        let allAreValid: boolean = true;
        for (let i = 0; i < 1000; i++) {
            const board = new Board();
            board.generateRandomPlacement();
            const currentIsValid = board.boardIsValid();
            if (!currentIsValid) {
                allAreValid = false;
            }
        }
        expect(allAreValid).toBe(true);
    });
});
