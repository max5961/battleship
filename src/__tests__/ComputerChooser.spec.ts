import { Board } from "../Board";
import { ComputerChooser } from "../ComputerChooser";
// ***including the first shot - carriers must be destroyed in:
//  // first hit is an start/end square: shots <= 8 && shots >=5
//  // first hit is in the middle: shots <=7 && shots >= 5
const carrierHorizontal = [
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
];
const carrierVertical = [
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
];

describe("ComputerChooser.currentTargetShipIsSunk", () => {
    test("Recognize when a ship is sunk", () => {
        const opponentBoard = new Board(carrierHorizontal);
        const cpu = new ComputerChooser();
        cpu.currentTargetShip = [
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
        ];
        cpu.opponentBoard = opponentBoard.board;
        cpu.opponentFleet = [
            [
                [1, 1],
                [1, 2],
                [1, 3],
                [1, 4],
                [1, 5],
            ],
            [
                [3, 1],
                [3, 2],
                [3, 3],
            ],
        ];
        const shipSunk: boolean = cpu.currentTargetShipIsSunk();
        expect(shipSunk).toBe(true);
    });
});

describe("ComputerChooser.takeTurn() - first shot is on target", () => {
    test("Sink horizontal carrier (5 sqs): shots <= 8 && shots >= 5", () => {
        const opponentBoard = new Board(carrierHorizontal);
        const firstShotCoord: Array<number> = [1, 1];

        const cpu = new ComputerChooser();
        cpu.opponentBoard = opponentBoard.board;
        cpu.opponentFleet = [
            [
                [1, 1],
                [1, 2],
                [1, 3],
                [1, 4],
                [1, 5],
            ],
        ];

        cpu.takeShot(firstShotCoord);
        let shots: number = 1;
        for (let i = 1; i < 10; i++) {
            cpu.takeTurn();
            shots++;
            const shipSunk = cpu.currentTargetShipIsSunk();
            if (shipSunk) break;
        }
        const efficientlySankShip: boolean = shots <= 8 && shots >= 5;
        console.log(shots);
        expect(efficientlySankShip).toBe(true);
    });
    // test("Sink vertical carrier (5 sqs): shots <=8 && shots >= 5", () => {
    //     const board = new Board(carrierVertical);
    //     const firstShotCoord: Array<number> = [1,1];
    // });
    // test("Sink horizontal carrier (5 sqs): shots <= 7 && shots >= 5", () => {
    //     const board = new Board(carrierHorizontal);
    //     const firstShotCoord: Array<number> = [1,3];
    // });
    // test("Sink vertical carrier (5 sqs): shots <=7 && shots >= 5", () => {
    //     const board = new Board(carrierVertical);
    //     const firstShotCoord: Array<number> = [3,1];
    // });
});
