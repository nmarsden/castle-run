# IDEAS

## Brain Storming
* Rook - Survival chess game - https://www.puzzleprime.com/game/rook/
* Tower Stacks - use 9 puzzle piece to build a vertical castle - https://www.youtube.com/watch?v=H84Tc2ZyXpY
* Stack Tower - physics based tower stacking - https://www.mortgagecalculator.org/money-games/stack-tower/
* Rook Puzzle - use the standard chess moves to get the Rook to the black square - https://gx.games/games/pbumve/rook-puzzle-sherzod-khaydarbekov-/

# Castle Run: Game Outline

## Genre
Arcade, Puzzle, Endless Runner

## Concept
Players control a **Rook** chess piece on a 5x10 grid that scrolls towards them. The objective is to avoid squares threatened by approaching enemy chess pieces (Pawns, Knights, Bishops, Rooks, Queens) for as long as possible. The game concludes when the Rook is captured.

---

## Gameplay Mechanics

### Player Control
* The player controls a **Rook** piece.
* **Movement:** The Rook can move any number of squares horizontally or vertically in a single turn, just like in chess. However, unlike traditional chess, movement is fluid and not turn-based.
* **Input:**
    * **Arrow Keys / WASD:** To move the Rook (Left, Right, Up/Forward, Down/Backward).
    * The Rook moves one square at a time in the direction pressed. Holding a key allows continuous movement.

### Game Grid
* A 5 squares wide x 10 squares long grid.
* The player's Rook starts at the "front" (closest to the player's view) of the grid, facing away.
* The entire grid **scrolls towards the player**, creating a sense of continuous movement and approaching threats.

### Enemy Pieces
* Various enemy chess pieces (Pawns, Knights, Bishops, Rooks, Queens) appear on the scrolling grid at varying distances and frequencies.
* Each enemy piece targets squares according to its standard chess movement rules.
* **Visual Cues:** Squares threatened by enemy pieces will be clearly highlighted (e.g., red glow, specific pattern) to indicate danger zones.
* **Capture Condition:** If the player's Rook occupies a threatened square when the enemy piece "moves into range" or the threatened square reaches the Rook's position, the Rook is captured, and the game ends.

### Scoring
* Score is based on how long the player survives.
* Bonus points could be awarded for surviving specific waves of enemies, collecting power-ups, or performing risky maneuvers.

### Game Over
* When the Rook is captured.
* A "Game Over" screen displays the final score and an option to restart.

---

### Defensive & Survival Power-Ups

1.  #### Castle Wall (Temporary Shield)
    * **Effect:** Grants temporary invulnerability to your Rook. For a short duration (e.g., 3-5 seconds), your Rook can pass through threatened squares without being captured.
    * **Visual:** The Rook glows with a shimmering aura, perhaps with a stone or brick texture overlay.
    * **Chess Theme:** Represents the strength and protection of a castle's walls.

2.  #### King's Decree (Slow Time)
    * **Effect:** Slows down the scrolling of the grid and the movement/attack patterns of all enemy pieces for a brief period (e.g., 4-6 seconds). This gives you more time to react and plan your moves.
    * **Visual:** A regal golden glow emanates from your Rook, and the background subtly shifts to a slower, more deliberate motion.
    * **Chess Theme:** The King's authority dictates the pace of the game.

3.  #### Bishop's Blessing (Diagonal Dodge)
    * **Effect:** For a single move, your Rook gains the ability to move diagonally, similar to a Bishop. This can be a crucial escape tool when boxed in by horizontal or vertical threats.
    * **Visual:** A faint diagonal path appears as a guide when you attempt a diagonal move, or the Rook briefly takes on a Bishop-like silhouette.
    * **Chess Theme:** Grants a temporary aspect of another piece's movement.

4.  #### Knight's Leap (Jump Over Threat)
    * **Effect:** Allows your Rook to "jump" over one adjacent threatened square, effectively passing through it without being captured, as if it were a Knight's L-shaped move. This can be used once per pickup.
    * **Visual:** The Rook performs a quick "hop" animation over the square.
    * **Chess Theme:** Emulates the unique jumping ability of the Knight.

