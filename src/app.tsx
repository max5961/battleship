import { Board, RandomBoard } from "./Classes";
import { cloneDeep } from "lodash";
import React from "react";
import { useState } from "react";
import { StartMenu } from "./pages/start-menu";

export default function App(): React.ReactElement {
    return (
        <>
            <StartMenu />
        </>
    );
}

function Game(): React.ReactElement {
    const board: RandomBoard = new RandomBoard();
    const [playerBoard, setPlayerBoard] = useState<Board>(board);
    const [boardIsPlaced, setBoardIsPlaced] = useState<boolean>(false);

    function handleResetClick(): void {
        setPlayerBoard(new RandomBoard());
    }

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
                <button
                    className="reset-placement"
                    onClick={() => handleResetClick()}
                >
                    Reset
                </button>
                <div className="ships-container"></div>
            </div>
        </div>
    );
}

interface PlayerBoardProps {
    playerBoard: Board;
    setPlayerBoard: (newBoard: Board) => void;
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
            const nextBoard: Board = cloneDeep(playerBoard);

            let currNumber = nextBoard.grid[yIndex][xIndex];
            currNumber ? (currNumber = 0) : (currNumber = 1);
            nextBoard.grid[yIndex][xIndex] = currNumber;
            setPlayerBoard(nextBoard);
        } else {
            return;
        }
    }

    function getComponentSquares(): Array<React.ReactElement> {
        return playerBoard.grid
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
