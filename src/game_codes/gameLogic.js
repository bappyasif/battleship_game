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
        // console.log(human, "!!")
        let gameBoard = GameBoard(human);
        // let humanBoard = gameBoard.createGrids(10);
        let humanBoard = gameBoard.creatingGridsForHuman(10);
        // console.log(humanBoard);
        let board = document.querySelector('.human-board');
        if(board) board.append(humanBoard);
    }

    // creating computer player battleship game board with a grid of 10X10
    let creatingComputerGameBoard = () => {
        let gameBoard = GameBoard(computer);
        // let computerBoard = gameBoard.createGrids(10);
        let computerBoard = gameBoard.creatingGridsForComputer(10);
        // console.log(computerBoard, "??");
        let board = document.querySelector('.computer-board');
        if(board) board.append(computerBoard);
    }

    // let gridClicked = evt => console.log(evt.target);

    // placing ships on game board for human player
    let humanFleets = () => {
        let i = 0;
        do{
            buildingShips();
            i++;
        } while(i<5)
        // let computerBoard = document.querySelector('.board-container-for-computer');
        // computerBoard.addEventListener('click', gridClicked);
        // GameBoard().getCoordsFromClick();
        // gameBoard.getCoordsFromClick();
    }

    let buildingShips = () => {
        let board = document.querySelector('.board-container');
        let shipCoords = human.coordsGenerator();
        // let ship = Ship(shipCoords, shipCoords.length);
        // console.log('ship', ship)
        // GameBoard(human).placeShips(shipCoords)
        // computerFleetShipsCoords.push(shipCoords);
        // GameBoard().computerCoords.push(shipCoords);
        gameBoard.computerCoords.push(shipCoords);
        // console.log(gameBoard.computerCoords);
        GameBoard(human).placeShips(shipCoords, board);
    }

    let computerFleet = () => {
        let i = 0;
        while(i < 5) {
            computerShips(i);
            i++;
        }
        gameBoard.getCoordsFromClick();
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

/**
 * 
 * 
 let computerShips = () => {
        // console.log(ship.trackingShipsUniqueCoords,"<>", ship)
        let shipCoords = ship.coordsGenerator();
        // let shipCoords = computer.coordsGenerator();
        // console.log(shipCoords)
        let board = document.querySelector('.board-container-for-computer');
        // GameBoard().placeShips(shipCoords);
        // console.log(shipCoords, board, "is it!!")
        GameBoard().placeShips(shipCoords, board);
    }
 * 
 * 
 let humanFleets = () => {
        let i = 0;
        do{
            buildingShips();
            // if(i === 0) {
            //     buildingShips('carrier');
            // } else if(i === 1) {
            //     buildingShips('battleship');
            // } else if(i === 2) {
            //     buildingShips('cruiser');
            // } else if(i === 3) {
            //     buildingShips('submarine');
            // } else if(i === 4) {
            //     buildingShips('destroyer');
            // }
            i++;
        } while(i<5)
    }

    let buildingShips = (type) => {
        let board = document.querySelector('.board-container');
        let shipCoords = human.coordsGenerator();
        // GameBoard(human).placeShips(shipCoords)
        GameBoard(human).placeShips(shipCoords, board);
        // shipType = human.positionShips();
        // shipType = human.positionShip(type);
        // shipType = Ship().coordsGenerator();
        // console.log(shipType, "wat wat");
        // shipPosition = shipType[type].shipCoords;
        // shipPosition = shipType[type];
        // placingShip = GameBoard(human).placeShips(shipPosition);
    }
 * 
 * 
 let buildingShips = (type) => {
        let shipType, shipPosition, placingShip;
        shipType = human.coordsGenerator();
        // shipType = human.positionShips();
        // shipType = human.positionShip(type);
        // shipType = Ship().coordsGenerator();
        console.log(shipType);
        shipPosition = shipType[type].shipCoords;
        // shipPosition = shipType[type];
        placingShip = GameBoard(human).placeShips(shipPosition);
    }
 * 
 * 
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
            i++;
        } while(i<5)
    }

    let buildingShips = (type) => {
        let shipType, shipPosition, placingShip;
        // shipType = human.coordsGenerator();
        // shipType = human.positionShip(type);
        shipType = Ship().coordsGenerator();
        console.log(shipType);
        shipPosition = shipType[type].shipCoords;
        placingShip = GameBoard(human).placeShips(shipPosition);
    }
 * 
 * 
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