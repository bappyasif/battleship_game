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
            if(board.className.includes ('board-container-for-computer')) {
                placingShipsForComputer(board, coords)
            } else {
                placingShipsForHuman(board, coords)
            }
        }
    }

    let placingShipsForHuman = (board, coords) => {
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

    let placingShipsForComputer = (board, coords) => {
        Array.from(board.children).forEach((grid) => {
            let idx = 0;
            do {
                if(grid.value[0] === coords[idx][0] && grid.value[1] == coords[idx][1]) {
                    // grid.className = 'ship-placed';
                    // grid.classList.add()
                    grid.className = 'hide-ship';
                }
                idx++;
            } while(idx < coords.length);
        })
    }

    let togglingComputerFleetVisuals = () => {
        let board = document.querySelector('.board-container-for-computer');
        let sneakPeak = document.querySelector('.sneak-peak');
        Array.from(board.children).forEach(grid => {
            if(grid.classList.contains('hide-ship')) {
                grid.classList.remove('hide-ship');
                grid.classList.add('ship-placed');
                sneakPeak.textContent = 'turn off sneak peak';
            } else if(grid.classList.contains('ship-placed')) {
                grid.classList.add('hide-ship');
                grid.classList.remove('ship-placed');
                sneakPeak.textContent = 'sneak peak';
            }
        })
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
        // let doesLogAlreadyExist
        let alreadyVisited = checkCoordsExistInAllShots(checkCoords);
        if(checkBoard == 'human-board' && !alreadyVisited) {
            found = checkHumanCoordsMatched(checkCoords, checkBoard);
            whichShipMods(checkCoords, humanCoords, checkBoard);
            if(found) {
                checkCoordsBoundaryToImproveAccuracy(checkCoords)
                markShipBeingHit(checkCoords, checkBoard);
                // console.log("found!!", checkCoords)
            } else {
                console.log("missed", humanCoords, checkCoords);
                loggingMissFiredShots.push({computer: checkCoords});
                if(!alreadyVisited) {
                    missHits(checkCoords, checkBoard)
                } else {
                    getCoordsForComputer(board)
                }
            }
        } 
        // else {
        //     getCoordsForComputer(board)
        // }
        
        loggingAllShotsFired.push(checkCoords);
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
        intelligentMoves = humanCoords[checkIndex];
        filteringIntlMovesCoords(coords);
    }

    let checkCoordsExistInAllShots = (coords) => {
        // console.log(coords, loggingAllShotsFired);
        let isVisited;
        loggingAllShotsFired.forEach(cr => {
            if(cr[0] == coords[0] && cr[1] == coords[1]) isVisited = true;
        })
        // console.log("isCisited", isVisited, JSON.stringify(loggingAllShotsFired))
        return isVisited;
    }

    let playersTurn = () => {
        let turns = document.querySelector('.board-container-for-computer');
        
        let flag = true;
        turns.addEventListener('click', (evt) => {
            if(evt.target.value != undefined) {
                if(flag) {
                    // alert('player 2');
                    gridClicked(evt);
                    flag = false;
                }
                // alert('player 1');
                let board = document.querySelector('.board-container');
                if(intelligentMoves.length == 0) {
                    getCoordsForComputer(board);
                } else {
                    let selectingCoords = randomlySelectingIntlCoords();
                    loggingAllShotsFired.push(selectingCoords);

                    whichShipMods(selectingCoords, humanCoords, 'human-board');
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
        let filtered = intelligentMoves.map(pair => pair[0] == coords[0] && pair[1] == coords[1] ? false : pair).filter(v=>v!=false);
        intelligentMoves = filtered;
    }

    let randomlySelectingIntlCoords = () => {
        let rand = Math.floor(Math.random()*intelligentMoves.length);
        return intelligentMoves[rand];
    }

    let gridClicked = (evt) => {
        let checkCoords = evt.target.value;
        let checkBoard = evt.target.parentNode.parentNode.className;
        let found;
        if(checkBoard == 'computer-board') {
            found = checkComputerCoordsMatched(checkCoords);
            whichShipMods(checkCoords, computerCoords, checkBoard);
            playerTurnFlag = true;
            if(found) {
                // console.log("found!!", checkCoords, computerCoords)
                markShipBeingHit(checkCoords, checkBoard);
            } else {
                loggingMissFiredShots.push({human: checkCoords});
                missHits(checkCoords, checkBoard)
            }
        } 
    }

    let whichShipMods = (coords, coordsArr, checkSide) => {
        let check = coordsArr.map(arr => {
            if(coords != undefined) {
                return arr.some(cr => cr[0] == coords[0] && cr[1] == coords[1] ? true : false);
            }
        }).indexOf(true);
        // console.log("check::", check);
        
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

    let checkComputerCoordsMatched = (coords) => {
        let found
        if(coords != undefined) {
            found = computerCoords.flat(1).some(ar => ar[0] == coords[0] && ar[1] == coords[1]);
        }
        // console.log(computerCoords, "here",  found, coords);
        return found;
    }

    let keepingTrackOfShips = (idx, player, shipLength) => {        
        if(player == 'human-board') {
            adjustingPlayersShipHealth(idx, 'human', shipLength)
        } else {
            adjustingPlayersShipHealth(idx, 'computer', shipLength);
        }
    }

    let adjustingPlayersShipHealth = (idx, whichBoard, shipLength) => {
        for(let key in shipsHealth) {
            // console.log(shipsHealth, whichBoard, idx, "<>")
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
                    grid.classList.add("unclickable", "miss-fired");
                }
            });
        }
    }

    let markShipBeingHit = (coords, whichSide) => {
        console.log(humanCoords, computerCoords, whichSide, coords);
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
        Array.from(board.children).forEach(grid => {
            grid.className = 'board-grids';
        });
    }

    let checkWinner = (whichBoard) => {
        fleetSanked[whichBoard] ? fleetSanked[whichBoard]++ : fleetSanked[whichBoard]=1;
        if(fleetSanked[whichBoard] == 5) {
            return true;
        }
    }

    let checkAllShipsSank = (whichBoard) => {
        if(whichBoard == 'human') {
            if(checkWinner(whichBoard)) {
                console.log('computer wins!!');
                afterWinnerIsDecided(whichBoard);
            }
        } else {
            if(checkWinner(whichBoard)) {
                console.log('human wins!!');
                afterWinnerIsDecided(whichBoard);
            }
        }
    }

    let afterWinnerIsDecided = (whichBoard) => {
        let humanBoard = document.querySelector('.board-container');
        let computerBoard = document.querySelector('.board-container-for-computer');
        let winner = document.querySelector('.winner');

        humanBoard.style.opacity = "56%";
        computerBoard.style.opacity = "56%";

        humanBoard.classList.add('boards-behind');
        computerBoard.classList.add('boards-behind');

        freezeGrids(humanBoard);
        freezeGrids(computerBoard);
        removingPreviousBoardGrids();

        if(whichBoard == 'human') {
            announceWinner('computer', winner);
        } else {
            announceWinner('human', winner);
        }
        
        showingPlayAgainOption();
    }

    let announceWinner = (player, winner) => {
        winner.style.display = 'block';
        winner.textContent = player+" wins!!"
        alert(player+" wins!!");
    }

    let unfreezeBtns = () => {
        let btn = document.querySelector('.re-arrange-human-formation');
        let btnReady = document.querySelector('.human-ready');

        let btn2 = document.querySelector('.re-arrange-computer-formation');
        let btnReady2 = document.querySelector('.computer-ready');

        removingClassForBtns([btn, btnReady, btn2, btnReady2]);
    }

    let removingClassForBtns = (btns) => {
        btns.forEach(btn => btn.classList.remove('disabled-btn'));
    }

    let freezeGrids = (board) => {
        console.log(board, "board!!");
        Array.from(board.children).forEach(grid => {
            grid.classList.add('unclickable');
        });
    }

    let removingPreviousBoardGrids = () => {
        let humanBoard = document.querySelector('.board-container');
        let computerBoard = document.querySelector('.board-container-for-computer');

        // removingShipsFromBoard(humanBoard);
        // removingShipsFromBoard(computerBoard);

        freezeGrids(humanBoard);
        freezeGrids(computerBoard);

        humanCoords = [];
        computerCoords = [];
    }

    let showingPlayAgainOption = () => {
        let playAgain = document.querySelector('.play-again');
        playAgain.style.display = 'block';
    }

    let freshCoords = () => {
        humanCoords = [];
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
            div.className = 'board-grids';
            gridContainer.append(div);
            }
        }
        return gridContainer;
    }

    let creatingGridsForComputer = (num) => {
        populateBoardOnDOM(num);
        let gridContainer = document.createElement('div');
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
        checkAllShipsSank,
        removingPreviousBoardGrids,
        freshCoords,
        togglingComputerFleetVisuals
    }
}

module.exports = GameBoard;