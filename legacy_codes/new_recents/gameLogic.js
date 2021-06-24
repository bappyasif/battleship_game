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
        // let ship =  Ship();
        // gameBoard.humanCoords = [];
        // gameBoard.freshCoords();
        do{
            // buildingShips(i);
            buildingShips(i, ship);
            i++;
        } while(i<5)
        let humanBoard = document.querySelector('.board-container');
        gameBoard.getCoordsFromClick(humanBoard);
        // here it will show that humanCoords has it's value, but when starts to playing round, after first match, it shows empty, for some reason i can't comprehend why?
        console.log(gameBoard.humanCoords, 'humans')
        
        // even trying to use some sort of "fail-safe" to ensure that humanCoords get's correct value
        // gameBoard.humanCoords = humanFleetShipsCoords;  // doesn't help when click Play Again after a round
        // gameBoard.humanCoords = gameBoard.humanCoords;
    }

    let buildingShips = (idx, ship) => {
        let board = document.querySelector('.board-container');

        let shipCoords = ship.coordsGenerator();
        
        // gameBoard.humanCoords = [];
        // gameBoard.humanCoords.unshift();
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

        // trying another fail safe attempt for humanCoords
        // gameBoard.humanCoords = humanFleetShipsCoords; // still showing emtpy humanCoords, after first round
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
        // let board = document.querySelector('.board-container');
        // btn.addEventListener('click', (evt) => reArrangeHumanFleet(evt, board));
        btn.addEventListener('click', reArrangeHumanFleet);
    }

    let re_arrange_computer_fleets = () => {
        // let btn = document.querySelector('.re-arrange-computer-formation');
        let board = document.querySelector('.board-container-for-computer');
        // btn.addEventListener('click', (evt) => reArrangeComputerFleet(evt, board));
        // gameBoard.computerCoords = [];
        reArrangeComputerFleet(board);
    }

    let reArrangeHumanFleet = () => {
        removeHumanGameBoard();
        creatingHumanGameBoard();
        // gameBoard.humanCoords = [];
        
        // let board = document.querySelector('.board-container');
        // gameBoard.removingShipsFromBoard(board);
        
        setTimeout(()=>humanFleets(), 1001);
        console.log('human coords', gameBoard.humanCoords);
    }

    let reArrangeComputerFleet = (board) => {
        gameBoard.removingShipsFromBoard(board);
        if(board.className.contains = '-for-computer') {
            setTimeout(()=>computerFleet(), 1001);
        }
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

    let playAgain = () => {
        let playAgain = document.querySelector('.play-again');
        playAgain.addEventListener('click', startProcess)
    }

    let startProcess = () => {
        removeHumanGameBoard();
        removeComputerGameBoard();
        
        creatingComputerGameBoard();
        creatingHumanGameBoard();

        setTimeout(() => {
            humanFleets();
            computerFleet();
        }, 1001)
        beginPlay();
    }

    let updateCoordsForBoth = () => {
        // not making any difference when trying to play after a round?! still showing an emtpy array for humanCoords, even though it should be loaded with right coords as it's on gameBoard on human side
        gameBoard.humanCoords = humanFleetShipsCoords;
        // gameBoard.computerCoords
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

        // if(ready.computer) return true;
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

    let beginPlay = () => {
        let winner = document.querySelector('.winner');
        let playAgain = document.querySelector('.play-again');
        
        winner.style.display = 'none';
        playAgain.style.display = 'none';
        
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
        creatingHumanGameBoard();
        creatingComputerGameBoard();
        humanFleets();
        computerFleet();
        beginPlay();
        // gameBoard.playersTurn();
        // alert('game ready, your turn!!');
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
        playAgain,
        removeComputerGameBoard,
        removeHumanGameBoard,
        updateCoordsForBoth,
        startGame
    }
}

module.exports = game;