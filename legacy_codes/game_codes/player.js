const Ship = require("./ship");

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

    let shipsCoords = {};
    let trackingShipsUniqueCoords = [];

    let shipsRandomCoordsGenerator = (alph, num) => {
        // let isEmpty = Object.keys(trackingShipsUniqueCoords).length;
        let isEmpty = trackingShipsUniqueCoords.length;
        let notUnique;
        let checkBoundary;
        if(isEmpty == 0) {
            checkBoundary = num + 5 > 9;
            while(!checkBoundary) {
                // console.log(creatingShip(alph, num, 5, 'carrier'));
                // trackingShipsUniqueCoords.push(creatingShip(alph, num, 5, 'carrier')['carrier'].shipCoords);
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 5, 'carrier'));
                return creatingShip(alph, num, 5, 'carrier');
            }
            return coordsGenerator();
        } else {
            if(isEmpty === 1) {                
                checkBoundary = num + 4 > 9;
                notUnique = checkinUniques(creatingShip(alph, num, 4, 'battleship'));
                while(!checkBoundary && !notUnique) {
                    // trackingShipsUniqueCoords.push(creatingShip(alph, num, 4, 'battleship')['battleship'].shipCoords);
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 4, 'battleship'));
                    return creatingShip(alph, num, 4, 'battleship');
                }
            } else if(isEmpty === 2) {
                checkBoundary = num + 3 > 9;
                notUnique = checkinUniques(creatingShip(alph, num, 3, 'cruiser'));
                while(!checkBoundary && !notUnique) {
                    // trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'cruiser')['cruiser'].shipCoords);
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'cruiser'));
                    return creatingShip(alph, num, 3, 'cruiser');
                }
            } else if(isEmpty === 3) {
                checkBoundary = num + 3 > 9;
                notUnique = checkinUniques(creatingShip(alph, num, 3, 'submarine'));
                while(!checkBoundary && !notUnique) {
                    // trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'submarine')['submarine'].shipCoords);
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'submarine'));
                    return creatingShip(alph, num, 3, 'submarine');
                }
            } else if(isEmpty === 4) {
                checkBoundary = num + 2 > 9;
                notUnique = checkinUniques(creatingShip(alph, num, 2, 'destroyer'));
                while(!checkBoundary && !notUnique) {
                    // trackingShipsUniqueCoords.push(creatingShip(alph, num, 2, 'destroyer')['destroyer'].shipCoords);
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 2, 'destroyer'));
                    return creatingShip(alph, num, 2, 'destroyer');
                }
            }
            return coordsGenerator();
        }
    }

    let creatingShip = (alph, num, length, type) => {
        let consecutiveCoords = [];
        let i = 0;
        do {
            consecutiveCoords.push([alph, num+i]);
            i++;
        } while(i < length);

        return consecutiveCoords;
    }

    let checkinUniques = (coords) => {
        let leveledCoords = trackingShipsUniqueCoords.flat(1);

        let check = leveledCoords.some(ar => coords.some(cr => ar[0] == cr[0] && ar[1] == cr[1]));
        
        return check;
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
        // console.log("??")
            // console.log('play random coords on enemy board and not same coords twice');
            let randomCoords = [alph, num];
            keepingComputerRandomCoords[Object.keys(keepingComputerRandomCoords).length + 1] = randomCoords;
            // coordsGenerator();
            // if(Object.keys(keepingComputerRandomCoords).length === 2) return false;
            // console.log("??", randomCoords, keepingComputerRandomCoords)
            return randomCoords
            // console.log(randomCoords);
            // enemyBoard(randomCoords);
            // enemyBoard.checkAllShipsSank()
            // enemyBoard.keepingTrackOfShips()
    }

    let humanPlayer = () => {
        console.log('human player taking turn');
        if(whosTurn === 'human') {
            console.log('human player taking turn');
            let selectCoords = ["B", "2"];
            // enemyBoard(selectCoords);
            // enemyBoard.checkAllShipsSank();
            // enemyBoard.keepingTrackOfShips();
        }
    }

    return {
        flagFleet,
        humanPlayer,
        computerPlayer,
        coordsGenerator,
        positionShip,
        trackingShipsUniqueCoords
    }
}

module.exports = Player;

