// important variables
const DB = window.localStorage;
if (!DB.getItem('guessCount')) DB.setItem('guessCount', '0');
if (!DB.getItem('correctGuess')) DB.setItem('correctGuess', '0');

const TOTALGUESS = 10;
const ESP = 5;
const MSGS = {
   afterGuesses: [
      `If you would like to continue, click Continue. Otherwise, click Exit`,
      `Shall we continue? I could go all day.`,
      `Are you afraid of no ghost?`,
      `Why do I feel like I need to call someone?`,
      `Please click Continue, unless you are afraid.`,
      `If you feel the need to leave... please click Exit on your way out.`,
      `Are you on doing well? Are you failing? I don't know. These responses are randomized`,
      `I'm studying the effects of negative reinforcement on ESP ability.`,
      `Is this worth the 5 dollars the school is paying you? Oh wait... they're not paying you?`,
   ],
   afterButton: [
      `Clear your mind... When you're ready, select the card below that matches the one on the back.`,
      `It could be a circle, a star, a square, a plus, or waves. Select the right one below.`,
      `Do I know which one it is? I'll never tell...`,
      `We shall continue. Now clear your mind and select the right card.`,
      `If only Bill knew what we were doing...`,
      `Well, I guess you really want to see that fire station. Pick a card.`,
      `Clear your head... All right... Pick which one you think it is.`,
      `All right... Think hard... Now... which is it?`,
      `All right... Are you ready? What is it? Come on...`,
      `Ok... Are you nervous? You only have a few more to go... What's this one?`,
   ],
   winCondition: [
      `It appears you have an affinity for the supernatural...`,
      `Perhaps a career in Ghost-busting is in your future...`,
      `You have it! Remember, NEVER cross the streams.`,
      `Now that you've proven your ESP ability... Are you ready to fight a giant Stay Puft Marshmallow Man?`,
      `Bill would be so proud...`,
   ],
   loseCondition: [
      `Some people just don't have it...`,
      `I guess you're not a pretty blond girl...`,
      `No rides in the station wagon for you I guess...`,
      `Bill would be disappointed...`,
      `At least they won't make a weirdly entertaining, yet weirdly disappointing, reboot about your adventures in 40 years; only so you can cameo as a brand new character to kind of nostalgia-bait movie-goers...`,
   ],
   wrong: [
      `Good guess... but wrong...`,
      `Close... But definitely wrong...`,
      `Sorry... This isn't your lucky day...`,
   ],
   right: [
      `It is that card! Very good! That's great!`,
      `Incredible! You can't see these cards can you? You're not cheating me are you?`,
   ],
};
const CARDS = ['star', 'circle', 'square', 'waves', 'plus'];

function setContinueState() {
   document.getElementById('startBtn').style.display = 'none';
   document.getElementById('continueBtn').style.display = 'inline';
   document.getElementById('cardBtnGroup').style.display = 'none';
   document.getElementById('cardBack').style.display = 'block';
   document.getElementById('cardFront').style.display = 'none';
   document.getElementById('welcomeMessage').style.display = 'none';
   [...document.querySelectorAll('.c-zener-card')].forEach(
      card => (card.style.display = 'none')
   );
}

function setBeginState() {
   document.getElementById('startBtn').style.display = 'block';
   document.getElementById('continueBtn').style.display = 'none';
   document.getElementById('exitBtn').style.display = 'none';
   document.getElementById('cardBack').style.display = 'block';
   document.getElementById('cardFront').style.display = 'none';
   document.getElementById('cardBtnGroup').style.display = 'none';
   [...document.querySelectorAll('.c-zener-card')].forEach(
      card => (card.style.display = 'none')
   );
}

function updateGuesses() {
   let remainingGuesses = TOTALGUESS - Number(DB.getItem('guessCount'));
   document.getElementById('guessCount').innerText = '';
   document.getElementById(
      'guessCount'
   ).innerText = `Of ${TOTALGUESS} guesses...\n${remainingGuesses} remain.`;
   document.getElementById('guessRatio').innerText = '';
   document.getElementById('guessRatio').innerText = `${DB.getItem(
      'correctGuess'
   )} guessed correctly...`;
}

