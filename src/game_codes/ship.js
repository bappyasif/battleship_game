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
        randomCoords,
        // shipsRandomCoordsGenerator
        // fleetStatus,
        // allShipsHasSunk
        chekcingUniques
    }
}

module.exports = Ship;