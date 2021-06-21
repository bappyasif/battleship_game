import GameBoard from "./game_codes/gameBoard";
import game from "./game_codes/gameLogic"
// let x = document.createElement('div');
let combinedCoords = [];
// let game = GameBoard();

let Game = game();

Game.creatingComputerGameBoard();
Game.creatingHumanGameBoard();
Game.humanFleets();
Game.computerFleet();
// Game.re_arrange_human_fleets();
// Game.re_arrange_computer_fleets();
Game.beginPlay();

let playAgain = document.querySelector('.play-again');
playAgain.addEventListener('click', Game.playAgain);


// let startAgain = () => {
//     // let humanBoard = document.querySelector('.board-container');
//     // let computerBoard = document.querySelector('.board-container-for-computer');
//     // GameBoard().removingShipsFromBoard(humanBoard);
//     // GameBoard().removingShipsFromBoard(computerBoard);
//     let Game = game();
//     Game.creatingComputerGameBoard();
//     Game.creatingHumanGameBoard();
//     Game.humanFleets();
//     Game.computerFleet();
//     Game.beginPlay();
// }

// module.exports = startAgain;

// game().creatingComputerGameBoard();
// game().creatingHumanGameBoard();
// game().humanFleets();
// game().computerFleet();
// game().re_arrange();
// game().beginPlay();
// console.log(Game().computerFleetShipsCoords);
// console.log(game().creatingComputerGameBoard())
// console.log("aloha from init.js file");