function customShuffle(array) {
   let shuffled;
   // for some reason _.shuffle() returns an undefined list every once and a while... don't know why
   while (!shuffled) shuffled = _.shuffle(array).shift();
   return shuffled;
}

function newCommand(phrase) {
   let div = document.getElementById('messageSpace');
   div.innerText = '';
   div.innerText = phrase;
}

function appendCommand(phrase) {
   let div = document.getElementById('messageSpace');
   div.innerText += ` ${phrase}`;
}

function flipFront(card) {
   document.getElementById('cardBack').style.display = 'none';
   document.getElementById('cardFront').style.display = 'block';
   document.getElementById(`${card}-card`).style.display = 'block';
}

function flipBack() {
   document.getElementById('cardFront').style.display = 'none';
   [...document.querySelectorAll('.c-zener-card')].forEach(
      card => (card.style.display = 'none')
   );
   document.getElementById('cardBack').style.display = 'block';
}

function ZhuLi_DoTheThing(event) {
   document.getElementById('cardBtnGroup').style.display = 'none';
   let card = event.target.alt;
   let correct = customShuffle(CARDS);
   let guessed = Number(DB.getItem('correctGuess'));
   let count = Number(DB.getItem('guessCount'));
   count++;
   DB.setItem('guessCount', count);
   if (card === correct) {
      guessed++;
      happyChime();
      DB.setItem('correctGuess', guessed.toString());
      newCommand(customShuffle(MSGS.right));
   } else {
      sadBuzz();
      newCommand(`${customShuffle(MSGS.wrong)}. The correct symbol was ${correct}.`);
   }
   appendCommand(`You have guessed ${guessed} card${guessed == 1 ? '' : 's'} correctly.`);
   flipFront(correct);
   if (count >= TOTALGUESS) {
      setTimeout(() => {
         finishTheGame();
      }, 3000);
      return;
   } else {
      appendCommand(customShuffle(MSGS.afterGuesses));
      document.getElementById('continueBtn').style.display = 'inline';
      document.getElementById('exitBtn').style.display = 'inline';
   }
}

function finishTheGame() {
   setContinueState();
   let correct = Number(DB.getItem('correctGuess'));
   let gameOver = document.getElementById('gameOverModalBody');
   gameOver.innerHTML = '';
   gameOver.innerHTML = `<p>You managed to guess ${correct} card${
      correct === 1 ? '' : 's'
   }.</p>`;
   if (correct >= ESP) {
      gameOver.innerHTML += `<p>${customShuffle(MSGS.winCondition)}</p>`;
   } else {
      gameOver.innerHTML += `<p>${customShuffle(MSGS.loseCondition)}</p>`;
   }
   document.getElementById('gameOverBtn').click();
}

function startGame() {
   resetTheGame();
   document.getElementById('startBtn').style.display = 'none';
   document.getElementById('welcomeMessage').style.display = 'none';
   document.getElementById('messageSpace').style.display = 'block';
   // send init command
   newCommand(
      `I'm going to test you for extra sensory power. The symbol on the back of this card matches one of the cards below. Clear your mind. When you're ready, select the correct card.`
   );
   document.getElementById('cardBtnGroup').style.display = 'block';
}

function resetTheGame() {
   DB.setItem('correctGuess', '0');
   DB.setItem('guessCount', '0');
   updateGuesses();
   flipBack();
   document.getElementById('exitBtn').style.display = 'none';
   document.getElementById('continueBtn').style.display = 'none';
   document.getElementById('cardBtnGroup').style.display = 'none';
   document.getElementById('startBtn').style.display = 'block';
   document.getElementById('welcomeMessage').style.display = 'block';
   document.getElementById('messageSpace').style.display = 'none';
}

function continueGame() {
   document.getElementById('welcomeMessage').style.display = 'none';
   document.getElementById('continueBtn').style.display = 'none';
   document.getElementById('exitBtn').style.display = 'none';
   document.getElementById('cardBtnGroup').style.display = 'block';
   // update guess display
   updateGuesses();
   // flip the card back
   flipBack();
   // send follow up response
   newCommand(customShuffle(MSGS.afterButton));
}

function happyChime() {
   let sound = document.getElementById('notificationSound');
   sound.volume = 1;
   sound.play();
}

function sadBuzz() {
   return window.navigator.vibrate(1000);
}
