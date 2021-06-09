we are going to implement classic game 'battleship', and these are breakdown to follow along as guideline for this assignment.
since this is a TDD approach, we'll write codes that are testable and pass'em along throughout development flow
for this assignment we should do our best to isolate every bit of application functionality from actual DOM manipulation bits, we can use mocks to ake sure DOM methods like appendChild are being called, and keep them outside of app logic when possible
Steps Breakdown:
<> begin by creating a Ship factory function, which will have these factors covered
    -- ship should include their length, where they are being hit or whether they sanked or not (we need to test ship public interface, as in only methods that are used outside of ship needs unit tests not all)
    -- ship should have a hit() which takes a number anbd then marks that position as 'hit-[X]'
    -- ship should also have function that calculates whether a ships has been sunked or not based on their length and 'hit' positions
<> creating ameBoard factory function, which should have these following criterions met
    -- create game board UI for outside scope to use
    -- game board should be able to place ships at specific coordinates by calling ship factory function
    -- game board should have a recieveAttack() method which takes a pair of coordinates, and determines whether or not that attack did hit a ship or not, if it did then calls on to hit() method from ship, otherwise records coordinates of missed shot
    -- game board should keep track of missed attacks so that they can be displayed on DOM properly
    -- game board should also be able to report whether or not all of their ships been sunked or not
<> create player factory function, which should have these traits
    -- players can take turns playing game by attacking enemy game borad at given coordinates
    -- this game is played against computer, so computer player should be capable of playing randomly, it should always aim at valid coordinates and should not fire at same coordinates twice
<> creating main game loop, and a module for DOM interaction
    -- we should create our entire game UI at this point
    -- game loop should set up a new game by creating Players and Gameboards, we can begin with predefined coordinates first then using user placed ships later on
    -- UI should display both boards on DOM, and render them using data from game board
        -- we'll need methods to render gameboards and provide user defined inputs for attacks on enemy ship, it can be a click on a coordinate in enemy gameboard
    -- game loop should step through game, turn by turn using only methods from other functions / objects that implemented separately, and should not break free from this noted point
    -- when any specific logic is not available, figure out which function should have it and use it from there
    -- have conditions so that game ends, when one players ship have all been sunk, which seems like a good place for this game module
<> Finishing Up
    -- there are sevral options for letting users place their ships, we can let them type coordinates for each ship or drag and drop
    -- we can brush up computer moves by haing it try adjacent slots after getting a 'hit' on enemy ship
    -- or even try to implement a two player version of it, but make sure to hide each other screen to each other so that opponents board stay hidden from display