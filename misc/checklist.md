# Checklist

ESP Change Order Checklist
Dallen Baldwin 10819890
9/3/2020

## Preflight checklist

- [x] Submit a zip of your ESP1 code before reading the rest of the requirements
- [x] Unicode is out. SVG is in. zener svg in wikipedia (video, research)
  - [x] SVG spike
  - [x] split SVG from wikipedia page
- [x] jQuery is out. Vanilla JS is in. (remedial/research)
- [x] Voice gen and rec are out. Buttons are in. (remedial)
- [x] Play pleasant sound for right answer (research)
  - [x] https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics
  - [x] sound library spike
- [x] Vibrate for wrong answer (research)
- [x] https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
- [x] device vibration spike
- [x] Change counter from 25 to 10
- [x] ESP threshold from 11 to 5
- [x] Pick a random card each time, not from a deck.
- [x] submit a checklist URL.

## inflight checklist

- [x] convert jquery to vanilla js
- [x] replace voice stuff with buttons and UI. #sadface
- [x] refactor shuffle function to shuffle 1 * 5 cards instead of 5 * 5 cards
- [x] set max guesses to 10
- [x] set esp to 5

### Flow

- [x] landing page
  - [x] visually can stay the same
  - [x] replace voice with text
  - [x] flip to back
  - [x] update player states
  - [x] continue/start logic can stay
- [x] start
  - [x] replace voice with text
  - [x] show card svgs as buttons
  - [x] click card to guess
  - [x] shuffle the 5 cards and pick one
  - [x] compare to guess
  - [x] flip to front with correct card
- [x] when correct
  - [x] display single card
  - [x] display a message of some kind
  - [x] play sound
- [x] when incorrect
  - [x] display single card svg
  - [x] display a message
  - [x] vibrate device
- [x] continue
  - [x] flip to back
  - [x] update player states
  - [x] show card buttons
  - [x] repeat { flip to front > correct/incorrect until max guesses }
- [x] win/lose logic should stay about the same.
  - [x] replace voice with text
- [x] exit
  - [x] should stay about the same functionality wise
- [x] spell check game text
