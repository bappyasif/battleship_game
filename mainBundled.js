/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game_codes/gameBoard.js":
/*!*************************************!*\
  !*** ./src/game_codes/gameBoard.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(/*! ./ship */ "./src/game_codes/ship.js");

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

/***/ }),

/***/ "./src/game_codes/gameLogic.js":
/*!*************************************!*\
  !*** ./src/game_codes/gameLogic.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

let GameBoard = __webpack_require__(/*! ./gameBoard */ "./src/game_codes/gameBoard.js");
const Player = __webpack_require__(/*! ./player */ "./src/game_codes/player.js");
const Ship = __webpack_require__(/*! ./ship */ "./src/game_codes/ship.js");

let game = () => {
    // main game loop and DOM interaction
    // let human = Player('human', 5);
    // let computer = Player('computer', 5);
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
        
        gameBoard.humanCoords.push(shipCoords);
        
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

    let beginPlay = () => {
        let winner = document.querySelector('.winner');
        let playAgain = document.querySelector('.play-again');
        
        winner.style.display = 'none';
        playAgain.style.display = 'none';
        
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

    let togglingSneakPeakOnComputerFleet = () => {
        gameBoard.togglingComputerFleetVisuals();
    }

    let sneakPeakOnComputer = () => {
        let btn = document.querySelector('.sneak-peak');
        btn.addEventListener('click', togglingSneakPeakOnComputerFleet);
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
        startGame,
        sneakPeakOnComputer
    }
}

module.exports = game;

/***/ }),

/***/ "./src/game_codes/player.js":
/*!**********************************!*\
  !*** ./src/game_codes/player.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(/*! ./ship */ "./src/game_codes/ship.js");

function Player(whichPlayer, ships) {
    let whosTurn;
    let totalNumberOfShips = ships
    let shipsHealth = {};
    let flagFleet = false;
    // let turnFlag = false;

    if(whichPlayer === 'computer') {
        whosTurn = 'computer'
        // turnFlag = true;
    } else {
        whosTurn = 'human'
        // turnFlag = false;
    }

    let positionShip = (forWho) => {
        return forWho === 'human' ? Ship().coordsGenerator() : false;
    }
    
    let alphabetsSet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let numeralsSet = ['0','1','2','3','4','5','6','7','8','9']
    let keepingComputerRandomCoords = {}
    let coordsGenerator = (forWho) => {
        let randomNumber = Math.floor(Math.random()*alphabetsSet.length);
        let randomAlphabet = alphabetsSet[randomNumber];
        
        randomNumber = Math.floor(Math.random()*numeralsSet.length);
        let randomNumeral = numeralsSet[randomNumber];
        
        // if( 9 - randomNumber > 0) {
        //     console.log(randomNumber, 9, 9 - randomNumber)
        //     // if(whichPlayer === 'human' || forWho === 'human' || whosTurn === 'human') return shipsRandomCoordsGenerator(randomAlphabet, randomNumber);
        // }

        // console.log("??")
        if(whichPlayer === 'human' || forWho === 'human' || whosTurn === 'human') return shipsRandomCoordsGenerator(randomAlphabet, randomNumber);
        // console.log("??", whichPlayer === 'human', whosTurn === 'human', whichPlayer, forWho)
        return generateUniqueComputerCoords(randomAlphabet, randomNumeral);
    }

    let generateUniqueComputerCoords = (alph, num) => {
        // console.log("??", keepingComputerRandomCoords)
        let chkEmpty = Object.keys(keepingComputerRandomCoords).length;
        if(chkEmpty !== 0) {
            let found = checkUniqueBoardCoords();
            return !found ? computerPlayer(alph, num) : coordsGenerator()
        } else {
            return computerPlayer(alph, num);
            // console.log("??", alph, num)
        }
    }

    let checkUniqueBoardCoords = () => {
        for(let key in keepingComputerRandomCoords) {
            let found = keepingComputerRandomCoords[key].filter(pair => pair[0] === alph && pair[1] === num)
            console.log("?? unique:", found)
            return found 
        }
    }

    let computerPlayer = (alph, num) => {
            let randomCoords = [alph, num];
            keepingComputerRandomCoords[Object.keys(keepingComputerRandomCoords).length + 1] = randomCoords;
            return randomCoords
    }

    let humanPlayer = () => {
        console.log('human player taking turn');
        if(whosTurn === 'human') {
            console.log('human player taking turn');
            let selectCoords = ["B", "2"];
        }
    }

    return {
        flagFleet,
        humanPlayer,
        computerPlayer,
        coordsGenerator,
        positionShip,
        // trackingShipsUniqueCoords
    }
}

module.exports = Player;

/***/ }),

/***/ "./src/game_codes/ship.js":
/*!********************************!*\
  !*** ./src/game_codes/ship.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Player = __webpack_require__(/*! ./player */ "./src/game_codes/player.js");

function Ship(coords, length, type) {
    // let shipLength = 0;
    // let [a, d] = coords;
    let didSink = false;
    let didHit = false;
    let shipLength = length;
    // let whereDidItHit = attackCoords;
    let shipCoords = coords;
    let logShots;

    let checkHitOrMiss = (attackCoords) => {
        // return coords === shipCoords ? true : false;
        console.log(attackCoords, shipCoords, attackCoords.every((v,i) => shipCoords[i] === v))
        // return attackCoords.every(v => shipCoords.indexOf(v));
        return attackCoords.every((v,i) => shipCoords[i] === v)
    }
    let hit = (attackCoords) => {
        if(checkHitOrMiss(attackCoords)) {
            // didHit = true;
            shipLength--;
            console.log('a hit!! when coords matches formation', shipLength);
            return shipLength;
        } else {
            return missFired(attackCoords);
            // console.log("[]")
        }
    };
    let isSunk = () => {
        if(shipLength === 0) {
            console.log('battleship sunk, when all consisting grids are destroyed');
            return true;
        }
    }
    let missFired = (coords) => {
        if(!checkHitOrMiss(coords)) {
            console.log('missfired, logs shot coords');
            logShots = coords;
            return logShots;
        }
    }
    // let fleetStatus = () => console.log('all ships health report');
    // let allShipsHasSunk = () => console.log('all ships has sunk');
    let alphabetsSet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let numeralsSet = ['0','1','2','3','4','5','6','7','8','9'];
    let trackingShipsUniqueCoords = [];
    
    let randomCoords = () => {
        let randomNumber = Math.floor(Math.random()*alphabetsSet.length);
        let randomAlphabet = alphabetsSet[randomNumber];
        
        let randomNN = Math.floor(Math.random()*numeralsSet.length);
        let randomNumeral = numeralsSet[randomNN];

        return [randomAlphabet, randomNumeral];
    }
    
    let coordsGenerator = () => {
        // let randomNumber = Math.floor(Math.random()*alphabetsSet.length);
        // let randomAlphabet = alphabetsSet[randomNumber];
        
        // let randomNN = Math.floor(Math.random()*numeralsSet.length);
        // let randomNumeral = numeralsSet[randomNN];
        let [randomAlphabet, randomNumeral] = randomCoords();
        // console.log(randomAlphabet, randomNumeral, randomNN);
        return shipsRandomCoordsGenerator(randomAlphabet, Number(randomNumeral));
    }

    let shipsRandomCoordsGenerator = (alph, num) => {
        let isEmpty = trackingShipsUniqueCoords.length;
        let checkBoundary;
        // console.log("?!", alph, num, isEmpty, trackingShipsUniqueCoords);
        // chekcingUniques(alph, num);
        // console.log(isEmpty, "is")
        if(!isEmpty) {
            checkBoundary = num + 5 > 9;
            while(!checkBoundary) {
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 5));
                // trackingShipsUniqueCoords.push(creatingShip(alph, num, 5))
                // console.log("watt", creatingShip(alph, num, 5), trackingShipsUniqueCoords, trackingShipsUniqueCoords.length);
                return creatingShip(alph, num, 5);
            }
            return coordsGenerator();
        } else {
            let found;
            // console.log(found, alph, num, '<>')
            if(isEmpty === 1) {
                checkBoundary = num + 4 > 9;
                found = chekcingUniques(creatingShip(alph, num, 4));
                while(!checkBoundary && !found) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 4));
                    // console.log(creatingShip(alph, num, 4), "ba");
                    return creatingShip(alph, num, 4);
                }
            } else if(isEmpty === 2) {
                checkBoundary = num + 3 > 9;
                found = chekcingUniques(creatingShip(alph, num, 3));
                while(!checkBoundary && !found) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 3))
                    return creatingShip(alph, num, 3);
                }
            } else if(isEmpty === 3) {
                checkBoundary = num + 3 > 9;
                found = chekcingUniques(creatingShip(alph, num, 3));
                while(!checkBoundary && !found) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 3))
                    return creatingShip(alph, num, 3);
                }
            } else if(isEmpty === 4) {
                checkBoundary = num + 2 > 9;
                found = chekcingUniques(creatingShip(alph, num, 2));
                while(!checkBoundary && !found) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 2))
                    return creatingShip(alph, num, 2);
                }
            }
            return coordsGenerator();
        }
    }

    let creatingShip = (alph, num, length) => {
        let consecutiveCoords = [];
        let i = 0;
        while(i < length) {
            consecutiveCoords.push([alph, num+i]);
            i++;
        }
        return consecutiveCoords;
    }

    let chekcingUniques = (coords) => {
        let flattened = trackingShipsUniqueCoords.flat(1);
        // let found = flattened.some(ar => coords[0] === alph && coords[1] === num)
        let found = flattened.some(ar =>false );
        let chk = flattened.some(ar => coords.some(cr => cr[0] == ar[0] && cr[1] == ar[1]))
        // console.log(trackingShipsUniqueCoords, 'ready for!!', flattened, coords, chk);
        // return found;
        return chk
    }
    

    return {
        hit,
        isSunk,
        checkHitOrMiss,
        missFired,
        logShots,
        shipCoords,
        shipLength,
        coordsGenerator,
        trackingShipsUniqueCoords,
        randomCoords
        // shipsRandomCoordsGenerator
        // fleetStatus,
        // allShipsHasSunk
    }
}

module.exports = Ship;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_codes_gameLogic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_codes/gameLogic */ "./src/game_codes/gameLogic.js");
/* harmony import */ var _game_codes_gameLogic__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_game_codes_gameLogic__WEBPACK_IMPORTED_MODULE_0__);


