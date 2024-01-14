import { RandomBoard, BoardValidator } from "../Classes";

describe("RandomBoard", () => {
    test("new RandomBoard() creates a valid board - 1000 iterations)", () => {
        let allAreValid: boolean = true;
        for (let i = 0; i < 1000; i++) {
            const randomBoard: RandomBoard = new RandomBoard();
            const boardValidator: BoardValidator = new BoardValidator(
                randomBoard,
            );
            if (!boardValidator.boardIsValid()) {
                allAreValid = false;
            }
        }
    });
});
