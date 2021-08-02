<template>
  <div class="submit">
    <router-link to="/"><img class="svg-icon" src="../assets/back.svg" alt="back"></router-link>
    <h1>Don't keep your secrets to yourself, <br> share them anonymously here!</h1>
    <textarea v-model="text" rows="7" cols="30"></textarea> <br>
    <button v-on:click="submitSecret">Submit</button>
  </div>
</template>

<script>
document.title = "Add new secret"

export default {
  props: ["user"],
  data() {
    return {
      text: ""
    }
  },
  methods: {
    submitSecret(){
      const client = require('../secrets-client')

      const newSecret = {
        accountId: this.user.id,
        secret: this.text
      }

      client.createSecret(newSecret, (errors) => {
        if (errors.length == 0) {
          this.$router.push("/")
        }
      })
    }
  }
}
</script>

<style>
.svg-icon{
  height: 40px;
}
</style>