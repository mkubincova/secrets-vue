<template>
  <div class="register">
    <h1>Register</h1>

    <form>
      <input v-model="username" type="text" placeholder="Username"> <br>
      <input v-model="password" type="password" placeholder="Password"> <br>
      <input v-model="rpassword" type="password" placeholder="Repeat Password"> <br>
      <p v-if="password != rpassword">Password and Repeat Password have to match!</p>
      <p>{{info}}</p>
      <button v-on:click="register">Register</button>
    </form>

    <p>Already have an account? <router-link to="/">
      <u>Login </u><font-awesome-icon :icon="['fas', 'long-arrow-alt-right']"/>
    </router-link></p>
  </div>
</template>

<script>
document.title = "Register"
import { library } from '../../node_modules/@fortawesome/fontawesome-svg-core'
import { faLongArrowAltRight } from '../../node_modules/@fortawesome/free-solid-svg-icons'
library.add(faLongArrowAltRight)

export default {
  data() {
    return {
      username: "",
      password: "",
      rpassword: "",
      info: ""
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
        this.info = this.errors;
        console.log(this.info)
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