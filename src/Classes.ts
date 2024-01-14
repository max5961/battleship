import { getPositiveSortShip } from "./sortShipArray";

export class Utils {
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

    static getPositiveSortArray(
        array: Array<Array<number>>,
    ): Array<Array<number>> {
        return getPositiveSortShip(array);
    }

    static getDirections(): Array<Array<number>> {
        return [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];
    }
}

export class Ship {
    coords: Array<Array<number>>;
    direction: Array<number> | null;
    parentBoard: Board;

    constructor(parentBoard: Board) {
        this.coords = [];
        this.direction = null;
        this.parentBoard = parentBoard;
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
            if (
                this.parentBoard.grid[nx] &&
                this.parentBoard.grid[nx][ny] !== 0
            ) {
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

    getShipCoords(
        coord: Array<number>,
        markers: Array<number>,
        mappedSpaces: Set<string> = new Set(),
    ): Array<Array<number>> {
        const [x, y] = coord;
        if (!this.parentBoard.grid[x]) {
            return [];
        }
        if (mappedSpaces.has(coord.toString())) {
            return [];
        }
        let shipCoord: boolean = false;
        for (const marker of markers) {
            if (
                this.parentBoard.grid[x] &&
                this.parentBoard.grid[x][y] === marker
            ) {
                shipCoord = true;
            }
        }
        if (!shipCoord) {
            return [];
        }

        mappedSpaces.add(coord.toString());
        const shipCoords: Array<Array<number>> = [coord];
        const directions = [ [1, 0], [-1, 0], [0, 1], [0, -1] ]; // prettier-ignore
        for (const direction of directions) {
            const [dx, dy] = direction;
            const nx = x + dx;
            const ny = y + dy;
            const nextCoords: Array<Array<number>> = this.getShipCoords(
                [nx, ny],
                markers,
                mappedSpaces,
            );
            if (nextCoords.length) {
                for (const coord of nextCoords) {
                    shipCoords.push(coord);
                }
            }
        }
        return Utils.getPositiveSortArray(shipCoords);
    }

    getSunkenPartOfShip(coord: Array<number>): Array<Array<number>> {
        return this.getShipCoords(coord, [2]);
    }

    getEntireShip(coord: Array<number>): Array<Array<number>> {
        return this.getShipCoords(coord, [1, 2]);
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

    resetBoard(): void {
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

    addInvalidCoordsRecursive(ship: Ship): void {
        const shipCoords: Set<string> = new Set();
        for (const coord of ship.coords) {
            shipCoords.add(coord.toString());
        }
        const directions: Array<Array<number>> = [
            // left/right/up/down
            [1, 0],
            [-1, 0],
            [0, -1],
            [0, 1],
            // diagonal
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
        ];
        for (const coord of ship.coords) {
            for (const dir of directions) {
                const [cx, cy] = coord;
                const [dx, dy] = dir;
                const nx = cx + dx;
                const ny = cy + dy;
                if (!shipCoords.has([nx, ny].toString())) {
                    this.invalidCoords.add([nx, ny].toString());
                }
            }
        }
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
        if (this.invalidCoords.has(coord.toString())) {
            return false;
        }
        if (this.takenCoords.has(coord.toString())) {
            return false;
        }
        if (!Utils.coordInBounds(coord)) {
            return false;
        }
        return true;
    }

    // return coord or null if no coords available
    tryRandomValidCoord(): Array<number> | null {
        let tries: number = 0;
        while (tries < 20) {
            const coord = Utils.getRandomCoord();
            if (this.coordIsValid(coord)) {
                return coord;
            } else {
                tries++;
            }
        }
        // assume no valid coords available if none produced in 10 tries
        return null;
    }

    getRandomValidCoord(): Array<number> {
        let coord: Array<number> = Utils.getRandomCoord();
        while (!this.coordIsValid(coord)) {
            coord = Utils.getRandomCoord();
        }
        return coord;
    }
}

export class BoardValidator {
    board: Board;
    gridState: GridState;

    constructor(board: Board) {
        this.board = board;
        this.gridState = new GridState();
    }

    // design flaw: this method ALSO adds ships to the Fleet object of the Board object which
    // violates SRP, but...since the boolean results of this method are required
    // before any game starts, remembering run a method to add all the ships to the Fleet manually
    // would introduce bugs
    boardIsValid(): boolean {
        this.board.fleet = new Fleet();

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (this.board.grid[x][y] === 1) {
                    const coordString: string = [x, y].toString();
                    if (!this.gridState.takenCoords.has(coordString)) {
                        if (this.gridState.invalidCoords.has(coordString)) {
                            return false;
                        } else {
                            const ship = new Ship(this.board);
                            ship.coords = this.findShip([x, y]);
                            this.gridState.addInvalidCoordsRecursive(ship);
                            this.gridState.addTakenCoords(ship);
                            this.board.fleet.addShip(ship);
                        }
                    }
                }
            }
        }

        return this.board.fleet.fleetIsValid();
    }

    findShip(coord: Array<number>): Array<Array<number>> {
        const directions: Array<Array<number>> = [
            [0, 1],
            [1, 0],
        ];
        let currDir: Array<number> = [];
        for (const dir of directions) {
            const [dx, dy] = dir;
            const [cx, cy] = coord;
            const nx: number = cx + dx;
            const ny: number = cy + dy;
            if (this.board.grid[nx] && this.board.grid[nx][ny] === 1) {
                currDir = [dx, dy];
            }
        }
        const shipCoords: Array<Array<number>> = [];
        const [dx, dy] = currDir;
        let [x, y] = coord;
        while (this.board.grid[x] && this.board.grid[x][y] === 1) {
            shipCoords.push([x, y]);
            x += dx;
            y += dy;
        }
        return shipCoords;
    }
}

export class RandomBoard extends Board {
    gridState: GridState;

    constructor() {
        super();
        this.gridState = new GridState();
        this.init();
    }

    init() {
        let validFleet: boolean = false;
        while (!validFleet) {
            this.gridState = new GridState();
            this.createRandomFleet();
            if (this.fleet.fleetIsValid()) {
                this.placeShips();
                validFleet = true;
            }
        }
    }

    resetRandomBoard(): void {
        this.resetBoard();
        this.gridState = new GridState();
    }

    placeShips(): void {
        for (const key of Object.keys(this.fleet)) {
            if (key !== "mappedFleet") {
                for (const ship of this.fleet[key]) {
                    for (const coord of ship.coords) {
                        this.grid[coord[0]][coord[1]] = 1;
                    }
                }
            }
        }
    }

    // returns an array of coordinates to map to the grid
    createRandomFleet(): void {
        this.fleet = new Fleet();

        const ships: Array<number> = [5, 4, 4, 3, 3, 3, 2, 2, 2, 2];
        // attempt to make a ship for every shipLength in the Q
        // if no ship is made, an invalid board will be made that will be invalidated by BoardboardInitializer
        // 1. Get a random coord that isn't already taken or part of an invalid space
        // 2. Attempt to create a ship starting at random coord at every possible direction at random
        // 3. If a ship is made, add it to the fleet. If not, try again until out of tries
        while (ships.length) {
            const shipLength: number = ships.shift()!;

            let shipCreated: boolean = false;
            let tries: number = 0;
            while (!shipCreated && tries < 10) {
                let randomValidCoord: Array<number> | null =
                    this.gridState.tryRandomValidCoord();
                if (!randomValidCoord) {
                    // no random valid coord was available (previous ships too
                    // close to center)
                    break;
                }

                // try to place ship with valid coord
                let placementFailures: number = 0;
                let ship: Ship | null = null;
                while (!ship && placementFailures < 5) {
                    ship = this.createShip(randomValidCoord, shipLength);
                    if (!ship) {
                        placementFailures++;
                        randomValidCoord = this.gridState.tryRandomValidCoord();
                        if (!randomValidCoord) {
                            break;
                        }
                    }
                }
                // check for success
                if (!ship) {
                    tries++;
                } else {
                    shipCreated = true;
                    this.gridState.addInvalidCoordsRecursive(ship);
                    this.gridState.addTakenCoords(ship);
                    this.fleet.addShip(ship);
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
            const ship: Ship = new Ship(this);
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
                        ship.direction = [dx, dy];
                        return ship;
                    }
                }
            }
        }
        return null;
    }
}

class Chooser {
    public opponentBoard: Board;
    public gridState: GridState;

