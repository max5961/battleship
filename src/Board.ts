interface Ship {
    coords: Array<Array<number>>;
    direction: Array<number>;
}
export class Fleet {
    // carriers/battleships/submarines/destroyers = [[[1,2],[2,2]]]
    carriers: Array<Array<Array<number>>>;
    battleships: Array<Array<Array<number>>>;
    submarines: Array<Array<Array<number>>>;
    destroyers: Array<Array<Array<number>>>;
    invalid: Array<Array<Array<number>>>;
    mappedFleet: Array<Array<number>>;

    constructor() {
        this.carriers = []; // ship length 5, expected 1
        this.battleships = []; // ship length 4, expected 2
        this.submarines = []; // ship length 3, expected 3
        this.destroyers = []; // ship length 2, expected 4
        this.invalid = []; // ship length < 2 || length > 5, expected 0
        this.mappedFleet = []; // flattened array of all ship coordinates
    }

    addShip(ship: Array<Array<number>>): void {
        switch (ship.length) {
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
        ship.forEach((coord) => this.mappedFleet.push(coord));
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
    board: Array<Array<number>>;
    fleet: Fleet;

    constructor(
        board: Array<Array<number>> = new Array(10)
            .fill(null)
            .map(() => new Array(10).fill(0)),
    ) {
        this.board = board;
        this.fleet = new Fleet();
    }

    // helper function
    coordToString(x: number, y: number): string {
        return [x, y].toString();
    }

    resetBoard(): void {
        this.board = new Array(10).fill(null).map(() => new Array(10).fill(0));
        this.fleet.clearFleet();
    }

    boardIsValid(): boolean {
        // bozo code // board should be validated other than checking fleet instance
        this.fleet.clearFleet();

        const takenSpaces: Set<string> = new Set();
        const invalidSpaces: Set<string> = new Set();

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                // chosen coords value is 1 // empty coords value is 0
                if (this.board[x][y] === 1) {
                    const stringCoord: string = [x, y].toString();
                    // coord has not yet been mapped to a ship
                    if (!takenSpaces.has(stringCoord)) {
                        if (invalidSpaces.has(stringCoord)) {
                            return false;
                        } else {
                            const ship = this.mapShip(x, y, takenSpaces);
                            this.fleet.addShip(ship.coords);
                            this.mapInvalidSpaces(ship, invalidSpaces);
                        }
                    }
                }
            }
        }

        return this.fleet.fleetIsValid();
    }

    mapInvalidSpaces(ship: Ship, invalidSpaces: Set<string>): void {
        const invalidCoords: Array<Array<number>> = [];
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
            const [x, y] = ship.coords[i];
            if (vertical) {
                invalidCoords.push([x, y + 1]);
                invalidCoords.push([x, y - 1]);
            } else {
                invalidCoords.push([x + 1, y]);
                invalidCoords.push([x - 1, y]);
            }
        }

        for (const coord of invalidCoords) {
            invalidSpaces.add(this.coordToString(coord[0], coord[1]));
        }
    }

    mapShip(x: number, y: number, takenSpaces: Set<string>): Ship {
        const directions: Array<Array<number>> = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        let pathDir: Array<number> = directions[0];
        while (directions.length) {
            const [dx, dy] = directions.shift()!;
            const nx = x + dx;
            const ny = y + dy;
            if (this.board[nx] && this.board[nx][ny] === 1) {
                pathDir = [dx, dy];
            }
        }
        const ship: Ship = {
            coords: [],
            direction: pathDir,
        };
        const [dx, dy] = pathDir;
        let mappingShip = true;
        do {
            if (this.board[x] && this.board[x][y] === 1) {
                ship.coords.push([x, y]);
                takenSpaces.add(this.coordToString(x, y));
                x += dx;
                y += dy;
            } else {
                mappingShip = false;
            }
        } while (mappingShip);

        return ship;
    }

    createRandomBoard(): void {
        let validBoard = false;
        while (!validBoard) {
            this.resetBoard();
            const randomFleet: Array<Array<number>> = this.getRandomFleet();
            for (const coord of randomFleet) {
                this.board[coord[0]][coord[1]] = 1;
            }
            validBoard = this.boardIsValid();
        }
    }

    getRandomFleet(): Array<Array<number>> {
        const getRandomCoord = (): Array<number> => {
            return [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
        };

        const mappedFleet: Array<Array<Array<number>>> = [];
        const ships: Array<number> = [5, 4, 4, 3, 3, 3, 2, 2, 2, 2];
        const takenSpaces: Set<string> = new Set();
        const invalidSpaces: Set<string> = new Set();

        while (ships.length) {
            const shipLength = ships.shift()!;

            let tries = 0;
            let [x, y] = getRandomCoord();
            while (
                takenSpaces.has(this.coordToString(x, y)) ||
                invalidSpaces.has(this.coordToString(x, y))
            ) {
                [x, y] = getRandomCoord();
                tries++;
                if (tries > 10) break;
            }

            let placementFailures = 0;
            let ship: Array<Array<number>> | null = null;
            while (!ship && placementFailures < 5) {
                ship = this.createShip(
                    shipLength,
                    [x, y],
                    takenSpaces,
                    invalidSpaces,
                );
                if (!ship) {
                    [x, y] = getRandomCoord();
                    placementFailures++;
                } else {
                    mappedFleet.push(ship);
                }
            }
        }

        return mappedFleet.flat();
    }

    // creates an array representing a ship if possible, otherwise returns null
    createShip(
        shipLength: number,
        startCoord: Array<number>,
        takenSpaces: Set<string>,
        invalidSpaces: Set<string>,
    ): Array<Array<number>> | null {
        const coordsAreValid = (x: number, y: number): boolean => {
            const coordString: string = this.coordToString(x, y);
            if (
                takenSpaces.has(coordString) ||
                invalidSpaces.has(coordString)
            ) {
                return false;
            }
            if (x < 0 || y < 0 || x > 9 || y > 9) {
                return false;
            }
            return true;
        };
        const directions: Array<Array<number>> = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        const [x, y] = startCoord;
        while (directions.length) {
            const randomIndex = Math.floor(Math.random() * directions.length);
            const [dx, dy] = directions[randomIndex]!;
            directions.splice(randomIndex, 1);
            const ship: Array<Array<number>> = [];
            let nx = x + dx;
            let ny = y + dy;
            let createdLength = 0;
            let validCoord: boolean = true;
            while (createdLength < shipLength && validCoord) {
                if (!coordsAreValid(nx, ny)) {
                    validCoord = false;
                } else {
                    ship.push([nx, ny]);
                    nx += dx;
                    ny += dy;
                    createdLength++;
                    if (createdLength === shipLength) {
                        for (const coord of ship) {
                            takenSpaces.add(coord.toString());
                        }
                        this.mapInvalidSpaces(
                            { coords: ship, direction: [dx, dy] },
                            invalidSpaces,
                        );

                        return ship;
                    }
                }
            }
        }

        return null;
    }
}
