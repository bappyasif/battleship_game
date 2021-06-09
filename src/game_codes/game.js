let Board = require('./gameBoard');

let game = () => {
    // main game loop and DOM interaction
    let human = Player('human', Board(BattleShip(["A", "4"])));
    let computer = Player('computer', Board(BattleShip(["B", "2"])));
    // we'll have to manually take inputs from user to pass into Board for players
    // use functions that are implemented in other modules, before writing it in here intinctively
    if(human.flagFleet || computer.flagFleet) {
        console.log('somebody won!!');
    }
}