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
    let loggingAllShotsFired = [];

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
            markShipBeingHit(checkCoords, checkBoard);
        } else {
            if(checkCoords != undefined) {
                loggingMissFiredShots.push({computer: checkCoords});
                missHits(checkCoords, checkBoard)
            }
        }

        loggingAllShotsFired.push(checkCoords);
        // loggingAllShotsFired.push(["A","2"]);
    }

    let checkComputerCoordsAlreadyExistsInLogs = (coords) => {
        let check = loggingAllShotsFired.map(log => log[0]==coords[0] && log[1]==coords[1]);
        // console.log(coords, check, check.filter(v=>v==true).length);
        return check.filter(v=>v==true).length;
    }

    let playersTurn = () => {
        let test = document.querySelector('.board-container-for-computer');
        let flag = true;
        // checkAllShipsSank();
        test.addEventListener('click', (evt) => {
            if(evt.target.value != undefined) {
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
            } else {
                alert('already visited!!');
            }
        })
    }

    let gridClicked = (evt) => {
        let checkCoords = evt.target.value;
        let checkBoard = evt.target.parentNode.parentNode.className;
        let found;
        if(checkBoard == 'computer-board') {
            // found = checkHumanCoordsMatched(checkCoords, checkSide);
            // whichShipMods(checkCoords, humanCoords, checkSide);

            found = checkComputerCoordsMatched(checkCoords, checkBoard);
            whichShipMods(checkCoords, computerCoords, checkBoard);
            playerTurnFlag = true;
            // console.log("here!!")
        } 
        // else {
        //     found = checkComputerCoordsMatched(checkCoords, checkSide);
        //     whichShipMods(checkCoords, computerCoords, checkSide);
        // }
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
        // playerTurnFlag = true;
        // console.log("here!!", playerTurnFlag)
    }

    let whichShipMods = (coords, coordsArr, checkSide) => {
        let check = coordsArr.map(arr => {
            if(coords != undefined) {
                return arr.some(cr => cr[0] == coords[0] && cr[1] == coords[1] ? true : false);
            }
        }).indexOf(true);
        console.log("checking", check, coords, coordsArr, checkSide);
        // console.log("length", coordsArr[check].length);
        if(check !== -1) {
            // console.log("length", coordsArr[check].length);
            let length = coordsArr[check].length;
            // keepingTrackOfShips(check, checkSide);
            keepingTrackOfShips(check, checkSide, length);
            // TrackingOfShipsModified()
        } 
        // else {
        //     return false
        // }
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
        console.log(computerCoords, "here",  found, coords);
        return found;
    }

    let keepingTrackOfShips = (idx, player, shipLength) => {
        // console.log(idx, player, "::")
        console.log(shipsHealth, "all ships"); // shipsHealth keys are not matching with board layout
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
                    // console.log("HERE!!", shipLength, shipsHealth[key].length);
                    shipsHealth[key].remainingLength--;
                    // console.log("HERE!!", shipLength, shipsHealth[key].length, shipsHealth[key].remainingLength);
                    if(shipsHealth[key].remainingLength == 0) {
                        shipSankedMods(whichBoard,shipsHealth[key],idx)
                        // console.log("HERE!!");
                    }

                }
            }
        }
    }    

    let missHits = (coords, whichSide) => {
        // console.log(coords, whichSide, "misshits!!")
        let board = returnAnyGameBoard(whichSide);
        // console.log('misshits', loggingMissFiredShots);
        // checkMissedCoordsAlreadyBeenVisited(coords, whichSide);
        // missHitsdAlreadyVisited(coords, whichSide);
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
        // missHitsdAlreadyVisited();
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
        console.log('hits', board);
        // if(whichSide.split("-")[0] == 'human') {
        //     board = document.querySelector('.board-container');
        // } else {
        //     board = document.querySelector('.board-container-for-computer');
        // }
        
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
        console.log('??', whichPlayer, whichShip, idx)
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
            //    break;
            })
            // updateExistingShipCoords(idx, board.parentNode.className);
        }
    }

    let removingShipsFromBoard = (board) => {
        // console.log(board);
        Array.from(board.children).forEach(grid => {
            grid.className = 'board-grids';
        });
    }

    let checkWinner = (whichBoard) => {
        for(let key in shipsHealth) {
            if(key.includes(whichBoard) && shipsHealth[key].remainingLength == 0) {
                return true;                
            }
        }
    }

    let checkAllShipsSank = (whichBoard) => {
        if(whichBoard == 'human') {
            if(checkWinner(whichBoard)) {
                console.log('computer wins!!')
            }
        } else {
            if(checkWinner(whichBoard)) {
                console.log('human wins!!')
            }
        }

        // commenceAttack.allShipsHasSunk();
        // if(computerCoords)
        // console.log(computerCoords, humanCoords, "<>");
        // if(computerCoords.length == 0) {
        //     console.log(computerCoords, 'human wins');
        // } else if(humanCoords.length == 0) {
        //     console.log(humanCoords, 'computer wins');
        // }
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
        // let doesLogAlreadyExist = checkComputerCoordsAlreadyExistsInLogs(checkCoords);
        // let doesLogAlreadyExist = checkComputerCoordsAlreadyExistsInLogs(["A", "2"]);
        // checkComputerCoordsAlreadyExistsInLogs(["A", "2"]);
        // console.log(doesLogAlreadyExist);

        // if(!doesLogAlreadyExist) {
        //     if(found) {
        //         markShipBeingHit(checkCoords, checkBoard);
        //     } else {
        //         if(checkCoords != undefined) {
        //             loggingMissFiredShots.push({computer: checkCoords});
        //             missHits(checkCoords, checkBoard)
        //         }
        //     }
        // }

        // if(found) {
        //     markShipBeingHit(checkCoords, checkBoard);
        // } else {
        //     if(checkCoords != undefined) {
        //         loggingMissFiredShots.push({computer: checkCoords});
        //         missHits(checkCoords, checkBoard)
        //     }
        // }

        if(found && !doesLogAlreadyExist) {
            markShipBeingHit(checkCoords, checkBoard);
        } else {
            if(checkCoords != undefined) {
                loggingMissFiredShots.push({computer: checkCoords});
                missHits(checkCoords, checkBoard)
            }
        }

        loggingAllShotsFired.push(checkCoords);
        // loggingAllShotsFired.push(["A","2"]);

        // console.log(loggingAllShotsFired, "here!!")
        // console.log(found, checkCoords, checkSide)
    }
 * 
 * 
 // let findingShipForAdjustingItsHealth = (idx, whichPlayer) => {
    //     let test;
    //     if(whichPlayer != undefined) {
    //         for(let key in shipsHealth) {
    //             // shipsHealth is not logging in all computer board's coords in it
    //             // need to use another source for checking of shipsHealth instaed of shipsHealth
    //             // as it's keys are not updating in accordance with our humanCoords array adjustsment
                
    //             // console.log(idx, whichPlayer, "::", shipsHealth[whichPlayer+idx], shipsHealth )
    //             if(key === whichPlayer+idx) {
    //                 shipsHealth[key].length--;
    //                 // console.log(shipsHealth[key].length, "here!!", key, shipsHealth[key]);
    //                 if(shipsHealth[key].length == 0) {
    //                     shipSankedMods(whichPlayer, shipsHealth[key], idx)
    //                     // adjustingPlayersShipHealth(idx, whichPlayer);
    //                     // delete shipsHealth[key];
    //                 } 
    //                 // else if(computerCoords.length == 0 || humanCoords.length == 0) {
    //                 //     checkAllShipsSank();
    //                 // }
    //             }
    //         }
    //     }
        
    // }

    // let updateExistingShipCoords = (idx, whichSideShipCoords) => {
    //     // console.log(computerCoords, humanCoords, "whatwhat?!", whichSideShipCoords.includes('computer'));
    //     let filteredHumanShips = [];
    //     let filteredComputerShips = [];
    //     if(whichSideShipCoords.split("-")[0] == 'human') {
    //         for(let i=0; i<humanCoords.length; i++) {
    //             if(i!=idx) {
    //                 filteredHumanShips.push(humanCoords[i]);
    //             } 
    //         }
    //         humanCoords = filteredHumanShips;
    //     } else {
    //         for(let i=0; i<computerCoords.length; i++) {
    //             if(i!=idx) {
    //                 filteredComputerShips.push(computerCoords[i]);
    //             } 
    //         }
    //         computerCoords = filteredComputerShips;       
    //     }
    //     console.log(filteredHumanShips, filteredComputerShips, "yoyo!!", humanCoords, computerCoords)
    //     // humanCoords = filteredHumanShips;
    //     // computerCoords = filteredComputerShips;
    // }
 * 
 * 
 let getCoordsForComputer = (board) => {
        let [alph, num] = Ship().randomCoords();
        let checkCoords = [alph, num];
        let checkBoard = board.parentNode.className
        let found;
        if(checkBoard == 'human-board') {
            found = checkHumanCoordsMatched(checkCoords, checkBoard);
            whichShipMods(checkCoords, humanCoords, checkBoard);

            // found = checkComputerCoordsMatched(checkCoords, checkSide);
            // whichShipMods(checkCoords, computerCoords, checkSide);
        }
        let doesLogAlreadyExist = checkComputerCoordsAlreadyExistsInLogs(checkCoords);
        // let doesLogAlreadyExist = checkComputerCoordsAlreadyExistsInLogs(["A", "2"]);
        // checkComputerCoordsAlreadyExistsInLogs(["A", "2"]);
        // console.log(doesLogAlreadyExist);

        // while(!doesLogAlreadyExist) {
        //     if(found) {
        //         markShipBeingHit(checkCoords, checkBoard);
        //     } else {
        //         if(checkCoords != undefined) {
        //             loggingMissFiredShots.push({computer: checkCoords});
        //             missHits(checkCoords, checkBoard)
        //         }
        //     }
        //     loggingAllShotsFired.push(checkCoords); 
        // }

        // if(found && !doesLogAlreadyExist) {
        //     markShipBeingHit(checkCoords, checkBoard);
        // } else {
        //     if(checkCoords != undefined) {
        //         loggingMissFiredShots.push({computer: checkCoords});
        //         missHits(checkCoords, checkBoard)
        //     }
        //     // loggingMissFiredShots.push({computer: checkCoords});
        //     // missHits(checkCoords, checkSide)
        // }

        // if(!doesLogAlreadyExist) {
        //     if(found) {
        //         markShipBeingHit(checkCoords, checkBoard);
        //     } else {
        //         if(checkCoords != undefined) {
        //             loggingMissFiredShots.push({computer: checkCoords});
        //             missHits(checkCoords, checkBoard)
        //         }
        //     }
        // }

        if(found) {
            markShipBeingHit(checkCoords, checkBoard);
        } else {
            if(checkCoords != undefined) {
                loggingMissFiredShots.push({computer: checkCoords});
                missHits(checkCoords, checkBoard)
            }
        }

        // if(found && !doesLogAlreadyExist) {
        //     markShipBeingHit(checkCoords, checkBoard);
        // } else {
        //     if(checkCoords != undefined) {
        //         loggingMissFiredShots.push({computer: checkCoords});
        //         missHits(checkCoords, checkBoard)
        //     }
        // }

        loggingAllShotsFired.push(checkCoords);
        // loggingAllShotsFired.push(["A","2"]);

        // console.log(loggingAllShotsFired, "here!!")
        // console.log(found, checkCoords, checkSide)
    }
 * 
 * 
 let missHitsdAlreadyVisited = (coords, whichSide) => {
    //     // console.log('missHitsFiltered', filtered, missFiltered);
    //     // let checkCoordsLoggedAlready = 
    //     let check;
    //     let test;
    //     console.log('logging misses', loggingMissFiredShots, coords, whichSide);
    //     if(whichSide.includes('computer')) {
    //         test = returnFilteredMissedCoords('human');
    //         check = confirmMatches(coords, test, 'human');
    //     } else {
    //         test = returnFilteredMissedCoords('computer');
    //         check = confirmMatches(coords, test, 'computer');
    //     }

    //     // check = confirmMatches(coords, test, whichSide);
    //     console.log(check, "is it?!");
    // }

    // let confirmMatches = (coords, filtered, whichSide) => {
    //     console.log(coords, filtered, whichSide, "here!!");
    //     // let side = whichSide.split('-')[0];
    //     // console.log("here!!", coords, filtered, whichSide, side);
    //     // loggingMissFiredShots.forEach(arr => {
    //     //     // console.log(arr['human'], arr);
    //     //     if(arr['human'][0] == coords[0] && arr['human'][1] == coords[1]) {
    //     //         console.log(arr['human'], arr);
    //     //     }
    //     // })        
    // }

    // let checkMissedCoordsAlreadyBeenVisited = (coords, whichSide) => {
    //     // console.log('misshits', loggingMissFiredShots, coords, whichSide);
    //     // let filtered;
    //     if(whichSide.includes('computer-')) {
    //         // console.log('misshitsOnHumanSide', coords, whichSide);
    //         filtered = returnFilteredMissedCoords('human');
    //     } else {
    //         // console.log('misshitsOnComputerSide', coords, whichSide, loggingMissFiredShots);
    //         filtered = returnFilteredMissedCoords('computer');
    //     }
    //     missFiltered.push(filtered);
    //     console.log(filtered, "filtered")
    // }

    // let returnFilteredMissedCoords = (whichSide) => {
    //     let filtered = [];
    //     loggingMissFiredShots.forEach(logs => {
    //         let keys = Object.keys(logs);
    //         console.log(keys);
    //         if(keys.includes(whichSide)) {
    //             filtered.push(logs[keys]);
    //         }
    //     })
    //     return filtered;
    // }
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