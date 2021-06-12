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

    let shipsCoords = {};
    let trackingShipsUniqueCoords = [];

    let positionShip = (forWho) => {
        return coordsGenerator(forWho);
    }

    let shipsRandomCoordsGenerator = (alph, num) => {
        // let isEmpty = Object.keys(trackingShipsUniqueCoords).length;
        let isEmpty = trackingShipsUniqueCoords.length;
        let isUnique = checkUniqueBoardCoords();
        console.log("here!!", isEmpty, trackingShipsUniqueCoords, isUnique);
        if(isEmpty == 0) {
            // console.log("here!!")
            // trackingShipsUniqueCoords[alph] = creatingShip(alph, num, 4, 'carrier');
            // console.log(creatingShip(alph, num, 4, 'carrier')['carrier'].shipCoords, "?!")
            trackingShipsUniqueCoords.push(creatingShip(alph, num, 5, 'carrier')['carrier'].shipCoords);
            return creatingShip(alph, num, 5, 'carrier');
        } else {
            if(isEmpty === 1) {
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 4, 'battleship')['battleship'].shipCoords);
                return creatingShip(alph, num, 4, 'battleship');
            } else if(isEmpty === 2) {
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'cruiser')['cruiser'].shipCoords);
                return creatingShip(alph, num, 3, 'cruiser');
            } else if(isEmpty === 3) {
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 3, 'submarine')['submarine'].shipCoords);
                return creatingShip(alph, num, 3, 'submarine');
            } else if(isEmpty === 4) {
                trackingShipsUniqueCoords.push(creatingShip(alph, num, 2, 'destroyer')['destroyer'].shipCoords);
                return creatingShip(alph, num, 2, 'destroyer');
            } 
            // else if(isEmpty === 3) {
            //     return creatingShip(alph, num, 3, 'battleship');
            // }
            console.log("here!!", trackingShipsUniqueCoords);
        }
    }

    let creatingShip = (alph, num, length, type) => {
        // let ship = Ship([alph, num], length, type);
        console.log("shipyard", alph, num, type, length)
        let consecutiveCoords = [];
        let i = 0;
        do {
            // consecutiveCoords.push([alph, num+i]);
            consecutiveCoords.push([alph, num+i > 9 ? i%9 : num+i]);
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
        console.log("??", shipsCoords)
        return shipsCoords;
    }
    
    let alphabetsSet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let numeralsSet = ['0','1','2','3','4','5','6','7','8','9']
    let keepingComputerRandomCoords = {}
    let coordsGenerator = (forWho) => {
        let randomNumber = Math.floor(Math.random()*alphabetsSet.length);
        let randomAlphabet = alphabetsSet[randomNumber];
        randomNumber = Math.floor(Math.random()*numeralsSet.length);
        let randomNumeral = numeralsSet[randomNumber];
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
            // console.log("??", found)
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