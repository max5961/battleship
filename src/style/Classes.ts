import { positiveSortShip } from "../sortShipArray";

export class CoordUtils {
    static getRandomCoord(): Array<number> {
        function getRandomNumber(): number {
            return Math.floor(Math.random() * 10);
        }
        return [getRandomNumber(), getRandomNumber()];
    }

    static coordInBounds(coord: Array<number>): boolean {
        const [x, y] = coord;
        return x >= 0 && y >= 0 && x <= 9 && y <= 9;
    }
}

export class Ship {
    coords: Array<Array<number>>;
    direction: Array<number> | null;
    readonly parentGrid: Array<Array<number>>;

    constructor(parentGrid: Array<Array<number>>) {
        this.parentGrid = parentGrid;
        this.coords = [];
        this.direction = null;
    }

    updateShipDirection(startCoord: Array<number>): void {
        const possibleDirections: Array<Array<number>> = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        const [x, y] = startCoord;
        while (!this.direction && possibleDirections.length) {
            const [dx, dy] = possibleDirections.shift()!;
            const nx = x + dx;
            const ny = y + dy;
            if (this.parentGrid[nx] && this.parentGrid[nx][ny] !== 0) {
                this.direction = [dx, dy];
            }
        }
        throw new Error("No direction found");
    }

    // adds coordinates to this.coords
    findShipFromStartCoord(startCoord: Array<number>): void {
        if (!this.direction) {
            this.updateShipDirection(startCoord);
        }

        this.coords = [[startCoord[0], startCoord[1]]];
        const [dx, dy] = this.direction!;
        let nx = dx + startCoord[0];
        let ny = dy + startCoord[1];
        let mappingShip = true;
        while (mappingShip) {
            if (this.parentGrid[nx] && this.parentGrid[nx][ny] !== 0) {
                this.coords.push([nx, ny]);
                nx += dx;
                ny += dy;
            } else {
                mappingShip = false;
            }
        }
    }

    positiveSortShip(): void {
        this.coords = positiveSortShip(this.coords);
    }
}

export class Fleet {
    carriers: Array<Ship>;
    battleships: Array<Ship>;
    submarines: Array<Ship>;
    destroyers: Array<Ship>;
    invalid: Array<Ship>;
    mappedFleet: Array<Array<Array<number>>>;

    constructor() {
        this.carriers = [];
        this.battleships = [];
        this.submarines = [];
        this.destroyers = [];
        this.invalid = [];
        this.mappedFleet = [];
    }

    addShip(ship: Ship): void {
        ship.positiveSortShip();

        switch (ship.coords.length) {
            case 5:
                this.carriers.push(ship);
                break;
            case 4:
                this.battleships.push(ship);
                break;
            case 3:
                this.submarines.push(ship);
                break;
            case 2:
                this.destroyers.push(ship);
                break;
            default:
                this.invalid.push(ship);
        }
        this.mappedFleet.push(ship.coords);
    }

    clearFleet(): void {
        this.carriers = [];
        this.battleships = [];
        this.submarines = [];
        this.destroyers = [];
        this.invalid = [];
        this.mappedFleet = [];
    }

    fleetIsValid(): boolean {
        return (
            this.carriers.length === 1 &&
            this.battleships.length === 2 &&
            this.submarines.length === 3 &&
            this.destroyers.length === 4 &&
            this.invalid.length === 0
        );
    }
}

export class Board {
    grid: Array<Array<number>>;
    fleet: Fleet;

    constructor(
        grid: Array<Array<number>> = new Array(10)
            .fill(null)
            .map(() => new Array(10).fill(0)),
    ) {
        this.grid = grid;
        this.fleet = new Fleet();
    }

    resetGridAndFleet(): void {
        this.grid = new Array(10).fill(null).map(() => new Array(10).fill(0));
        this.fleet = new Fleet();
    }
}

export class GridState {
    invalidCoords: Set<string>;
    takenCoords: Set<string>;

    constructor() {
        this.invalidCoords = new Set();
        this.takenCoords = new Set();
    }

