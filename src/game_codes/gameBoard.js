// let Ship = require('./battleShip');

const Game = require("./gameLogic");
const Ship = require("./ship");

function GameBoard(player) {
    let dummyCoords = ["A","4"];
    // gameboard should be able to place ships at specific coordinates by calling ship factory function
    let currentShip = Ship(["A", "4"], 2);
    let loggingMissFiredShots = [];
    let grids;
    let loggingHits = [];
    let computerCoords = [];
    let humanCoords = [];
    let playerTurnFlag = false;
    let filtered;

    // let commenceAttack = ship(coords);
    let shipsHealth = {}

    let recieveAttacks = coords => {
        // let [a, d] = coords;
        // let attackStatus = Ship(coords);
        // let checkAttack = commenceAttack.checkHitOrMiss(coords);
        let checkAttack = currentShip.checkHitOrMiss(coords);
        // console.log("<?", checkAttack)
        // let shipsHealth = {}
        if(checkAttack) {
            // commenceAttack.hit(coords);
            currentShip.hit(coords);
            // console.log("<..>")
        } else {
            // commenceAttack.missFired(coords);
            currentShip.missFired(coords);
            // loggingMissFiredShots.push(currentShip.logShots);
            loggingMissFiredShots.push(coords);
            // console.log("<>", loggingMissFiredShots, coords)
            return loggingMissFiredShots;
        }
    }

    let placeShips = (coords, board) => {
        if(board) {
            Array.from(board.children).forEach((grid) => {
                let idx = 0;
                do {
                    if(grid.value[0] === coords[idx][0] && grid.value[1] == coords[idx][1]) {
                        grid.className = 'ship-placed';
                    }
                    idx++;
                } while(idx < coords.length);
            })
        }
    }

    let getCoordsFromClick = (board) => {
        if(board) {
            board.addEventListener('click', gridClicked);
        }
    }

    let getCoordsForComputer = (board) => {
        let [alph, num] = Ship().randomCoords();
        let checkCoords = [alph, num];
        let checkSide = board.parentNode.className
        let found;
        if(checkSide == 'human-board') {
            found = checkHumanCoordsMatched(checkCoords, checkSide);
            whichShipMods(checkCoords, humanCoords, checkSide);

            // found = checkComputerCoordsMatched(checkCoords, checkSide);
            // whichShipMods(checkCoords, computerCoords, checkSide);
        }
        if(found) {
            markShipBeingHit(checkCoords, checkSide);
        } else {
            loggingMissFiredShots.push({computer: checkCoords});
            missHits(checkCoords, checkSide)
        }
        // console.log(found, checkCoords, checkSide)
    }

    let playersTurn = () => {
        let test = document.querySelector('.board-container-for-computer');
        let flag = true;
        test.addEventListener('click', (evt) => {
            if(flag) {
                // alert('player 2');
                let board = document.querySelector('.board-container-for-computer');
                // getCoordsFromClick(board);
                gridClicked(evt);
                flag = false;
            }
            // alert('player 1');
            let board = document.querySelector('.board-container');
            getCoordsForComputer(board);
            flag = true;
        })
    }

    let gridClicked = (evt) => {
        let checkCoords = evt.target.value;
        let checkSide = evt.target.parentNode.parentNode.className;
        let found;
        if(checkSide == 'computer-board') {
            // found = checkHumanCoordsMatched(checkCoords, checkSide);
            // whichShipMods(checkCoords, humanCoords, checkSide);

            found = checkComputerCoordsMatched(checkCoords, checkSide);
            whichShipMods(checkCoords, computerCoords, checkSide);
            playerTurnFlag = true;
            // console.log("here!!")
        } 
        // else {
        //     found = checkComputerCoordsMatched(checkCoords, checkSide);
        //     whichShipMods(checkCoords, computerCoords, checkSide);
        // }
        if(found) {
            markShipBeingHit(checkCoords, checkSide);
        } else {
            loggingMissFiredShots.push({human: checkCoords});
            missHits(checkCoords, checkSide)
        }
        // playerTurnFlag = true;
        // console.log("here!!", playerTurnFlag)
    }

    let whichShipMods = (coords, coordsArr, checkSide) => {
        let check = coordsArr.map(arr => {
            if(coords != undefined) {
                return arr.some(cr => cr[0] == coords[0] && cr[1] == coords[1] ? true : false);
            }
        }).indexOf(true);
        if(check !== -1) {
            keepingTrackOfShips(check, checkSide);
        }
    }

    let checkHumanCoordsMatched = coords => {
        let found;
        if(coords != undefined) {
            found = humanCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        }
        return found;
    }

    let checkComputerCoordsMatched = (coords, checkSide) => {
        let found
        if(coords != undefined) {
            found = computerCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        }
        return found;
    }

    let keepingTrackOfShips = (idx, side) => {
        if(side == 'human-board') {
            findingShipForAdjustingItsHealth(idx, 'human');
        } else {
            findingShipForAdjustingItsHealth(idx, 'computer');
        }
    }

    let findingShipForAdjustingItsHealth = (idx, whichPlayer) => {
        let test;
        for(let key in shipsHealth) {
            if(key === whichPlayer+idx) {
                shipsHealth[key].length--;
                if(shipsHealth[key].length == 0) {
                    shipSankedMods(whichPlayer, shipsHealth[key], idx)
                    delete shipsHealth[key];
                }
            }
        }
    }

    let missHits = (coords, whichSide) => {
        // console.log(coords, whichSide, "misshits!!")
        let board = returnAnyGameBoard(whichSide);
        // console.log('misshits', loggingMissFiredShots);
        checkMissedCoordsAlreadyBeenVisited(coords, whichSide);
        markingMissesOnBoard(board, coords)
    }

    let checkMissedCoordsAlreadyBeenVisited = (coords, whichSide) => {
        // console.log('misshits', loggingMissFiredShots, coords, whichSide);
        
        if(whichSide.includes('computer-')) {
            // console.log('misshitsOnHumanSide', coords, whichSide);
            filtered = returnFilteredMissedCoords('human');
        } else {
            console.log('misshitsOnComputerSide', coords, whichSide, loggingMissFiredShots);
            filtered = returnFilteredMissedCoords('computer');
        }
        console.log(filtered, "filtered")
    }

    let returnFilteredMissedCoords = (whichSide) => {
        let filtered = [];
        loggingMissFiredShots.forEach(logs => {
            let keys = Object.keys(logs);
            console.log(keys);
            if(keys.includes(whichSide)) {
                filtered.push(logs[keys]);
            }
        })
        return filtered;
    }

    let returnAnyGameBoard = (whichSide) => {
        let board;
        if(whichSide.split("-")[0] == 'human') {
            board = document.querySelector('.board-container');
        } else {
            board = document.querySelector('.board-container-for-computer');
        }
        return board;
    }

    let markingMissesOnBoard = (board, coords) => {
        if(board) { 
            Array.from(board.children).forEach(grid => {
                if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    grid.textContent = "O";
                    grid.classList.add("unclickable", "ship-hitted");
                }
            });
        }
    }

    let markShipBeingHit = (coords, whichSide) => {
        let board = returnAnyGameBoard(whichSide);
        // if(whichSide.split("-")[0] == 'human') {
        //     board = document.querySelector('.board-container');
        // } else {
        //     board = document.querySelector('.board-container-for-computer');
        // }
        
        if(board) { 
            Array.from(board.children).forEach((grid, idx) => {
                if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    grid.textContent = "X";
                    grid.classList.add("unclickable", "ship-hitted");
                }
            });
        }
    }

    let shipSankedMods = (whichPlayer, whichShip, idx) => {
        let board;
        if(whichPlayer == 'human') {
            board = document.querySelector('.board-container');
        } else {
            board = document.querySelector('.board-container-for-computer');
        }
        disablingShipOnBoard(whichShip, idx, board);
    }

    let disablingShipOnBoard = (ship, idx, board) => {
        console.log("ship sanked mods", ship, idx, board)
        if(board) {
            Array.from(board.children).forEach(grid => {
               ship.coords.forEach(coords => {
                   if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    // grid.className = 'board-grids';
                    grid.classList.add('unclickable');
                   }
               })
               return;
            })
            updateExistingShipCoords(idx, board.parentNode.className);
        }
    }

    let updateExistingShipCoords = (idx, whichSideShipCoords) => {
        let filteredHumanShips = [];
        let filteredComputerShips = [];
        if(whichSideShipCoords.split("-")[0] == 'human') {
            for(let i=0; i<humanCoords.length; i++) {
                if(i!=idx) {
                    filteredHumanShips.push(humanCoords[i]);
                } 
            }
            humanCoords = filteredHumanShips;
        } else {
            for(let i=0; i<computerCoords.length; i++) {
                if(i!=idx) {
                    filteredComputerShips.push(computerCoords[i]);
                } 
            }
            computerCoords = filteredComputerShips;       
        }
    }

    let removingShipsFromBoard = (board) => {
        // console.log(board);
        Array.from(board.children).forEach(grid => {
            grid.className = 'board-grids';
        });
    }

    let checkAllShipsSank = () => {
        // commenceAttack.allShipsHasSunk();
    }
    
    let populateBoardOnDOM = (num) => {
        // grids = 10;
        grids = num;
        return grids;
    }

    let creatingGridsForHuman = (num) => {
        populateBoardOnDOM(num);
        let gridContainer = document.createElement('div');
        // let gridContainer = document.querySelector('.human-board');
        gridContainer.className = 'board-container';
        gridContainer = creatingGrids(gridContainer);
        // console.log(gridContainer)
        return gridContainer;
    }

    let creatingGrids = (gridContainer) => {
        for(let i=0; i<grids; i++) {
            for(let j=0; j<grids; j++) {
                // create grids
            let div = document.createElement('div');
            div.textContent = String.fromCharCode(65+i)+" "+j;
            div.value = [String.fromCharCode(65+i), `${j}`];
            // console.log(div.value)
            // div.textContent = i;
            div.className = 'board-grids';
            gridContainer.append(div);
            }
        }
        return gridContainer;
    }

    let creatingGridsForComputer = (num) => {
        populateBoardOnDOM(num);
        let gridContainer = document.createElement('div');
        // let gridContainer = document.querySelector('.human-board');
        gridContainer.className = 'board-container-for-computer';
        gridContainer = creatingGrids(gridContainer);
        return gridContainer;
    }

    return {
        creatingGrids,
        recieveAttacks,
        populateBoardOnDOM,
        loggingMissFiredShots,
        placeShips,
        creatingGridsForComputer,
        creatingGridsForHuman,
        getCoordsFromClick,
        gridClicked,
        computerCoords,
        humanCoords,
        shipsHealth,
        removingShipsFromBoard,
        getCoordsForComputer,
        playerTurnFlag,
        playersTurn
    }
}

module.exports = GameBoard;

/**
 * 
 * 
 let playersTurn = () => {
        let test = document.querySelector('.game-container');
        let flag = false;
        test.addEventListener('click', () => {
            if(flag) {
                alert('player 1');
                let board = document.querySelector('.board-container');
                getCoordsForComputer(board);
                flag = false;
            } else {
                alert('player 2');
                let board = document.querySelector('.board-container-for-computer');
                getCoordsFromClick(board);
                flag = true;
            }
        })
    }
 */