import { Board, SetupCreator, SetupValidator, Ship } from "../Classes";

describe("Ship.getSunkenPartOfShip(coord)", () => {
    test("retrieve back [[1,1]]", () => {
        const board: Board = new Board();
        board.grid[1][1] = 2;
        board.grid[1][2] = 1;
        const ship: Ship = new Ship(board);
        const sunken: Array<Array<number>> = ship.getSunkenPartOfShip([1, 1]);
        expect(sunken).toEqual([[1, 1]]);
    });
    test("retrieve back [[0,0],[0,1],[0,2]]", () => {
        const board: Board = new Board();
        board.grid[0][0] = 2;
        board.grid[0][1] = 2;
        board.grid[0][2] = 2;
        board.grid[0][3] = 1;
        const ship: Ship = new Ship(board);
        const sunken: Array<Array<number>> = ship.getSunkenPartOfShip([0, 0]);
        expect(sunken).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
    });
    test("retrieve back [[0,0],[0,1],[0,2]]", () => {
        const board: Board = new Board();
        board.grid[0][0] = 2;
        board.grid[0][1] = 2;
        board.grid[0][2] = 2;
        board.grid[0][3] = 1;
        const ship: Ship = new Ship(board);
        const sunken: Array<Array<number>> = ship.getSunkenPartOfShip([0, 1]);
        expect(sunken).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
    });
    test("retrieve back [[0,0],[0,1],[0,2]]", () => {
        const board: Board = new Board();
        board.grid[0][0] = 2;
        board.grid[0][1] = 2;
        board.grid[0][2] = 2;
        board.grid[0][3] = 1;
        const ship: Ship = new Ship(board);
        const sunken: Array<Array<number>> = ship.getSunkenPartOfShip([0, 2]);
        expect(sunken).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
    });
    test("retrieve back [[0,0],[0,1],[0,2],[0,3]]", () => {
        const board: Board = new Board();
        board.grid[0][0] = 2;
        board.grid[0][1] = 2;
        board.grid[0][2] = 2;
        board.grid[0][3] = 2;
        board.grid[0][4] = 3;
        const ship: Ship = new Ship(board);
        const sunken: Array<Array<number>> = ship.getSunkenPartOfShip([0, 2]);
        expect(sunken).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
        ]);
    });
    test("retrieve back [[1,1],[2,1],[3,1],[4,1],[5,1]]", () => {
        const board: Board = new Board();
        board.grid[1][1] = 2;
        board.grid[2][1] = 2;
        board.grid[3][1] = 2;
        board.grid[4][1] = 2;
        board.grid[5][1] = 2;
        const ship: Ship = new Ship(board);
        const sunken: Array<Array<number>> = ship.getSunkenPartOfShip([3, 1]);
        expect(sunken).toEqual([
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 1],
            [5, 1],
        ]);
    });
    test("retrieve back [[1,1],[2,1]]", () => {
        const board: Board = new Board();
        board.grid[1][1] = 2;
        board.grid[2][1] = 2;
        board.grid[3][1] = 1;
        board.grid[4][1] = 2;
        board.grid[5][1] = 2;
        const ship: Ship = new Ship(board);
        const sunken: Array<Array<number>> = ship.getSunkenPartOfShip([2, 1]);
        expect(sunken).toEqual([
            [1, 1],
            [2, 1],
        ]);
    });
});

describe("Ship.getEntireShip(coord)", () => {
    test("retrieve back[[1,1]]", () => {
        const board: Board = new Board();
        board.grid[1][1] = 1;
        const ship: Ship = new Ship(board);
        ship.coords = ship.getEntireShip([1, 1]);
        expect(ship.coords).toEqual([[1, 1]]);
    });
    test("retrieve back[[1,1],[2,1],[3,1],[4,1],[5,1]]", () => {
        const board: Board = new Board();
        board.grid[1][1] = 2;
        board.grid[2][1] = 2;
        board.grid[3][1] = 1;
        board.grid[4][1] = 2;
        board.grid[5][1] = 2;
        const ship: Ship = new Ship(board);
        ship.coords = ship.getEntireShip([2, 1]);
        expect(ship.coords).toEqual([
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 1],
            [5, 1],
        ]);
    });
    test("retrieve back[[1,1],[1,2],[1,3],[1,4],[1,5]]", () => {
        const board: Board = new Board();
        board.grid[1][1] = 2;
        board.grid[1][2] = 2;
        board.grid[1][3] = 1;
        board.grid[1][4] = 2;
        board.grid[1][5] = 2;
        const ship: Ship = new Ship(board);
        ship.coords = ship.getEntireShip([1, 3]);
        expect(ship.coords).toEqual([
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
        ]);
    });
    test("retrieve back[[1,1],[1,2],[1,3],[1,4],[1,5]]", () => {
        const board: Board = new Board();
        board.grid[1][1] = 2;
        board.grid[1][2] = 2;
        board.grid[1][3] = 1;
        board.grid[1][4] = 2;
        board.grid[1][5] = 2;
        const ship: Ship = new Ship(board);
        ship.coords = ship.getEntireShip([1, 3]);
        expect(ship.coords).toEqual([
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
        ]);
    });
});

describe("BoardValidator.boardIsValid()", () => {
    test("Board should be valid", () => {
        const validGrid: Array<Array<number>> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        ];
        const board: Board = new Board(validGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(true);
    });
    test("Board should be valid", () => {
        const validGrid: Array<Array<number>> = [
            [0, 1, 1, 0, 1, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [1, 0, 1, 1, 1, 1, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        const board: Board = new Board(validGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(true);
    });
    test("Board should be valid", () => {
        const validGrid: Array<Array<number>> = [
            [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        const board: Board = new Board(validGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(true);
    });
    test("Board should be invalid", () => {
        const invalidGrid: Array<Array<number>> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        ];
        const board: Board = new Board(invalidGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
    test("Board should be invalid", () => {
        const validGrid: Array<Array<number>> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        ];
        const board: Board = new Board(validGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
    test("Board should be invalid", () => {
        const validGrid: Array<Array<number>> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 1, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        ];
        const board: Board = new Board(validGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
    test("Board should be invalid", () => {
        const validGrid: Array<Array<number>> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        ];
        const board: Board = new Board(validGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
    test("Board should be invalid", () => {
        const invalidGrid: Array<Array<number>> = [
            [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        ];
        const board: Board = new Board(invalidGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
    test("Board should be invalid", () => {
        const invalidGrid: Array<Array<number>> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        ];
        const board: Board = new Board(invalidGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
    test("Board should be invalid", () => {
        const invalidGrid: Array<Array<number>> = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        const board: Board = new Board(invalidGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
    test("Board should be invalid", () => {
        const invalidGrid: Array<Array<number>> = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        const board: Board = new Board(invalidGrid);
        const setupValidator: SetupValidator = new SetupValidator(board);
        const isValid: boolean = setupValidator.boardIsValid();
        expect(isValid).toBe(false);
    });
});

describe("SetupCreator.getRandomSetup()", () => {
    test("Return a valid Board object 1000 iterations", () => {
        let valid = false;
        for (let i = 0; i < 1000; i++) {
            const setupCreator: SetupCreator = new SetupCreator();
            const board: Board = setupCreator.getRandomBoardSetup();
            board.fleet.clearFleet();
            const setupValidator: SetupValidator = new SetupValidator(board);
            if (setupValidator.boardIsValid()) {
                valid = true;
            }
        }
        expect(valid).toBe(true);
    });
});
