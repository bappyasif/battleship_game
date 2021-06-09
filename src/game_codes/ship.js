function BattleShip(coords) {
    let length = 0;
    // let [a, d] = coords;
    let didSunk = false;
    let didHit = false;
    let whereDidItHit = coords;

    let checkHitOrMiss = coords => console.log('did it hit or its a miss', coords);
    let hit = () => console.log('a hit!! when coords matches formation');
    let isSunk = () => console.log('battleship sunk, when all consisting grids are destroyed');
    let missFired = coords => console.log('missfired, logs shot coords');
    let fleetStatus = () => console.log('all ships health report');
    let allShipsHasSunk = () => console.log('all ships has sunk');

    return {
        hit,
        isSunk,
        checkHitOrMiss,
        missFired,
        fleetStatus,
        allShipsHasSunk
    }
}