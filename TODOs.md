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
  [x] extend leading edge out of camera view
  [ ] fade trailing edge

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
  [ ] animate hitting threat
  [ ] animate hitting enemy
  [ ] animate gaining health
  [ ] animate losing health
 
[ ] health indicator
  [x] show health indicator on player
  [x] decrease health when threat hit
  [x] increase health when health power-up collected
  [x] animate increase
  [x] animate decrease

[ ] enemy
  [x] move with the ground
  [x] only visible when on the ground
  [x] use models
  [x] show threatened squares
  [x] react to being hit by player
      [x] kill enemy
      [x] kill enemy's threats
  [x] fade in when entering
  [x] animate killed enemy
  [x] animate killed threat
  [x] animate threat hit by player

[ ] waves
  [x] setup enemy positions
  [x] setup multiple waves
  [ ] show current wave number in HUD
  [x] show new wave message
  [ ] have different environment for each wave
      [ ] background color
      [ ] lighting
      [ ] speed

[ ] power-ups
  [x] health power-up
  [x] fade in when entering
  [x] animate idle as bouncing
  [x] animate being picked up
  [ ] coins power-up

[ ] game over
  [x] end game when player's health runs out
  [x] show game over overlay
  [x] allow restart

[ ] ui improvements
  [ ] fonts
  [ ] icons

[ ] audio
  [ ] music
  [ ] sfx
    [ ] player movement
    [ ] power-up pickup
    [ ] enemy spawn
    [ ] threat spawn
    [ ] power-up spawn
    [ ] enemy capture
    [ ] threat hit
    [ ] health increase
    [ ] health decrease
    [ ] die
    [ ] wave complete

[ ] fix bug: at the end of a wave, player no longer reacts to keypress when on the right or left edge of the ground
             unless you stop spamming the keyboard
