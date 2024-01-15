import React from "react";
import fighterJet from "../images/fighter-jet1.svg";
import diagonalLeftShip from "../images/diagonal-left-facing-ship.svg";
import diagonalRightShip from "../images/diagonal-right-facing-ship.svg";
import forwardShip from "../images/forward-facing-ship.svg";

export function StartMenu(): React.ReactElement {
    return (
        <div className="start-menu">
            <h1>BATTLESHIP</h1>
            <div className="radar">
                <div className="cutout"></div>
                <div className="inner1"></div>
                <div className="inner2"></div>
                <div className="inner3"></div>
                <div className="inner4"></div>
            </div>
            <div className="images-container">
                <img src={fighterJet} alt="" className="fighter-jet one" />
                <img src={fighterJet} alt="" className="fighter-jet two" />
                <img
                    src={diagonalLeftShip}
                    alt=""
                    className="diagonal-ship second"
                />
                <img
                    src={diagonalLeftShip}
                    alt=""
                    className="diagonal-ship first"
                />
                <img src={forwardShip} alt="" className="forward-ship" />
                <img
                    src={diagonalRightShip}
                    alt=""
                    className="diagonal-ship first"
                />
                <img
                    src={diagonalRightShip}
                    alt=""
                    className="diagonal-ship second"
                />
            </div>
            <div className="options-container">
                <div className="button-container">
                    <h3>Player Vs Computer</h3>
                    <button className="player-vs-cpu">
                        Play Against Computer
                    </button>
                </div>
                <div className="button-container">
                    <h3>Watch a random simulation of two AIs</h3>
                    <button className="player-vs-cpu">Simulation</button>
                </div>
            </div>
        </div>
    );
}
