import game from "./game_codes/gameLogic"

let Game = game();
Game.startGame();
Game.sneakPeakOnComputer();
// Game.re_arrange_human_fleets();
// game().playAgain();

let startAgain = () => {
    document.querySelector('.sneak-peak').textContent = 'sneak peak'
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