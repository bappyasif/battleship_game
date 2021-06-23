import GameBoard from "./game_codes/gameBoard";
import game from "./game_codes/gameLogic"

let Game = game();
Game.creatingComputerGameBoard();
Game.creatingHumanGameBoard();
Game.humanFleets();
Game.computerFleet();
Game.re_arrange_human_fleets();
// Game.re_arrange_computer_fleets();
Game.beginPlay();

let startAgain = () => {
    let Game = game();
    Game.removeComputerGameBoard();
    Game.removeHumanGameBoard();
    Game.creatingComputerGameBoard();
    Game.creatingHumanGameBoard();
    // Game.humanFleets();
    Game.computerFleet();
    Game.humanFleets();
    Game.beginPlay();
}

let playAgain = document.querySelector('.play-again');
playAgain.addEventListener('click', startAgain);

// let re_Arrange_Human_Fleet = () => {
//     let btn = document.querySelector('.re-arrange-human-formation');
//     btn.addEventListener('click', () => {
//         setTimeout(()=>{
//             startAgain();
//         }, 1001);
//     })
// }
// re_Arrange_Human_Fleet();



// let startAgain = () => {
//     // let humanBoard = document.querySelector('.board-container');
//     // let computerBoard = document.querySelector('.board-container-for-computer');
//     // GameBoard().removingShipsFromBoard(humanBoard);
//     // GameBoard().removingShipsFromBoard(computerBoard);
//     // let humanBoard = document.querySelector('.board-container');
//     // let computerBoard = document.querySelector('.board-container-for-computer');
//     // humanBoard.remove();
//     // computerBoard.remove();

//     let Game = game();
//     Game.removeComputerGameBoard();
//     Game.removeHumanGameBoard();
//     Game.creatingComputerGameBoard();
//     Game.creatingHumanGameBoard();
//     Game.humanFleets();
//     Game.computerFleet();
//     Game.beginPlay();
// }

// let playAgain = document.querySelector('.play-again');
// // playAgain.addEventListener('click', Game.playAgain);
// playAgain.addEventListener('click', startAgain);

// let re_Arrange_Human_Fleet = () => {
//     let humanBoard = document.querySelector('.board-container');
//     GameBoard().removingShipsFromBoard(humanBoard);
//     // let Game = game();
//     Game.removeHumanGameBoard();
//     Game.creatingHumanGameBoard();
//     setTimeout(()=>{
//         Game.humanFleets()
//     }, 1001);
// }

// let btn = document.querySelector('.re-arrange-human-formation');
// btn.addEventListener('click', re_Arrange_Human_Fleet)

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