    addInvalidCoords(ship: Ship): void {
        const invalidCoords: Array<Array<number>> = [];
        if (!ship.direction) {
            throw new Error("Ship property: direction, is null");
        }
        // ship.coords must be sorted in order
        const [dx, dy] = ship.direction;
        const [fx, fy] = ship.coords[0];
        const [lx, ly] = ship.coords[ship.coords.length - 1];
        const vertical: boolean = dx !== 0;
        if (vertical) {
            invalidCoords.push([fx - dx, fy - 1]);
            invalidCoords.push([fx - dx, fy + 0]);
            invalidCoords.push([fx - dx, fy + 1]);
            invalidCoords.push([lx + dx, fy - 1]);
            invalidCoords.push([lx + dx, fy + 0]);
            invalidCoords.push([lx + dx, fy + 1]);
        } else {
            invalidCoords.push([fx - 1, fy - dy]);
            invalidCoords.push([fx + 0, fy - dy]);
            invalidCoords.push([fx + 1, fy - dy]);
            invalidCoords.push([lx - 1, ly + dy]);
            invalidCoords.push([lx + 0, ly + dy]);
            invalidCoords.push([lx + 1, ly + dy]);
        }

        for (let i = 0; i < ship.coords.length; i++) {
            const [x, y] = ship[i];
            if (vertical) {
                invalidCoords.push([x, y + 1]);
                invalidCoords.push([x, y - 1]);
            } else {
                invalidCoords.push([x + 1, y]);
                invalidCoords.push([x - 1, y]);
            }
        }

        for (const coord of invalidCoords) {
            this.invalidCoords.add(coord.toString());
        }
    }

    addTakenCoords(ship: Ship): void {
        for (const coord of ship.coords) {
            this.takenCoords.add(coord.toString());
        }
    }

    coordIsValid(coord: Array<number>): boolean {
        return (
            !this.invalidCoords.has(coord.toString()) &&
            !this.takenCoords.has(coord.toString()) &&
            CoordUtils.coordInBounds(coord)
        );
    }
}

export class BoardSetupValidator {
    board: Board;
    gridState: GridState;

    constructor(board: Board) {
        this.board = board;
        this.gridState = new GridState();
    }

    boardIsValid(): boolean {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const coordString: string = [x, y].toString();
                if (!this.gridState.takenCoords.has(coordString)) {
                    if (this.gridState.invalidCoords.has(coordString)) {
                        return false;
                    } else {
                        const ship = new Ship(this.board.grid);
                        ship.findShipFromStartCoord([x, y]);
                        this.gridState.addInvalidCoords(ship);
                        this.gridState.addTakenCoords(ship);
                        this.board.fleet.addShip(ship);
                    }
                }
            }
        }

        return this.board.fleet.fleetIsValid();
    }
}

class BoardSetupCreator {
    board: Board;
    gridState: GridState;

    constructor() {
        this.board = new Board();
        this.gridState = new GridState();
    }

    getRandomBoardSetup(): Board {
        let setupIsValid: boolean = false;
        do {
            this.createRandomBoard();

            const boardSetupValidator = new BoardSetupValidator(this.board);
            if (boardSetupValidator.boardIsValid()) {
                setupIsValid = true;
            }
        } while (!setupIsValid);

        return this.board;
    }

    // assigns a random board setup to this.board
    createRandomBoard() {
        const ships: Array<number> = [5, 4, 4, 3, 3, 3, 2, 2, 2, 2];
        // attempt to make a ship for every shipLength in the Q
        // if no ship is made, an invalid board will be made that will be invalidated by BoardSetupValidator
        // 1. Get a random coord that isn't already taken or part of an invalid space
        // 2. Attempt to create a ship starting at random coord at every possible direction at random
        // 3. If a ship is made add it to the fleet. If not, add try again
        while (ships.length) {
            const shipLength = ships.shift()!;
            let tries = 0;
            let shipCreated = false;
            while (!shipCreated && tries < 10) {
                let [x, y] = CoordUtils.getRandomCoord();
                let randomCoordAttemps: number = 0;
                while (!this.gridState.coordIsValid([x, y])) {
                    [x, y] = CoordUtils.getRandomCoord();
                    randomCoordAttemps++;
                    if (randomCoordAttemps > 10) {
                        // assume that no valid spaces available
                        // this happens when ships are placed too close to grid center
                        break;
                    }
                }

                // try to place ship with valid coord
                let placementFailures = 0;
                let ship: Ship | null = null;
                while (!ship && placementFailures < 5) {
                    ship = this.createShip([x, y], shipLength);
                    if (!ship) {
                        [x, y] = CoordUtils.getRandomCoord();
                        placementFailures++;

                        // successfully made ship, add it to the fleet
                    } else {
                        this.board.fleet.mappedFleet.push(ship.coords);
                    }
                }
                // check for success
                if (!ship) {
                    tries++;
                } else {
                    shipCreated = true;
                }
            }
        }
    }

    createShip(coord: Array<number>, shipLength: number): Ship | null {
        //
    }
}
