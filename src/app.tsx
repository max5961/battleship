import React from "react";
import { useState } from "react";

interface SquareProps {
    className: string;
    onClick: () => void;
}
function Square({ className, onClick }: SquareProps): React.ReactElement {
    return <div className={className} onClick={onClick}></div>;
}

function GameContainer(): React.ReactElement {
    const board: Array<Array<number>> = new Array(10)
        .fill(null)
        .map(() => new Array(10).fill(0));

    const [currBoard, setCurrBoard] = useState<Array<Array<number>>>(
        board.slice(),
    );

    function handleSquareClick(key: string): void {
        const [yIndex, xIndex] = key.split(",");
        const nextBoard = currBoard.slice();

        let currNumber = nextBoard[yIndex][xIndex];
        currNumber ? (currNumber = 0) : (currNumber = 1);
        nextBoard[yIndex][xIndex] = currNumber;
        setCurrBoard(nextBoard);
    }

    function getComponentSquares(): Array<React.ReactElement> {
        return currBoard
            .map((row, yIndex) => {
                return row.map((square, xIndex) => {
                    const key: string = `${yIndex},${xIndex}`;
                    if (square === 0) {
                        const className = "square";
                        return (
                            <Square
                                key={key}
                                className={className}
                                onClick={() => handleSquareClick(key)}
                            />
                        );
                    } else {
                        const className = "square taken";
                        return (
                            <Square
                                key={key}
                                className={className}
                                onClick={() => handleSquareClick(key)}
                            />
                        );
                    }
                });
            })
            .flat();
    }

    return (
        <div id="game-container">
            <div className="game-board computer"></div>
            <div className="game-board player">{getComponentSquares()}</div>
            <div className="sidebar">
                <button className="random-placement">Random Placement</button>
                <button className="reset-placement">Reset</button>
                <div className="ships-container"></div>
            </div>
        </div>
    );
}

export default function App(): React.ReactElement {
    return (
        <>
            <GameContainer />
        </>
    );
}
