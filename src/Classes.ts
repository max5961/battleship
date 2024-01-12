import { getPositiveSortShip } from "./sortShipArray";

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
            [0, 1],
            [-1, 0],
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

    reverseShipDirection(): void {
        if (!this.direction) {
            throw new Error("Ship.direction is null");
        }

        for (let i = 0; i < 2; i++) {
            if (this.direction[i] !== 0) {
                if (this.direction[i] === 1) {
                    this.direction[i] = -1;
                } else {
                    this.direction[i] = 1;
                }
            }
        }
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
            if (
                (this.parentGrid[nx] && this.parentGrid[nx][ny] === 1) ||
                (this.parentGrid[nx] && this.parentGrid[nx][ny] === 2)
            ) {
                this.coords.push([nx, ny]);
                nx += dx;
                ny += dy;
            } else {
                mappingShip = false;
            }
        }
    }

    // returns a copy of shipCoords sorted in ascending order
    getPositiveSortShip(): Array<Array<number>> {
        return getPositiveSortShip(this.coords);
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
        ship.coords = ship.getPositiveSortShip();

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

export class SunkenFleet {
    carriers: Array<Ship>;
    battleships: Array<Ship>;
    submarines: Array<Ship>;
    destroyers: Array<Ship>;

    constructor() {
        this.carriers = [];
        this.battleships = [];
        this.submarines = [];
        this.destroyers = [];
    }

    addShip(ship: Ship): void {
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
                throw new Error(
                    "Attempting to add invalid ship to sunken fleet",
                );
        }
    }

    fleetIsSunk(): boolean {
        return (
            this.carriers.length === 1 &&
            this.battleships.length === 2 &&
            this.submarines.length === 3 &&
            this.destroyers.length === 4
        );
    }
}

export class Board {
    grid: Array<Array<number>>;
    fleet: Fleet;
    sunkenFleet: SunkenFleet;

    constructor(
        grid: Array<Array<number>> = new Array(10)
            .fill(null)
            .map(() => new Array(10).fill(0)),
    ) {
        this.grid = grid;
        this.fleet = new Fleet();
        this.sunkenFleet = new SunkenFleet();
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

    // return coord or null if no coords available
    tryRandomValidCoord(): Array<number> | null {
        let tries: number = 0;
        while (tries < 10) {
            const coord = CoordUtils.getRandomCoord();
            if (this.coordIsValid(coord)) {
                return coord;
            } else {
                tries++;
            }
        }
        // assume no valid coords available if none produced in 10 tries
        return null;
    }

    getRandomValidCoord(): Array<numnber> {
        let coord: Array<number> = CoordUtils.getRandomCoord();
        while (!this.coordIsValid(coord)) {
            coord = CoordUtils.getRandomCoord();
        }
        return coord;
    }
}

export class SetupValidator {
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

class RandomSetupCreator {
    board: Board;
    gridState: GridState;

    constructor() {
        this.board = new Board();
        this.gridState = new GridState();
    }

    getRandomBoardSetup(): Board {
        let setupIsValid: boolean = false;
        while (!setupIsValid) {
            this.attemptRandomBoard();

            const setupValidator: SetupValidator = new SetupValidator(
                this.board,
            );
            if (setupValidator.boardIsValid()) {
                setupIsValid = true;
            }
        }
        return this.board;
    }

