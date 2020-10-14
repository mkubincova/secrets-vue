<template>
  <div class="submit">
    <button id="backButton"><router-link to="/">Go back</router-link></button>
    <h1>Don't keep your secrets to yourself, <br> share them anonymously here!</h1>
    <textarea v-model="text" rows="7" cols="50"></textarea> <br>
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
  .submit {
    overflow: hidden;
  }

  #backButton {
    display: block;
    margin-left: 15%;
    background: #DC622C;
    font-weight: 300;
    padding: 7px 15px;
  }
</style>