const Player = require("../game_codes/player")

test('check random coords generator', () => {
    // expect(Player().coordsGenerator()).toBe(true);
    // expect(Player().coordsGenerator()).toBeCalledWith(expect.anything());
    expect(Player().coordsGenerator()).toBeTruthy();
});