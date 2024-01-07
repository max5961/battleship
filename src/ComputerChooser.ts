import { Board, Fleet, Ship } from "./Board";
import { negativeSortShip, positiveSortShip } from "./sortShipArray";

export class ComputerChooser {
    opponentBoard: Array<Array<number>> | null;
    opponentFleet: Array<Array<Array<number>>> | null;
    lastHitCoord: Array<number> | null;
    nextCoord: Array<number> | null;
    currentTargetShip: Array<Array<number>>;
    possibleDirections: Array<Array<number>>;
    currentDirection: Array<number> | null;
    invalidCoords: Set<string>;
    chosenCoords: Set<string>;

    constructor() {
        this.opponentBoard = null;
        this.opponentFleet = null;
        this.lastHitCoord = null;
        this.nextCoord = null;
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

    // use the mapInvalidCoords method from the Board class
    mapInvalidCoords(): void {
        if (!this.currentDirection) {
            throw new Error("currentDirection property is null");
        }
        const ship: Ship = {
            coords: positiveSortShip(this.currentTargetShip),
            direction: this.currentDirection,
        };
        const board = new Board();
        board.mapInvalidSpaces(ship, this.invalidCoords);
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
        next.nextCoord = this.nextCoord;

        // clone reference types
        next.invalidCoords = new Set(this.invalidCoords);
        next.chosenCoords = new Set(this.chosenCoords);
        next.opponentBoard = this.opponentBoard.map((row) => row.slice());
        next.opponentFleet = this.opponentFleet.map((ship) =>
            ship.map((coord) => coord.slice()).slice(),
        );
        next.possibleDirections = this.possibleDirections.map((direction) =>
            direction.slice(),
        );
        next.currentTargetShip = this.currentTargetShip.map((coord) =>
            coord.slice(),
        );
        next.currentDirection = !this.currentDirection
            ? this.currentDirection
            : this.currentDirection.slice();

        return next;
    }

    resetNextCoordData(): void {
        this.nextCoord = null;
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

    currentTargetShipIsSunk(): boolean {
        if (!this.opponentFleet) {
            throw new Error("Must set opponentFleet property");
        }
        const currTarget = this.currentTargetShip;
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
            this.resetNextCoordData();
        }

        if (this.lastHitCoord === null) {
            const coord = this.getRandomCoord();
            this.takeShot(coord);
        } else {
            this.takeFocusedShot();
        }
    }

    handleShotIsOnTarget(coord: Array<number>): void {
        this.markHit(coord);
        this.lastHitCoord = coord;
        this.currentTargetShip.push(coord);
        console.debug(this.currentTargetShip);
    }

    takeShot(coord: Array<number>): void {
        if (this.shotIsOnTarget(coord)) {
            this.handleShotIsOnTarget(coord);
        } else {
            this.markMiss(coord);
        }
    }

    // target area HAS been found
    takeFocusedShot(): void {
        // currentDirection is already known
        if (this.currentDirection) {
            this.shootAlongCurrentDirection();
            return;
        }
        // currentDirection is not yet known
        this.shootAndSearchForDirection();
    }

    // if there is a current x or y direction to search along
    shootAlongCurrentDirection(): void {
        if (!this.currentDirection) {
            throw new Error(
                "Fn should not have been run: currentDirection property is null",
            );
        }
        if (!this.lastHitCoord) {
            throw new Error(
                "Fn should not have been run: lastHitCoord is null",
            );
        }

        const [cx, cy] = this.lastHitCoord;
        const [dx, dy] = this.currentDirection;
        const nextCoord = [cx + dx, cy + dy];
        this.takeShot(nextCoord);

        // HANDLE AFTER THE SHOT IS TAKEN
        // shooting at nextCoord sinks a ship
        // reset properties to default
        const shipSunk = this.currentTargetShipIsSunk();
        if (shipSunk) {
            return;
        }

        // shooting at nextCoord is a hit
        if (this.shotIsOnTarget(nextCoord)) {
            this.lastHitCoord = nextCoord;
        }

        // shooting at nextCoord is a miss
        // get the opposite side of the ship from the currentTargetShip array
        if (!this.shotIsOnTarget(nextCoord)) {
            // reverse the currentDirection
            for (let i = 0; i < this.currentDirection.length; i++) {
                if (this.currentDirection[i] === 1) {
                    this.currentDirection[i] = -1;
                }
                if (this.currentDirection[i] === -1) {
                    this.currentDirection[i] = 1;
                }
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

    shootAndSearchForDirection(): void {
        if (!this.lastHitCoord) {
            throw new Error(
                "Fn should not have been run: lastHitCoord property is null",
            );
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
        // finally, take the shot
        this.takeShot(nextCoord);
    }
}