/**
 * 
 * 
 let creatingShip = (alph, num, length, type) => {
        // let ship = Ship([alph, num], length, type);
        // console.log("shipyard", alph, num, type, length)
        let consecutiveCoords = [];
        let i = 0;
        do {
            consecutiveCoords.push([alph, num+i]);
            i++;
        } while(i < length);
        
        // let ship = Ship(consecutiveCoords, length, type);
        // let ship = Ship(consecutiveCoords, length, type);
        // shipsCoords[type] = ship;
        // return shipsCoords;
        return consecutiveCoords;
    }
 * 
 * 
 let checkinUniques = (coords) => {
        // console.log(trackingShipsUniqueCoords, "coords");
        // let isUnique = trackingShipsUniqueCoords.every(coords => coords.every(ar => ar[0] == alph && ar[1] == num))
        // let isUnique = trackingShipsUniqueCoords.every(coords => coords.every(ar => console.log(ar[0] == alph && ar[1] == num, alph, num, ar)))
        // let leveledCoords = trackingShipsUniqueCoords.reduce((c, a)=>a.concat(c), []);
        // let leveledCoords = [].concat(trackingShipsUniqueCoords);
        // let isUnique = leveledCoords.some(coords => coords.indexOf(alph) == -1 && coords.indexOf(num) == -1);
        // let isUnique = leveledCoords.every(coords => coords.includes(alph) == -1 && coords.includes(num) == -1);
        // let isUnique = !leveledCoords.some(coords => coords[0] == alph && coords[1] == num);
        // let isUnique = !leveledCoords.some(coords => coords[0] == alph && coords[1] == num);
        // console.log(leveledCoords, isUnique);
        // return isUnique ? isUnique : coordsGenerator();
        let isUnique = false;
        let leveledCoords = trackingShipsUniqueCoords.flat(1);

        let check = leveledCoords.some(ar => coords.some(cr => ar[0] == cr[0] && ar[1] == cr[1]));
        console.log(check, "wow!!");
        // return isUnique;
        return check;
    }
 * 
 * 
     // generating ships and positioning them accordingly
    let shipsCoords = {};
    let trackingShipsUniqueCoords = [];

    let shipsRandomCoordsGenerator = (alph, num) => {
        // let isEmpty = Object.keys(trackingShipsUniqueCoords).length;
        let isEmpty = trackingShipsUniqueCoords.length;
        let isUnique = checkinUniques(alph, num);
        let checkBoundary;
        if(isEmpty == 0) {
            checkBoundary = num + 5 > 9;
            while(!checkBoundary) {
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 5, 'carrier')['carrier'].shipCoords);
                return creatingShip(alph, num, 5, 'carrier');
            }
            // return coordsGenerator();
            return Player().coordsGenerator();
        } else {
            console.log(isUnique, alph, num);
            // isUnique = checkinUniques(alph, num);
            if(isEmpty === 1 && isUnique) {                
                checkBoundary = num + 4 > 9;
                while(!checkBoundary) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 4, 'battleship')['battleship'].shipCoords);
                    return creatingShip(alph, num, 4, 'battleship');
                }
            } else if(isEmpty === 2 && isUnique) {
                checkBoundary = num + 3 > 9;
                while(!checkBoundary) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'cruiser')['cruiser'].shipCoords);
                    return creatingShip(alph, num, 3, 'cruiser');
                }
            } else if(isEmpty === 3 && isUnique) {
                checkBoundary = num + 3 > 9;
                while(!checkBoundary) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'submarine')['submarine'].shipCoords);
                    return creatingShip(alph, num, 3, 'submarine');
                }
            } else if(isEmpty === 4 && isUnique) {
                checkBoundary = num + 2 > 9;
                while(!checkBoundary) {
                    trackingShipsUniqueCoords.push(creatingShip(alph, num, 2, 'destroyer')['destroyer'].shipCoords);
                    return creatingShip(alph, num, 2, 'destroyer');
                }
            }
            // return coordsGenerator();
            return Player().coordsGenerator();
        }
    }

    let creatingShip = (alph, num, length, type) => {
        // let ship = Ship([alph, num], length, type);
        // console.log("shipyard", alph, num, type, length)
        let consecutiveCoords = [];
        let i = 0;
        do {
            consecutiveCoords.push([alph, num+i]);
            i++;
        } while(i < length);
        let ship = Ship(consecutiveCoords, length, type);
        shipsCoords[type] = ship;
        return shipsCoords;
    }

    let checkinUniques = (alph, num) => {
        console.log(trackingShipsUniqueCoords, "coords");
        // let leveledCoords = trackingShipsUniqueCoords.reduce((c, a)=>a.concat(c), []);
        let leveledCoords = [].concat(...trackingShipsUniqueCoords);
        // let isUnique = leveledCoords.some(coords => coords.indexOf(alph) == -1 && coords.indexOf(num) == -1);
        // let isUnique = leveledCoords.every(coords => coords.includes(alph) == -1 && coords.includes(num) == -1);
        let isUnique = leveledCoords.some(coords => coords[0] == alph && coords[1] == num);
        // return isUnique ? isUnique : coordsGenerator();
        return !isUnique;
    }

    let alphabetsSet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let numeralsSet = ['0','1','2','3','4','5','6','7','8','9']

    let coordsGenerator = () => {
        let randomNumber = Math.floor(Math.random()*alphabetsSet.length);
        let randomAlphabet = alphabetsSet[randomNumber];
        
        randomNumber = Math.floor(Math.random()*numeralsSet.length);
        let randomNumeral = numeralsSet[randomNumber];
        
        return shipsRandomCoordsGenerator(randomAlphabet, randomNumber);
     
        // return generateUniqueComputerCoords(randomAlphabet, randomNumeral);
    }
     
 * 
 * 
     let shipsRandomCoordsGenerator = (alph, num) => {
        // let isEmpty = Object.keys(trackingShipsUniqueCoords).length;
        let isEmpty = trackingShipsUniqueCoords.length;
        let isUnique = checkinUniques(alph, num);
        let checkBoundary;
        // let isUnique = checkUniqueBoardCoords();
        // console.log(isUnique)
        // console.log("here!!", isEmpty, trackingShipsUniqueCoords, isUnique);
        if(isEmpty == 0) {
            // console.log("here!!", isUnique)
            // trackingShipsUniqueCoords[alph] = creatingShip(alph, num, 4, 'carrier');
            // console.log(creatingShip(alph, num, 4, 'carrier')['carrier'].shipCoords, "?!")
            checkBoundary = num + 5 > 9;
            console.log(isUnique, 'if', checkBoundary);
            while(!checkBoundary) {
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 5, 'carrier')['carrier'].shipCoords);
                return creatingShip(alph, num, 5, 'carrier');
            }
            return coordsGenerator();
            // trackingShipsUniqueCoords.push(creatingShip(alph, num, 5, 'carrier')['carrier'].shipCoords);
            // return creatingShip(alph, num, 5, 'carrier');
        } else {
            // checkinUniques();
            // isUnique = checkinUniques();
            // if(isUnique) {
                if(isEmpty === 1) {
                    // isUnique = checkinUniques(alph, num);
                    console.log(isUnique, 'battlseship');
                    checkBoundary = num + 4 > 9;
                    while(!checkBoundary) {
                        trackingShipsUniqueCoords.push(creatingShip(alph, num, 4, 'battleship')['battleship'].shipCoords);
                        return creatingShip(alph, num, 4, 'battleship');
                    }
                } else if(isEmpty === 2) {
                    console.log(isUnique, 'cruiser');
                    checkBoundary = num + 3 > 9;
                    while(!checkBoundary) {
                        trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'cruiser')['cruiser'].shipCoords);
                        return creatingShip(alph, num, 3, 'cruiser');
                    }
                } else if(isEmpty === 3) {
                    console.log(isUnique, 'submarine')
                    checkBoundary = num + 3 > 9;
                    while(!checkBoundary) {
                        trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'submarine')['submarine'].shipCoords);
                        return creatingShip(alph, num, 3, 'submarine');
                    }
                } else if(isEmpty === 4) {
                    console.log(isUnique, 'destroyer');
                    checkBoundary = num + 2 > 9;
                    while(!checkBoundary) {
                        trackingShipsUniqueCoords.push(creatingShip(alph, num, 2, 'destroyer')['destroyer'].shipCoords);
                    // console.log("here!!", trackingShipsUniqueCoords);
                        return creatingShip(alph, num, 2, 'destroyer');
                    }
                }
                return coordsGenerator()
            // else if(isEmpty === 3) {
            //     return creatingShip(alph, num, 3, 'battleship');
            // }
            // console.log("here!!", trackingShipsUniqueCoords);
        }
    }
 * 
 * 
 let creatingShip = (alph, num, length, type) => {
        // let ship = Ship([alph, num], length, type);
        // console.log("shipyard", alph, num, type, length)
        let consecutiveCoords = [];
        let i = 0;
        do {
            // consecutiveCoords.push([alph, num+i]);
            // if(num + i > 9) {
            //     coordsGenerator();
            // } else {
            //     consecutiveCoords.push([alph, num+i]);
            // }
            
            consecutiveCoords.push([alph, num+i > 9 ? (num+i)%9 : num+i]);

            // if(i+1 > 9) {
            //     coordsGenerator('human');
            //     console.log("here!!", i)
            // } else {
            //     consecutiveCoords.push([alph, num+i]);
            // }
            i++;
        } while(i < length);
        let ship = Ship(consecutiveCoords, length, type);
        shipsCoords[type] = ship;
        // shipsCoords[type+alph] = ship;
        // console.log("??", shipsCoords)
        return shipsCoords;
    }
 * 
 * 
 let generateUniqueComputerCoords = (alph, num) => {
        // console.log("??", keepingComputerRandomCoords)
        let chkEmpty = Object.keys(keepingComputerRandomCoords).length;
        if(chkEmpty !== 0) {
            for(let key in keepingComputerRandomCoords) {
                let found = keepingComputerRandomCoords[key].filter(pair => pair[0] === alph && pair[1] === num)
                // console.log("??", found)
                return !found ? computerPlayer(alph, num) : coordsGenerator()
            }
        } else {
            return computerPlayer(alph, num);
            // console.log("??", alph, num)
        }
    }
 * 
 * 
 // if(whosTurn === 'computer') {
    //     console.log('play random coords on enemy board and not same coords twice');
    //     let randomCoords = ["A", "4"]
    //     enemyBoard(randomCoords);
    //     enemyBoard.checkAllShipsSank()
    //     enemyBoard.keepingTrackOfShips()
    // } else {
    //     let selectCoords = ["B", "2"];
    //     enemyBoard(selectCoords);
    //     enemyBoard.checkAllShipsSank()
    //     enemyBoard.keepingTrackOfShips()
    // }
 */