    // assigns a random board setup to this.board
    attemptRandomBoard() {
        const ships: Array<number> = [5, 4, 4, 3, 3, 3, 2, 2, 2, 2];
        // attempt to make a ship for every shipLength in the Q
        // if no ship is made, an invalid board will be made that will be invalidated by BoardSetupValidator
        // 1. Get a random coord that isn't already taken or part of an invalid space
        // 2. Attempt to create a ship starting at random coord at every possible direction at random
        // 3. If a ship is made, add it to the fleet. If not, try again until out of tries
        while (ships.length) {
            const shipLength = ships.shift()!;
            let tries = 0;
            let shipCreated = false;
            while (!shipCreated && tries < 10) {
                let randomValidCoord: Array<number> | null =
                    this.gridState.tryRandomValidCoord();
                if (!randomValidCoord) {
                    break;
                }

                // try to place ship with valid coord
                let placementFailures = 0;
                let ship: Ship | null = null;
                while (!ship && placementFailures < 5) {
                    ship = this.createShip(randomValidCoord, shipLength);
                    if (!ship) {
                        placementFailures++;
                        randomValidCoord = this.gridState.tryRandomValidCoord();
                        if (!randomValidCoord) {
                            break;
                        }

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

    createShip(startCoord: Array<number>, shipLength: number): Ship | null {
        const directions: Array<Array<number>> = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        const [x, y] = startCoord;
        while (directions.length) {
            const ship: Ship = new Ship(this.board.grid);
            const randomIndex = Math.floor(Math.random() * directions.length);
            const [dx, dy] = directions[randomIndex]!;
            directions.splice(randomIndex, 1);
            let nx = x + dx;
            let ny = y + dy;
            let createdLength = 0;
            let validCoord: boolean = true;
            while (createdLength < shipLength && validCoord) {
                if (!this.gridState.coordIsValid([nx, ny])) {
                    validCoord = false;
                } else {
                    ship.coords.push([nx, ny]);
                    nx += dx;
                    ny += dy;
                    createdLength++;
                    if (createdLength === shipLength) {
                        return ship;
                    }
                }
            }
        }
        return null;
    }
}

class ComputerChooser {
    opponentBoard: Board;
    gridState: GridState;
    lastShotMissed: boolean;
    lastHitCoord: Array<number> | null;
    currentTargetShip: Ship;
    possibleDirections: Array<Array<number>>;

    // takes in a VALID board as an initalizer parameter
    constructor(board: Board) {
        this.opponentBoard = board;
        this.gridState = new GridState();
        this.lastShotMissed = true;
        this.lastHitCoord = null;
        this.currentTargetShip = new Ship(this.opponentBoard.grid);
        this.possibleDirections = this.resetPossibleDirections();
    }

    resetPossibleDirections(): Array<Array<number>> {
        return [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];
    }

    resetData(): void {
        this.lastShotMissed = true;
        this.lastHitCoord = null;
        this.possibleDirections = this.resetPossibleDirections();
        this.currentTargetShip = new Ship(this.opponentBoard.grid);
    }

    shotIsOnTarget(coord: Array<number>): boolean {
        const [x, y] = coord;
        return this.opponentBoard.grid[x][y] === 1;
    }

    markHit(coord: Array<number>): void {
        const [x, y] = coord;
        this.opponentBoard.grid[x][y] = 2;
    }

    markMiss(coord: Array<number>): void {
        const [x, y] = coord;
        this.opponentBoard.grid[x][y] = 3;
    }

    takeShot(coord: Array<number>): void {
        this.gridState.takenCoords.add(coord.toString());

        if (this.shotIsOnTarget(coord)) {
            this.markHit(coord);
            this.lastHitCoord = coord;
            this.lastShotMissed = false;
            this.currentTargetShip.coords.push(coord);
        } else {
            this.markMiss(coord);
            this.lastShotMissed = true;
        }
    }

    currentTargetShipIsSunk(): boolean {
        const currTarget = this.currentTargetShip.getPositiveSortShip();

        for (const ship of this.opponentBoard.fleet.mappedFleet) {
            if (ship.length === currTarget.length) {
                let match: boolean = true;
                for (let i = 0; i < ship.length; i++) {
                    if (ship[i][0] !== currTarget[i][0]) {
                        match = false;
                    }
                    if (ship[i][1] !== currTarget[i][1]) {
                        match = false;
                    }
                }
                if (match) return true;
            }
        }
        return false;
    }

    takeTurn(): void {
        if (this.currentTargetShipIsSunk()) {
            this.gridState.addInvalidCoords(this.currentTargetShip);
            this.resetData();
        }

        // last shot was a hit, target area is now focused
        if (this.lastHitCoord) {
            this.takeFocusedShot();
        } else {
            const coord = this.gridState.getRandomValidCoord();
            this.takeShot(coord);
        }
    }

    takeFocusedShot(): void {
        if (this.currentTargetShip.direction) {
            this.shootAlongCurrentDirection();
        } else {
            this.shootAndSearchForDirection();
        }
    }

    shootAlongCurrentDirection(): void {
        if (!this.lastHitCoord) {
            throw new Error("lastHitCoord property is null");
        }
        if (!this.currentTargetShip.direction) {
            throw new Error("currentTargetShip.direction property is null");
        }

        let x: number;
        let y: number;
        // last shot was a miss (reached beyond the ends of the ship), ship direction was reversed
        // derive dx, dy from the first hit
        if (this.lastShotMissed) {
            [x, y] = this.currentTargetShip[0];
            this.lastShotMissed = false;

            // else keep going along current direction
        } else {
            [x, y] = this.lastHitCoord;
        }
        const [dx, dy] = this.currentTargetShip.direction;
        const coord = [x + dx, y + dy];

        if (!this.shotIsOnTarget(coord)) {
            this.currentTargetShip.reverseShipDirection();
            // if the coord is in a spot that cannot contain a ship, skip taking
            // the illogical shot and immediately take the next shot in the reverse direction
            if (!this.gridState.coordIsValid(coord)) {
                this.lastShotMissed = true;
                this.shootAlongCurrentDirection();
                return; // make sure to return early (prevent double shot)
            }
        }

        // finally, take the shot
        this.takeShot(coord);
    }

    shootAndSearchForDirection(): void {
        if (!this.lastHitCoord) {
            throw new Error("lastHitCoord property is null");
        }

        const getRandomDirectionIndex = (): number =>
            Math.floor(Math.random() * this.possibleDirections.length);

        const [lx, ly] = this.lastHitCoord!;
        const nextCoord: Array<number> = [];

        // take the possibleDirections property and splice at random until a valid coord is found
        while (!nextCoord.length) {
            const index = getRandomDirectionIndex();
            const [dx, dy] = this.possibleDirections[index];
            this.possibleDirections.splice(index, 1);
            const nx = lx + dx;
            const ny = ly + dy;

            // ONLY check if the coordinate is valid.  NOT if its also on target
            if (this.gridState.coordIsValid([nx, ny])) {
                nextCoord.push(nx);
                nextCoord.push(ny);

                // if the nextCoord is a hit: update currentDirection, reset possibleDirections
                if (this.shotIsOnTarget(nextCoord)) {
                    this.currentTargetShip.direction = [dx, dy];
                    this.possibleDirections = this.resetPossibleDirections();
                }
            }
        }
        // finally, take the shot
        this.takeShot(nextCoord);
    }
}
