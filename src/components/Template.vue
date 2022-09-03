<template>
  <div class="fake">
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'Template',
    data: function() {
      return {
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