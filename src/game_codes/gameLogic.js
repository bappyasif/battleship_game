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
    let ready = {};
    // creating human player battleship game board with a grid of 10X10
    let creatingHumanGameBoard = () => {
        // let gameBoard = GameBoard(human);
        let humanBoard = gameBoard.creatingGridsForHuman(10);
        let board = document.querySelector('.human-board');
        if(board) board.append(humanBoard);
    }

    // creating computer player battleship game board with a grid of 10X10
    let creatingComputerGameBoard = () => {
        // let gameBoard = GameBoard(computer);
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
        
        gameBoard.humanCoords.push(shipCoords);
        
        // GameBoard(human).placeShips(shipCoords, board);
        gameBoard.placeShips(shipCoords, board);

        gameBoard.shipsHealth['human'+idx] = {coords: shipCoords, length: shipCoords.length, remainingLength: shipCoords.length};

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

        let board = document.querySelector('.board-container-for-computer');

        gameBoard.computerCoords.push(shipCoords);

        // GameBoard().placeShips(shipCoords, board);
        gameBoard.placeShips(shipCoords, board);

        gameBoard.shipsHealth['computer'+idx] = {coords: shipCoords, length: shipCoords.length, remainingLength: shipCoords.length};

        computerFleetShipsCoords.push(shipCoords)
    }

    let re_arrange_human_fleets = () => {
        let btn = document.querySelector('.re-arrange-human-formation');
        let board = document.querySelector('.board-container');
        btn.addEventListener('click', (evt) => reArrangeHumanFleet(evt, board));
    }

    let re_arrange_computer_fleets = () => {
        // let btn = document.querySelector('.re-arrange-computer-formation');
        let board = document.querySelector('.board-container-for-computer');
        // btn.addEventListener('click', (evt) => reArrangeComputerFleet(evt, board));
        // gameBoard.computerCoords = [];
        reArrangeComputerFleet(board);
    }

    let reArrangeHumanFleet = (avt, board) => {
        gameBoard.removingShipsFromBoard(board);
        setTimeout(()=>humanFleets(), 1001);
    }

    let reArrangeComputerFleet = (board) => {
        gameBoard.removingShipsFromBoard(board);
        if(board.className.contains = '-for-computer') {
            setTimeout(()=>computerFleet(), 1001);
        }
    }

    let playAgain = () => {
    let humanBoard = document.querySelector('.board-container');
    let computerBoard = document.querySelector('.board-container-for-computer');
    gameBoard.removingShipsFromBoard(humanBoard);
    gameBoard.removingShipsFromBoard(computerBoard);
    // gameBoard.humanCoords = [];
    // gameBoard.computerCoords = [];
    creatingComputerGameBoard();
    creatingHumanGameBoard();
    humanFleets();
    computerFleet();
    beginPlay();
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
            btn.classList.add('unclickable', 'disabled-btn');
            btnReady.classList.add('unclickable', 'disabled-btn');
            alert('computer ready!!')
        }, 2000)

        if(ready.computer) return true;
    }

    let humanPlayerBeReady = () => {
        let btn = document.querySelector('.re-arrange-human-formation');
        let btnReady = document.querySelector('.human-ready');
        btnReady.addEventListener('click', () => {
            btn.classList.add('unclickable', 'disabled-btn');
            btnReady.classList.add('unclickable', 'disabled-btn');
            ready.human = true;
            
            // game starts when human player is ready
            // gameBoard.playersTurn();
            // startGame();
            // return true;
        });
    }

    let beginPlay = () => {
        gameBoard.playersTurn();
        // waitComputerBeReady();
        // humanPlayerBeReady();
        // startGame()
        // console.log(ready)
        // if(ready.human && ready.computer) {
        //     // gameBoard.playersTurn();
        //     console.log("here!!")
        //     // startGame();
        // } 
        // else {
        //     // beginPlay()
        // }
        // console.log(ready, "??", readyHuman)
        
    }

    let startGame = () => {
        // gameBoard.playersTurn();
        alert('game ready, your turn!!');
        // gameBoard.playersTurn();
    }

    return {
        creatingComputerGameBoard,
        creatingHumanGameBoard, 
        humanFleets,
        computerFleet,
        computerFleetShipsCoords,
        humanFleetShipsCoords,
        re_arrange_human_fleets,
        re_arrange_computer_fleets,
        beginPlay,
        playAgain
    }
}

module.exports = game;

/**
 * 
 * 
 let waitPlayersBeReady = () => {
        let ready = {}
        // for human we'll prompt and accept y or n
        setTimeout(() => {
            let ans = prompt('you ready to play?', "y");
            if(ans == 'y' || 'Y' || 'yes' || 'YES' || 'Yes') {
                ready.human = true;
            }
        }, 2000)

        // for computer we'll randomize thios process
        let rand = () => Math.random();
        if(rand() > .5) {
            reArrangeComputerFleet();
            ready.computer = true;
        } else {
            rand();
        }

        if(ready.computer && ready.human) return true;
    }
 * 
 * 
 // let reArrangeShipsFormations = (evt, board) => {
    //     // console.log(evt.target.className);
    //     // for human
    //     let board = document.querySelector('.board-container');
    //     gameBoard.removingShipsFromBoard(board);
    //     setTimeout(()=>humanFleets(), 1001);
    //     // for computer
    //     board = document.querySelector('.board-container-for-computer');
    //     gameBoard.removingShipsFromBoard(board);
    //     setTimeout(()=>computerFleet(), 1001);
    // }
 */