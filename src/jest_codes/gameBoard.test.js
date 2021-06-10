/**
 * @jest-environment jsdom
 */
const GameBoard = require('../game_codes/gameBoard');
let boardMock = require('../game_codes/gameBoard');
// jest.mock('../game_codes/gameBoard');

//  boardMock.mockImplementation(() => 10)

test('should check grids of length 10', () => {
    expect(boardMock()).toBe(10)
});

// let board2 = require('../game_codes/gameBoard');
// boardMock.mockImplementation(() => 2)
test('match length', () => {
    expect(boardMock()).toBe(2);
    // expect(board2.createGrids(2)).toBe(2);
    // expect(GameBoard().createGrids(2)).toBe(2);
    // console.log(board2, GameBoard);
});

// boardMock.mockImplementation(() => ["A", "4"])
test('should match grid alphabet', () => {
    expect(boardMock()[0]).toBe("A");
});

test.only('should grid match lenegth', () => {
    expect(GameBoard().populateBoardOnDOM(4)).toBe(4);
});

test('should match cooords value', () => {
    // expect(boardMock()).toContainEqual(["A","4"])
    expect(boardMock()).toEqual(["A","4"])
})

test.only('should use jsdom here', () => {
    expect(GameBoard().createGrids(4)).not.toBeNull();
    // expect(GameBoard().createGrids(4)).toBeNull();
})

test.only('should check recieve attacks', () => {
    // expect(GameBoard().recieveAttacks(["A", "4"])).toEqual([["A","4"]])
    expect(GameBoard().recieveAttacks(["A", "4"])).not.toEqual([["A","4"]])
    expect(GameBoard().loggingMissFiredShots).not.toBeNull()
})

