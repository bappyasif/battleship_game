const Ship = require("../game_codes/ship");

let shipCoords = ["A", "4"];
let attackCoords = ["B", "2"];

test('check it did hit', () => {
    // expect(attackCoords).toEqual(shipCoords);
    expect(attackCoords).toBe(shipCoords);
});

let shipCoords2 = ["A", "4"];
let attackCoords2 = ["A", "4"];

test('see if it is a hit', () => {
    expect(attackCoords2).toEqual(shipCoords2);
});

let length = 2;
// let mockHit = jest.fn().mockReturnValue(length).mockImplementation(x => length-x).mockName('minus 1');
// jest.mock("../game_codes/ship");
// Ship.mockImplementation(() => length = length-1);
test('check when coords hits', () => {
    // expect(Ship(shipCoords2, length, attackCoords2)).toBe(1);
    expect(Ship()).toBe(1);
});

let ship2 = require("../game_codes/ship");

// ship2.mockImplementation(()=>shipCoords2[0] === attackCoords2[0]);
test('is it a hit or miss', () => {
    expect(ship2()).toBe(true);
});

let length2 = 0;
// ship2.mockImplementation(()=> length2 === 0);
test('when ship has sunked', () => {
    expect(ship2()).toBe(true)
});

test.only('when shot has missfired', () => {
    expect(attackCoords).not.toBe(shipCoords)
});

test.only('should check ship length and coords', () => {
    expect(Ship(["d","4"], 2).shipLength).toBe(2)
    expect(Ship(["d","4"], 2).shipCoords).toEqual(["d","4"])
});

test.only('should check hit miss', () => {
    expect(Ship(["d","4"], 2).checkHitOrMiss(["d", "4"])).toBe(true);
    expect(Ship(["d","4"], 2).checkHitOrMiss(["d", "2"])).toBe(false)
});

test.only('should check hit functionality', () => {
    expect(Ship(["g","4"], 2).hit(["f", "2"])).not.toBe(null)
    expect(Ship(["g","4"], 2).hit(["g", "4"])).toBe(1)
});

test.only('should check if sunk', () => {
    expect(Ship(["g","4"], 0).isSunk()).toBe(true)
})
