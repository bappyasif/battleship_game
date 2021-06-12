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

    let placeShips = (coords) => {
        let board = document.querySelector('.board-container');
        // console.log(coords, "here!!", coords[0][0]);
        if(board) {
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
        loggingMissFiredShots,
        placeShips
    }
}

module.exports = GameBoard;

/**
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