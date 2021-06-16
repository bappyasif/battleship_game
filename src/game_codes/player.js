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