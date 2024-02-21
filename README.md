# Battleship
A battleship game written in React and Typescript, including testing with Jest.

This game also inspired me to write a C++ implementation as well.  I was
learning C++ around the same time as writing this game and thought this would be
a good opportunity to develop my understanding of the language.  Link to the C++
version [here](https://www.github.com/max5961)

#### A few of the motives I had for writing this game were:
- Experiment with more Object Oriented Programming principles.  Previous
  projects I had done didn't require much OOP.  Writing the core logic for this
  game gave me an opportunity to apply more OOP principles to my code which can
  be viewed in the src/Classes.ts file
- Gain more experience writing React
- Learn more about Jest and use testing to make sure the core logic of the game
  works as expected

## Screenshots

## Features of the game

#### Generate a random placement of ships
- gif of random placement

The ships cannot be placed in a way where any one of the ships is touching the edge of another ship.

A valid gameboard setup includes the following ships:
| name | amount | length |
|---|---|---|
| carrier | 1 | 5 squares|
| **** | 2 | 4 squares|
| **** | 3 | 3 squares|
| **** | 4 | 2 squares |

#### Play against an AI or watch two AIs play against each other (simulation mode)
The reason I decided to include this as a feature is that Battleship is an
inherently long game to play the entire way through.  With a simulation mode, it
allows the user to quickly get a quick feel for the game mechanics.  I also
thought it would give me an opportunity to create something fun and unique.

The following features are included:
- pause/start the simulation
- increase the speed at which the simulation runs
- go back to a previous turn


