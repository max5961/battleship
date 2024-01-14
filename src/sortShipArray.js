"use strict";
// helper functions for ComputerChooser class
// takes an array of ship coordinates and returns a sorted array
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNegativeSortShip = exports.getPositiveSortShip = void 0;
function getPositiveSortShip(inputArray) {
    var array = inputArray.slice();
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < array.length - 1; i++) {
            var left = array[i];
            var right = array[i + 1];
            if (left[0] > right[0] || left[1] > right[1]) {
                array[i] = right;
                array[i + 1] = left;
                swapped = true;
            }
        }
    } while (swapped);
    return array;
}
exports.getPositiveSortShip = getPositiveSortShip;
function getNegativeSortShip(inputArray) {
    var array = inputArray.slice();
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < array.length - 1; i++) {
            var left = array[i];
            var right = array[i + 1];
            if (left[0] < right[0] || left[1] < right[1]) {
                array[i] = right;
                array[i + 1] = left;
                swapped = true;
            }
        }
    } while (swapped);
    return array;
}
exports.getNegativeSortShip = getNegativeSortShip;
