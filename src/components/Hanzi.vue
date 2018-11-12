<template>
  <div v-bind:class="[{ mobile: isMobile }]">
    <div class="right" v-if="!isSignedIn">
      <div v-on:click="login">
        Login
      </div>
      <div v-on:click="signUp">
        Sign up
      </div>
    </div>
    <div class="left">
      <h1>汉字 / 漢字 / Hàn Zì</h1>
      <div>
        <input v-model="maxCharacters" v-on:change="reset" class="maxCharacters" type="number" value="100" min="50" max="1500" />
        most common characters.
      </div>
      <div class="scores">
        <div class="score pinyinScore">
          pinyin score: <div class="pinyinCorrect"> {{ pinyinScore }}</div> / <div class="pinyinTotal">{{ total }}</div>
        </div>
        <div class="score englishScore">
          meaning score: <div class="englishCorrect"> {{ meaningScore }}</div> / <div class="englishTotal">{{ total }}</div>
        </div>
      </div>

      <div class="stats-link" v-if="isSignedIn && !isMobile" v-on:click="goToStats">
        view full stats
      </div>

      <div class="pastGames" v-if="!isMobile">
        <div v-for="(pastGame, index) in pastGames" :key="`pastGame-${index}`">
          <span v-html="pastGame"></span>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="characters" v-if="currentCharacter.simplified !== currentCharacter.traditional">
        {{ currentCharacter.simplified }} / {{ currentCharacter.traditional }}
      </div>
      <div class="characters" v-else>
        {{ currentCharacter.simplified }}
      </div>
      <div v-html="currentSentence.simplified" class="simplified chinese-sentence sentence"></div>
      <div
        v-html="currentSentence.traditional"
        v-if="currentCharacter.simplified !== currentCharacter.traditional"
        class="traditional chinese-sentence sentence"></div>
      <div
        v-if="pinyinAnswer && meaningAnswer"
        v-html="currentSentence.pinyin"
        class="sentence"></div>
      <div
        v-if="pinyinAnswer && meaningAnswer"
        v-html="currentSentence.english"
        class="sentence"></div>
      <div class="bottom">
        <div class="answers">
          <button v-if="!pinyinAnswer" v-for="(answer, index) in currentCharacterAnswers" :key="`answer-${index}`" v-on:click="pinyinAnswer = answer.pinyin">
            {{ answer.pinyin }}
          </button>
          <button v-if="pinyinAnswer && !meaningAnswer" v-for="(answer, index) in currentCharacterAnswers" :key="`answer-${index}`" v-on:click="meaningAnswer = answer.definition">
            {{ answer.definition }}
          </button>
        </div>
        <div class="results">
          <button v-if="pinyinCorrect !== undefined && meaningCorrect !== undefined" v-on:click="submitAnswer">Next</button>
          <div v-if="pinyinCorrect !== undefined"
            v-bind:class="{ correct: pinyinCorrect, incorrect: !pinyinCorrect }">
            {{ currentCharacter.pinyin }}
          </div>
          <div class="dash">-</div>
          <div v-if="meaningCorrect !== undefined"
            v-bind:class="{ correct: meaningCorrect, incorrect: !meaningCorrect }">
            {{ currentCharacter.definition }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function shuffle(a) {
  let j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

const getCurrentSentence = (currentCharacter) => {
  let possibleSentences = []

  // get sentences that contain the current character
  // we get all of them so there can be some variation
  Object.keys(sentences).forEach( function(key) {
    if (sentences[key].simplified.indexOf(currentCharacter.simplified) > 0) {
      possibleSentences.push(sentences[key])
    }
  })

  // get a random sentence from the list of possible ones
  let sentence = possibleSentences[getRandom(0, possibleSentences.length)]

  //bold the current character
  sentence.traditional = sentence.traditional.replace(currentCharacter.traditional, "<span style='color:black;font-weight:bold;'>" + currentCharacter.traditional + '</span>' )
  sentence.simplified = sentence.simplified.replace(currentCharacter.simplified, "<span style='color:black;font-weight:bold;'>" + currentCharacter.simplified + '</span>' )
  return sentence
}


const defaultMax = window.localStorage.getItem('maxCharacters') || 100
const sentences = require('./sentences.json')
const characters = require('./characters.json')

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

export default {
  name: 'Hanzi',
  data() {
    const currentCharacter = characters[getRandom(0, defaultMax)]
    const currentSentence = getCurrentSentence(currentCharacter)

    return {
      isSignedIn: firebase.auth().currentUser,
      isMobile: window.mobilecheck(),
      currentTime: Date.now(),
      characterIndex: getRandom(0, defaultMax),
      maxCharacters: defaultMax,
      total: 0,
      pinyinScore: 0,
      meaningScore: 0,
      pinyinAnswer: '',
      meaningAnswer: '',
      pastGames: [],
      sentences,
      characters,
      currentCharacter,
      currentSentence
    }
  },
  computed: {
    currentCharacterAnswers: function () {
      // initialize with correct answer
      let answers = [this.currentCharacter]

      // add 3 wrong answers
      while (answers.length < 4 && this.maxCharacters > 4) {
        answers = [ ...new Set([ ...answers, this.characters[getRandom(0, parseInt(this.maxCharacters))] ]) ]
      }

      return shuffle(answers)
    },
    pinyinCorrect: function () {
      if (this.pinyinAnswer === '' ) {
        return undefined
      }
      return this.pinyinAnswer === this.currentCharacter.pinyin
    },
    meaningCorrect: function () {
      if (this.meaningAnswer === '' ) {
        return undefined
      }
      return this.meaningAnswer === this.currentCharacter.definition
    }
  },
  methods: {
    goToStats: function() {
      this.$router.replace('/stats')
    },
    reset: function() {
      window.localStorage.setItem('maxCharacters', this.maxCharacters)
      this.pinyinAnswer = ''
      this.meaningAnswer = ''
      this.characterIndex = getRandom(0, this.maxCharacters)
      this.currentCharacter = this.characters[this.characterIndex]
      this.currentSentence = getCurrentSentence(this.currentCharacter)
    },
    submitAnswer: function(e) {
      const {pinyinCorrect, meaningCorrect, currentCharacter} = this
      if (this.pinyinCorrect) {
        this.pinyinScore++
      }
      if (this.meaningCorrect) {
        this.meaningScore++
      }
      this.total++
      this.pinyinAnswer = ''
      this.meaningAnswer = ''

      //upload to firebase
      if (this.isSignedIn) {
        const db = firebase.firestore()
        const scoresRef = db.collection("scores").doc(firebase.auth().currentUser.email)

        db.runTransaction(function(transaction) {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(scoresRef).then(function(scores) {
              if (!scores.exists) {
                const newCharacter = {}
                newCharacter[currentCharacter.simplified] = {
                  pinyin:{
                    correct: pinyinCorrect ? 1:0,
                    incorrect: pinyinCorrect ? 0:1
                  },
                  meaning:{
                    correct: meaningCorrect ? 1:0,
                    incorrect: meaningCorrect ? 0:1
                  }
                }
                transaction.set(scoresRef, newCharacter)
                return
              }

              if (!scores.data()[currentCharacter.simplified]) {
                const newCharacter = {}
                newCharacter[currentCharacter.simplified] = {
                  pinyin:{
                    correct: pinyinCorrect ? 1:0,
                    incorrect: pinyinCorrect ? 0:1
                  },
                  meaning:{
                    correct: meaningCorrect ? 1:0,
                    incorrect: meaningCorrect ? 0:1
                  }
                }

                transaction.update(scoresRef, newCharacter);
                return;
              }

              const currentScores = scores.data()[currentCharacter.simplified]
              const updatedScores = {}
              updatedScores[currentCharacter.simplified] = {
                  pinyin:{
                    correct: pinyinCorrect ? currentScores.pinyin.correct + 1 : currentScores.pinyin.correct,
                    incorrect: pinyinCorrect ? currentScores.pinyin.incorrect : currentScores.pinyin.incorrect + 1
                  },
                  meaning:{
                    correct: meaningCorrect ? currentScores.meaning.correct + 1 : currentScores.meaning.correct,
                    incorrect: meaningCorrect ? currentScores.meaning.incorrect : currentScores.meaning.incorrect + 1
                  }
                }

              transaction.update(scoresRef, updatedScores);
            });
        }).then(function() {
            console.log("Transaction successfully committed!");
        }).catch(function(error) {
            console.log("Transaction failed: ", error);
        });
      }

      let characterString = this.currentCharacter.simplified === this.currentCharacter.traditional ?
        this.currentCharacter.simplified :
        this.currentCharacter.simplified + '/' + this.currentCharacter.traditional

      let pinyinString = this.pinyinCorrect ?
        "<span class='correct'>" + this.currentCharacter.pinyin + "</span>" :
        "<span class='incorrect'>" + this.currentCharacter.pinyin + "</span>"

      let meaningString = this.meaningCorrect ?
        "<span class='correct'>" + this.currentCharacter.definition + "</span>" :
        "<span class='incorrect'>" + this.currentCharacter.definition + "</span>"

      let gameString = characterString + ' ' + pinyinString + ' - ' + meaningString


      this.pastGames.push(gameString)
      this.characterIndex = getRandom(0, this.maxCharacters)
      this.currentCharacter = this.characters[this.characterIndex]
      this.currentSentence = getCurrentSentence(this.currentCharacter)
    },
    login: function(e) {
      this.$router.replace('login')
    },
    signUp: function(e) {
      this.$router.replace('sign-up')
    }
  }
}
</script>

<!-- Add 'scoped' attribute 2 limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 1em;
}

.stats-link {
  cursor: pointer;
}

.mobile .middle {
  width: 95%;
  margin: auto;
}
.middle {
  width: 75%;
  margin: 0 0 0 20%;
}

.mobile .bottom {
  width: 100%;
  margin: auto;
}
.bottom {
  position: absolute;
  bottom: 25px;
  left: 0px;
  width: 75%;
  margin: 0 0 0 20%;
}

.right {
  position: absolute;
  top: 6px;
  right: 10px;
  text-align: right;
}

.mobile .left {
  position: relative;
}

.left {
  position: absolute;
  top: 6px;
  left: 10px;
}

.black {
  color: black;
  font-weight: bold;
}

.mobile .characters {
  font-size: 5em;
  margin-bottom: 6px;
}

.characters {
  width: 100%;
  text-align: center;
  font-size: 10em;
}

.helpers {
  width: 100%;
  color: #444;
  text-align: center;
  margin: 10px;
  font-size: 2em;
}

.bold {
  color: black;
}

.mobile .sentence {
  font-size: 1em;
  margin-bottom: .7em;
}

.sentence {
  width: 100%;
  color: #444;
  text-align: center;
  font-size: 1.5em;
  margin-bottom: .5em;
  box-shadow: 0 10px 14px -14px gray;
  padding-bottom: 10px;
}

.mobile .chinese-sentence {
  font-size: 1.2em;
}
.chinese-sentence {
  font-size: 1.8em;
}

.helpers div {
  display: inline-block;
}

.answers {
  text-align: center;
}

.mobile .results {
  font-size: 1em;
}

.results {
  text-align: center;
  font-size: 1.5em;
}

.results div{
  display: inline-block;
}

.results button{
  display: block;
  margin: 10px auto;
  background-color: rgb(68, 158, 71); /* Green */
  border: none;
  color: white;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  font-size: 1em;
  cursor: pointer;
  border-radius: 5px;
  min-width: 100px;
}

.mobile .answers button {
  font-size: 1em;
  min-width: 60px;
}

.answers button {
  margin: 10px;
  background-color: rgb(68, 158, 71); /* Green */
  border: none;
  color: white;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.5em;
  cursor: pointer;
  border-radius: 5px;
  min-width: 100px;
}

.correct {
  color: rgb(68, 158, 71);
}

.incorrect {
  color: rgb(212, 0, 0);
}


.mobile .scores {
  margin: 5px 0;
}
.scores {
  margin: 20px 0;
}

.score {
  display: block;
}

.score div {
  display: inline-block;
}

.pastGames {
  display: block;
}
</style>
