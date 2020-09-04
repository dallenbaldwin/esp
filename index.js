// important variables
const DB = window.localStorage;
if (!DB.getItem('guessCount')) DB.setItem('guessCount', '0');
if (!DB.getItem('correctGuess')) DB.setItem('correctGuess', '0');

const TOTALGUESS = 10;
const ESP = 5;
const MSGS = {
   afterGuesses: [
      `If you'd like to continue, click Continue, otherwise, click exit`,
      `Shall we continue? I could go all day.`,
      `Are you afraid of no Ghost?`,
      `Do I need to call someone about this?`,
      `Please click continue, unless you are afraid.`,
      `If you feel the need to leave, please click Exit on your way out.`,
      `Are you on a roll? Are you failing? I don't know. These responses are randomized`,
      `I'm studying the effect of negative reinforcement on ESP ability.`,
      `Is this worth the 5 dollars?`,
   ],
   afterButton: [
      `Let us continue. The deck has been shuffled. Clear your mind. When you're ready, say out loud which symbol is on the back of the card.`,
      `Let me go ahead and shuffle this deck a few times while you think about your next guess. I'll stop shuffling when you say the next symbol`,
      `It could be a circle. It could be a star, It could be a square, it could be a plus, or it could be waves.`,
      `Do I know which one it is? I'll never tell...`,
      `We shall continue. Clear your mind. Now tell me the symbol!`,
      `If only Bill knew what we were doing... Now tell me the symbol.`,
      `Man, all this small talk is making me tired. Just tell me the next symbol.`,
      `Well, I guess you really want to see that fire station. Tell me the symbol.`,
      `Clear your head. All right. Tell me what you think it is.`,
      `All right. Think hard. Now... what is it.`,
      `All right. Are you ready? What is it? Come on.`,
      `Ok. Are you nervous? You only have a few more to go. Ok. What's this one?`,
   ],
   winCondition: [
      `It appears you have an affinity for the supernatural.`,
      `Perhaps a career in Ghost-busting is in your future.`,
      `You win. Just don't cross streams when the time comes.`,
      `This definitely wasn't an aptitude test for ghost-busting. Or was it?`,
      `Bill would be proud...`,
   ],
   loseCondition: [
      `Some people just don't have it.`,
      `I guess you're not a pretty blond girl.`,
      `No rides in the station wagon for you I guess.`,
      `Bill would be disappointed...`,
      `At least they won't make a weirdly entertaining yet weirdly disappointing reboot about you and have you cameo as a brand new character in 40 years`,
   ],
   wrong: [
      `Good guess, but wrong.`,
      `Close... But definitely wrong.`,
      `Sorry. This isn't your lucky day.`,
   ],
   right: [
      `It is that symbol. Very good. That's great.`,
      `Incredible! You can't see these can you? You're not cheating me are you?`,
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
      DB.setItem('correctGuess', guessed.toString());
      newCommand(customShuffle(MSGS.right));
   } else {
      newCommand(`${customShuffle(MSGS.wrong)}. The correct symbol was ${correct}.`);
   }
   appendCommand(`You have guessed ${guessed} card${guessed == 1 ? '' : 's'} correctly.`);
   flipFront(correct);
   if (count >= TOTALGUESS) {
      finishTheGame();
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
      `I'm going to test you for extra sensory power. On the back of this card is a circle, plus, waves, square, or star. Clear your mind. When you're ready, select which card is on the back from the cards below.`
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
