// let Ship = require('./battleShip');

const Game = require("./gameLogic");
const Ship = require("./ship");

function GameBoard(player) {
    let dummyCoords = ["A","4"];
    // gameboard should be able to place ships at specific coordinates by calling ship factory function
    // Ship(dummyCoords);
    // let currentShip = Ship(["A", "4"], 2, ["A", "4"]);
    let currentShip = Ship(["A", "4"], 2);
    let loggingMissFiredShots = [];
    let grids;
    let loggingHits = [];
    let computerCoords = [];
    let humanCoords = [];

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
        // let board = document.querySelector('.board-container');
        // console.log(coords, "here!!", coords[0][0], board);
        if(board) {
            // if(board.classList.contains('board-container-for-computer')) {
            //     computerCoords.push(coords);
            //     console.log(computerCoords,"!!")
            // }
            Array.from(board.children).forEach((grid) => {
                // console.log(grid.value[1] == coords[0][1], grid.value[1], coords[0][1])
                let idx = 0;
                do {
                    if(grid.value[0] === coords[idx][0] && grid.value[1] == coords[idx][1]) {
                        // console.log("here!!", grid.value, coords[idx][0], coords[idx][1]);
                        grid.className = 'ship-placed';
                    }
                    idx++;
                    // console.log(idx);
                } while(idx < coords.length);
            })
        }
    }

    let getCoordsFromClick = (board) => {
        // let computerBoard = document.querySelector('.board-container-for-computer');
        console.log(board, "board")
        if(board) {
            board.addEventListener('click', gridClicked);
        }
        // let computerBoard = document.querySelector('.board-container-for-computer');
        // // console.log(computerBoard)
        // if(computerBoard) {
        //     computerBoard.addEventListener('click', gridClicked);
        // }
    }

    let gridClicked = (evt) => {
        // console.log(evt.target.value);
        // Game()
        let checkCoords = evt.target.value;
        let checkSide = evt.target.parentNode.parentNode.className;
        // console.log(checkSide);
        let found;
        // console.log(humanCoords, computerCoords)
        if(checkSide == 'human-board') {
            // found = checkIfCoordsMatched(checkCoords, computerCoords);
            found = checkHumanCoordsMatched(checkCoords, checkSide);
            whichShipMods(checkCoords, humanCoords, checkSide);
            // markShipBeingHit(checkCoords, checkSide);
        } else {
            found = checkComputerCoordsMatched(checkCoords, checkSide);
            whichShipMods(checkCoords, computerCoords, checkSide);
            // markShipBeingHit(checkCoords, checkSide);
            // found = checkIfCoordsMatched(checkCoords, humanCoords);
        }
        // found = checkComputerCoordsMatched(checkCoords, checkSide);
        // console.log(humanCoords, computerCoords)
        
        // if(found) {
        //     // whichShip(checkCoords);
        //     whichShipMods(checkCoords, humanCoords, checkSide)
        //     whichShipMods(checkCoords, computerCoords, checkSide)
        //     markShipBeingHit(checkCoords, checkSide);
        // }
        if(found) markShipBeingHit(checkCoords, checkSide);
        // console.log(checkCoords, Game, computerCoords, " ", humanCoords);
    }

    let whichShipMods = (coords, coordsArr, checkSide) => {
        // console.log(coords, coordsArr, "<>");
        let check = coordsArr.map(arr => {
            if(coords != undefined) {
                return arr.some(cr => cr[0] == coords[0] && cr[1] == coords[1] ? true : false);
            }
        }).indexOf(true);
        if(check !== -1) {
            // console.log("here!!", shipsHealth);
            // keepingTrackOfComputerShips(check);
            keepingTrackOfShips(check, checkSide);
        }
    }

    let whichShip = coords => {
        // let check = false;
        // console.log(computerCoords,"!!")
        // console.log(coords, "!!")
        let check = computerCoords.map((arr, idx) => {
            // console.log(arr, idx, arr[0], coords[0], coords[0] === arr[0][0], arr.indexOf(coords[0]));
            // return arr.every(cr => cr[0] == coords [0] && cr[1] == coords[1]);
            if(coords != undefined) {
                return arr.some(cr => cr[0] == coords[0] && cr[1] == coords[1] ? true : false);
            }
        }).indexOf(true);
        if(check !== -1) {
            keepingTrackOfComputerShips(check);
        }
        // console.log(check, "which");
        // console.log(check, test, coords, computerCoords[0]);
    }

    let checkHumanCoordsMatched = coords => {
        let found;
        console.log(humanCoords)
        if(coords != undefined) {
            found = humanCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        }
        return found;
    }

    let checkComputerCoordsMatched = (coords, checkSide) => {
        // console.log("??", coords, coordsArr)
        let found
        if(coords != undefined) {
            // console.log("here!!", checkSide)
            
            // if(checkSide == 'human-board') {
            //     console.log("here!!", checkSide, computerCoords)
            //     found = computerCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
            // } else {
            //     console.log("here!!", checkSide, humanCoords)
            //     found = humanCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
            // }

            found = computerCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
            // found = coordsArr.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        }
        // let found = computerCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        // console.log(found, coords, computerCoords.flat(1));
        return found;
    }

    let keepingTrackOfComputerShips = (idx) => {
        // console.log(shipsHealth, 'ships', idx);
        findingShipForAdjustingItsHealth(idx, 'computer');
    }

    let keepingTrackOfShips = (idx, side) => {
        console.log(shipsHealth, idx, side, "here!!");
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
                // console.log(key, shipsHealth[key])
                // markShipBeingHit(shipsHealth[key].coords);
                shipsHealth[key].length--;
                if(shipsHealth[key].length == 0) {
                    // shipSanked(shipsHealth[key], idx);
                    shipSankedMods(whichPlayer, shipsHealth[key], idx)
                    delete shipsHealth[key];
                }
            }
        }
        // console.log(shipsHealth);
    }

    let markShipBeingHit = (coords, whichSide) => {
        let board;
        // console.log(coords, "here!!", board, whichSide);
        if(whichSide.split("-")[0] == 'human') {
            board = document.querySelector('.board-container');
        } else {
            board = document.querySelector('.board-container-for-computer');
        }
        if(board) { 
            Array.from(board.children).forEach((grid, idx) => {
                // console.log(grid.value[0], coords[0], "!!")
                // console.log(coords, "!!")
                if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    grid.textContent = "X";
                    grid.classList.add("unclickable", "ship-hitted");
                }
            });
        }
    }

    let shipSankedMods = (whichPlayer, whichShip, idx) => {
        // console.log('ship sanked', whichShip, whichPlayer, idx);
        let board;
        if(whichPlayer == 'human') {
            board = document.querySelector('.board-container');
            // console.log("here!!")
        } else {
            board = document.querySelector('.board-container-for-computer');
        }
        disablingShipOnBoard(whichShip, idx, board);
    }

    let shipSanked = (whichShip, idx) => {
        // console.log('ship sank', whichShip, shipsHealth[whichShip]);
        removeShipFromBoard(whichShip, idx);
    }

    // let removalOfShipCoords = (whichShip, idx, whichPlayer) => {
    //     console.log(whichPlayer, whichShip, idx, "removing!!");
    // }

    let disablingShipOnBoard = (ship, idx, board) => {
        console.log("ship sanked mods", ship, idx, board)
        if(board) {
            Array.from(board.children).forEach(grid => {
                // console.log(ship.coords[0][0], "here!!", grid.value[0])
               ship.coords.forEach(coords => {
                   if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    // grid.className = 'board-grids';
                    grid.classList.add('unclickable');
                   }
               })
               return;
            })
            // updateComputerShipCoords(idx);
            updateExistingShipCoords(idx, board.parentNode.className);
        }
    }

    let removeShipFromBoard = (ship, idx) => {
        let board = document.querySelector('.board-container-for-computer');
        console.log(ship, "here!!", board, ship.coords.length)
        if(board) {
            Array.from(board.children).forEach(grid => {
                // console.log(ship.coords[0][0], "here!!", grid.value[0])
               ship.coords.forEach(coords => {
                   if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    // grid.className = 'board-grids';
                    grid.classList.add('unclickable');
                    // grid.removeEventListener('click', ()=>console.log('??'))
                    // updateComputerShipCoords(idx)
                    // console.log(computerCoords);
                    // grid.removeEventListener('click', gridClicked);
                    // grid.removeEventListener('click', getCoordsFromClick);
                   }
                //    updateComputerShipCoords(idx)
               })
               return;
            //    updateComputerShipCoords(idx); 
            })
            updateComputerShipCoords(idx)
        }
    }

    let updateExistingShipCoords = (idx, whichSideShipCoords) => {
        console.log(idx, whichSideShipCoords)
        let filteredHumanShips = [];
        let filteredComputerShips = [];
        if(whichSideShipCoords.split("-")[0] == 'human') {
            for(let i=0; i<humanCoords.length; i++) {
                if(i!=idx) {
                    filteredHumanShips.push(humanCoords[i]);
                } 
            }
            console.log(filteredHumanShips);
            humanCoords = filteredHumanShips;
        } else {
            for(let i=0; i<computerCoords.length; i++) {
                if(i!=idx) {
                    filteredComputerShips.push(computerCoords[i]);
                } 
            }
            console.log(filteredComputerShips);
            computerCoords = filteredComputerShips;       
        }
    }

    let updateComputerShipCoords = (idx) => {
        let filtered = [];
        for(let i=0; i<computerCoords.length; i++) {
            if(i!=idx) {
                filtered.push(computerCoords[i]);
            } 
        }
        console.log(filtered);
        computerCoords = filtered;
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
        shipsHealth
    }
}

