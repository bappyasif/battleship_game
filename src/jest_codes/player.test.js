const Player = require("../game_codes/player")

test('check random coords generator', () => {
    // expect(Player().coordsGenerator()).toBe(true);
    // expect(Player().coordsGenerator()).toBeCalledWith(expect.anything());
    expect(Player().coordsGenerator()).toBeTruthy();
});

test('check ships consecutive coords ', () => {
    expect(Player('human', 7).positionShip('human')).toBeTruthy();
    // expect(Player('human', 7).positionShip('human')).not.toBeTruthy();
});
