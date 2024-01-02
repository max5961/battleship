import { Board } from "./Board";
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
    const randomBoard = new Board();
    randomBoard.generateRandomPlacement();

    const [playerBoard, setPlayerBoard] = useState<Array<Array<number>>>(
        randomBoard.board,
    );
    const [boardIsPlaced, setBoardIsPlaced] = useState<boolean>(false);

    return (
        <div id="game">
            <div className="game-board computer"></div>
            <PlayerBoard
                playerBoard={playerBoard}
                setPlayerBoard={setPlayerBoard}
                boardIsPlaced={boardIsPlaced}
            />
            <div className="sidebar">
                <button
                    className="validate-board"
                    onClick={() => setBoardIsPlaced(true)}
                >
                    Validate Board
                </button>
                <button className="reset-placement">Reset</button>
                <div className="ships-container"></div>
            </div>
        </div>
    );
}

interface PlayerBoardProps {
    playerBoard: Array<Array<number>>;
    setPlayerBoard: (newBoard: Array<Array<number>>) => void;
    boardIsPlaced: boolean;
}
function PlayerBoard({
    playerBoard,
    setPlayerBoard,
    boardIsPlaced,
}: PlayerBoardProps): React.ReactElement {
    function handleSquareClick(key: string): void {
        if (!boardIsPlaced) {
            const [yIndex, xIndex] = key.split(",");
            const nextBoard = playerBoard.slice();

            let currNumber = nextBoard[yIndex][xIndex];
            currNumber ? (currNumber = 0) : (currNumber = 1);
            nextBoard[yIndex][xIndex] = currNumber;
            setPlayerBoard(nextBoard);
        } else {
            return;
        }
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
                                id={key}
                                className={className}
                                onClick={() => handleSquareClick(key)}
                            />
                        );
                    } else if (square === 1) {
                        const className = "square taken";
                        return (
                            <Square
                                key={key}
                                id={key}
                                className={className}
                                onClick={() => handleSquareClick(key)}
                            />
                        );
                    } else {
                        // square === 2
                        const className = "square damaged";
                        return (
                            <Square
                                key={key}
                                id={key}
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
    id: string;
    className: string;
    onClick: () => void;
}
function Square({ id, className, onClick }: SquareProps): React.ReactElement {
    return <div id={id} className={className} onClick={onClick}></div>;
}
