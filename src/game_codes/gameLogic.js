let GameBoard = require('./gameBoard');
const Player = require('./player');
const Ship = require('./ship');

let game = () => {
    // main game loop and DOM interaction
    let human = Player('human');
    let computer = Player('computer');
    // creating human player battleship game board with fixed positions
    let creatingHumanGameBoard = () => {
        // console.log(human, "!!")
        let gameBoard = GameBoard(human);
        let humanBoard = gameBoard.createGrids(10);
        // console.log(humanBoard);
        let board = document.querySelector('.human-board');
        if(board) board.append(humanBoard);
    }

    let creatingComputerGameBoard = () => {
        let gameBoard = GameBoard(computer);
        let computerBoard = gameBoard.createGrids(10);
        // console.log(computerBoard, "??");
        let board = document.querySelector('.computer-board');
        if(board) board.append(computerBoard);
    }

    return {
        creatingComputerGameBoard,
        creatingHumanGameBoard
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