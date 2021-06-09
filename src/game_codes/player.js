function Player(whichPlayer, enemyBoard) {
    let whosTurn;
    let shipsHealth = {};
    let flagFleet = false;

    if(whichPlayer === 'computer') {
        whosTurn = 'computer'
    } else {
        whosTurn = 'human'
    }

    if(whosTurn === 'computer') {
        console.log('play random coords on enemy board and not same coords twice');
        let randomCoords = ["A", "4"]
        enemyBoard(randomCoords);
        enemyBoard.checkAllShipsSank()
        enemyBoard.keepingTrackOfShips()
    } else {
        let selectCoords = ["B", "2"];
        enemyBoard(selectCoords);
        enemyBoard.checkAllShipsSank()
        enemyBoard.keepingTrackOfShips()
    }

    return {
        flagFleet
    }
}