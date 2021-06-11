// let Ship = require('./battleShip');

const Ship = require("./ship");

function GameBoard(player) {
    let dummyCoords = ["A","4"];
    // gameboard should be able to place ships at specific coordinates by calling ship factory function
    // Ship(dummyCoords);
    // let currentShip = Ship(["A", "4"], 2, ["A", "4"]);
    let currentShip = Ship(["A", "4"], 2);
    let loggingMissFiredShots = [];
    let grids;
    let loggingHits = []

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

    let keepingTrackOfShips = () => {
        // commenceAttack.fleetStatus();
    }

    let checkAllShipsSank = () => {
        // commenceAttack.allShipsHasSunk();
    }
    
    let populateBoardOnDOM = (num) => {
        // grids = 10;
        grids = num;
        return grids;
    }

    let createGrids = (num) => {
        populateBoardOnDOM(num);
        let gridContainer = document.createElement('div');
        // let gridContainer = document.querySelector('.human-board');
        gridContainer.className = 'board-container'

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

    return {
        createGrids,
        recieveAttacks,
        populateBoardOnDOM,
        loggingMissFiredShots
    }
}

module.exports = GameBoard;