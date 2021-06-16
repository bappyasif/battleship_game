let GameBoard = require('./gameBoard');
const Player = require('./player');
const Ship = require('./ship');

let game = () => {
    // main game loop and DOM interaction
    let human = Player('human', 5);
    let computer = Player('computer', 5);
    let ship = Ship();
    let gameBoard = GameBoard();
    let computerFleetShipsCoords = [];
    let humanFleetShipsCoords = [];
    // creating human player battleship game board with a grid of 10X10
    let creatingHumanGameBoard = () => {
        let gameBoard = GameBoard(human);
        let humanBoard = gameBoard.creatingGridsForHuman(10);
        let board = document.querySelector('.human-board');
        if(board) board.append(humanBoard);
    }

    // creating computer player battleship game board with a grid of 10X10
    let creatingComputerGameBoard = () => {
        let gameBoard = GameBoard(computer);
        let computerBoard = gameBoard.creatingGridsForComputer(10);
        let board = document.querySelector('.computer-board');
        if(board) board.append(computerBoard);
    }

    // placing ships on game board for human player
    let humanFleets = () => {
        let i = 0;
        do{
            buildingShips(i);
            i++;
        } while(i<5)
        let humanBoard = document.querySelector('.board-container');
        gameBoard.getCoordsFromClick(humanBoard);
    }

    let buildingShips = (idx) => {
        let board = document.querySelector('.board-container');

        let shipCoords = ship.coordsGenerator();
        
        gameBoard.humanCoords.push(shipCoords);
        
        GameBoard(human).placeShips(shipCoords, board);

        gameBoard.shipsHealth['human'+idx] = {coords: shipCoords, length: shipCoords.length};
    }

    let computerFleet = () => {
        let i = 0;
        while(i < 5) {
            computerShips(i);
            i++;
        }
        let board = document.querySelector('.board-container-for-computer');
        gameBoard.getCoordsFromClick(board);
    }

    let computerShips = (idx) => {
        let shipCoords = ship.coordsGenerator();

        let board = document.querySelector('.board-container-for-computer');

        gameBoard.computerCoords.push(shipCoords);

        GameBoard().placeShips(shipCoords, board);

        gameBoard.shipsHealth['computer'+idx] = {coords: shipCoords, length: shipCoords.length};
    }

    return {
        creatingComputerGameBoard,
        creatingHumanGameBoard, 
        humanFleets,
        computerFleet,
        computerFleetShipsCoords,
        humanFleetShipsCoords
    }
}

module.exports = game;