module.exports = GameBoard;

/**
 * 
 * 
     let updateComputerShipCoords = (idx) => {
        // console.log(idx,"??")
        // computerCoords = computerCoords.slice(0,idx) + computerCoords.slice(idx);
        let filtered = [];
        for(let i=0; i<computerCoords.length; i++) {
            if(i!=idx) {
                // break;
                // continue;
                filtered.push(computerCoords[i]);
            } 
            // else {
            //     filtered.push(computerCoords[i]);
            // }
        }
        // console.log(filtered);
        computerCoords = filtered;
        // console.log(computerCoords,"<>");

        // computerCoords.splice(idx, 1);
        // whichShip();
        // computerCoords = computerCoords.filter((v,i) => i!= idx ? v : -1);
        // let test = computerCoords.map((v,i) => i == idx ? false : v)
        // console.log(computerCoords, "??", test);
    }
 * 
 * 
     let removeShipFromBoard = ship => {
        let board = document.querySelector('.board-container-for-computer');
        console.log(ship, "here!!", board, ship.coords.length)
        if(board) {
            Array.from(board.children).forEach(grid => {
                // console.log(ship.coords[0][0], "here!!", grid.value[0])
               ship.coords.forEach(coords => {
                   if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    grid.className = 'board-grids';
                    // grid.removeEventListener('click', gridClicked);
                    // grid.removeEventListener('click', getCoordsFromClick);
                   }
               }) 
            })

            // if((grid.value[0] == ship.coords[0][0] && grid.value[1] == ship.coords[0][1])) {
            //     grid.className = 'board-grids';
            //     ship.coords.unshift();
            //     console.log(ship)
            //     grid.removeEventListener('click', gridClicked);
            // }
            
            // if((grid.value[0] == ship.coords[0][0] && grid.value[1] == ship.coords[0][1]) || grid.value[0] == ship.coords[1][0] && grid.value[1] == ship.coords[1][1]) {
                //     console.log("here!!")
                //     grid.className = 'board-grids';
                //     // grid.removeEventListener()
                // }
        }
    }
 * 
 * 
 let placeShips = (coords) => {
        let board = document.querySelector('.board-container');
        // console.log(coords, "here!!", coords[0][0]);
        if(board) {
            Array.from(board.children).forEach((grid, idx) => {
                // console.log(grid.value[0], coords[0][0], coords[idx] )
                // console.log(coords[idx][0], "??", idx, grid.value[0]);
                console.log(coords[0][0], coords[0][1])
                if(coords[idx] && (grid.value[0] === coords[0][0])) {
                    // console.log(grid.value, grid.value[0], idx, coords[idx], coords);
                    console.log(grid.value[0] === coords[idx][0], grid.value[0],coords[idx][0], "here!!",coords[0][0]);
                    grid.className = 'ship-placed';
                }
                // if(coords[idx]) {
                //     console.log(grid.value, idx);
                //     grid.className = 'ship-placed';
                // }
                // if(grid.value[0] == coords[0][0] && idx == coords[0][1] ) {
                //     console.log(grid.value);
                // }
            })
        }
    }
 */