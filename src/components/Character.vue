<template>
  <div class="character">
    <div class="hanzi">
      <div class="hanzi-characters">
        <div v-if="hanzi.traditional !== hanzi.simplified" class="hanzi-character">
          {{hanzi.traditional}}
        </div>
        <div class="hanzi-character">
          {{hanzi.simplified}}
        </div>
      </div>
      <div class="hanzi-pinyin">
        {{hanzi.pinyin}}
      </div>
      <div class="hanzi-definition">
        {{hanzi.definition}}
      </div>
    </div>
    <div class="example-sentences">
      <div class="example-sentence" v-for="(sentence, index) in exampleSentences" :key="`sentence-${index}`">
        <div class="example-sentence-traditional">
          {{sentence.traditional}}
        </div>
        <div class="example-sentence-simplified">
          {{sentence.simplified}}
        </div>
        <div class="example-sentence-pinyin">
          {{sentence.pinyin}}
        </div>
        <div class="example-sentence-english">
          {{sentence.english}}
        </div>
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
      }).filter(sentence => sentence !== null).sort((a, b) => {return a.simplified.length - b.simplified.length }).slice(0, 15)

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
.character {
  display: flex;
}
.hanzi {
  width: 20em;
  padding-top: 10vh;
  text-align: center;
}
.hanzi-characters {
  display: block;
}
.hanzi-character {
  font-size: 10em;
  display: inline-block;
}
.hanzi-pinyin {
  display: block;
  font-size: 2em;
}
.hanzi-definition {
  display: block;
  font-size: 2em;
}
.example-sentences{
  text-align: left;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 85vh;
}
.example-sentence {
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>