const CardFront = {
   template: `
      <div class="d-flex align-items-center justify-content-center c-card c-card-lg">
         <img
            class="img-fluid p-2"
            :alt="card"
            :src="imgSrc"
         />
      </div>
      `,
   props: ['card', 'theme'],
   data: function () {
      return {
         imgSrc: `./assets/${this.theme}/${this.card}.svg`,
      };
   },
};

const CardBack = {
   template: `
      <div class="c-card c-card-lg">
         <img 
            class="img-fluid p-2"
            alt="ghost" 
            :src="imgSrc"
         />
         <h4>Of {{ max }} guesses...</br>{{ max - num }} remain.</h4>
         <h5>{{ correct }} guessed correctly.</h5>
      </div>
   `,
   props: ['theme', 'max', 'num', 'correct'],
   data: function () {
      return {
         imgSrc: `./assets/${this.theme}/ghost.png`,
      };
   },
};

const CardButton = {
   template: `
   <div 
      class="c-card c-card-sm c-clickable" 
      @click="guess"
   >
      <img
         class="d-inline-block img-fluid p-2"
         :alt="card"
         :src="imgSrc"
         />
   </div>
   `,
   props: ['card', 'theme'],
   data: function () {
      return {
         imgSrc: `./assets/${this.theme}/${this.card}.svg`,
      };
   },
   methods: {
      guess: function () {
         this.$emit('guessed', this.card);
      },
   },
};

const v = new Vue({
   el: '#app',
   data: {
      currentState: '',
      currentCard: '',
      currentTheme: '',
      maxGuesses: 10,
      esp: 5,
      numGuesses: 0,
      correctGuesses: 0,
      shouldMove: undefined,
      pulse: undefined,
      vibrate: undefined,
      shake: undefined,
      shaking: false,
      pulsing: false,
      currentFeedback: '',
      gameOverFeedback: '',
      gameOverHeader: 'Game Over',
      cards: ['circle', 'plus', 'waves', 'square', 'star'],
      msgs: {
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
         beforeGuess: [
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
      },
      states: [
         // this is for reference,
         'init',
         'round-one', // different from guessing. uses static intro text
         'guessing',
         'guessed',
         'game-over',
      ],
   },
   components: {
      'card-button': CardButton,
      'card-front': CardFront,
      'card-back': CardBack,
   },
   methods: {
      ZhuLi_DoTheThing(card) {
         let correct = this.truffleShuffle(this.cards);
         this.currentCard = correct;
         this.numGuesses++;
         if (correct === card) {
            this.currentFeedback = this.truffleShuffle(this.msgs.right);
            this.correctGuesses++;
            this.happyChime();
         } else {
            if (this.vibrate === 'true') this.sadBuzz();
            if (this.shake === 'true') this.quakerShaker();
            if (this.pulse === 'true') this.redstonePulse();
            this.currentFeedback = this.truffleShuffle(this.msgs.wrong);
         }
         if (this.numGuesses >= this.maxGuesses) {
            this.currentState = 'guessed';
            if (this.correctGuesses >= this.esp) {
               this.gameOverFeedback = this.truffleShuffle(this.msgs.winCondition);
               this.gameOverHeader = 'Congratulations!';
            } else this.gameOverFeedback = this.truffleShuffle(this.msgs.loseCondition);
            setTimeout(() => {
               this.endGame();
            }, 3000);
         } else {
            this.currentState = 'guessed';
         }
      },
      loadCurrentGame() {
         this.currentFeedback = this.truffleShuffle(this.msgs.beforeGuess);
         this.correctGuesses = Number(this.getCookie('correctGuesses'));
         this.numGuesses = Number(this.getCookie('numGuesses'));
      },
      resetGame() {
         this.numGuesses = 0;
         this.correctGuesses = 0;
         this.currentState = 'init';
      },
      startGame() {
         this.numGuesses = 0;
         this.correctGuesses = 0;
         this.currentState = 'round-one';
      },
      endGame() {
         this.currentState = 'game-over';
         document.getElementById('gameOverBtn').click();
      },
      continueGame() {
         this.currentFeedback = this.truffleShuffle(this.msgs.beforeGuess);
         this.currentState = 'guessing';
      },
      setCookie(key, value) {
         document.cookie = `${key}=${value};max-age=2147483647;samesite=lax`;
      },
      getCookie(key) {
         let c = document.cookie
            .split(';')
            .map(x => x.trim())
            .find(x => x.startsWith(`${key}=`));
         if (c) c = c.split('=')[1].trim();
         if (c) return c;
         return undefined;
      },
      truffleShuffle(array) {
         let shuffled;
         // for some reason _.shuffle() returns an undefined list every once and a while... don't know why
         while (!shuffled) shuffled = _.shuffle(array).shift();
         return shuffled;
      },
      happyChime() {
         let sound = document.getElementById('notificationSound');
         sound.volume = 1;
         sound.play();
      },
      sadBuzz() {
         if (this.shouldMove) window.navigator.vibrate(1000);
      },
      redstonePulse() {
         this.pulsing = !this.pulsing;
         setTimeout(() => (this.pulsing = !this.pulsing), 1000);
      },
      quakerShaker() {
         if (this.shouldMove) {
            this.shaking = !this.shaking;
            setTimeout(() => (this.shaking = !this.shaking), 1000);
         }
      },
      initAppTheme() {
         let b = document.body;
         b.classList.remove('dark');
         b.classList.remove('light');
         b.classList.add(this.currentTheme);
         this.setCookie('theme', this.currentTheme);
      },
      setAppTheme() {
         let b = document.body;
         b.classList.remove('dark');
         b.classList.remove('light');
         b.classList.add(this.currentTheme);
         this.setCookie('theme', this.currentTheme);
         setTimeout(() => location.reload(), 500); // need this to update the images...
      },
      checkMovePref() {
         return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      },
      checkThemePref() {
         if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
         else return 'light';
      },
   },
   mounted() {
      this.currentState = this.getCookie('gameState') || 'init';
      this.currentTheme = this.getCookie('theme') || this.checkThemePref();
      this.numGuesses = Number(this.getCookie('numGuesses')) || 0;
      this.correctGuesses = Number(this.getCookie('correctGuesses')) || 0;
      this.shouldMove = this.checkMovePref() || true;
      this.pulse = this.getCookie('pulse') || 'true';
      this.vibrate = this.getCookie('vibrate') || `${this.checkMovePref()}`;
      this.shake = this.getCookie('shake') || `${this.checkMovePref()}`;
      this.currentCard = this.getCookie('currentCard') || '';
      this.initAppTheme();
      if (this.currentState === 'game-over') this.endGame();
      else if (this.currentState === 'init') this.resetGame();
      else this.loadCurrentGame();
   },
   beforeUpdate() {
      this.setCookie('gameState', this.currentState);
      this.setCookie('theme', this.currentTheme);
      this.setCookie('numGuesses', this.numGuesses);
      this.setCookie('correctGuesses', this.correctGuesses);
      this.setCookie('pulse', this.pulse);
      this.setCookie('vibrate', this.vibrate);
      this.setCookie('shake', this.shake);
      this.setCookie('currentCard', this.currentCard);
   },
});
