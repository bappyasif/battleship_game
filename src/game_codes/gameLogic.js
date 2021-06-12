let GameBoard = require('./gameBoard');
const Player = require('./player');
const Ship = require('./ship');

let game = () => {
    // main game loop and DOM interaction
    let human = Player('human', 7);
    let computer = Player('computer', 7);
    // creating human player battleship game board with a grid of 10X10
    let creatingHumanGameBoard = () => {
        // console.log(human, "!!")
        let gameBoard = GameBoard(human);
        let humanBoard = gameBoard.createGrids(10);
        // console.log(humanBoard);
        let board = document.querySelector('.human-board');
        if(board) board.append(humanBoard);
    }

    // creating computer player battleship game board with a grid of 10X10
    let creatingComputerGameBoard = () => {
        let gameBoard = GameBoard(computer);
        let computerBoard = gameBoard.createGrids(10);
        // console.log(computerBoard, "??");
        let board = document.querySelector('.computer-board');
        if(board) board.append(computerBoard);
    }

    // placing ships on game board for human player
    let humanFleets = () => {
        let i = 0;
        do{
            if(i === 0) {
                buildingShips('carrier');
            } else if(i === 1) {
                buildingShips('battleship');
            } else if(i === 2) {
                buildingShips('cruiser');
            } else if(i === 3) {
                buildingShips('submarine');
            } else if(i === 4) {
                buildingShips('destroyer');
            }
            // shipType = human.coordsGenerator('carrier');
            // shipPosition = shipType.carrier.shipCoords;
            // placingShip = GameBoard(human).placeShips(shipPosition);
            i++;
            // console.log(shipPosition, "{}")
        } while(i<7)
        // let shipType = human.coordsGenerator();
        // let shipPosition = shipType.carrier.shipCoords;
        // let placingShip = GameBoard(human).placeShips(shipPosition);
        // console.log(shipType, shipPosition, shipPosition[0], placingShip);
    }

    let buildingShips = (type) => {
        let shipType, shipPosition, placingShip;
        shipType = human.coordsGenerator(type);
        console.log(shipType);
        shipPosition = shipType[type].shipCoords;
        placingShip = GameBoard(human).placeShips(shipPosition);
    }

    return {
        creatingComputerGameBoard,
        creatingHumanGameBoard, 
        humanFleets
    }
}

module.exports = game;

/**
 * 
 * 
     // let human = Player('human', Board(Ship(["A", "4"], 2)));
    // let computer = Player('computer', Board(Ship(["B", "2"], 2)));
    // we'll have to manually take inputs from user to pass into Board for players
    // use functions that are implemented in other modules, before writing it in here intinctively
    // if(human.flagFleet || computer.flagFleet) {
    //     console.log('somebody won!!');
    // }
 */