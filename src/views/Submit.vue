<template>
  <div class="submit">
    <h1>Don't keep your secrets, share them anonymously!</h1>
    <textarea v-model="text" rows="7" cols="50"></textarea> <br>
    <button v-on:click="submitSecret">Submit</button>
  </div>
</template>

<script>


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

