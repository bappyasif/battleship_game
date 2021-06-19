const Ship = require("./ship");

function GameBoard(player) {
    // gameboard should be able to place ships at specific coordinates by calling ship factory function
    let currentShip = Ship(["A", "4"], 2);
    let loggingMissFiredShots = [];
    let grids;
    let loggingHits = [];
    let computerCoords = [];
    let humanCoords = [];
    let playerTurnFlag = false;
    let filtered;
    let intelligentMoves = [];
    let loggingAllShotsFired = [];

    // let commenceAttack = ship(coords);
    let shipsHealth = {};
    let fleetSanked = {};

    let recieveAttacks = coords => {
        let checkAttack = currentShip.checkHitOrMiss(coords);
        if(checkAttack) {
            currentShip.hit(coords);
        } else {
            currentShip.missFired(coords);
            loggingMissFiredShots.push(coords);
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
        let checkBoard = board.parentNode.className
        let found;
        let doesLogAlreadyExist
        if(checkBoard == 'human-board') {
            found = checkHumanCoordsMatched(checkCoords, checkBoard);
            whichShipMods(checkCoords, humanCoords, checkBoard);
            doesLogAlreadyExist = checkComputerCoordsAlreadyExistsInLogs(checkCoords);

            // found = checkComputerCoordsMatched(checkCoords, checkSide);
            // whichShipMods(checkCoords, computerCoords, checkSide);
        }

        if(found && !doesLogAlreadyExist) {
            console.log('hits!!', checkCoords, checkCoords[1], checkBoard);
            checkCoordsBoundaryToImproveAccuracy(checkCoords)
            markShipBeingHit(checkCoords, checkBoard);
        } else {
            if(checkCoords != undefined) {
                // doesLogAlreadyExist needs some tweaking, currently, it still goes to already visited coords fr computer
                console.log('is undefined?!', checkCoords);
                loggingMissFiredShots.push({computer: checkCoords});
                missHits(checkCoords, checkBoard)
            }
        }

        loggingAllShotsFired.push(checkCoords);
        // loggingAllShotsFired.push(["A","2"]);
    }

    let checkCoordsBoundaryToImproveAccuracy = (coords) => {
        // console.log(coords, humanCoords, "human-board")
        let checkIndex;
        humanCoords.forEach((arr, idx) => {
            arr.forEach((pair) => {
                if(pair[0] == coords[0] && pair[1] == coords[1]) {
                    checkIndex = idx;
                }
            })
        })
        // console.log(checkIndex);
        intelligentMoves = humanCoords[checkIndex];
        // console.log('intl-before', intelligentMoves)
        filteringIntlMovesCoords(coords);
        // console.log('intl- after', intelligentMoves)
        // console.log('intl', intelligentMoves)
    }

    let checkComputerCoordsAlreadyExistsInLogs = (coords) => {
        let check = loggingAllShotsFired.map(log => log[0]==coords[0] && log[1]==coords[1]);
        // console.log(coords, check, check.filter(v=>v==true).length);
        return check.filter(v=>v==true).length;
    }

    let playersTurn = () => {
        let test = document.querySelector('.board-container-for-computer');
        let flag = true;
        test.addEventListener('click', (evt) => {
            if(evt.target.value != undefined) {
                if(flag) {
                    // alert('player 2');
                    // let board = document.querySelector('.board-container-for-computer');
                    // getCoordsFromClick(board);
                    gridClicked(evt);
                    flag = false;
                }
                // alert('player 1');
                let board = document.querySelector('.board-container');
                // getCoordsForComputer(board);
                if(intelligentMoves.length == 0) {
                    getCoordsForComputer(board);
                } else {
                    // let checkCoords = evt.target.value;
                    // randomlySelectingIntlCoords();
                    // console.log(randomlySelectingIntlCoords(), "randomCoords");
                    // let selectingCoords = randomlySelectingIntlCoords()[0];
                    // let rand = randomlySelectingIntlCoords()[1];
                    // console.log(rand, "here?!");
                    // updatingIntl(rand);
                    let selectingCoords = randomlySelectingIntlCoords();
                    markShipBeingHit(selectingCoords, 'human-board');
                    filteringIntlMovesCoords(selectingCoords);
                }
                flag = true;
            } else {
                alert('already visited!!');
            }
        })
    }

    let filteringIntlMovesCoords = (coords) => {
        // let filtered = intelligentMoves.filter(pair => pair[0] == coords[0] && pair[1] == coords[1]);
        // let filtered = intelligentMoves.filter(pair => pair[0] != coords[0] && pair[1] != coords[1] ? pair : false);
        let filtered = intelligentMoves.map(pair => pair[0] == coords[0] && pair[1] == coords[1] ? false : pair).filter(v=>v!=false);
        // console.log(filtered, "filtered");
        intelligentMoves = filtered;
    }

    let randomlySelectingIntlCoords = () => {
        let rand = Math.floor(Math.random()*intelligentMoves.length);
        // console.log(rand, "randomNumber")
        return intelligentMoves[rand];
    }

    let gridClicked = (evt) => {
        let checkCoords = evt.target.value;
        let checkBoard = evt.target.parentNode.parentNode.className;
        let found;
        if(checkBoard == 'computer-board') {
            found = checkComputerCoordsMatched(checkCoords, checkBoard);
            whichShipMods(checkCoords, computerCoords, checkBoard);
            playerTurnFlag = true;
        } 
        if(found) {
            markShipBeingHit(checkCoords, checkBoard);
        } else {
            // if(checkCoords != undefined) {
            //     loggingMissFiredShots.push({human: checkCoords});
            //     missHits(checkCoords, checkSide);
            // }
            loggingMissFiredShots.push({human: checkCoords});
            missHits(checkCoords, checkBoard)
        }
    }

    let whichShipMods = (coords, coordsArr, checkSide) => {
        let check = coordsArr.map(arr => {
            if(coords != undefined) {
                return arr.some(cr => cr[0] == coords[0] && cr[1] == coords[1] ? true : false);
            }
        }).indexOf(true);
        // console.log("checking", check, coords, coordsArr, checkSide);
        // console.log("length", coordsArr[check].length);
        if(check !== -1) {
            // console.log("length", coordsArr[check].length);
            let length = coordsArr[check].length;
            keepingTrackOfShips(check, checkSide, length);
        } 
    }

    let checkHumanCoordsMatched = coords => {
        let found;
        if(coords != undefined) {
            found = humanCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        }
        // console.log(found, coords, "human-board", humanCoords);
        return found;
    }

    let checkComputerCoordsMatched = (coords, checkSide) => {
        let found
        if(coords != undefined) {
            found = computerCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        }
        // console.log(computerCoords, "here",  found, coords);
        return found;
    }

    let keepingTrackOfShips = (idx, player, shipLength) => {
        // console.log(shipsHealth, "all ships"); // shipsHealth keys are not matching with board layout
        if(player == 'human-board') {
            // findingShipForAdjustingItsHealth(idx, 'human');
            adjustingPlayersShipHealth(idx, 'human', shipLength)
        } else {
            // findingShipForAdjustingItsHealth(idx, 'computer');
            adjustingPlayersShipHealth(idx, 'computer', shipLength);
        }
    }

    let adjustingPlayersShipHealth = (idx, whichBoard, shipLength) => {
        for(let key in shipsHealth) {
            if(key.includes(whichBoard)) {
                if(shipsHealth[key].length == shipLength && key.indexOf(idx) != -1) {
                    shipsHealth[key].remainingLength--;
                    if(shipsHealth[key].remainingLength == 0) {
                        shipSankedMods(whichBoard,shipsHealth[key],idx)
                    }
                }
            }
        }
    }    

    let missHits = (coords, whichSide) => {
        let board = returnAnyGameBoard(whichSide);
        markingMissesOnBoard(board, coords)
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
                    grid.textContent = "X";
                    // grid.classList.add("unclickable", "ship-hitted");
                    grid.classList.add("unclickable", "miss-fired");
                }
            });
        }
    }

    let markShipBeingHit = (coords, whichSide) => {
        let board = returnAnyGameBoard(whichSide);
        
        if(board) { 
            Array.from(board.children).forEach((grid, idx) => {
                if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    grid.textContent = "O";
                    grid.classList.add("unclickable", "ship-hitted");
                }
            });
        }
    }

    let shipSankedMods = (whichPlayer, whichShip, idx) => {
        let board;
        // console.log('??', whichPlayer, whichShip, idx)
        if(whichPlayer == 'human') {
            board = document.querySelector('.board-container');
        } else {
            board = document.querySelector('.board-container-for-computer');
        }
        disablingShipAfterHit(whichShip, idx, board);
        checkAllShipsSank(whichPlayer);
    }

    let disablingShipAfterHit = (ship, idx, board) => {
        // console.log("ship sanked mods", ship, idx, board)
        if(board) {
            Array.from(board.children).forEach(grid => {
               ship.coords.forEach(coords => {
                   if(grid.value[0] == coords[0] && grid.value[1] == coords[1]) {
                    // grid.className = 'board-grids';
                    grid.classList.add('unclickable');
                   }
               })
            })
        }
    }

    let removingShipsFromBoard = (board) => {
        // console.log(board);
        Array.from(board.children).forEach(grid => {
            grid.className = 'board-grids';
        });
    }

    let checkWinner = (whichBoard) => {
        fleetSanked[whichBoard] ? fleetSanked[whichBoard]++ : fleetSanked[whichBoard]=1;
        // console.log(fleetSanked[whichBoard], "here!!", fleetSanked)
        if(fleetSanked[whichBoard] == 5) return true;
    }

    let checkAllShipsSank = (whichBoard) => {
        if(whichBoard == 'human') {
            // console.log('allShipsHumanBoard', shipsHealth)
            if(checkWinner(whichBoard)) {
                console.log('computer wins!!')
            }
        } else {
            // console.log('allShipsComputerBoard', shipsHealth)
            if(checkWinner(whichBoard)) {
                console.log('human wins!!')
            }
        }
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
        playersTurn,
        checkAllShipsSank
    }
}

module.exports = GameBoard;

/**
 * 
 * 
     let checkCoordsBoundaryToImproveAccuracy = (coords) => {
        console.log(coords, humanCoords, "human-board")
        let checkIndex;
        humanCoords.forEach((arr, idx) => {
            // console.log(arr, arr[0], arr[arr.length -1]);
            // if(arr[arr.length - 1][1] !== coords[1]) {
            //     console.log("not edge!!")
            // } else {
            //     console.log("edge!!")
            // }
            // arr.forEach(pair => {
            //     if(pair[0] == coords[0] && pair[1] == coords[1]) {
            //         console.log("here", coords[1], pair)
            //     }
            // })
            arr.forEach((pair) => {
                if(pair[0] == coords[0] && pair[1] == coords[1]) {
                    // console.log("here", coords[1], pair)
                    // console.log(idx);
                    checkIndex = idx;
                }
            })
        })
        console.log(checkIndex);
    }
 */