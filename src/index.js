import game from "./game_codes/gameLogic"

let Game = game();
Game.startGame();
// Game.re_arrange_human_fleets();
// game().playAgain();

let startAgain = () => {
    let Game = game();
    Game.removeComputerGameBoard();
    Game.removeHumanGameBoard();
    Game.creatingComputerGameBoard();
    Game.creatingHumanGameBoard();
    Game.humanFleets();
    Game.computerFleet();
    Game.beginPlay();
}

let playAgain = document.querySelector('.play-again');
playAgain.addEventListener('click', startAgain);

let btn = document.querySelector('.re-arrange-ships-formation');
btn.addEventListener('click', startAgain);

let reArrangeHumanFleet = () => {
    let Game = game();
    Game.removeHumanGameBoard();
    Game.creatingHumanGameBoard();
    Game.humanFleets();
    Game.beginPlay();
}

let btn2 = document.querySelector('.re-arrange-human-formation');
// btn2.addEventListener('click', reArrangeHumanFleet);

// let re_arrange_computer_fleets = () => {
//     let Game = game();
//     Game.removeComputerGameBoard();
//     Game.creatingComputerGameBoard();
//     Game.computerFleet();
//     Game.beginPlay();
// }

// let computerReady = () => {
//     let rand = () => Math.random();
//     setTimeout(() => {
//         while(rand() > .5) {
//             // console.log("here!!")
//             re_arrange_computer_fleets();
//             // ready.computer = true;
//         }
//         alert('computer ready!!')
//     }, 2000)
// }

// computerReady();