let GameBoard = require('./gameBoard');
const Player = require('./player');
const Ship = require('./ship');

let game = () => {
    // main game loop and DOM interaction
    let human = Player('human', 5);
    let computer = Player('computer', 5);
    let ship = Ship();
    let gameBoard = GameBoard();
    // let ship =  Ship();
    let computerFleetShipsCoords = [];
    let humanFleetShipsCoords = [];
    let combinedCoords = [];
    let flag = false;
    let ready = {};
    // creating human player battleship game board with a grid of 10X10
    let creatingHumanGameBoard = () => {
        let humanBoard = gameBoard.creatingGridsForHuman(10);
        let board = document.querySelector('.human-board');
        if(board) board.append(humanBoard);
    }

    // creating computer player battleship game board with a grid of 10X10
    let creatingComputerGameBoard = () => {
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
        console.log(gameBoard.humanCoords, 'humans')
    }

    let buildingShips = (idx, ship) => {
        let board = document.querySelector('.board-container');

        let shipCoords = ship.coordsGenerator();
        
        // gameBoard.humanCoords = [];
        gameBoard.humanCoords.push(shipCoords);
        
        // GameBoard(human).placeShips(shipCoords, board);
        gameBoard.placeShips(shipCoords, board);

        gameBoard.shipsHealth['human'+idx] = {coords: shipCoords, length: shipCoords.length, remainingLength: shipCoords.length};

        humanFleetShipsCoords.push(shipCoords);
    }

    let computerFleet = () => {
        let i = 0;
        let ship =  Ship();
        // gameBoard.computerCoords = [];
        while(i < 5) {
            // computerShips(i);
            computerShips(i, ship);
            i++;
        }
        // let board = document.querySelector('.board-container-for-computer');
        // gameBoard.getCoordsFromClick(board);
        console.log(gameBoard.computerCoords, 'computer')
    }

    let computerShips = (idx, ship) => {
        let shipCoords = ship.coordsGenerator();

        let board = document.querySelector('.board-container-for-computer');

        gameBoard.computerCoords.push(shipCoords);

        // GameBoard().placeShips(shipCoords, board);
        gameBoard.placeShips(shipCoords, board);

        gameBoard.shipsHealth['computer'+idx] = {coords: shipCoords, length: shipCoords.length, remainingLength: shipCoords.length};

        computerFleetShipsCoords.push(shipCoords)
    }

    let removeHumanGameBoard = () => {
        let humanBoard = document.querySelector('.board-container');
        humanBoard.remove();
        // this line was causing humanCoords to become empty?!
        // gameBoard.humanCoords = [];
    }

    let removeComputerGameBoard = () => {
        let computerBoard = document.querySelector('.board-container-for-computer');
        computerBoard.remove();
    }

    let waitComputerBeReady = () => {
        // let ready = {};
        let btn = document.querySelector('.re-arrange-computer-formation');
        let btnReady = document.querySelector('.computer-ready');

        // for computer we'll randomize thios process
        let rand = () => Math.random();
        setTimeout(() => {
            while(rand() > .5) {
                console.log("here!!")
                re_arrange_computer_fleets();
                ready.computer = true;
            }
            // btn.classList.add('unclickable', 'disabled-btn');
            // btnReady.classList.add('unclickable', 'disabled-btn');
            alert('computer ready!!')
        }, 2000)

        // if(ready.computer) return true;
    }

    let re_arrange_computer_fleets = () => {
     removeComputerGameBoard();
     creatingComputerGameBoard();
     computerFleet();
     beginPlay();
    }
    
    let computerReady = () => {
        let rand = () => Math.random();
        setTimeout(() => {
            while(rand() > .5) {
                // console.log("here!!")
                re_arrange_computer_fleets();
                // ready.computer = true;
            }
            alert('computer ready!!')
        }, 2000)
    }

    let humanPlayerBeReady = () => {
        let btn = document.querySelector('.re-arrange-human-formation');
        let btnReady = document.querySelector('.human-ready');
        btnReady.addEventListener('click', () => {
            btn.classList.add('unclickable', 'disabled-btn');
            btnReady.classList.add('unclickable', 'disabled-btn');
            ready.human = true;
        });
    }

    let reArrangeHumanFleet = () => {
        // let Game = game();
        // Game.removeHumanGameBoard();
        // Game.creatingHumanGameBoard();
        // Game.humanFleets();
        // Game.beginPlay();
        removeHumanGameBoard();
        creatingHumanGameBoard()
        humanFleets();
    }
    
    // let btn2 = document.querySelector('.re-arrange-human-formation');
    // btn2.addEventListener('click', reArrangeHumanFleet);

    let beginPlay = () => {
        let winner = document.querySelector('.winner');
        let playAgain = document.querySelector('.play-again');
        
        winner.style.display = 'none';
        playAgain.style.display = 'none';
        
        // computerReady();
        // let btn2 = document.querySelector('.re-arrange-human-formation');
        // btn2.addEventListener('click', reArrangeHumanFleet);
        gameBoard.playersTurn();
    }

    let startGame = () => {
        creatingHumanGameBoard();
        creatingComputerGameBoard();
        humanFleets();
        computerFleet();
        // waitComputerBeReady();
        beginPlay();
    }

    return {
        creatingComputerGameBoard,
        creatingHumanGameBoard, 
        humanFleets,
        computerFleet,
        computerFleetShipsCoords,
        humanFleetShipsCoords,
        beginPlay,
        removeComputerGameBoard,
        removeHumanGameBoard,
        startGame
    }
}

module.exports = game;