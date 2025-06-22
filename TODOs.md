# TODOs

[x] initial layout
  [x] camera
  [x] lights
  [x] ground
  [x] player
  [x] enemy

[ ] camera
    [x] shake when threat hit

[ ] background
  [x] color

[ ] ground
  [x] show as checker board
  [x] scroll
  [x] extend ground off the bottom of the screen
  [x] extend leading edge out of camera view
  [ ] fade trailing edge

[ ] player
  [x] movement using keyboard
  [x] movement using touch
  [x] restrict player movement
  [x] visually indicate player movement bounds, eg. boundary lines
  [x] use Rook model
  [x] animate movement
  [x] adjust camera when player moves
  [ ] add thruster(s)
  [ ] animate when idle
  [ ] should bounds extend to cover the whole ground?
  [x] animate hitting threat
  [ ] animate hitting enemy
  [ ] animate gaining health
  [ ] animate losing health
  [x] animate dead
  [x] edit model to simplify geometry
  [x] use a custom shader
  [ ] player color depends on health, the less health the more red
  [x] improve hitting threat animation


[ ] health indicator
  [x] show health indicator on player
  [x] decrease health when threat hit
  [x] increase health when health power-up collected
  [x] animate increase
  [x] animate decrease
  [x] use a custom shader
  [x] use a non-box geometry
  [x] add container

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
  [x] threat material - use shader

[ ] waves
  [x] setup enemy positions
  [x] setup multiple waves
  [ ] show current wave number in HUD
  [x] show new wave message
  [ ] have different environment for each wave
      [ ] background color
      [ ] lighting
      [ ] speed
  [x] use Segment-Based Generation:
      * How it works: Create a library of pre-designed "segments" (e.g., "single enemy dodge," "double enemy dodge with gap," "zig-zag pattern," "all lanes blocked but one").
      * Generation Process:
        1. Define a target difficulty/density for the current segment.
        2. Randomly select a segment from your library that matches the difficulty.
        3. Stitch segments together. Ensure smooth transitions.

[ ] power-ups
  [x] health power-up
  [x] fade in when entering
  [x] animate idle as bouncing
  [x] animate being picked up
  [x] animate idle as bouncing & rotating
  [x] use a custom shader
  [x] use a non-box geometry
  [ ] coins power-up

[ ] game over
  [x] end game when player's health runs out
  [x] show game over overlay
  [x] allow restart
  [x] show number of waves completed
  [x] show best number of waves completed

[ ] ui improvements
  [x] fonts
  [x] icons
  [x] toggle buttons
  [x] controls info

[ ] audio
  [x] music
  [x] sfx
    [x] player movement.  - 40, 46, 47
    [x] power-up pickup.  - 15, 23
    [x] enemy spawn       - 22, 35, 37
    [x] threat spawn.     - 21
    [x] power-up spawn.   - 22
    [x] enemy hit.        - 19, 20, 30, 31
    [x] threat hit.       - 27, 29
    [x] health increase.  - 24
    [x] health decrease.  - 25
    [x] die               - 05, 33, 27, 18, 17, 08
    [x] wave complete.    - 45
  [x] sfx on/off controls
  [x] music on/off controls
  [ ] convert audio files to mp3 & webm

[ ] use local storage
    [x] sfx on/off
    [x] bloom on/off

[x] favicon

[ ] fix bugs
    [x] player stopped moving if pressing one direction followed by the opposite direction multiple times
    [ ] enemy's z position is shifted out of alignment with the ground over time
    [x] fix camera shake when player hit
    [x] fix things becoming invisible too early before being out of view
    [x] fix loading behaviour - do not show ui until loaded

[x] push to github
[x] deploy

