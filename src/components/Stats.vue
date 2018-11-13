<template>
  <div class="stats">
    <h3 v-on:click="getScores">Stats</h3>
    <div class="knownCount">
      {{ knownCount }} known characters out of {{ scoresArray.length }}
    </div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div class="scores">
      <div class="score" v-for="(key, index) in scoresArray" :key="`score-${index}`" >
        <div class="key" v-on:click="goToCharacter(key)">
          {{key}}
        </div>
        <div class="percent" v-if="getPercentScore(scores[key])"  v-bind:style="{backgroundImage: `linear-gradient(90deg, rgba(68, 158, 71, .3) ${getPercentScore(scores[key])}%, rgba(212, 0, 0, .3), rgba(212, 0, 0, .3))` }" >
          {{ getPercentScore(scores[key]) }}
        </div>
        <div class="percent" v-if="!getPercentScore(scores[key])"  v-bind:style="{backgroundColor: 'rgba(212, 0, 0, .3)' }" >
          {{ getPercentScore(scores[key]) }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import firebase from 'firebase'

  export default {
    name: 'Stats',
    data: function() {
      return {
        scores: {},
        characters: [],
        isSignedIn: firebase.auth().currentUser,
        loading: true,
        error: null,
        knownCount: 0
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.getScores()
    },
    methods: {
      goToCharacter: function(hanzi) {
        this.$router.replace('/character/'+ hanzi)
      },
      getPercentScore: function(scores) {
        return Math.floor(100 * (scores.pinyin.correct + scores.meaning.correct)
            / ( scores.pinyin.incorrect + scores.pinyin.correct + scores.meaning.correct + scores.meaning.incorrect ))
      },
      getScores: function() {
        this.error = null
        this.loading = true
        const db = firebase.firestore()
        const scoresRef = db.collection("scores").doc(firebase.auth().currentUser.email)
        scoresRef.get().then(doc => {
            if (doc.exists) {
              const scores = doc.data()
              this.scores = scores
              this.scoresArray = Object.keys(this.scores).sort(function(a, b) {
                const aScore = 100 * (scores[a].pinyin.correct + scores[a].meaning.correct)
                  / ( scores[a].pinyin.incorrect
                  + scores[a].pinyin.correct
                  + scores[a].meaning.correct
                  + scores[a].meaning.incorrect )

                const bScore = 100 * (scores[b].pinyin.correct + scores[b].meaning.correct)
                  / ( scores[b].pinyin.incorrect
                  + scores[b].pinyin.correct
                  + scores[b].meaning.correct
                  + scores[b].meaning.incorrect )

                return bScore - aScore;
              });

              const knownCharacters = Object.keys(this.scores).reduce(function(memo, key) {
                if ((scores[key].meaning.correct - scores[key].meaning.incorrect) >= scores[key].meaning.correct / 2
                  && (scores[key].pinyin.correct - scores[key].pinyin.incorrect) >= scores[key].pinyin.correct / 2 ) {
                  return memo + 1
                }
                return memo
              }, 0)

              this.knownCount = knownCharacters

              this.loading = false
            } else {
              // doc.data() will be undefined in this case
              console.warn("No such document!")
              this.error = "error"

            }
        }).catch(error => {
            console.warn("Error getting document:", error)
            this.error = error
        })

      }
    }
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
h3 {
  margin-bottom: 5px;
}
.scores {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 85vh;
}
.score {
  display: flex;
  margin-right: 5px;
}
.knownCount {
  margin-bottom: 10px;
}
.key {
  font-size: 24px;
  margin-right: 5px;
}
.percent {
  width: 70%;
  text-align: center;
  margin-bottom: 2px;
}

</style>