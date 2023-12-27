import React from "react";
import { useState } from "react";

export default function App(): React.ReactElement {
    return (
        <>
            <Game />
        </>
    );
}

function Game(): React.ReactElement {
    const [playerBoard, setPlayerBoard] = useState<Array<Array<number>>>(
        new Array(10).fill(null).map(() => new Array(10).fill(0)),
    );

    return (
        <div id="game">
            <div className="game-board computer"></div>
            <PlayerBoard
                playerBoard={playerBoard}
                setPlayerBoard={setPlayerBoard}
            />
            <div className="sidebar">
                <button className="random-placement">Random Placement</button>
                <button className="reset-placement">Reset</button>
                <div className="ships-container"></div>
            </div>
        </div>
    );
}

interface PlayerBoardProps {
    playerBoard: Array<Array<number>>;
    setPlayerBoard: (newBoard: Array<Array<number>>) => void;
}
function PlayerBoard({
    playerBoard,
    setPlayerBoard,
}: PlayerBoardProps): React.ReactElement {
    function handleSquareClick(key: string): void {
        const [yIndex, xIndex] = key.split(",");
        const nextBoard = playerBoard.slice();

        let currNumber = nextBoard[yIndex][xIndex];
        currNumber ? (currNumber = 0) : (currNumber = 1);
        nextBoard[yIndex][xIndex] = currNumber;
        setPlayerBoard(nextBoard);
    }

    function getComponentSquares(): Array<React.ReactElement> {
        return playerBoard
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

    return <div className="game-board player">{getComponentSquares()}</div>;
}

interface SquareProps {
    key: string;
    className: string;
    onClick: () => void;
}
function Square({ key, className, onClick }: SquareProps): React.ReactElement {
    return <div key={key} className={className} onClick={onClick}></div>;
}
