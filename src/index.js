import game from "./game_codes/gameLogic"
let x = document.createElement('div');

game().creatingComputerGameBoard();
game().creatingHumanGameBoard();
game().humanFleets();
// console.log(game().creatingComputerGameBoard())
// console.log("aloha from init.js file");