import { getPositiveSortShip, getNegativeSortShip } from "../sortShipArray";

// helper functions for ComputerChooser class
describe("getPositiveSortShip()", () => {
    test("ship is sorted in ascending order based on 0th index", () => {
        const array = [
            [4, 3],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
        ];
        const sortedArray = getPositiveSortShip(array);
        expect(sortedArray).toEqual([
            [0, 3],
            [1, 3],
            [2, 3],
            [3, 3],
            [4, 3],
        ]);
    });
    test("ship is sorted in ascending order based on 0th index", () => {
        const array = [
            [4, 8],
            [4, 3],
            [4, 9],
            [4, 5],
        ];
        const sortedArray = getPositiveSortShip(array);
        expect(sortedArray).toEqual([
            [4, 3],
            [4, 5],
            [4, 8],
            [4, 9],
        ]);
    });
    test("ship is sorted in ascending order based on 1st index", () => {
        const array = [
            [1, 4],
            [1, 3],
            [1, 2],
            [1, 1],
            [1, 0],
        ];
        const sortedArray = getPositiveSortShip(array);
        expect(sortedArray).toEqual([
            [1, 0],
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
        ]);
    });
    test("ship is sorted in ascending order based on 1st index", () => {
        const array = [
            [3, 5],
            [3, 8],
            [3, 2],
            [3, 7],
        ];
        const sortedArray = getPositiveSortShip(array);
        expect(sortedArray).toEqual([
            [3, 2],
            [3, 5],
            [3, 7],
            [3, 8],
        ]);
    });
});

describe("negativeSortShip()", () => {
    test("ship is sorted in descending order based on 0th index", () => {
        const array = [
            [4, 3],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
        ];
        const sortedArray = getNegativeSortShip(array);
        expect(sortedArray).toEqual([
            [4, 3],
            [3, 3],
            [2, 3],
            [1, 3],
            [0, 3],
        ]);
    });
    test("ship is sorted in descending order based on 0th index", () => {
        const array = [
            [4, 8],
            [4, 3],
            [4, 9],
            [4, 5],
        ];
        const sortedArray = getNegativeSortShip(array);
        expect(sortedArray).toEqual([
            [4, 9],
            [4, 8],
            [4, 5],
            [4, 3],
        ]);
    });
    test("ship is sorted in descending order based on 1st index", () => {
        const array = [
            [1, 4],
            [1, 3],
            [1, 2],
            [1, 1],
            [1, 0],
        ];
        const sortedArray = getNegativeSortShip(array);
        expect(sortedArray).toEqual([
            [1, 4],
            [1, 3],
            [1, 2],
            [1, 1],
            [1, 0],
        ]);
    });
    test("ship is sorted in descending order based on 1st index", () => {
        const array = [
            [3, 5],
            [3, 8],
            [3, 2],
            [3, 7],
        ];
        const sortedArray = getNegativeSortShip(array);
        expect(sortedArray).toEqual([
            [3, 8],
            [3, 7],
            [3, 5],
            [3, 2],
        ]);
    });
});
