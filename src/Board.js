"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.Fleet = void 0;
var Fleet = /** @class */ (function () {
    function Fleet() {
        this.carriers = []; // ship length 5, expected 1
        this.battleships = []; // ship length 4, expected 2
        this.submarines = []; // ship length 3, expected 3
        this.destroyers = []; // ship length 2, expected 4
        this.invalid = []; // ship length < 2 || length > 5, expected 0
        this.mappedFleet = []; // flattened array of all ship coordinates
    }
    Fleet.prototype.addShip = function (ship) {
        var _this = this;
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
        ship.forEach(function (coord) { return _this.mappedFleet.push(coord); });
    };
    Fleet.prototype.clearFleet = function () {
        this.carriers = [];
        this.battleships = [];
        this.submarines = [];
        this.destroyers = [];
        this.invalid = [];
        this.mappedFleet = [];
    };
    Fleet.prototype.fleetIsValid = function () {
        return (this.carriers.length === 1 &&
            this.battleships.length === 2 &&
            this.submarines.length === 3 &&
            this.destroyers.length === 4 &&
            this.invalid.length === 0);
    };
    return Fleet;
}());
exports.Fleet = Fleet;
var Board = /** @class */ (function () {
    function Board(board) {
        if (board === void 0) { board = new Array(10)
            .fill(null)
            .map(function () { return new Array(10).fill(0); }); }
        this.board = board;
        this.fleet = new Fleet();
    }
    // helper function
    Board.prototype.coordToString = function (x, y) {
        return [x, y].toString();
    };
    Board.prototype.resetBoard = function () {
        this.board = new Array(10).fill(null).map(function () { return new Array(10).fill(0); });
        this.fleet.clearFleet();
    };
    Board.prototype.boardIsValid = function () {
        // bozo code // board should be validated other than checking fleet instance
        this.fleet.clearFleet();
        var takenSpaces = new Set();
        var invalidSpaces = new Set();
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                // chosen coords value is 1 // empty coords value is 0
                if (this.board[x][y] === 1) {
                    var stringCoord = [x, y].toString();
                    // coord has not yet been mapped to a ship
                    if (!takenSpaces.has(stringCoord)) {
                        if (invalidSpaces.has(stringCoord)) {
                            return false;
                        }
                        else {
                            var ship = this.mapShip(x, y, takenSpaces);
                            this.fleet.addShip(ship.coords);
                            this.mapInvalidSpaces(ship, invalidSpaces);
                        }
                    }
                }
            }
        }
        return this.fleet.fleetIsValid();
    };
    Board.prototype.mapInvalidSpaces = function (ship, invalidSpaces) {
        var invalidCoords = [];
        var _a = ship.direction, dx = _a[0], dy = _a[1];
        var _b = ship.coords[0], fx = _b[0], fy = _b[1];
        var _c = ship.coords[ship.coords.length - 1], lx = _c[0], ly = _c[1];
        var vertical = dx !== 0;
        if (vertical) {
            invalidCoords.push([fx - dx, fy - 1]);
            invalidCoords.push([fx - dx, fy + 0]);
            invalidCoords.push([fx - dx, fy + 1]);
            invalidCoords.push([lx + dx, fy - 1]);
            invalidCoords.push([lx + dx, fy + 0]);
            invalidCoords.push([lx + dx, fy + 1]);
        }
        else {
            invalidCoords.push([fx - 1, fy - dy]);
            invalidCoords.push([fx + 0, fy - dy]);
            invalidCoords.push([fx + 1, fy - dy]);
            invalidCoords.push([lx - 1, ly + dy]);
            invalidCoords.push([lx + 0, ly + dy]);
            invalidCoords.push([lx + 1, ly + dy]);
        }
        for (var i = 0; i < ship.coords.length; i++) {
            var _d = ship.coords[i], x = _d[0], y = _d[1];
            if (vertical) {
                invalidCoords.push([x, y + 1]);
                invalidCoords.push([x, y - 1]);
            }
            else {
                invalidCoords.push([x + 1, y]);
                invalidCoords.push([x - 1, y]);
            }
        }
        for (var _i = 0, invalidCoords_1 = invalidCoords; _i < invalidCoords_1.length; _i++) {
            var coord = invalidCoords_1[_i];
            invalidSpaces.add(this.coordToString(coord[0], coord[1]));
        }
    };
    Board.prototype.mapShip = function (x, y, takenSpaces) {
        var directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        var pathDir = directions[0];
        while (directions.length) {
            var _a = directions.shift(), dx_1 = _a[0], dy_1 = _a[1];
            var nx = x + dx_1;
            var ny = y + dy_1;
            if (this.board[nx] && this.board[nx][ny] === 1) {
                pathDir = [dx_1, dy_1];
            }
        }
        var ship = {
            coords: [],
            direction: pathDir,
        };
        var dx = pathDir[0], dy = pathDir[1];
        var mappingShip = true;
        do {
            if (this.board[x] && this.board[x][y] === 1) {
                ship.coords.push([x, y]);
                takenSpaces.add(this.coordToString(x, y));
                x += dx;
                y += dy;
            }
            else {
                mappingShip = false;
            }
        } while (mappingShip);
        return ship;
    };
    Board.prototype.generateRandomPlacement = function () {
        var validBoard = false;
        while (!validBoard) {
            this.resetBoard();
            var randomFleet = this.getRandomFleet();
            for (var _i = 0, randomFleet_1 = randomFleet; _i < randomFleet_1.length; _i++) {
                var coord = randomFleet_1[_i];
                this.board[coord[0]][coord[1]] = 1;
            }
            validBoard = this.boardIsValid();
        }
    };
    Board.prototype.getRandomFleet = function () {
        var _a, _b;
        var getRandomCoord = function () {
            return [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
        };
        var mappedFleet = [];
        var ships = [5, 4, 4, 3, 3, 3, 2, 2, 2, 2];
        var takenSpaces = new Set();
        var invalidSpaces = new Set();
        while (ships.length) {
            var shipLength = ships.shift();
            var tries = 0;
            var _c = getRandomCoord(), x = _c[0], y = _c[1];
            while (takenSpaces.has(this.coordToString(x, y)) ||
                invalidSpaces.has(this.coordToString(x, y))) {
                _a = getRandomCoord(), x = _a[0], y = _a[1];
                tries++;
                if (tries > 10)
                    break;
            }
            var placementFailures = 0;
            var ship = null;
            while (!ship && placementFailures < 5) {
                ship = this.createShip(shipLength, [x, y], takenSpaces, invalidSpaces);
                if (!ship) {
                    _b = getRandomCoord(), x = _b[0], y = _b[1];
                    placementFailures++;
                }
                else {
                    mappedFleet.push(ship);
                }
            }
        }
        return mappedFleet.flat();
    };
    // creates an array representing a ship if possible, otherwise returns null
    Board.prototype.createShip = function (shipLength, startCoord, takenSpaces, invalidSpaces) {
        var _this = this;
        var coordsAreValid = function (x, y) {
            var coordString = _this.coordToString(x, y);
            if (takenSpaces.has(coordString) ||
                invalidSpaces.has(coordString)) {
                return false;
            }
            if (x < 0 || y < 0 || x > 9 || y > 9) {
                return false;
            }
            return true;
        };
        var directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        var x = startCoord[0], y = startCoord[1];
        while (directions.length) {
            var randomIndex = Math.floor(Math.random() * directions.length);
            var _a = directions[randomIndex], dx = _a[0], dy = _a[1];
            directions.splice(randomIndex, 1);
            var ship = [];
            var nx = x + dx;
            var ny = y + dy;
            var createdLength = 0;
            var validCoord = true;
            while (createdLength < shipLength && validCoord) {
                if (!coordsAreValid(nx, ny)) {
                    validCoord = false;
                }
                else {
                    ship.push([nx, ny]);
                    nx += dx;
                    ny += dy;
                    createdLength++;
                    if (createdLength === shipLength) {
                        for (var _i = 0, ship_1 = ship; _i < ship_1.length; _i++) {
                            var coord = ship_1[_i];
                            takenSpaces.add(coord.toString());
                        }
                        this.mapInvalidSpaces({ coords: ship, direction: [dx, dy] }, invalidSpaces);
                        return ship;
                    }
                }
            }
        }
        return null;
    };
    return Board;
}());
exports.Board = Board;
