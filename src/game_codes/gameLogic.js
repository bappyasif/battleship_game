let GameBoard = require('./gameBoard');
const Player = require('./player');
const Ship = require('./ship');

let game = () => {
    // main game loop and DOM interaction
    let human = Player('human', 5);
    let computer = Player('computer', 5);
    // let ship = Ship();
    let gameBoard = GameBoard();
    let computerFleetShipsCoords = [];
    let humanFleetShipsCoords = [];
    let combinedCoords = [];
    let flag = false;
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
        let ship =  Ship();
        do{
            // buildingShips(i);
            buildingShips(i, ship);
            i++;
        } while(i<5)
        let humanBoard = document.querySelector('.board-container');
        gameBoard.getCoordsFromClick(humanBoard);
    }

    let buildingShips = (idx, ship) => {
        let board = document.querySelector('.board-container');

        let shipCoords = ship.coordsGenerator();
        // let shipCoords = Ship().coordsGenerator();
        
        gameBoard.humanCoords.push(shipCoords);
        
        GameBoard(human).placeShips(shipCoords, board);

        gameBoard.shipsHealth['human'+idx] = {coords: shipCoords, length: shipCoords.length};

        // beginPlay(gameBoard.shipsHealth, null);
        // humanFleetShipsCoords.push(gameBoard.shipsHealth);
        // beginPlay(shipCoords);
        // combinedCoords.push(shipCoords);
        // beginPlay();
        // console.log(combinedCoords, "human")
        humanFleetShipsCoords.push(shipCoords);
    }

    let computerFleet = () => {
        let i = 0;
        let ship =  Ship();
        while(i < 5) {
            // computerShips(i);
            computerShips(i, ship);
            i++;
        }
        // let board = document.querySelector('.board-container-for-computer');
        // gameBoard.getCoordsFromClick(board);
    }

    let computerShips = (idx, ship) => {
        let shipCoords = ship.coordsGenerator();
        // let shipCoords = Ship().coordsGenerator();
        // console.log(shipCoords, "!!");

        let board = document.querySelector('.board-container-for-computer');

        gameBoard.computerCoords.push(shipCoords);

        GameBoard().placeShips(shipCoords, board);

        gameBoard.shipsHealth['computer'+idx] = {coords: shipCoords, length: shipCoords.length};

        // beginPlay(null,gameBoard.shipsHealth);
        // computerFleetShipsCoords.push(gameBoard.shipsHealth)
        // beginPlay(shipCoords);
        // combinedCoords.push(shipCoords);
        // beginPlay();
        // console.log(combinedCoords, "computer");
        computerFleetShipsCoords.push(shipCoords)
    }

    let re_arrange = () => {
        let btn = document.querySelector('.re-arrange');
        btn.addEventListener('click', reArrangeShipsFormations);
    }

    let reArrangeShipsFormations = (evt) => {
        // console.log(evt.target.className);
        let board = document.querySelector('.board-container');
        gameBoard.removingShipsFromBoard(board);
        setTimeout(()=>humanFleets(), 1001);
    }

    let beginPlay = () => {
        gameBoard.playersTurn();
    }

    return {
        creatingComputerGameBoard,
        creatingHumanGameBoard, 
        humanFleets,
        computerFleet,
        computerFleetShipsCoords,
        humanFleetShipsCoords,
        re_arrange,
        beginPlay
    }
}

module.exports = game;

/**
 * 
 * 
     let beginPlay = () => {
        let flag = false;
        let wait = true;
        for(let i=0; i<4; i++) {
            if(i%2!=0 && flag) {
                // computer turn
                board = document.querySelector('.board-container');
                gameBoard.getCoordsForComputer(board);
                flag = false;
            } else {
                // humans turn
                board = document.querySelector('.board-container-for-computer');
                gameBoard.getCoordsFromClick(board);
                while(gameBoard.playerTurnFlag) {
                    flag = true;
                }
            }
        }
    }
 * 
 * 
 let beginPlay = () => {
        let flag = false;
        let wait = true;
        for(let i=0; i<4; i++) {
            if(i%2!=0) {
                // computer turn
                while(flag && wait) {
                    board = document.querySelector('.board-container');
                    // gameBoard.getCoordsForComputer(board);
                    flag = false;
                    if(wait) {
                        gameBoard.getCoordsForComputer(board);
                        wait = false
                    }
                    // wait = false
                }
            } else {
                // humans turn
                while(!flag && !wait) {
                    board = document.querySelector('.board-container-for-computer');
                    gameBoard.getCoordsFromClick(board);
                    flag = true;
                    wait = true;
                }
            }
        }
    }
 * 
 * 
 let beginPlay = () => {
        let flag = false;
        // console.log(humanFleetShipsCoords, computerFleetShipsCoords);
        let board;
        let count = 0;
        while(count < 4) {
            if(!flag) {
                board = document.querySelector('.board-container-for-computer');
                gameBoard.getCoordsFromClick(board);
                flag = true;
                console.log(flag);
            } else {
                board = document.querySelector('.board-container');
                // when selecting coords from mouse click
                // gameBoard.getCoordsFromClick(board);
                // when randomly coords selected for computer
                gameBoard.getCoordsForComputer(board);
                flag = false;
                console.log(flag);
            }
            count++;
        }

    }
 */