    // takes in a **valid** board as an initalizer parameter
    constructor(opponentBoard: Board) {
        this.opponentBoard = opponentBoard;
        this.gridState = new GridState();
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
}

export class ComputerChooserMemory {
    public lastShotMissed: boolean;
    public lastHitCoord: Array<number> | null;
    public currentTargetShip: Ship;
    public possibleDirections: Array<Array<number>>;

    constructor(opponentBoard: Board) {
        this.lastShotMissed = true;
        this.lastHitCoord = null;
        this.currentTargetShip = new Ship(opponentBoard);
        this.possibleDirections = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];
    }

    resetPossibleDirections(): Array<Array<number>> {
        this.possibleDirections = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];
    }
}

export class ComputerChooser extends Chooser {
    memory: ComputerChooserMemory;

    constructor(opponentBoard: Board) {
        super(opponentBoard);
        this.memory = new ComputerChooserMemory(opponentBoard);
    }

    resetMemory(): void {
        this.memory = new ComputerChooserMemory(this.opponentBoard);
    }

    currentTargetShipIsSunk(): boolean {
        // create a copy of currTargetShip
        // mutating the original would cause issues with shootAlongCurrentDirection method
        const currTarget: Array<Array<number>> =
            this.memory.currentTargetShip.getPositiveSortShip();

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

    //            ┌ takeShot(randomCoord)
    // takeTurn() ┤                   ┌ shootAndSearchForDirection()
    //            └ takeFocusedShot() ┤
    //                                └ shootAlongCurrentDirection()
    takeTurn(): void {
        if (this.currentTargetShipIsSunk()) {
            console.log("ship is sunk");
            this.gridState.addInvalidCoordsRecursive(
                this.memory.currentTargetShip,
            );
            this.opponentBoard.sunkenFleet.addShip(
                this.memory.currentTargetShip,
            );
            this.resetMemory();
        }

        // last shot was a hit, target area is now focused
        if (this.memory.lastHitCoord) {
            this.takeFocusedShot();
        } else {
            const coord: Array<number> = this.gridState.getRandomValidCoord();
            this.takeShot(coord);
        }
    }

    takeShot(coord: Array<number>): void {
        this.gridState.takenCoords.add(coord.toString());

        if (this.shotIsOnTarget(coord)) {
            this.markHit(coord);
            this.memory.lastHitCoord = coord;
            this.memory.lastShotMissed = false;
            this.memory.currentTargetShip.coords.push(coord);
        } else {
            this.markMiss(coord);
            this.memory.lastShotMissed = true;
        }
    }

    takeFocusedShot(): void {
        if (this.memory.currentTargetShip.direction) {
            this.shootAlongCurrentDirection();
        } else {
            this.shootAndSearchForDirection();
        }
    }

    shootAndSearchForDirection(): void {
        if (!this.memory.lastHitCoord) {
            throw new Error("lastHitCoord property is null");
        }

        const getRandomDirectionIndex = (): number =>
            Math.floor(Math.random() * this.memory.possibleDirections.length);

        const [lx, ly] = this.memory.lastHitCoord!;
        const nextCoord: Array<number> = [];

        // take the possibleDirections property and splice at random until a valid coord is found
        while (!nextCoord.length) {
            const index = getRandomDirectionIndex();
            const [dx, dy] = this.memory.possibleDirections[index];
            this.memory.possibleDirections.splice(index, 1);
            const nx = lx + dx;
            const ny = ly + dy;

            // ONLY check if the coordinate is valid.  NOT if its also on target
            if (this.gridState.coordIsValid([nx, ny])) {
                nextCoord.push(nx);
                nextCoord.push(ny);

                // if the nextCoord is a hit: update currentDirection, reset possibleDirections
                if (this.shotIsOnTarget(nextCoord)) {
                    this.memory.currentTargetShip.direction = [dx, dy];
                    // thinking I don't need to reset possible directions because
                    // this gets reset when the memory property gets reset
                    this.memory.possibleDirections =
                        this.memory.resetPossibleDirections();
                }
            }
        }
        // finally, take the shot
        this.takeShot(nextCoord);
    }

    shootAlongCurrentDirection(): void {
        if (!this.memory.lastHitCoord) {
            throw new Error("lastHitCoord property is null");
        }
        if (!this.memory.currentTargetShip.direction) {
            throw new Error("currentTargetShip.direction property is null");
        }

        let x: number;
        let y: number;
        // last shot was a miss (reached beyond the ends of the ship), ship direction was reversed
        // derive dx, dy from the first hit
        if (this.memory.lastShotMissed) {
            [x, y] = this.memory.currentTargetShip.coords[0];
            this.memory.lastShotMissed = false;

            // else keep going along current direction
        } else {
            [x, y] = this.memory.lastHitCoord;
        }
        const [dx, dy] = this.memory.currentTargetShip.direction;
        const coord = [x + dx, y + dy];

        if (!this.shotIsOnTarget(coord)) {
            this.memory.currentTargetShip.reverseShipDirection();
            // if the coord is in a spot that cannot contain a ship, skip taking
            // the illogical shot and immediately take the next shot in the reverse direction
            if (!this.gridState.coordIsValid(coord)) {
                this.memory.lastShotMissed = true;
                this.shootAlongCurrentDirection();
                return; // make sure to return early (prevent double shot)
            }
        }

        // finally, take the shot
        this.takeShot(coord);
    }
}
