/**
 * @jest-environment jsdom
 */
const game = require("../game_codes/gameLogic")

test('should check human player game Board is created', () => {
    expect(game().creatingHumanGameBoard()).not.toBeNull();
    // expect(game().creatingHumanGameBoard()).toBeNull();
});

test('should check computer player game Board is created', () => {
    expect(game().creatingComputerGameBoard()).not.toBeNull();
    // expect(game().creatingComputerGameBoard()).toBeNull();
});

test('should check ships coords', () => {
    expect(game().humanFleets()).not.toBeTruthy();
})
