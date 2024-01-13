import { Board, Ship } from "../Classes";

describe("Ship.getSunkenPartOfShip(coord)", () => {
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
});
