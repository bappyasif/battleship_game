const Player = require("./player");

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

    

    return {
        hit,
        isSunk,
        checkHitOrMiss,
        missFired,
        logShots,
        shipCoords,
        shipLength,
        // coordsGenerator,
        // shipsRandomCoordsGenerator
        // fleetStatus,
        // allShipsHasSunk
    }
}

module.exports = Ship;