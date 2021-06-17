import game from "./game_codes/gameLogic"
// let x = document.createElement('div');
let combinedCoords = [];

let Game = game();

Game.creatingComputerGameBoard();
Game.creatingHumanGameBoard();
Game.humanFleets();
Game.computerFleet();
Game.re_arrange();
Game.beginPlay();


// game().creatingComputerGameBoard();
// game().creatingHumanGameBoard();
// game().humanFleets();
// game().computerFleet();
// game().re_arrange();
// game().beginPlay();
// console.log(Game().computerFleetShipsCoords);
// console.log(game().creatingComputerGameBoard())
// console.log("aloha from init.js file");