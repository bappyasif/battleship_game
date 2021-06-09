// let Ship = require('./battleShip');

function GameBoard(ship) {
    let dummyCoords = ["A","4"];
    // gameboard should be able to place ships at specific coordinates by calling ship factory function
    // Ship(dummyCoords);
    let commenceAttack = ship(coords);

    let recieveAttacks = coords => {
        // let [a, d] = coords;
        // let attackStatus = Ship(coords);
        let checkAttack = commenceAttack.checkHitOrMiss(coords);
        let shipsHealth = {}
        if(checkAttack.didHit) {
            commenceAttack.hit(coords);
        } else if(checkAttack.didMiss) {
            commenceAttack.missFired(coords);
        }
    }

    let keepingTrackOfShips = () => {
        commenceAttack.fleetStatus();
    }

    let checkAllShipsSank = () => {
        commenceAttack.allShipsHasSunk();
    }
    
    let populateBoardOnDOM = () => {
        let grids = 10;

    }

    let createGrids = grids => {
        for(let i=0; i<grids; i++) {
            // create grids
        }
    }

    return {
        
    }
}