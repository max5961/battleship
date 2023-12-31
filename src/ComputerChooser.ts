import { Board, Fleet } from "./Board";
import { positiveSortShip } from "./sortShipArray";
import { cloneDeep } from "lodash";

export class ComputerChooser {
    opponentBoard: Array<Array<number>> | null;
    opponentFleet: Array<Array<Array<number>>> | null;
    lastHitCoord: Array<number> | null;
    lastShotMissed: boolean;
    currentTargetShip: Array<Array<number>>;
    possibleDirections: Array<Array<number>>;
    currentDirection: Array<number> | null;
    invalidCoords: Set<string>;
    chosenCoords: Set<string>;

    constructor() {
        this.opponentBoard = null;
        this.opponentFleet = null;
        this.lastHitCoord = null;
        this.lastShotMissed = true;
        this.currentTargetShip = [];
        this.currentDirection = null;
        this.possibleDirections = this.resetDirections();
        this.invalidCoords = new Set();
        this.chosenCoords = new Set();
    }

    setBoard(board: Array<Array<number>>): void {
        this.opponentBoard = board;
    }

    setFleet(fleet: Fleet): void {
        this.opponentFleet = fleet.mappedFleet;
    }

    getClone(): ComputerChooser {
        if (!this.opponentFleet) {
            throw new Error("opponentFleet property is null");
        }
        if (!this.opponentBoard) {
            throw new Error("opponentBoard property is null");
        }

        const next = new ComputerChooser();
        // clone primitive types
        next.lastHitCoord = this.lastHitCoord;
        next.lastShotMissed = this.lastShotMissed;
        // clone reference types
        next.invalidCoords = cloneDeep(this.invalidCoords);
        next.chosenCoords = cloneDeep(this.invalidCoords);
        next.opponentBoard = cloneDeep(this.opponentBoard);
        next.opponentFleet = cloneDeep(this.opponentFleet);
        next.possibleDirections = cloneDeep(this.possibleDirections);
        next.currentTargetShip = cloneDeep(this.currentTargetShip);
        next.currentDirection = this.currentDirection
            ? cloneDeep(this.currentDirection)
            : this.currentDirection;
        return next;
    }

    resetData(): void {
        this.lastShotMissed = true;
        this.lastHitCoord = null;
        this.currentTargetShip = [];
        this.possibleDirections = this.resetDirections();
    }

    resetDirections(): Array<Array<number>> {
        return [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];
    }

    // use the mapInvalidSpaces method from the Board class
    mapInvalidSpaces(): void {
        if (!this.currentDirection) {
            throw new Error("currentDirection property is null");
        }

        let positiveXOrYDirection: Array<number>;
        if (this.currentDirection[0] !== 0) {
            positiveXOrYDirection = [1, 0];
        } else {
            positiveXOrYDirection = [0, 1];
        }
        const ship = positiveSortShip(this.currentTargetShip);
        const board = new Board();
        board.mapInvalidSpaces(ship, this.invalidCoords);
    }

    coordIsValid(coord: Array<number>): boolean {
        const [x, y] = coord;
        return (
            !this.invalidCoords.has(coord.toString()) &&
            !this.chosenCoords.has(coord.toString()) &&
            x >= 0 &&
            y >= 0 &&
            x < 10 &&
            y < 10
        );
    }

    getRandomCoord(): Array<number> {
        const randomNumber = (): number => {
            return Math.floor(Math.random() * 10);
        };
        const randomCoord = (): Array<number> => {
            return [randomNumber(), randomNumber()];
        };

        let coord = randomCoord();
        while (!this.coordIsValid(coord)) {
            coord = randomCoord();
        }

        return coord;
    }

    currentTargetShipIsSunk(): boolean {
        if (!this.opponentFleet) {
            throw new Error("opponentFleet property is null");
        }
        const currTarget = positiveSortShip(this.currentTargetShip);
        for (const ship of this.opponentFleet) {
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

    shotIsOnTarget(coord: Array<number>): boolean {
        const [x, y] = coord;
        return this.opponentBoard![x][y] === 1;
    }

    markHit(coord: Array<number>): void {
        const [x, y] = coord;
        this.opponentBoard![x][y] = 3;
    }

    markMiss(coord: Array<number>): void {
        const [x, y] = coord;
        this.opponentBoard![x][y] = 2;
    }

    takeTurn(): void {
        if (this.currentTargetShipIsSunk()) {
            this.mapInvalidSpaces();
            this.resetData();
        }

        // last shot was a hit, target area is now focused
        if (this.lastHitCoord) {
            this.takeFocusedShot();
        } else {
            const coord = this.getRandomCoord();
            this.takeShot(coord);
        }
    }

    takeShot(coord: Array<number>): void {
        this.chosenCoords.add(coord.toString());

        if (this.shotIsOnTarget(coord)) {
            this.markHit(coord);
            this.lastHitCoord = coord;
            this.currentTargetShip.push(coord);
            this.lastShotMissed = false;
        } else {
            this.markMiss(coord);
            this.lastShotMissed = true;
        }
    }

    takeFocusedShot(): void {
        // currentDirection is already known
        if (this.currentDirection) {
            this.shootAlongCurrentDirection();
            return;
        }
        // currentDirection is not yet known
        this.shootAndSearchForDirection();
    }

    shootAlongCurrentDirection(): void {
        if (!this.currentDirection) {
            throw new Error("currentDirection property is null");
        }
        if (!this.lastHitCoord) {
            throw new Error("lastHitCoord property is null");
        }

        let cx: number;
        let cy: number;
        // last shot was a miss (reached beyond the ends of the ship), current direction was reversed
        // derive dx, dy from the first hit
        if (this.lastShotMissed) {
            const [x, y] = this.currentTargetShip[0];
            cx = x;
            cy = y;
            this.lastShotMissed = false;

            // else keep going along current direction
        } else {
            const [x, y] = this.lastHitCoord;
            cx = x;
            cy = y;
        }
        const [dx, dy] = this.currentDirection;
        const coord = [cx + dx, cy + dy];

        // shot with coord is a miss, reverse currentDirection
        if (!this.shotIsOnTarget(coord)) {
            for (let i = 0; i < 2; i++) {
                if (this.currentDirection[i] !== 0) {
                    if (this.currentDirection[i] === 1) {
                        this.currentDirection[i] = -1;
                    } else {
                        this.currentDirection[i] = 1;
                    }
                }
            }

            // if the coord is in a spot that cannot contain a ship, skip taking
            // the illogical shot and immediately take the next shot in the reverse direction
            if (!this.coordIsValid(coord)) {
                this.lastShotMissed = true;
                this.shootAlongCurrentDirection();
                return;
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
            // the computer isn't supposed to know which direction to try to shoot
            // until the x or y direction has been found
            if (this.coordIsValid([nx, ny])) {
                nextCoord.push(nx);
                nextCoord.push(ny);

                // if the nextCoord is a hit: update currentDirection, reset possibleDirections
                if (this.shotIsOnTarget(nextCoord)) {
                    this.currentDirection = [dx, dy];
                    this.possibleDirections = this.resetDirections();
                }
            }
        }
        // finally, take the shot
        this.takeShot(nextCoord);
    }
}
