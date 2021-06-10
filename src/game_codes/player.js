function Player(whichPlayer, enemyBoard) {
    let whosTurn;
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
    let alphabetsSet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let numeralsSet = ['1','2','3','4','5','6','7','8','9','10']
    let keepingComputerRandomCoords = {}
    let coordsGenerator = () => {
        let randomNumber = Math.floor(Math.random()*alphabetsSet.length);
        let randomAlphabet = alphabetsSet[randomNumber];
        randomNumber = Math.floor(Math.random()*numeralsSet.length);
        let randomNumeral = numeralsSet[randomNumber];
        return generateUniqueComputerCoords(randomAlphabet, randomNumeral);
        // console.log("??")
    }

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

    let computerPlayer = (alph, num) => {
        // console.log("??")
            // console.log('play random coords on enemy board and not same coords twice');
            let randomCoords = [alph, num];
            keepingComputerRandomCoords[Object.keys(keepingComputerRandomCoords).length + 1] = randomCoords;
            // coordsGenerator();
            if(Object.keys(keepingComputerRandomCoords).length === 2) return false;
            console.log("??", randomCoords, keepingComputerRandomCoords)
            return randomCoords
            // console.log(randomCoords);
            // enemyBoard(randomCoords);
            // enemyBoard.checkAllShipsSank()
            // enemyBoard.keepingTrackOfShips()
        
    }

    let humanPlayer = () => {
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
        coordsGenerator
    }
}

module.exports = Player;