5.  #### Pawn Promotion (Extra Life/Second Chance)
    * **Effect:** Functions as an "extra life." If your Rook is captured while this power-up is active, it immediately reappears on a safe, adjacent square (or slightly further back on the grid), and the power-up is consumed.
    * **Visual:** A small, floating "Pawn" icon that the Rook collects. When activated, a "Promotion" animation briefly plays with the Rook.
    * **Chess Theme:** The pawn's ability to be promoted to a more powerful piece, here representing a "rebirth."

### Utility & Strategic Power-Ups

6.  #### Clear Path (Threat Removal)
    * **Effect:** Briefly removes all currently active threatened squares on the visible part of the grid, or clears a specific area around your Rook.
    * **Visual:** A burst of white energy ripples across the screen, making the threatened squares disappear.
    * **Chess Theme:** A strategic "clearance" of the board.

7.  #### Queen's Insight (Future Vision)
    * **Effect:** For a short duration, highlights potential safe paths on the upcoming (scrolling) grid, showing where enemy pieces *will* target in the next few seconds.
    * **Visual:** Faint, glowing lines or indicators appear on future safe squares.
    * **Chess Theme:** The Queen's power and foresight.

8.  #### Rook's Rally (Speed Boost)
    * **Effect:** Temporarily increases your Rook's movement speed across the grid, allowing for quicker evasions and reaching distant safe spots.
    * **Visual:** The Rook leaves a faint trail, and a "whoosh" sound effect plays.
    * **Chess Theme:** The Rook's long-range, decisive movement.

### Score & Collectible Power-Ups

9.  #### Golden Chess Piece (Score Multiplier)
    * **Effect:** Doubles or triples the score gained for a short period. Any successful evasions contribute more points.
    * **Visual:** A shining golden chess piece appears on the grid.
    * **Chess Theme:** Value in collecting precious pieces.

10. #### Time Warp (Bonus Time)
    * **Effect:** Adds a small amount of bonus time to the overall survival timer (if one is displayed, or directly contributes to the score based on time).
    * **Visual:** A swirling clock icon.
    * **Chess Theme:** Gaining precious turns or time in a critical game.

---

### Considerations for Power-Ups Implementation:

* **Rarity:** Some power-ups should be rarer than others (e.g., King's Decree, Clear Path) to make them feel more impactful.
* **Duration/Uses:** Clearly define if a power-up is temporary (time-based) or a one-time use.
* **Visual/Audio Cues:** Ensure distinct visual and sound effects for each power-up pick-up and activation, so players immediately understand what they've gained.
* **Balancing:** Thoroughly test the power-ups to ensure they don't make the game too easy or too difficult. Adjust durations, frequencies, and effects as needed.

---

## Game Progression

### Difficulty Curve
* Initially, only a few Pawns might appear, moving slowly.
* As time progresses, more enemy pieces of different types will appear, increasing in frequency and complexity of attack patterns.
* Enemy piece types will be introduced gradually: Pawns, then Knights, then Bishops, then Rooks, then Queens.

### "Waves" or "Levels"
* While an endless runner, there could be subtle "wave" transitions where new enemy types are introduced or the density of enemies increases.

### Environmental Hazards (Optional)
* Later stages could introduce static "obstacles" on the board that the Rook cannot move through, forcing more precise movement.

---

## Visuals & Audio

### Art Style
Clean, stylized 3D or 2D chess pieces and a simple, clear grid. The scrolling motion should be smooth.

### Player Rook
Distinctive and easily identifiable.

### Enemy Pieces
Standard chess piece designs, perhaps with subtle color variations to distinguish them from the player.

### Threat Indicators
Highly visible and distinct visual effects for threatened squares.

### Sound Effects
* Movement sounds for the Rook.
* Distinct sounds for enemy piece appearances.
* A "capture" sound for game over.
* Upbeat, arcade-style background music that increases in intensity with difficulty.

---

## Development Considerations

* **Collision Detection:** Efficient system for detecting when the Rook is on a threatened square.
* **Enemy AI:** Simple pathing for enemies to determine their threatened squares.
* **Scrolling Management:** Smooth and consistent scrolling of the grid and enemy pieces.
* **Performance:** Optimized for web browsers to ensure smooth gameplay on various devices.
