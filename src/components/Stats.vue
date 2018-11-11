<template>
  <div class="stats">
    <h3 v-on:click="getScores">Stats</h3>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div class="scores">
      <div class="score" v-for="(score,  key) in scores" :key="`score-${key}`" >
        {{key}} // pinyin:{{score.pinyin.correct}}/{{score.pinyin.incorrect}} meaning: {{score.meaning.correct}}/{{score.meaning.incorrect}}
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
        error: null
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.getScores()
    },
    methods: {
      getScores: function() {
        this.error = null
        this.loading = true
        const db = firebase.firestore()
        const scoresRef = db.collection("scores").doc(firebase.auth().currentUser.email)
        scoresRef.get().then(doc => {
            if (doc.exists) {
              this.scores = doc.data()
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
.scores {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 80vh;
}
.score {

}

</style>