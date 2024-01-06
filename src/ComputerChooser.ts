import { Board } from "./Board";
import { negativeSortShip, positiveSortShip } from "./sortShipArray";

class ComputerChooser {
    opponentBoard: Board | null;
    targetFound: boolean;
    lastHitCoord: Array<number> | null;
    nextCoord: Array<number> | null;
    currentTargetShip: Array<Array<number>>;
    possibleDirections: Array<Array<number>>;
    currentDirection: Array<number> | null;
    invalidCoords: Set<string>;
    chosenCoords: Set<string>;

    constructor() {
        this.opponentBoard = null;
        this.targetFound = false;
        this.lastHitCoord = null;
        this.nextCoord = null;
        this.currentTargetShip = [];
        this.possibleDirections = this.resetDirections();
        this.currentDirection = null;
        this.invalidCoords = new Set();
        this.chosenCoords = new Set();
    }

    setBoard(board: Board): void {
        this.opponentBoard = board;
    }

    resetDirections(): Array<Array<number>> {
        return [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
        ];
    }

    coordIsValid(coord: Array<number>): boolean {
        const [x, y] = coord;
        return (
            !this.invalidCoords.has(coord.toString()) &&
            !this.chosenCoords.has(coord.toString()) &&
            x > 0 &&
            y > 0 &&
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

    getNextCoord(): Array<number> | void {
        // run this function only if there is a current target area
        if (!this.targetFound) {
            return;
        }

        const getRandomDirectionIndex = (): number =>
            Math.floor(Math.random() * this.possibleDirections.length);

        const [lx, ly] = this.lastHitCoord!;
        const nextCoord: Array<number> = [];

        // take the possibleDirections property and splice at a random index until a coord
        // is found that is not part of the taken or invalid Sets
        while (!nextCoord.length) {
            const index = getRandomDirectionIndex();
            const [dx, dy] = this.possibleDirections[index];
            this.possibleDirections.splice(index, 1);
            const nx = lx + dx;
            const ny = ly + dy;

            // ONLY check if the coordinate is valid // NOT if its also on target
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

        return nextCoord;
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

    takeShot(coord: Array<number>): void {
        if (this.shotIsOnTarget(coord)) {
            this.markHit(coord);
            this.currentTargetShip.push(coord);
        } else {
            this.markMiss(coord);
        }
    }

    // if there is a current x or y direction to search along
    takeDirectionalShot(): void {
        if (!this.currentDirection) {
            throw new Error("currentDirection property is null");
        }

        const [cx, cy] = this.lastHitCoord!;
        const [dx, dy] = this.currentDirection;
        this.nextCoord = [cx + dx, cy + dy];
        this.takeShot(this.nextCoord);

        // HANDLE AFTER THE SHOT IS TAKEN
        // shooting at nextCoord sinks a ship
        // reset properties to default
        const x = true;
        if (!x) {
            this.nextCoord = null;
            this.lastHitCoord = null;
            this.targetFound = false;
            return;
        }

        // shooting at nextCoord is a hit
        if (!this.shotIsOnTarget(this.nextCoord)) {
            this.lastHitCoord = this.nextCoord;
        }

        // shooting at nextCoord is a miss
        // get the opposite side of the ship from the currentTargetShip array
        if (!this.shotIsOnTarget(this.nextCoord)) {
            // reverse the currentDirection
            for (let i = 0; i < this.currentDirection.length; i++) {
                this.currentDirection[i] === 1
                    ? (this.currentDirection[i] = -1)
                    : (this.currentDirection[i] = 1);
            }
            // get the orientation of currentDirection
            // positive: left -> right, up -> down
            // negative: right -> left, down -> up
            const positive: boolean =
                this.currentDirection[0] === 1 ||
                this.currentDirection[1] === 1;

            // sort the mapped hits from currentTargetShip
            positive
                ? (this.currentTargetShip = positiveSortShip(
                      this.currentTargetShip,
                  ))
                : (this.currentTargetShip = negativeSortShip(
                      this.currentTargetShip,
                  ));

            // last index of currentTargetShip is nextCoord
            this.nextCoord =
                this.currentTargetShip[this.currentTargetShip.length - 1];
        }
    }

    // target area HAS been found
    takeFocusedShot(): void {
        // currentDirection is already known
        if (this.currentDirection) {
            this.takeDirectionalShot();
            return;
        }

        // currentDirection is not yet known
    }
}
