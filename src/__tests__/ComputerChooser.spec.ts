import { cloneDeep } from "lodash";
import { ComputerChooser } from "../ComputerChooser";
// ***including the first shot on target, carriers must be destroyed in: shots <= 8 && shots >=5
interface TestEfficientSink {
    opponentBoard: Array<Array<number>>;
    opponentFleet: Array<Array<Array<number>>>;
    startCoord: Array<number>;
    endCoord: Array<number>;
}
const carrierHorizontal: TestEfficientSink = {
    opponentBoard: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    opponentFleet: [
        [ [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], ],
    ], // prettier-ignore
    startCoord: [1, 1],
    endCoord: [1, 5],
};
const carrierVertical: TestEfficientSink = {
    opponentBoard: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    opponentFleet: [
        [ [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], ],
    ], // prettier-ignore
    startCoord: [1, 1],
    endCoord: [5, 1],
};
const carrierEdgeHorizontal: TestEfficientSink = {
    opponentBoard: [
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    opponentFleet: [
        [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], ],
    ], // prettier-ignore
    startCoord: [0, 0],
    endCoord: [0, 4],
};

describe("ComputerChooser.currentTargetShipIsSunk", () => {
    test("Recognize when a ship is sunk", () => {
        const cpu = new ComputerChooser();
        cpu.currentTargetShip = [ [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], ]; // prettier-ignore
        cpu.opponentBoard = carrierHorizontal.opponentBoard;
        cpu.opponentFleet = carrierHorizontal.opponentFleet;
        const shipSunk: boolean = cpu.currentTargetShipIsSunk();
        expect(shipSunk).toBe(true);
    });
});

describe("ComputerChooser.takeTurn() - first shot is on target", () => {
    test.each([
        // Test 1: carrier horizontal, start at beginning of ship
        [
            cloneDeep(carrierHorizontal.opponentBoard),
            cloneDeep(carrierHorizontal.opponentFleet),
            carrierHorizontal.startCoord,
        ],
        // Test 2: carrier vertical, start at beginning of ship
        [
            cloneDeep(carrierVertical.opponentBoard),
            cloneDeep(carrierVertical.opponentFleet),
            carrierVertical.startCoord,
        ],
        // Test 3: carrier horizontal, start at end of ship
        [
            cloneDeep(carrierHorizontal.opponentBoard),
            cloneDeep(carrierHorizontal.opponentFleet),
            carrierHorizontal.endCoord,
        ],
        // Test 4: carrier vertical, start at end of ship
        [
            cloneDeep(carrierVertical.opponentBoard),
            cloneDeep(carrierVertical.opponentFleet),
            carrierVertical.endCoord,
        ],
        // Test 5: carrier horizontal, start in middle of ship
        [
            cloneDeep(carrierHorizontal.opponentBoard),
            cloneDeep(carrierHorizontal.opponentFleet),
            [1, 3],
        ],
        // Test 6: carrier horizontal, start in middle of ship
        [
            cloneDeep(carrierHorizontal.opponentBoard),
            cloneDeep(carrierHorizontal.opponentFleet),
            [1, 4],
        ],
        // Test 7: carrier horizontal, start in middle of ship
        [
            cloneDeep(carrierHorizontal.opponentBoard),
            cloneDeep(carrierHorizontal.opponentFleet),
            [1, 2],
        ],
        // Test 8: carrier vertical, start in middle of ship
        [
            cloneDeep(carrierVertical.opponentBoard),
            cloneDeep(carrierVertical.opponentFleet),
            [3, 1],
        ],
        // Test 9: carrier vertical, start in middle of ship
        [
            cloneDeep(carrierVertical.opponentBoard),
            cloneDeep(carrierVertical.opponentFleet),
            [4, 1],
        ],
        // Test 10: carrier vertical, start in middle of ship
        [
            cloneDeep(carrierVertical.opponentBoard),
            cloneDeep(carrierVertical.opponentFleet),
            [2, 1],
        ],
        // Test 11: carrier horizontal on edge, start beginning
        [
            cloneDeep(carrierEdgeHorizontal.opponentBoard),
            cloneDeep(carrierEdgeHorizontal.opponentFleet),
            carrierEdgeHorizontal.startCoord,
        ],
        // Test 12: carrier horizontal on edge, start end
        [
            cloneDeep(carrierEdgeHorizontal.opponentBoard),
            cloneDeep(carrierEdgeHorizontal.opponentFleet),
            carrierEdgeHorizontal.endCoord,
        ],
        // Test 13: carrier horizontal on edge, start middle
        [
            cloneDeep(carrierEdgeHorizontal.opponentBoard),
            cloneDeep(carrierEdgeHorizontal.opponentFleet),
            [0, 2],
        ],
    ])("efficiently sink ship", (opponentBoard, opponentFleet, firstShot) => {
        const cpu = new ComputerChooser();
        cpu.opponentBoard = opponentBoard;
        cpu.opponentFleet = opponentFleet;

        cpu.takeShot(firstShot);
        let shots: number = 1;
        for (let i = 0; i < 10; i++) {
            cpu.takeTurn();
            shots++;
            const shipSunk = cpu.currentTargetShipIsSunk();
            if (shipSunk) break;
        }
        const efficientlySankShip = shots <= 8 && shots >= 5;
        expect(efficientlySankShip).toBe(true);
    });
});
