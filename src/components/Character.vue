<template>
  <div class="character">
    <div class="hanzi">
      {{hanzi.traditional}}
      {{hanzi.simplified}}
      {{hanzi.pinyin}}
      {{hanzi.definition}}
    </div>
    <div class="example-sentences" v-for="(sentence, index) in exampleSentences" :key="`sentence-${index}`">
      <div class="example-sentence">
        {{sentence.traditional}}
        {{sentence.simplified}}
        {{sentence.pinyin}}
        {{sentence.english}}
      </div>
    </div>
  </div>
</template>


<script>
  import firebase from 'firebase'
  const sentences = require('./sentences.json')
  const characters = require('./characters.json')


  export default {
    name: 'Template',
    data: function() {
      const route = this.$route.params.hanzi
      const hanziIndex = Object.keys(characters).find(index => {
        return characters[index].traditional === route ||
        characters[index].simplified === route
      })
      const hanzi = characters[hanziIndex]
      const exampleSentences = Object.keys(sentences).map(index => {
        if (sentences[index].simplified.indexOf(hanzi.simplified) >= 0){
          return sentences[index]
        }
        return null
      }).filter(sentence => sentence !== null).slice(0, 15)

      return {
        hanzi,
        exampleSentences,
        isSignedIn: firebase.auth().currentUser,
        nothing: "matters"
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.fakeMethod()
    },
    methods: {
      fakeMethod: function() {
        return "you think this is fake?"
      }
    }
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */

</style>