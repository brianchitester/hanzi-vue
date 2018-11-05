<template>
  <div>
    <h1>汉字 / 漢字 / Hàn Zì</h1>
      <div v-if="!isSignedIn">
        <div v-on:click="login">
          Login
        </div>
        <div v-on:click="signUp">
          Sign up
        </div>
      </div>
      <div>
        <input v-model="maxCharacters" v-on:change="reset" class="maxCharacters" type="number" value="1000" min="50" max="1500" />
        most common characters.
      </div>
      <div class="characters" v-if="currentCharacter.simplified !== currentCharacter.traditional">
        {{ currentCharacter.simplified }} / {{ currentCharacter.traditional }}
      </div>
      <div class="characters" v-else>
        {{ currentCharacter.simplified }}
      </div>
      <div class="sentence">
        <div v-html="currentSentence.simplified" class="simplified"></div>
        <div
          v-html="currentSentence.traditional"
          v-if="currentCharacter.simplified !== currentCharacter.traditional"
          class="traditional"></div>
      </div>
      <div
        v-if="pinyinAnswer && meaningAnswer"
        v-html="currentSentence.pinyin"
        class="pinyinSentence"></div>
      <div
        v-if="pinyinAnswer && meaningAnswer"
        v-html="currentSentence.english"
        class="englishSentence"></div>
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
      <div class="scores">
        <div class="score pinyinScore">
          pinyin score: <div class="pinyinCorrect"> {{ pinyinScore }}</div> / <div class="pinyinTotal">{{ total }}</div>
        </div>
        <div class="score englishScore">
          meaning score: <div class="englishCorrect"> {{ meaningScore }}</div> / <div class="englishTotal">{{ total }}</div>
        </div>
      </div>
      <div class="pastGames">
        <div v-for="(pastGame, index) in pastGames" :key="`pastGame-${index}`">
          {{ pastGame }}
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

const defaultMax = 1000
const sentences = require('./sentences.json')
const characters = require('./characters.json')

export default {
  name: 'Hanzi',
  data() {
    const currentCharacter = characters[1]
    const currentSentence = getCurrentSentence(currentCharacter)

    return {
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
      currentSentence,
      isSignedIn: firebase.auth().currentUser
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
    reset: function(e){
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

      let gameString = this.currentCharacter.simplified + '/' + this.currentCharacter.traditional + ' ' + this.currentCharacter.pinyin + ' - ' + this.currentCharacter.definition
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

.black {
  color: black;
  font-weight: bold;
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

.sentence {
  width: 100%;
  color: #444;
  text-align: center;
  font-size: 2em;
}
.bold {
  color: black;
}

.pinyinSentence{
  width: 100%;
  color: #444;
  text-align: center;
  height: 1.5em;
  font-size: 1.5em;
}

.englishSentence{
  width: 100%;
  color: #444;
  text-align: center;
  height: 1.5em;
  font-size: 1.5em;
}

.helpers div {
  display: inline-block;
}

.answers {
  width: 100%;
  text-align: center;
}

.results {
  width: 100%;
  text-align: center;
  font-size: 1.5em;
}

.results div{
  display: inline-block;
}

.results button{
  display: block;
  margin: 10px auto;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  font-size: 1em;
  cursor: pointer;
}

.correct {
  color: #4CAF50;
}

.incorrect {
  color: red;
}

.answers button {
  margin: 10px;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.5em;
  cursor: pointer;
}

.scores {
  width: 100%;
  text-align: center;
  font-size: 2em;
}

.score {
  display: inline-block;
  margin: 0px 50px;
}

.score div {
  display: inline-block;
}

.pastGames {
  display: block;
  position: absolute;
  top: 100px;
}
</style>