let Game = _game_codes_gameLogic__WEBPACK_IMPORTED_MODULE_0___default()();
Game.startGame();
Game.sneakPeakOnComputer();
// Game.re_arrange_human_fleets();
// game().playAgain();

let startAgain = () => {
    document.querySelector('.sneak-peak').textContent = 'sneak peak'
    let Game = _game_codes_gameLogic__WEBPACK_IMPORTED_MODULE_0___default()();
    Game.removeComputerGameBoard();
    Game.removeHumanGameBoard();
    Game.creatingComputerGameBoard();
    Game.creatingHumanGameBoard();
    Game.humanFleets();
    Game.computerFleet();
    Game.beginPlay();
}

let playAgain = document.querySelector('.play-again');
playAgain.addEventListener('click', startAgain);

let btn = document.querySelector('.re-arrange-ships-formation');
btn.addEventListener('click', startAgain);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwX3RkZC8uL3NyYy9nYW1lX2NvZGVzL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX3RkZC8uL3NyYy9nYW1lX2NvZGVzL2dhbWVMb2dpYy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX3RkZC8uL3NyYy9nYW1lX2NvZGVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX3RkZC8uL3NyYy9nYW1lX2NvZGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF90ZGQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF90ZGQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF90ZGQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBfdGRkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF90ZGQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX3RkZC8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxhQUFhLG1CQUFPLENBQUMsd0NBQVE7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSw0Q0FBNEMsc0JBQXNCO0FBQ2xFO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiw0Q0FBNEMsbUJBQW1CO0FBQy9EO0FBQ0E7QUFDQSxTO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxFQUFFO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCOzs7Ozs7Ozs7O0FDdGVBLGdCQUFnQixtQkFBTyxDQUFDLGtEQUFhO0FBQ3JDLGVBQWUsbUJBQU8sQ0FBQyw0Q0FBVTtBQUNqQyxhQUFhLG1CQUFPLENBQUMsd0NBQVE7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLDhDQUE4Qzs7QUFFOUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLGlEQUFpRDs7QUFFakQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCOzs7Ozs7Ozs7O0FDN0lBLGFBQWEsbUJBQU8sQ0FBQyx3Q0FBUTs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCOzs7Ozs7Ozs7O0FDdEZBLGVBQWUsbUJBQU8sQ0FBQyw0Q0FBVTs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0I7Ozs7OztVQy9KQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7QUNOeUM7O0FBRXpDLFdBQVcsNERBQUk7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw0REFBSTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwwQyIsImZpbGUiOiJtYWluQnVuZGxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi9zaGlwXCIpO1xuXG5mdW5jdGlvbiBHYW1lQm9hcmQocGxheWVyKSB7XG4gICAgLy8gZ2FtZWJvYXJkIHNob3VsZCBiZSBhYmxlIHRvIHBsYWNlIHNoaXBzIGF0IHNwZWNpZmljIGNvb3JkaW5hdGVzIGJ5IGNhbGxpbmcgc2hpcCBmYWN0b3J5IGZ1bmN0aW9uXG4gICAgbGV0IGN1cnJlbnRTaGlwID0gU2hpcChbXCJBXCIsIFwiNFwiXSwgMik7XG4gICAgbGV0IGxvZ2dpbmdNaXNzRmlyZWRTaG90cyA9IFtdO1xuICAgIGxldCBncmlkcztcbiAgICBsZXQgbG9nZ2luZ0hpdHMgPSBbXTtcbiAgICBsZXQgY29tcHV0ZXJDb29yZHMgPSBbXTtcbiAgICBsZXQgaHVtYW5Db29yZHMgPSBbXTtcbiAgICBsZXQgcGxheWVyVHVybkZsYWcgPSBmYWxzZTtcbiAgICBsZXQgZmlsdGVyZWQ7XG4gICAgbGV0IGludGVsbGlnZW50TW92ZXMgPSBbXTtcbiAgICBsZXQgbG9nZ2luZ0FsbFNob3RzRmlyZWQgPSBbXTtcblxuICAgIC8vIGxldCBjb21tZW5jZUF0dGFjayA9IHNoaXAoY29vcmRzKTtcbiAgICBsZXQgc2hpcHNIZWFsdGggPSB7fTtcbiAgICBsZXQgZmxlZXRTYW5rZWQgPSB7fTtcblxuICAgIGxldCByZWNpZXZlQXR0YWNrcyA9IGNvb3JkcyA9PiB7XG4gICAgICAgIGxldCBjaGVja0F0dGFjayA9IGN1cnJlbnRTaGlwLmNoZWNrSGl0T3JNaXNzKGNvb3Jkcyk7XG4gICAgICAgIGlmKGNoZWNrQXR0YWNrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2hpcC5oaXQoY29vcmRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRTaGlwLm1pc3NGaXJlZChjb29yZHMpO1xuICAgICAgICAgICAgbG9nZ2luZ01pc3NGaXJlZFNob3RzLnB1c2goY29vcmRzKTtcbiAgICAgICAgICAgIHJldHVybiBsb2dnaW5nTWlzc0ZpcmVkU2hvdHM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcGxhY2VTaGlwcyA9IChjb29yZHMsIGJvYXJkKSA9PiB7XG4gICAgICAgIGlmKGJvYXJkKSB7XG4gICAgICAgICAgICBpZihib2FyZC5jbGFzc05hbWUuaW5jbHVkZXMgKCdib2FyZC1jb250YWluZXItZm9yLWNvbXB1dGVyJykpIHtcbiAgICAgICAgICAgICAgICBwbGFjaW5nU2hpcHNGb3JDb21wdXRlcihib2FyZCwgY29vcmRzKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGFjaW5nU2hpcHNGb3JIdW1hbihib2FyZCwgY29vcmRzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHBsYWNpbmdTaGlwc0Zvckh1bWFuID0gKGJvYXJkLCBjb29yZHMpID0+IHtcbiAgICAgICAgQXJyYXkuZnJvbShib2FyZC5jaGlsZHJlbikuZm9yRWFjaCgoZ3JpZCkgPT4ge1xuICAgICAgICAgICAgbGV0IGlkeCA9IDA7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYoZ3JpZC52YWx1ZVswXSA9PT0gY29vcmRzW2lkeF1bMF0gJiYgZ3JpZC52YWx1ZVsxXSA9PSBjb29yZHNbaWR4XVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBncmlkLmNsYXNzTmFtZSA9ICdzaGlwLXBsYWNlZCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeCsrO1xuICAgICAgICAgICAgfSB3aGlsZShpZHggPCBjb29yZHMubGVuZ3RoKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgcGxhY2luZ1NoaXBzRm9yQ29tcHV0ZXIgPSAoYm9hcmQsIGNvb3JkcykgPT4ge1xuICAgICAgICBBcnJheS5mcm9tKGJvYXJkLmNoaWxkcmVuKS5mb3JFYWNoKChncmlkKSA9PiB7XG4gICAgICAgICAgICBsZXQgaWR4ID0gMDtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZihncmlkLnZhbHVlWzBdID09PSBjb29yZHNbaWR4XVswXSAmJiBncmlkLnZhbHVlWzFdID09IGNvb3Jkc1tpZHhdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdyaWQuY2xhc3NOYW1lID0gJ3NoaXAtcGxhY2VkJztcbiAgICAgICAgICAgICAgICAgICAgLy8gZ3JpZC5jbGFzc0xpc3QuYWRkKClcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC5jbGFzc05hbWUgPSAnaGlkZS1zaGlwJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4Kys7XG4gICAgICAgICAgICB9IHdoaWxlKGlkeCA8IGNvb3Jkcy5sZW5ndGgpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGxldCB0b2dnbGluZ0NvbXB1dGVyRmxlZXRWaXN1YWxzID0gKCkgPT4ge1xuICAgICAgICBsZXQgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuICAgICAgICBsZXQgc25lYWtQZWFrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNuZWFrLXBlYWsnKTtcbiAgICAgICAgQXJyYXkuZnJvbShib2FyZC5jaGlsZHJlbikuZm9yRWFjaChncmlkID0+IHtcbiAgICAgICAgICAgIGlmKGdyaWQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlLXNoaXAnKSkge1xuICAgICAgICAgICAgICAgIGdyaWQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS1zaGlwJyk7XG4gICAgICAgICAgICAgICAgZ3JpZC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZCcpO1xuICAgICAgICAgICAgICAgIHNuZWFrUGVhay50ZXh0Q29udGVudCA9ICd0dXJuIG9mZiBzbmVhayBwZWFrJztcbiAgICAgICAgICAgIH0gZWxzZSBpZihncmlkLmNsYXNzTGlzdC5jb250YWlucygnc2hpcC1wbGFjZWQnKSkge1xuICAgICAgICAgICAgICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgnaGlkZS1zaGlwJyk7XG4gICAgICAgICAgICAgICAgZ3JpZC5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwLXBsYWNlZCcpO1xuICAgICAgICAgICAgICAgIHNuZWFrUGVhay50ZXh0Q29udGVudCA9ICdzbmVhayBwZWFrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgZ2V0Q29vcmRzRnJvbUNsaWNrID0gKGJvYXJkKSA9PiB7XG4gICAgICAgIGlmKGJvYXJkKSB7XG4gICAgICAgICAgICBib2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdyaWRDbGlja2VkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBnZXRDb29yZHNGb3JDb21wdXRlciA9IChib2FyZCkgPT4ge1xuICAgICAgICBsZXQgW2FscGgsIG51bV0gPSBTaGlwKCkucmFuZG9tQ29vcmRzKCk7XG4gICAgICAgIGxldCBjaGVja0Nvb3JkcyA9IFthbHBoLCBudW1dO1xuICAgICAgICBsZXQgY2hlY2tCb2FyZCA9IGJvYXJkLnBhcmVudE5vZGUuY2xhc3NOYW1lXG4gICAgICAgIGxldCBmb3VuZDtcbiAgICAgICAgLy8gbGV0IGRvZXNMb2dBbHJlYWR5RXhpc3RcbiAgICAgICAgbGV0IGFscmVhZHlWaXNpdGVkID0gY2hlY2tDb29yZHNFeGlzdEluQWxsU2hvdHMoY2hlY2tDb29yZHMpO1xuICAgICAgICBpZihjaGVja0JvYXJkID09ICdodW1hbi1ib2FyZCcgJiYgIWFscmVhZHlWaXNpdGVkKSB7XG4gICAgICAgICAgICBmb3VuZCA9IGNoZWNrSHVtYW5Db29yZHNNYXRjaGVkKGNoZWNrQ29vcmRzLCBjaGVja0JvYXJkKTtcbiAgICAgICAgICAgIHdoaWNoU2hpcE1vZHMoY2hlY2tDb29yZHMsIGh1bWFuQ29vcmRzLCBjaGVja0JvYXJkKTtcbiAgICAgICAgICAgIGlmKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tDb29yZHNCb3VuZGFyeVRvSW1wcm92ZUFjY3VyYWN5KGNoZWNrQ29vcmRzKVxuICAgICAgICAgICAgICAgIG1hcmtTaGlwQmVpbmdIaXQoY2hlY2tDb29yZHMsIGNoZWNrQm9hcmQpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm91bmQhIVwiLCBjaGVja0Nvb3JkcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtaXNzZWRcIiwgaHVtYW5Db29yZHMsIGNoZWNrQ29vcmRzKTtcbiAgICAgICAgICAgICAgICBsb2dnaW5nTWlzc0ZpcmVkU2hvdHMucHVzaCh7Y29tcHV0ZXI6IGNoZWNrQ29vcmRzfSk7XG4gICAgICAgICAgICAgICAgaWYoIWFscmVhZHlWaXNpdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pc3NIaXRzKGNoZWNrQ29vcmRzLCBjaGVja0JvYXJkKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdldENvb3Jkc0ZvckNvbXB1dGVyKGJvYXJkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgIC8vICAgICBnZXRDb29yZHNGb3JDb21wdXRlcihib2FyZClcbiAgICAgICAgLy8gfVxuICAgICAgICBcbiAgICAgICAgbG9nZ2luZ0FsbFNob3RzRmlyZWQucHVzaChjaGVja0Nvb3Jkcyk7XG4gICAgfVxuXG4gICAgbGV0IGNoZWNrQ29vcmRzQm91bmRhcnlUb0ltcHJvdmVBY2N1cmFjeSA9IChjb29yZHMpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY29vcmRzLCBodW1hbkNvb3JkcywgXCJodW1hbi1ib2FyZFwiKVxuICAgICAgICBsZXQgY2hlY2tJbmRleDtcbiAgICAgICAgaHVtYW5Db29yZHMuZm9yRWFjaCgoYXJyLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGFyci5mb3JFYWNoKChwYWlyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYocGFpclswXSA9PSBjb29yZHNbMF0gJiYgcGFpclsxXSA9PSBjb29yZHNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tJbmRleCA9IGlkeDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICBpbnRlbGxpZ2VudE1vdmVzID0gaHVtYW5Db29yZHNbY2hlY2tJbmRleF07XG4gICAgICAgIGZpbHRlcmluZ0ludGxNb3Zlc0Nvb3Jkcyhjb29yZHMpO1xuICAgIH1cblxuICAgIGxldCBjaGVja0Nvb3Jkc0V4aXN0SW5BbGxTaG90cyA9IChjb29yZHMpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY29vcmRzLCBsb2dnaW5nQWxsU2hvdHNGaXJlZCk7XG4gICAgICAgIGxldCBpc1Zpc2l0ZWQ7XG4gICAgICAgIGxvZ2dpbmdBbGxTaG90c0ZpcmVkLmZvckVhY2goY3IgPT4ge1xuICAgICAgICAgICAgaWYoY3JbMF0gPT0gY29vcmRzWzBdICYmIGNyWzFdID09IGNvb3Jkc1sxXSkgaXNWaXNpdGVkID0gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc0Npc2l0ZWRcIiwgaXNWaXNpdGVkLCBKU09OLnN0cmluZ2lmeShsb2dnaW5nQWxsU2hvdHNGaXJlZCkpXG4gICAgICAgIHJldHVybiBpc1Zpc2l0ZWQ7XG4gICAgfVxuXG4gICAgbGV0IHBsYXllcnNUdXJuID0gKCkgPT4ge1xuICAgICAgICBsZXQgdHVybnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuICAgICAgICBcbiAgICAgICAgbGV0IGZsYWcgPSB0cnVlO1xuICAgICAgICB0dXJucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmKGV2dC50YXJnZXQudmFsdWUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYoZmxhZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGVydCgncGxheWVyIDInKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZENsaWNrZWQoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBhbGVydCgncGxheWVyIDEnKTtcbiAgICAgICAgICAgICAgICBsZXQgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgaWYoaW50ZWxsaWdlbnRNb3Zlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRDb29yZHNGb3JDb21wdXRlcihib2FyZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGluZ0Nvb3JkcyA9IHJhbmRvbWx5U2VsZWN0aW5nSW50bENvb3JkcygpO1xuICAgICAgICAgICAgICAgICAgICBsb2dnaW5nQWxsU2hvdHNGaXJlZC5wdXNoKHNlbGVjdGluZ0Nvb3Jkcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpY2hTaGlwTW9kcyhzZWxlY3RpbmdDb29yZHMsIGh1bWFuQ29vcmRzLCAnaHVtYW4tYm9hcmQnKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya1NoaXBCZWluZ0hpdChzZWxlY3RpbmdDb29yZHMsICdodW1hbi1ib2FyZCcpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyaW5nSW50bE1vdmVzQ29vcmRzKHNlbGVjdGluZ0Nvb3Jkcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnYWxyZWFkeSB2aXNpdGVkISEnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgZmlsdGVyaW5nSW50bE1vdmVzQ29vcmRzID0gKGNvb3JkcykgPT4ge1xuICAgICAgICBsZXQgZmlsdGVyZWQgPSBpbnRlbGxpZ2VudE1vdmVzLm1hcChwYWlyID0+IHBhaXJbMF0gPT0gY29vcmRzWzBdICYmIHBhaXJbMV0gPT0gY29vcmRzWzFdID8gZmFsc2UgOiBwYWlyKS5maWx0ZXIodj0+diE9ZmFsc2UpO1xuICAgICAgICBpbnRlbGxpZ2VudE1vdmVzID0gZmlsdGVyZWQ7XG4gICAgfVxuXG4gICAgbGV0IHJhbmRvbWx5U2VsZWN0aW5nSW50bENvb3JkcyA9ICgpID0+IHtcbiAgICAgICAgbGV0IHJhbmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqaW50ZWxsaWdlbnRNb3Zlcy5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gaW50ZWxsaWdlbnRNb3Zlc1tyYW5kXTtcbiAgICB9XG5cbiAgICBsZXQgZ3JpZENsaWNrZWQgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGxldCBjaGVja0Nvb3JkcyA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgICAgIGxldCBjaGVja0JvYXJkID0gZXZ0LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NOYW1lO1xuICAgICAgICBsZXQgZm91bmQ7XG4gICAgICAgIGlmKGNoZWNrQm9hcmQgPT0gJ2NvbXB1dGVyLWJvYXJkJykge1xuICAgICAgICAgICAgZm91bmQgPSBjaGVja0NvbXB1dGVyQ29vcmRzTWF0Y2hlZChjaGVja0Nvb3Jkcyk7XG4gICAgICAgICAgICB3aGljaFNoaXBNb2RzKGNoZWNrQ29vcmRzLCBjb21wdXRlckNvb3JkcywgY2hlY2tCb2FyZCk7XG4gICAgICAgICAgICBwbGF5ZXJUdXJuRmxhZyA9IHRydWU7XG4gICAgICAgICAgICBpZihmb3VuZCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm91bmQhIVwiLCBjaGVja0Nvb3JkcywgY29tcHV0ZXJDb29yZHMpXG4gICAgICAgICAgICAgICAgbWFya1NoaXBCZWluZ0hpdChjaGVja0Nvb3JkcywgY2hlY2tCb2FyZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dpbmdNaXNzRmlyZWRTaG90cy5wdXNoKHtodW1hbjogY2hlY2tDb29yZHN9KTtcbiAgICAgICAgICAgICAgICBtaXNzSGl0cyhjaGVja0Nvb3JkcywgY2hlY2tCb2FyZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICB9XG5cbiAgICBsZXQgd2hpY2hTaGlwTW9kcyA9IChjb29yZHMsIGNvb3Jkc0FyciwgY2hlY2tTaWRlKSA9PiB7XG4gICAgICAgIGxldCBjaGVjayA9IGNvb3Jkc0Fyci5tYXAoYXJyID0+IHtcbiAgICAgICAgICAgIGlmKGNvb3JkcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyLnNvbWUoY3IgPT4gY3JbMF0gPT0gY29vcmRzWzBdICYmIGNyWzFdID09IGNvb3Jkc1sxXSA/IHRydWUgOiBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmluZGV4T2YodHJ1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hlY2s6OlwiLCBjaGVjayk7XG4gICAgICAgIFxuICAgICAgICBpZihjaGVjayAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibGVuZ3RoXCIsIGNvb3Jkc0FycltjaGVja10ubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBjb29yZHNBcnJbY2hlY2tdLmxlbmd0aDtcbiAgICAgICAgICAgIGtlZXBpbmdUcmFja09mU2hpcHMoY2hlY2ssIGNoZWNrU2lkZSwgbGVuZ3RoKTtcbiAgICAgICAgfSBcbiAgICB9XG5cbiAgICBsZXQgY2hlY2tIdW1hbkNvb3Jkc01hdGNoZWQgPSBjb29yZHMgPT4ge1xuICAgICAgICBsZXQgZm91bmQ7XG4gICAgICAgIGlmKGNvb3JkcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvdW5kID0gaHVtYW5Db29yZHMuZmxhdCgxKS5zb21lKGFyID0+IGFyWzBdID09IGNvb3Jkc1swXSAmJiBhclsxXSA9PSBjb29yZHNbMV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGZvdW5kLCBjb29yZHMsIFwiaHVtYW4tYm9hcmRcIiwgaHVtYW5Db29yZHMpO1xuICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgfVxuXG4gICAgbGV0IGNoZWNrQ29tcHV0ZXJDb29yZHNNYXRjaGVkID0gKGNvb3JkcykgPT4ge1xuICAgICAgICBsZXQgZm91bmRcbiAgICAgICAgaWYoY29vcmRzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm91bmQgPSBjb21wdXRlckNvb3Jkcy5mbGF0KDEpLnNvbWUoYXIgPT4gYXJbMF0gPT0gY29vcmRzWzBdICYmIGFyWzFdID09IGNvb3Jkc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coY29tcHV0ZXJDb29yZHMsIFwiaGVyZVwiLCAgZm91bmQsIGNvb3Jkcyk7XG4gICAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9XG5cbiAgICBsZXQga2VlcGluZ1RyYWNrT2ZTaGlwcyA9IChpZHgsIHBsYXllciwgc2hpcExlbmd0aCkgPT4geyAgICAgICAgXG4gICAgICAgIGlmKHBsYXllciA9PSAnaHVtYW4tYm9hcmQnKSB7XG4gICAgICAgICAgICBhZGp1c3RpbmdQbGF5ZXJzU2hpcEhlYWx0aChpZHgsICdodW1hbicsIHNoaXBMZW5ndGgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZGp1c3RpbmdQbGF5ZXJzU2hpcEhlYWx0aChpZHgsICdjb21wdXRlcicsIHNoaXBMZW5ndGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGFkanVzdGluZ1BsYXllcnNTaGlwSGVhbHRoID0gKGlkeCwgd2hpY2hCb2FyZCwgc2hpcExlbmd0aCkgPT4ge1xuICAgICAgICBmb3IobGV0IGtleSBpbiBzaGlwc0hlYWx0aCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2hpcHNIZWFsdGgsIHdoaWNoQm9hcmQsIGlkeCwgXCI8PlwiKVxuICAgICAgICAgICAgaWYoa2V5LmluY2x1ZGVzKHdoaWNoQm9hcmQpKSB7XG4gICAgICAgICAgICAgICAgaWYoc2hpcHNIZWFsdGhba2V5XS5sZW5ndGggPT0gc2hpcExlbmd0aCAmJiBrZXkuaW5kZXhPZihpZHgpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoaXBzSGVhbHRoW2tleV0ucmVtYWluaW5nTGVuZ3RoLS07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc2hpcHNIZWFsdGhba2V5XS5yZW1haW5pbmdMZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hpcFNhbmtlZE1vZHMod2hpY2hCb2FyZCxzaGlwc0hlYWx0aFtrZXldLGlkeClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gICAgXG5cbiAgICBsZXQgbWlzc0hpdHMgPSAoY29vcmRzLCB3aGljaFNpZGUpID0+IHtcbiAgICAgICAgbGV0IGJvYXJkID0gcmV0dXJuQW55R2FtZUJvYXJkKHdoaWNoU2lkZSk7XG4gICAgICAgIG1hcmtpbmdNaXNzZXNPbkJvYXJkKGJvYXJkLCBjb29yZHMpXG4gICAgfVxuXG4gICAgbGV0IHJldHVybkFueUdhbWVCb2FyZCA9ICh3aGljaFNpZGUpID0+IHtcbiAgICAgICAgbGV0IGJvYXJkO1xuICAgICAgICBpZih3aGljaFNpZGUuc3BsaXQoXCItXCIpWzBdID09ICdodW1hbicpIHtcbiAgICAgICAgICAgIGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXJkLWNvbnRhaW5lcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2FyZDtcbiAgICB9XG5cbiAgICBsZXQgbWFya2luZ01pc3Nlc09uQm9hcmQgPSAoYm9hcmQsIGNvb3JkcykgPT4ge1xuICAgICAgICBpZihib2FyZCkgeyBcbiAgICAgICAgICAgIEFycmF5LmZyb20oYm9hcmQuY2hpbGRyZW4pLmZvckVhY2goZ3JpZCA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZ3JpZC52YWx1ZVswXSA9PSBjb29yZHNbMF0gJiYgZ3JpZC52YWx1ZVsxXSA9PSBjb29yZHNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC50ZXh0Q29udGVudCA9IFwiWFwiO1xuICAgICAgICAgICAgICAgICAgICBncmlkLmNsYXNzTGlzdC5hZGQoXCJ1bmNsaWNrYWJsZVwiLCBcIm1pc3MtZmlyZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbWFya1NoaXBCZWluZ0hpdCA9IChjb29yZHMsIHdoaWNoU2lkZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhodW1hbkNvb3JkcywgY29tcHV0ZXJDb29yZHMsIHdoaWNoU2lkZSwgY29vcmRzKTtcbiAgICAgICAgbGV0IGJvYXJkID0gcmV0dXJuQW55R2FtZUJvYXJkKHdoaWNoU2lkZSk7XG4gICAgICAgIFxuICAgICAgICBpZihib2FyZCkgeyBcbiAgICAgICAgICAgIEFycmF5LmZyb20oYm9hcmQuY2hpbGRyZW4pLmZvckVhY2goKGdyaWQsIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGdyaWQudmFsdWVbMF0gPT0gY29vcmRzWzBdICYmIGdyaWQudmFsdWVbMV0gPT0gY29vcmRzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyaWQudGV4dENvbnRlbnQgPSBcIk9cIjtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC5jbGFzc0xpc3QuYWRkKFwidW5jbGlja2FibGVcIiwgXCJzaGlwLWhpdHRlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzaGlwU2Fua2VkTW9kcyA9ICh3aGljaFBsYXllciwgd2hpY2hTaGlwLCBpZHgpID0+IHtcbiAgICAgICAgbGV0IGJvYXJkO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnPz8nLCB3aGljaFBsYXllciwgd2hpY2hTaGlwLCBpZHgpXG4gICAgICAgIGlmKHdoaWNoUGxheWVyID09ICdodW1hbicpIHtcbiAgICAgICAgICAgIGJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXJkLWNvbnRhaW5lcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuICAgICAgICB9XG4gICAgICAgIGRpc2FibGluZ1NoaXBBZnRlckhpdCh3aGljaFNoaXAsIGlkeCwgYm9hcmQpO1xuICAgICAgICBjaGVja0FsbFNoaXBzU2Fuayh3aGljaFBsYXllcik7XG4gICAgfVxuXG4gICAgbGV0IGRpc2FibGluZ1NoaXBBZnRlckhpdCA9IChzaGlwLCBpZHgsIGJvYXJkKSA9PiB7XG4gICAgICAgIGlmKGJvYXJkKSB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGJvYXJkLmNoaWxkcmVuKS5mb3JFYWNoKGdyaWQgPT4ge1xuICAgICAgICAgICAgICAgc2hpcC5jb29yZHMuZm9yRWFjaChjb29yZHMgPT4ge1xuICAgICAgICAgICAgICAgICAgIGlmKGdyaWQudmFsdWVbMF0gPT0gY29vcmRzWzBdICYmIGdyaWQudmFsdWVbMV0gPT0gY29vcmRzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdyaWQuY2xhc3NOYW1lID0gJ2JvYXJkLWdyaWRzJztcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC5jbGFzc0xpc3QuYWRkKCd1bmNsaWNrYWJsZScpO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlbW92aW5nU2hpcHNGcm9tQm9hcmQgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgQXJyYXkuZnJvbShib2FyZC5jaGlsZHJlbikuZm9yRWFjaChncmlkID0+IHtcbiAgICAgICAgICAgIGdyaWQuY2xhc3NOYW1lID0gJ2JvYXJkLWdyaWRzJztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IGNoZWNrV2lubmVyID0gKHdoaWNoQm9hcmQpID0+IHtcbiAgICAgICAgZmxlZXRTYW5rZWRbd2hpY2hCb2FyZF0gPyBmbGVldFNhbmtlZFt3aGljaEJvYXJkXSsrIDogZmxlZXRTYW5rZWRbd2hpY2hCb2FyZF09MTtcbiAgICAgICAgaWYoZmxlZXRTYW5rZWRbd2hpY2hCb2FyZF0gPT0gNSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY2hlY2tBbGxTaGlwc1NhbmsgPSAod2hpY2hCb2FyZCkgPT4ge1xuICAgICAgICBpZih3aGljaEJvYXJkID09ICdodW1hbicpIHtcbiAgICAgICAgICAgIGlmKGNoZWNrV2lubmVyKHdoaWNoQm9hcmQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvbXB1dGVyIHdpbnMhIScpO1xuICAgICAgICAgICAgICAgIGFmdGVyV2lubmVySXNEZWNpZGVkKHdoaWNoQm9hcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoY2hlY2tXaW5uZXIod2hpY2hCb2FyZCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaHVtYW4gd2lucyEhJyk7XG4gICAgICAgICAgICAgICAgYWZ0ZXJXaW5uZXJJc0RlY2lkZWQod2hpY2hCb2FyZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJXaW5uZXJJc0RlY2lkZWQgPSAod2hpY2hCb2FyZCkgPT4ge1xuICAgICAgICBsZXQgaHVtYW5Cb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZC1jb250YWluZXInKTtcbiAgICAgICAgbGV0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuICAgICAgICBsZXQgd2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuXG4gICAgICAgIGh1bWFuQm9hcmQuc3R5bGUub3BhY2l0eSA9IFwiNTYlXCI7XG4gICAgICAgIGNvbXB1dGVyQm9hcmQuc3R5bGUub3BhY2l0eSA9IFwiNTYlXCI7XG5cbiAgICAgICAgaHVtYW5Cb2FyZC5jbGFzc0xpc3QuYWRkKCdib2FyZHMtYmVoaW5kJyk7XG4gICAgICAgIGNvbXB1dGVyQm9hcmQuY2xhc3NMaXN0LmFkZCgnYm9hcmRzLWJlaGluZCcpO1xuXG4gICAgICAgIGZyZWV6ZUdyaWRzKGh1bWFuQm9hcmQpO1xuICAgICAgICBmcmVlemVHcmlkcyhjb21wdXRlckJvYXJkKTtcbiAgICAgICAgcmVtb3ZpbmdQcmV2aW91c0JvYXJkR3JpZHMoKTtcblxuICAgICAgICBpZih3aGljaEJvYXJkID09ICdodW1hbicpIHtcbiAgICAgICAgICAgIGFubm91bmNlV2lubmVyKCdjb21wdXRlcicsIHdpbm5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbm5vdW5jZVdpbm5lcignaHVtYW4nLCB3aW5uZXIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzaG93aW5nUGxheUFnYWluT3B0aW9uKCk7XG4gICAgfVxuXG4gICAgbGV0IGFubm91bmNlV2lubmVyID0gKHBsYXllciwgd2lubmVyKSA9PiB7XG4gICAgICAgIHdpbm5lci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgd2lubmVyLnRleHRDb250ZW50ID0gcGxheWVyK1wiIHdpbnMhIVwiXG4gICAgICAgIGFsZXJ0KHBsYXllcitcIiB3aW5zISFcIik7XG4gICAgfVxuXG4gICAgbGV0IHVuZnJlZXplQnRucyA9ICgpID0+IHtcbiAgICAgICAgbGV0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZS1hcnJhbmdlLWh1bWFuLWZvcm1hdGlvbicpO1xuICAgICAgICBsZXQgYnRuUmVhZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaHVtYW4tcmVhZHknKTtcblxuICAgICAgICBsZXQgYnRuMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZS1hcnJhbmdlLWNvbXB1dGVyLWZvcm1hdGlvbicpO1xuICAgICAgICBsZXQgYnRuUmVhZHkyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXB1dGVyLXJlYWR5Jyk7XG5cbiAgICAgICAgcmVtb3ZpbmdDbGFzc0ZvckJ0bnMoW2J0biwgYnRuUmVhZHksIGJ0bjIsIGJ0blJlYWR5Ml0pO1xuICAgIH1cblxuICAgIGxldCByZW1vdmluZ0NsYXNzRm9yQnRucyA9IChidG5zKSA9PiB7XG4gICAgICAgIGJ0bnMuZm9yRWFjaChidG4gPT4gYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkLWJ0bicpKTtcbiAgICB9XG5cbiAgICBsZXQgZnJlZXplR3JpZHMgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYm9hcmQsIFwiYm9hcmQhIVwiKTtcbiAgICAgICAgQXJyYXkuZnJvbShib2FyZC5jaGlsZHJlbikuZm9yRWFjaChncmlkID0+IHtcbiAgICAgICAgICAgIGdyaWQuY2xhc3NMaXN0LmFkZCgndW5jbGlja2FibGUnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IHJlbW92aW5nUHJldmlvdXNCb2FyZEdyaWRzID0gKCkgPT4ge1xuICAgICAgICBsZXQgaHVtYW5Cb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZC1jb250YWluZXInKTtcbiAgICAgICAgbGV0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuXG4gICAgICAgIC8vIHJlbW92aW5nU2hpcHNGcm9tQm9hcmQoaHVtYW5Cb2FyZCk7XG4gICAgICAgIC8vIHJlbW92aW5nU2hpcHNGcm9tQm9hcmQoY29tcHV0ZXJCb2FyZCk7XG5cbiAgICAgICAgZnJlZXplR3JpZHMoaHVtYW5Cb2FyZCk7XG4gICAgICAgIGZyZWV6ZUdyaWRzKGNvbXB1dGVyQm9hcmQpO1xuXG4gICAgICAgIGh1bWFuQ29vcmRzID0gW107XG4gICAgICAgIGNvbXB1dGVyQ29vcmRzID0gW107XG4gICAgfVxuXG4gICAgbGV0IHNob3dpbmdQbGF5QWdhaW5PcHRpb24gPSAoKSA9PiB7XG4gICAgICAgIGxldCBwbGF5QWdhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheS1hZ2FpbicpO1xuICAgICAgICBwbGF5QWdhaW4uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgbGV0IGZyZXNoQ29vcmRzID0gKCkgPT4ge1xuICAgICAgICBodW1hbkNvb3JkcyA9IFtdO1xuICAgIH1cbiAgICBcbiAgICBsZXQgcG9wdWxhdGVCb2FyZE9uRE9NID0gKG51bSkgPT4ge1xuICAgICAgICAvLyBncmlkcyA9IDEwO1xuICAgICAgICBncmlkcyA9IG51bTtcbiAgICAgICAgcmV0dXJuIGdyaWRzO1xuICAgIH1cblxuICAgIGxldCBjcmVhdGluZ0dyaWRzRm9ySHVtYW4gPSAobnVtKSA9PiB7XG4gICAgICAgIHBvcHVsYXRlQm9hcmRPbkRPTShudW0pO1xuICAgICAgICBsZXQgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAvLyBsZXQgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5odW1hbi1ib2FyZCcpO1xuICAgICAgICBncmlkQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdib2FyZC1jb250YWluZXInO1xuICAgICAgICBncmlkQ29udGFpbmVyID0gY3JlYXRpbmdHcmlkcyhncmlkQ29udGFpbmVyKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZ3JpZENvbnRhaW5lcilcbiAgICAgICAgcmV0dXJuIGdyaWRDb250YWluZXI7XG4gICAgfVxuXG4gICAgbGV0IGNyZWF0aW5nR3JpZHMgPSAoZ3JpZENvbnRhaW5lcikgPT4ge1xuICAgICAgICBmb3IobGV0IGk9MDsgaTxncmlkczsgaSsrKSB7XG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajxncmlkczsgaisrKSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgZ3JpZHNcbiAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRpdi50ZXh0Q29udGVudCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUraSkrXCIgXCIrajtcbiAgICAgICAgICAgIGRpdi52YWx1ZSA9IFtTdHJpbmcuZnJvbUNoYXJDb2RlKDY1K2kpLCBgJHtqfWBdO1xuICAgICAgICAgICAgZGl2LmNsYXNzTmFtZSA9ICdib2FyZC1ncmlkcyc7XG4gICAgICAgICAgICBncmlkQ29udGFpbmVyLmFwcGVuZChkaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkQ29udGFpbmVyO1xuICAgIH1cblxuICAgIGxldCBjcmVhdGluZ0dyaWRzRm9yQ29tcHV0ZXIgPSAobnVtKSA9PiB7XG4gICAgICAgIHBvcHVsYXRlQm9hcmRPbkRPTShudW0pO1xuICAgICAgICBsZXQgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBncmlkQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdib2FyZC1jb250YWluZXItZm9yLWNvbXB1dGVyJztcbiAgICAgICAgZ3JpZENvbnRhaW5lciA9IGNyZWF0aW5nR3JpZHMoZ3JpZENvbnRhaW5lcik7XG4gICAgICAgIHJldHVybiBncmlkQ29udGFpbmVyO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0aW5nR3JpZHMsXG4gICAgICAgIHJlY2lldmVBdHRhY2tzLFxuICAgICAgICBwb3B1bGF0ZUJvYXJkT25ET00sXG4gICAgICAgIGxvZ2dpbmdNaXNzRmlyZWRTaG90cyxcbiAgICAgICAgcGxhY2VTaGlwcyxcbiAgICAgICAgY3JlYXRpbmdHcmlkc0ZvckNvbXB1dGVyLFxuICAgICAgICBjcmVhdGluZ0dyaWRzRm9ySHVtYW4sXG4gICAgICAgIGdldENvb3Jkc0Zyb21DbGljayxcbiAgICAgICAgZ3JpZENsaWNrZWQsXG4gICAgICAgIGNvbXB1dGVyQ29vcmRzLFxuICAgICAgICBodW1hbkNvb3JkcyxcbiAgICAgICAgc2hpcHNIZWFsdGgsXG4gICAgICAgIHJlbW92aW5nU2hpcHNGcm9tQm9hcmQsXG4gICAgICAgIGdldENvb3Jkc0ZvckNvbXB1dGVyLFxuICAgICAgICBwbGF5ZXJUdXJuRmxhZyxcbiAgICAgICAgcGxheWVyc1R1cm4sXG4gICAgICAgIGNoZWNrQWxsU2hpcHNTYW5rLFxuICAgICAgICByZW1vdmluZ1ByZXZpb3VzQm9hcmRHcmlkcyxcbiAgICAgICAgZnJlc2hDb29yZHMsXG4gICAgICAgIHRvZ2dsaW5nQ29tcHV0ZXJGbGVldFZpc3VhbHNcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUJvYXJkOyIsImxldCBHYW1lQm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpO1xuY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTtcblxubGV0IGdhbWUgPSAoKSA9PiB7XG4gICAgLy8gbWFpbiBnYW1lIGxvb3AgYW5kIERPTSBpbnRlcmFjdGlvblxuICAgIC8vIGxldCBodW1hbiA9IFBsYXllcignaHVtYW4nLCA1KTtcbiAgICAvLyBsZXQgY29tcHV0ZXIgPSBQbGF5ZXIoJ2NvbXB1dGVyJywgNSk7XG4gICAgbGV0IHNoaXAgPSBTaGlwKCk7XG4gICAgbGV0IGdhbWVCb2FyZCA9IEdhbWVCb2FyZCgpO1xuICAgIC8vIGxldCBzaGlwID0gIFNoaXAoKTtcbiAgICBsZXQgY29tcHV0ZXJGbGVldFNoaXBzQ29vcmRzID0gW107XG4gICAgbGV0IGh1bWFuRmxlZXRTaGlwc0Nvb3JkcyA9IFtdO1xuICAgIGxldCBjb21iaW5lZENvb3JkcyA9IFtdO1xuICAgIGxldCBmbGFnID0gZmFsc2U7XG4gICAgbGV0IHJlYWR5ID0ge307XG4gICAgLy8gY3JlYXRpbmcgaHVtYW4gcGxheWVyIGJhdHRsZXNoaXAgZ2FtZSBib2FyZCB3aXRoIGEgZ3JpZCBvZiAxMFgxMFxuICAgIGxldCBjcmVhdGluZ0h1bWFuR2FtZUJvYXJkID0gKCkgPT4ge1xuICAgICAgICBsZXQgaHVtYW5Cb2FyZCA9IGdhbWVCb2FyZC5jcmVhdGluZ0dyaWRzRm9ySHVtYW4oMTApO1xuICAgICAgICBsZXQgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaHVtYW4tYm9hcmQnKTtcbiAgICAgICAgaWYoYm9hcmQpIGJvYXJkLmFwcGVuZChodW1hbkJvYXJkKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGluZyBjb21wdXRlciBwbGF5ZXIgYmF0dGxlc2hpcCBnYW1lIGJvYXJkIHdpdGggYSBncmlkIG9mIDEwWDEwXG4gICAgbGV0IGNyZWF0aW5nQ29tcHV0ZXJHYW1lQm9hcmQgPSAoKSA9PiB7XG4gICAgICAgIGxldCBjb21wdXRlckJvYXJkID0gZ2FtZUJvYXJkLmNyZWF0aW5nR3JpZHNGb3JDb21wdXRlcigxMCk7XG4gICAgICAgIGxldCBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wdXRlci1ib2FyZCcpO1xuICAgICAgICBpZihib2FyZCkgYm9hcmQuYXBwZW5kKGNvbXB1dGVyQm9hcmQpO1xuICAgIH1cblxuICAgIC8vIHBsYWNpbmcgc2hpcHMgb24gZ2FtZSBib2FyZCBmb3IgaHVtYW4gcGxheWVyXG4gICAgbGV0IGh1bWFuRmxlZXRzID0gKCkgPT4ge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBzaGlwID0gIFNoaXAoKTtcbiAgICAgICAgZG97XG4gICAgICAgICAgICAvLyBidWlsZGluZ1NoaXBzKGkpO1xuICAgICAgICAgICAgYnVpbGRpbmdTaGlwcyhpLCBzaGlwKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfSB3aGlsZShpPDUpXG4gICAgICAgIGxldCBodW1hbkJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXJkLWNvbnRhaW5lcicpO1xuICAgICAgICBnYW1lQm9hcmQuZ2V0Q29vcmRzRnJvbUNsaWNrKGh1bWFuQm9hcmQpO1xuICAgICAgICBjb25zb2xlLmxvZyhnYW1lQm9hcmQuaHVtYW5Db29yZHMsICdodW1hbnMnKVxuICAgIH1cblxuICAgIGxldCBidWlsZGluZ1NoaXBzID0gKGlkeCwgc2hpcCkgPT4ge1xuICAgICAgICBsZXQgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyJyk7XG5cbiAgICAgICAgbGV0IHNoaXBDb29yZHMgPSBzaGlwLmNvb3Jkc0dlbmVyYXRvcigpO1xuICAgICAgICBcbiAgICAgICAgZ2FtZUJvYXJkLmh1bWFuQ29vcmRzLnB1c2goc2hpcENvb3Jkcyk7XG4gICAgICAgIFxuICAgICAgICBnYW1lQm9hcmQucGxhY2VTaGlwcyhzaGlwQ29vcmRzLCBib2FyZCk7XG5cbiAgICAgICAgZ2FtZUJvYXJkLnNoaXBzSGVhbHRoWydodW1hbicraWR4XSA9IHtjb29yZHM6IHNoaXBDb29yZHMsIGxlbmd0aDogc2hpcENvb3Jkcy5sZW5ndGgsIHJlbWFpbmluZ0xlbmd0aDogc2hpcENvb3Jkcy5sZW5ndGh9O1xuXG4gICAgICAgIGh1bWFuRmxlZXRTaGlwc0Nvb3Jkcy5wdXNoKHNoaXBDb29yZHMpO1xuICAgIH1cblxuICAgIGxldCBjb21wdXRlckZsZWV0ID0gKCkgPT4ge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBzaGlwID0gIFNoaXAoKTtcbiAgICAgICAgd2hpbGUoaSA8IDUpIHtcbiAgICAgICAgICAgIC8vIGNvbXB1dGVyU2hpcHMoaSk7XG4gICAgICAgICAgICBjb21wdXRlclNoaXBzKGksIHNoaXApO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxldCBib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZC1jb250YWluZXItZm9yLWNvbXB1dGVyJyk7XG4gICAgICAgIC8vIGdhbWVCb2FyZC5nZXRDb29yZHNGcm9tQ2xpY2soYm9hcmQpO1xuICAgICAgICBjb25zb2xlLmxvZyhnYW1lQm9hcmQuY29tcHV0ZXJDb29yZHMsICdjb21wdXRlcicpXG4gICAgfVxuXG4gICAgbGV0IGNvbXB1dGVyU2hpcHMgPSAoaWR4LCBzaGlwKSA9PiB7XG4gICAgICAgIGxldCBzaGlwQ29vcmRzID0gc2hpcC5jb29yZHNHZW5lcmF0b3IoKTtcblxuICAgICAgICBsZXQgYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuXG4gICAgICAgIGdhbWVCb2FyZC5jb21wdXRlckNvb3Jkcy5wdXNoKHNoaXBDb29yZHMpO1xuXG4gICAgICAgIC8vIEdhbWVCb2FyZCgpLnBsYWNlU2hpcHMoc2hpcENvb3JkcywgYm9hcmQpO1xuICAgICAgICBnYW1lQm9hcmQucGxhY2VTaGlwcyhzaGlwQ29vcmRzLCBib2FyZCk7XG5cbiAgICAgICAgZ2FtZUJvYXJkLnNoaXBzSGVhbHRoWydjb21wdXRlcicraWR4XSA9IHtjb29yZHM6IHNoaXBDb29yZHMsIGxlbmd0aDogc2hpcENvb3Jkcy5sZW5ndGgsIHJlbWFpbmluZ0xlbmd0aDogc2hpcENvb3Jkcy5sZW5ndGh9O1xuXG4gICAgICAgIGNvbXB1dGVyRmxlZXRTaGlwc0Nvb3Jkcy5wdXNoKHNoaXBDb29yZHMpXG4gICAgfVxuXG4gICAgbGV0IHJlbW92ZUh1bWFuR2FtZUJvYXJkID0gKCkgPT4ge1xuICAgICAgICBsZXQgaHVtYW5Cb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZC1jb250YWluZXInKTtcbiAgICAgICAgaHVtYW5Cb2FyZC5yZW1vdmUoKTtcbiAgICAgICAgLy8gdGhpcyBsaW5lIHdhcyBjYXVzaW5nIGh1bWFuQ29vcmRzIHRvIGJlY29tZSBlbXB0eT8hXG4gICAgICAgIC8vIGdhbWVCb2FyZC5odW1hbkNvb3JkcyA9IFtdO1xuICAgIH1cblxuICAgIGxldCByZW1vdmVDb21wdXRlckdhbWVCb2FyZCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQtY29udGFpbmVyLWZvci1jb21wdXRlcicpO1xuICAgICAgICBjb21wdXRlckJvYXJkLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGxldCBiZWdpblBsYXkgPSAoKSA9PiB7XG4gICAgICAgIGxldCB3aW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lubmVyJyk7XG4gICAgICAgIGxldCBwbGF5QWdhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheS1hZ2FpbicpO1xuICAgICAgICBcbiAgICAgICAgd2lubmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHBsYXlBZ2Fpbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBcbiAgICAgICAgZ2FtZUJvYXJkLnBsYXllcnNUdXJuKCk7XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgICAgICAgY3JlYXRpbmdIdW1hbkdhbWVCb2FyZCgpO1xuICAgICAgICBjcmVhdGluZ0NvbXB1dGVyR2FtZUJvYXJkKCk7XG4gICAgICAgIGh1bWFuRmxlZXRzKCk7XG4gICAgICAgIGNvbXB1dGVyRmxlZXQoKTtcbiAgICAgICAgLy8gd2FpdENvbXB1dGVyQmVSZWFkeSgpO1xuICAgICAgICBiZWdpblBsYXkoKTtcbiAgICB9XG5cbiAgICBsZXQgdG9nZ2xpbmdTbmVha1BlYWtPbkNvbXB1dGVyRmxlZXQgPSAoKSA9PiB7XG4gICAgICAgIGdhbWVCb2FyZC50b2dnbGluZ0NvbXB1dGVyRmxlZXRWaXN1YWxzKCk7XG4gICAgfVxuXG4gICAgbGV0IHNuZWFrUGVha09uQ29tcHV0ZXIgPSAoKSA9PiB7XG4gICAgICAgIGxldCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc25lYWstcGVhaycpO1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGluZ1NuZWFrUGVha09uQ29tcHV0ZXJGbGVldCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRpbmdDb21wdXRlckdhbWVCb2FyZCxcbiAgICAgICAgY3JlYXRpbmdIdW1hbkdhbWVCb2FyZCwgXG4gICAgICAgIGh1bWFuRmxlZXRzLFxuICAgICAgICBjb21wdXRlckZsZWV0LFxuICAgICAgICBjb21wdXRlckZsZWV0U2hpcHNDb29yZHMsXG4gICAgICAgIGh1bWFuRmxlZXRTaGlwc0Nvb3JkcyxcbiAgICAgICAgYmVnaW5QbGF5LFxuICAgICAgICByZW1vdmVDb21wdXRlckdhbWVCb2FyZCxcbiAgICAgICAgcmVtb3ZlSHVtYW5HYW1lQm9hcmQsXG4gICAgICAgIHN0YXJ0R2FtZSxcbiAgICAgICAgc25lYWtQZWFrT25Db21wdXRlclxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lOyIsImNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi9zaGlwXCIpO1xuXG5mdW5jdGlvbiBQbGF5ZXIod2hpY2hQbGF5ZXIsIHNoaXBzKSB7XG4gICAgbGV0IHdob3NUdXJuO1xuICAgIGxldCB0b3RhbE51bWJlck9mU2hpcHMgPSBzaGlwc1xuICAgIGxldCBzaGlwc0hlYWx0aCA9IHt9O1xuICAgIGxldCBmbGFnRmxlZXQgPSBmYWxzZTtcbiAgICAvLyBsZXQgdHVybkZsYWcgPSBmYWxzZTtcblxuICAgIGlmKHdoaWNoUGxheWVyID09PSAnY29tcHV0ZXInKSB7XG4gICAgICAgIHdob3NUdXJuID0gJ2NvbXB1dGVyJ1xuICAgICAgICAvLyB0dXJuRmxhZyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2hvc1R1cm4gPSAnaHVtYW4nXG4gICAgICAgIC8vIHR1cm5GbGFnID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHBvc2l0aW9uU2hpcCA9IChmb3JXaG8pID0+IHtcbiAgICAgICAgcmV0dXJuIGZvcldobyA9PT0gJ2h1bWFuJyA/IFNoaXAoKS5jb29yZHNHZW5lcmF0b3IoKSA6IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBsZXQgYWxwaGFiZXRzU2V0ID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJJXCIsIFwiSlwiXTtcbiAgICBsZXQgbnVtZXJhbHNTZXQgPSBbJzAnLCcxJywnMicsJzMnLCc0JywnNScsJzYnLCc3JywnOCcsJzknXVxuICAgIGxldCBrZWVwaW5nQ29tcHV0ZXJSYW5kb21Db29yZHMgPSB7fVxuICAgIGxldCBjb29yZHNHZW5lcmF0b3IgPSAoZm9yV2hvKSA9PiB7XG4gICAgICAgIGxldCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqYWxwaGFiZXRzU2V0Lmxlbmd0aCk7XG4gICAgICAgIGxldCByYW5kb21BbHBoYWJldCA9IGFscGhhYmV0c1NldFtyYW5kb21OdW1iZXJdO1xuICAgICAgICBcbiAgICAgICAgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKm51bWVyYWxzU2V0Lmxlbmd0aCk7XG4gICAgICAgIGxldCByYW5kb21OdW1lcmFsID0gbnVtZXJhbHNTZXRbcmFuZG9tTnVtYmVyXTtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmKCA5IC0gcmFuZG9tTnVtYmVyID4gMCkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2cocmFuZG9tTnVtYmVyLCA5LCA5IC0gcmFuZG9tTnVtYmVyKVxuICAgICAgICAvLyAgICAgLy8gaWYod2hpY2hQbGF5ZXIgPT09ICdodW1hbicgfHwgZm9yV2hvID09PSAnaHVtYW4nIHx8IHdob3NUdXJuID09PSAnaHVtYW4nKSByZXR1cm4gc2hpcHNSYW5kb21Db29yZHNHZW5lcmF0b3IocmFuZG9tQWxwaGFiZXQsIHJhbmRvbU51bWJlcik7XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj8/XCIpXG4gICAgICAgIGlmKHdoaWNoUGxheWVyID09PSAnaHVtYW4nIHx8IGZvcldobyA9PT0gJ2h1bWFuJyB8fCB3aG9zVHVybiA9PT0gJ2h1bWFuJykgcmV0dXJuIHNoaXBzUmFuZG9tQ29vcmRzR2VuZXJhdG9yKHJhbmRvbUFscGhhYmV0LCByYW5kb21OdW1iZXIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj8/XCIsIHdoaWNoUGxheWVyID09PSAnaHVtYW4nLCB3aG9zVHVybiA9PT0gJ2h1bWFuJywgd2hpY2hQbGF5ZXIsIGZvcldobylcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlVW5pcXVlQ29tcHV0ZXJDb29yZHMocmFuZG9tQWxwaGFiZXQsIHJhbmRvbU51bWVyYWwpO1xuICAgIH1cblxuICAgIGxldCBnZW5lcmF0ZVVuaXF1ZUNvbXB1dGVyQ29vcmRzID0gKGFscGgsIG51bSkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj8/XCIsIGtlZXBpbmdDb21wdXRlclJhbmRvbUNvb3JkcylcbiAgICAgICAgbGV0IGNoa0VtcHR5ID0gT2JqZWN0LmtleXMoa2VlcGluZ0NvbXB1dGVyUmFuZG9tQ29vcmRzKS5sZW5ndGg7XG4gICAgICAgIGlmKGNoa0VtcHR5ICE9PSAwKSB7XG4gICAgICAgICAgICBsZXQgZm91bmQgPSBjaGVja1VuaXF1ZUJvYXJkQ29vcmRzKCk7XG4gICAgICAgICAgICByZXR1cm4gIWZvdW5kID8gY29tcHV0ZXJQbGF5ZXIoYWxwaCwgbnVtKSA6IGNvb3Jkc0dlbmVyYXRvcigpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZXJQbGF5ZXIoYWxwaCwgbnVtKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPz9cIiwgYWxwaCwgbnVtKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGNoZWNrVW5pcXVlQm9hcmRDb29yZHMgPSAoKSA9PiB7XG4gICAgICAgIGZvcihsZXQga2V5IGluIGtlZXBpbmdDb21wdXRlclJhbmRvbUNvb3Jkcykge1xuICAgICAgICAgICAgbGV0IGZvdW5kID0ga2VlcGluZ0NvbXB1dGVyUmFuZG9tQ29vcmRzW2tleV0uZmlsdGVyKHBhaXIgPT4gcGFpclswXSA9PT0gYWxwaCAmJiBwYWlyWzFdID09PSBudW0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIj8/IHVuaXF1ZTpcIiwgZm91bmQpXG4gICAgICAgICAgICByZXR1cm4gZm91bmQgXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY29tcHV0ZXJQbGF5ZXIgPSAoYWxwaCwgbnVtKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmFuZG9tQ29vcmRzID0gW2FscGgsIG51bV07XG4gICAgICAgICAgICBrZWVwaW5nQ29tcHV0ZXJSYW5kb21Db29yZHNbT2JqZWN0LmtleXMoa2VlcGluZ0NvbXB1dGVyUmFuZG9tQ29vcmRzKS5sZW5ndGggKyAxXSA9IHJhbmRvbUNvb3JkcztcbiAgICAgICAgICAgIHJldHVybiByYW5kb21Db29yZHNcbiAgICB9XG5cbiAgICBsZXQgaHVtYW5QbGF5ZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdodW1hbiBwbGF5ZXIgdGFraW5nIHR1cm4nKTtcbiAgICAgICAgaWYod2hvc1R1cm4gPT09ICdodW1hbicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdodW1hbiBwbGF5ZXIgdGFraW5nIHR1cm4nKTtcbiAgICAgICAgICAgIGxldCBzZWxlY3RDb29yZHMgPSBbXCJCXCIsIFwiMlwiXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGZsYWdGbGVldCxcbiAgICAgICAgaHVtYW5QbGF5ZXIsXG4gICAgICAgIGNvbXB1dGVyUGxheWVyLFxuICAgICAgICBjb29yZHNHZW5lcmF0b3IsXG4gICAgICAgIHBvc2l0aW9uU2hpcCxcbiAgICAgICAgLy8gdHJhY2tpbmdTaGlwc1VuaXF1ZUNvb3Jkc1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7IiwiY29uc3QgUGxheWVyID0gcmVxdWlyZShcIi4vcGxheWVyXCIpO1xuXG5mdW5jdGlvbiBTaGlwKGNvb3JkcywgbGVuZ3RoLCB0eXBlKSB7XG4gICAgLy8gbGV0IHNoaXBMZW5ndGggPSAwO1xuICAgIC8vIGxldCBbYSwgZF0gPSBjb29yZHM7XG4gICAgbGV0IGRpZFNpbmsgPSBmYWxzZTtcbiAgICBsZXQgZGlkSGl0ID0gZmFsc2U7XG4gICAgbGV0IHNoaXBMZW5ndGggPSBsZW5ndGg7XG4gICAgLy8gbGV0IHdoZXJlRGlkSXRIaXQgPSBhdHRhY2tDb29yZHM7XG4gICAgbGV0IHNoaXBDb29yZHMgPSBjb29yZHM7XG4gICAgbGV0IGxvZ1Nob3RzO1xuXG4gICAgbGV0IGNoZWNrSGl0T3JNaXNzID0gKGF0dGFja0Nvb3JkcykgPT4ge1xuICAgICAgICAvLyByZXR1cm4gY29vcmRzID09PSBzaGlwQ29vcmRzID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZyhhdHRhY2tDb29yZHMsIHNoaXBDb29yZHMsIGF0dGFja0Nvb3Jkcy5ldmVyeSgodixpKSA9PiBzaGlwQ29vcmRzW2ldID09PSB2KSlcbiAgICAgICAgLy8gcmV0dXJuIGF0dGFja0Nvb3Jkcy5ldmVyeSh2ID0+IHNoaXBDb29yZHMuaW5kZXhPZih2KSk7XG4gICAgICAgIHJldHVybiBhdHRhY2tDb29yZHMuZXZlcnkoKHYsaSkgPT4gc2hpcENvb3Jkc1tpXSA9PT0gdilcbiAgICB9XG4gICAgbGV0IGhpdCA9IChhdHRhY2tDb29yZHMpID0+IHtcbiAgICAgICAgaWYoY2hlY2tIaXRPck1pc3MoYXR0YWNrQ29vcmRzKSkge1xuICAgICAgICAgICAgLy8gZGlkSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNoaXBMZW5ndGgtLTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhIGhpdCEhIHdoZW4gY29vcmRzIG1hdGNoZXMgZm9ybWF0aW9uJywgc2hpcExlbmd0aCk7XG4gICAgICAgICAgICByZXR1cm4gc2hpcExlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtaXNzRmlyZWQoYXR0YWNrQ29vcmRzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW11cIilcbiAgICAgICAgfVxuICAgIH07XG4gICAgbGV0IGlzU3VuayA9ICgpID0+IHtcbiAgICAgICAgaWYoc2hpcExlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2JhdHRsZXNoaXAgc3Vuaywgd2hlbiBhbGwgY29uc2lzdGluZyBncmlkcyBhcmUgZGVzdHJveWVkJyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgbWlzc0ZpcmVkID0gKGNvb3JkcykgPT4ge1xuICAgICAgICBpZighY2hlY2tIaXRPck1pc3MoY29vcmRzKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ21pc3NmaXJlZCwgbG9ncyBzaG90IGNvb3JkcycpO1xuICAgICAgICAgICAgbG9nU2hvdHMgPSBjb29yZHM7XG4gICAgICAgICAgICByZXR1cm4gbG9nU2hvdHM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbGV0IGZsZWV0U3RhdHVzID0gKCkgPT4gY29uc29sZS5sb2coJ2FsbCBzaGlwcyBoZWFsdGggcmVwb3J0Jyk7XG4gICAgLy8gbGV0IGFsbFNoaXBzSGFzU3VuayA9ICgpID0+IGNvbnNvbGUubG9nKCdhbGwgc2hpcHMgaGFzIHN1bmsnKTtcbiAgICBsZXQgYWxwaGFiZXRzU2V0ID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJJXCIsIFwiSlwiXTtcbiAgICBsZXQgbnVtZXJhbHNTZXQgPSBbJzAnLCcxJywnMicsJzMnLCc0JywnNScsJzYnLCc3JywnOCcsJzknXTtcbiAgICBsZXQgdHJhY2tpbmdTaGlwc1VuaXF1ZUNvb3JkcyA9IFtdO1xuICAgIFxuICAgIGxldCByYW5kb21Db29yZHMgPSAoKSA9PiB7XG4gICAgICAgIGxldCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqYWxwaGFiZXRzU2V0Lmxlbmd0aCk7XG4gICAgICAgIGxldCByYW5kb21BbHBoYWJldCA9IGFscGhhYmV0c1NldFtyYW5kb21OdW1iZXJdO1xuICAgICAgICBcbiAgICAgICAgbGV0IHJhbmRvbU5OID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKm51bWVyYWxzU2V0Lmxlbmd0aCk7XG4gICAgICAgIGxldCByYW5kb21OdW1lcmFsID0gbnVtZXJhbHNTZXRbcmFuZG9tTk5dO1xuXG4gICAgICAgIHJldHVybiBbcmFuZG9tQWxwaGFiZXQsIHJhbmRvbU51bWVyYWxdO1xuICAgIH1cbiAgICBcbiAgICBsZXQgY29vcmRzR2VuZXJhdG9yID0gKCkgPT4ge1xuICAgICAgICAvLyBsZXQgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmFscGhhYmV0c1NldC5sZW5ndGgpO1xuICAgICAgICAvLyBsZXQgcmFuZG9tQWxwaGFiZXQgPSBhbHBoYWJldHNTZXRbcmFuZG9tTnVtYmVyXTtcbiAgICAgICAgXG4gICAgICAgIC8vIGxldCByYW5kb21OTiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpudW1lcmFsc1NldC5sZW5ndGgpO1xuICAgICAgICAvLyBsZXQgcmFuZG9tTnVtZXJhbCA9IG51bWVyYWxzU2V0W3JhbmRvbU5OXTtcbiAgICAgICAgbGV0IFtyYW5kb21BbHBoYWJldCwgcmFuZG9tTnVtZXJhbF0gPSByYW5kb21Db29yZHMoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmFuZG9tQWxwaGFiZXQsIHJhbmRvbU51bWVyYWwsIHJhbmRvbU5OKTtcbiAgICAgICAgcmV0dXJuIHNoaXBzUmFuZG9tQ29vcmRzR2VuZXJhdG9yKHJhbmRvbUFscGhhYmV0LCBOdW1iZXIocmFuZG9tTnVtZXJhbCkpO1xuICAgIH1cblxuICAgIGxldCBzaGlwc1JhbmRvbUNvb3Jkc0dlbmVyYXRvciA9IChhbHBoLCBudW0pID0+IHtcbiAgICAgICAgbGV0IGlzRW1wdHkgPSB0cmFja2luZ1NoaXBzVW5pcXVlQ29vcmRzLmxlbmd0aDtcbiAgICAgICAgbGV0IGNoZWNrQm91bmRhcnk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPyFcIiwgYWxwaCwgbnVtLCBpc0VtcHR5LCB0cmFja2luZ1NoaXBzVW5pcXVlQ29vcmRzKTtcbiAgICAgICAgLy8gY2hla2NpbmdVbmlxdWVzKGFscGgsIG51bSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlzRW1wdHksIFwiaXNcIilcbiAgICAgICAgaWYoIWlzRW1wdHkpIHtcbiAgICAgICAgICAgIGNoZWNrQm91bmRhcnkgPSBudW0gKyA1ID4gOTtcbiAgICAgICAgICAgIHdoaWxlKCFjaGVja0JvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgdHJhY2tpbmdTaGlwc1VuaXF1ZUNvb3Jkcy5wdXNoKGNyZWF0aW5nU2hpcChhbHBoLCBudW0sIDUpKTtcbiAgICAgICAgICAgICAgICAvLyB0cmFja2luZ1NoaXBzVW5pcXVlQ29vcmRzLnB1c2goY3JlYXRpbmdTaGlwKGFscGgsIG51bSwgNSkpXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3YXR0XCIsIGNyZWF0aW5nU2hpcChhbHBoLCBudW0sIDUpLCB0cmFja2luZ1NoaXBzVW5pcXVlQ29vcmRzLCB0cmFja2luZ1NoaXBzVW5pcXVlQ29vcmRzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0aW5nU2hpcChhbHBoLCBudW0sIDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvb3Jkc0dlbmVyYXRvcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZvdW5kO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm91bmQsIGFscGgsIG51bSwgJzw+JylcbiAgICAgICAgICAgIGlmKGlzRW1wdHkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjaGVja0JvdW5kYXJ5ID0gbnVtICsgNCA+IDk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBjaGVrY2luZ1VuaXF1ZXMoY3JlYXRpbmdTaGlwKGFscGgsIG51bSwgNCkpO1xuICAgICAgICAgICAgICAgIHdoaWxlKCFjaGVja0JvdW5kYXJ5ICYmICFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFja2luZ1NoaXBzVW5pcXVlQ29vcmRzLnB1c2goY3JlYXRpbmdTaGlwKGFscGgsIG51bSwgNCkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjcmVhdGluZ1NoaXAoYWxwaCwgbnVtLCA0KSwgXCJiYVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0aW5nU2hpcChhbHBoLCBudW0sIDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZihpc0VtcHR5ID09PSAyKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tCb3VuZGFyeSA9IG51bSArIDMgPiA5O1xuICAgICAgICAgICAgICAgIGZvdW5kID0gY2hla2NpbmdVbmlxdWVzKGNyZWF0aW5nU2hpcChhbHBoLCBudW0sIDMpKTtcbiAgICAgICAgICAgICAgICB3aGlsZSghY2hlY2tCb3VuZGFyeSAmJiAhZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tpbmdTaGlwc1VuaXF1ZUNvb3Jkcy5wdXNoKGNyZWF0aW5nU2hpcChhbHBoLCBudW0sIDMpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRpbmdTaGlwKGFscGgsIG51bSwgMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmKGlzRW1wdHkgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBjaGVja0JvdW5kYXJ5ID0gbnVtICsgMyA+IDk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBjaGVrY2luZ1VuaXF1ZXMoY3JlYXRpbmdTaGlwKGFscGgsIG51bSwgMykpO1xuICAgICAgICAgICAgICAgIHdoaWxlKCFjaGVja0JvdW5kYXJ5ICYmICFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFja2luZ1NoaXBzVW5pcXVlQ29vcmRzLnB1c2goY3JlYXRpbmdTaGlwKGFscGgsIG51bSwgMykpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGluZ1NoaXAoYWxwaCwgbnVtLCAzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYoaXNFbXB0eSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGNoZWNrQm91bmRhcnkgPSBudW0gKyAyID4gOTtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGNoZWtjaW5nVW5pcXVlcyhjcmVhdGluZ1NoaXAoYWxwaCwgbnVtLCAyKSk7XG4gICAgICAgICAgICAgICAgd2hpbGUoIWNoZWNrQm91bmRhcnkgJiYgIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNraW5nU2hpcHNVbmlxdWVDb29yZHMucHVzaChjcmVhdGluZ1NoaXAoYWxwaCwgbnVtLCAyKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0aW5nU2hpcChhbHBoLCBudW0sIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb29yZHNHZW5lcmF0b3IoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjcmVhdGluZ1NoaXAgPSAoYWxwaCwgbnVtLCBsZW5ndGgpID0+IHtcbiAgICAgICAgbGV0IGNvbnNlY3V0aXZlQ29vcmRzID0gW107XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUoaSA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY29uc2VjdXRpdmVDb29yZHMucHVzaChbYWxwaCwgbnVtK2ldKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uc2VjdXRpdmVDb29yZHM7XG4gICAgfVxuXG4gICAgbGV0IGNoZWtjaW5nVW5pcXVlcyA9IChjb29yZHMpID0+IHtcbiAgICAgICAgbGV0IGZsYXR0ZW5lZCA9IHRyYWNraW5nU2hpcHNVbmlxdWVDb29yZHMuZmxhdCgxKTtcbiAgICAgICAgLy8gbGV0IGZvdW5kID0gZmxhdHRlbmVkLnNvbWUoYXIgPT4gY29vcmRzWzBdID09PSBhbHBoICYmIGNvb3Jkc1sxXSA9PT0gbnVtKVxuICAgICAgICBsZXQgZm91bmQgPSBmbGF0dGVuZWQuc29tZShhciA9PmZhbHNlICk7XG4gICAgICAgIGxldCBjaGsgPSBmbGF0dGVuZWQuc29tZShhciA9PiBjb29yZHMuc29tZShjciA9PiBjclswXSA9PSBhclswXSAmJiBjclsxXSA9PSBhclsxXSkpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRyYWNraW5nU2hpcHNVbmlxdWVDb29yZHMsICdyZWFkeSBmb3IhIScsIGZsYXR0ZW5lZCwgY29vcmRzLCBjaGspO1xuICAgICAgICAvLyByZXR1cm4gZm91bmQ7XG4gICAgICAgIHJldHVybiBjaGtcbiAgICB9XG4gICAgXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBoaXQsXG4gICAgICAgIGlzU3VuayxcbiAgICAgICAgY2hlY2tIaXRPck1pc3MsXG4gICAgICAgIG1pc3NGaXJlZCxcbiAgICAgICAgbG9nU2hvdHMsXG4gICAgICAgIHNoaXBDb29yZHMsXG4gICAgICAgIHNoaXBMZW5ndGgsXG4gICAgICAgIGNvb3Jkc0dlbmVyYXRvcixcbiAgICAgICAgdHJhY2tpbmdTaGlwc1VuaXF1ZUNvb3JkcyxcbiAgICAgICAgcmFuZG9tQ29vcmRzXG4gICAgICAgIC8vIHNoaXBzUmFuZG9tQ29vcmRzR2VuZXJhdG9yXG4gICAgICAgIC8vIGZsZWV0U3RhdHVzLFxuICAgICAgICAvLyBhbGxTaGlwc0hhc1N1bmtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWUgZnJvbSBcIi4vZ2FtZV9jb2Rlcy9nYW1lTG9naWNcIlxuXG5sZXQgR2FtZSA9IGdhbWUoKTtcbkdhbWUuc3RhcnRHYW1lKCk7XG5HYW1lLnNuZWFrUGVha09uQ29tcHV0ZXIoKTtcbi8vIEdhbWUucmVfYXJyYW5nZV9odW1hbl9mbGVldHMoKTtcbi8vIGdhbWUoKS5wbGF5QWdhaW4oKTtcblxubGV0IHN0YXJ0QWdhaW4gPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNuZWFrLXBlYWsnKS50ZXh0Q29udGVudCA9ICdzbmVhayBwZWFrJ1xuICAgIGxldCBHYW1lID0gZ2FtZSgpO1xuICAgIEdhbWUucmVtb3ZlQ29tcHV0ZXJHYW1lQm9hcmQoKTtcbiAgICBHYW1lLnJlbW92ZUh1bWFuR2FtZUJvYXJkKCk7XG4gICAgR2FtZS5jcmVhdGluZ0NvbXB1dGVyR2FtZUJvYXJkKCk7XG4gICAgR2FtZS5jcmVhdGluZ0h1bWFuR2FtZUJvYXJkKCk7XG4gICAgR2FtZS5odW1hbkZsZWV0cygpO1xuICAgIEdhbWUuY29tcHV0ZXJGbGVldCgpO1xuICAgIEdhbWUuYmVnaW5QbGF5KCk7XG59XG5cbmxldCBwbGF5QWdhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheS1hZ2FpbicpO1xucGxheUFnYWluLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3RhcnRBZ2Fpbik7XG5cbmxldCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmUtYXJyYW5nZS1zaGlwcy1mb3JtYXRpb24nKTtcbmJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN0YXJ0QWdhaW4pOyJdLCJzb3VyY2VSb290IjoiIn0=