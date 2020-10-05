<template>
  <div class="register">
    <h1>Register</h1>

    <form>
      <input v-model="username" type="text" placeholder="Username"> <br>
      <input v-model="password" type="password" placeholder="Password"> <br>
      <input v-model="rpassword" type="password" placeholder="Repeat Password"> <br>
      <p v-if="password != rpassword">Password and Repeat Password have to match!</p>
      <button v-on:click="register">Register</button>
    </form>

    <p>Already have an account? <router-link to="/">Login</router-link></p>
  </div>
</template>



<script>


export default {
  data() {
          return {
            username: "",
            password: "",
            rpassword: ""
          }
  },
  methods: {
    register(){

      if(this.password === this.rpassword){

        const client = require('../secrets-client')

        const newAccount = {
          username: this.username,
          password: this.password
        }

        client.createAccount(newAccount, (errors, id) => {
          if (errors.length == 0) {
            this.$router.push("/")
          }
        })

      } else {
        console.log("Password and Repeat Password have to match!");
      }
      
    }
  }
}
</script>

<style scoped>
form p{
  color: red;
}
</style>