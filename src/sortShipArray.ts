// helper functions for ComputerChooser class
// takes an array of ship coordinates and returns a sorted array

export function positiveSortShip(
    inputArray: Array<Array<number>>,
): Array<Array<number>> {
    const array = inputArray.slice();
    let swapped: boolean;
    do {
        swapped = false;
        for (let i = 0; i < array.length - 1; i++) {
            const left = array[i];
            const right = array[i + 1];
            if (left[0] > right[0] || left[1] > right[1]) {
                array[i] = right;
                array[i + 1] = left;
                swapped = true;
            }
        }
    } while (swapped);

    return array;
}

export function negativeSortShip(
    inputArray: Array<Array<number>>,
): Array<Array<number>> {
    const array = inputArray.slice();
    let swapped: boolean;
    do {
        swapped = false;
        for (let i = 0; i < array.length - 1; i++) {
            const left = array[i];
            const right = array[i + 1];
            if (left[0] < right[0] || left[1] < right[1]) {
                array[i] = right;
                array[i + 1] = left;
                swapped = true;
            }
        }
    } while (swapped);

    return array;
}
