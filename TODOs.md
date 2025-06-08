# TODOs

[x] initial layout
  [x] camera
  [x] lights
  [x] ground
  [x] player
  [x] enemy

[ ] background
  [ ] color

[ ] ground
  [x] show as checker board
  [x] scroll
  [x] extend ground off the bottom of the screen
  [ ] fade leading & trailing edges

[ ] player
  [x] movement using keyboard
  [ ] movement using touch
  [x] restrict player movement
  [x] visually indicate player movement bounds, eg. boundary lines
  [x] use Rook model
  [x] animate movement
  [x] adjust camera when player moves
  [ ] add thruster(s)
  [ ] animate when idle
  [ ] should bounds extend to cover the whole ground?
  [ ] react to hitting threat
 
[ ] health indicator
  [x] show health indicator on player
  [x] decrease health when threat hit
  [ ] increase health when health power-up collected

[ ] enemy
  [x] move with the ground
  [x] only visible when on the ground
  [x] use models
  [x] show threatened squares
  [x] react to being hit by player
      [x] kill enemy
      [x] kill enemy's threats
  [ ] fade in entering enemies & fade out leaving enemies

[ ] waves
  [x] setup enemy positions

[ ] power-ups
  [x] health power-up

[ ] game over
  [ ] end game when player's health runs out
  [ ] show game over overlay
  [ ] allow restart
