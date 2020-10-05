<template>
  <div class="home">

    <div v-if="user.isLoggedIn">
      <h1>Welcome to our secrets collection!</h1>
      <button><router-link to="/submit">Add secret</router-link></button>

      <ul class="secrets">
          <li v-for="(data, index) in secrets" :key="index">
            <p> {{data.secret}} </p>
          </li>
      </ul>
    </div>


    <div v-else>
      <h1>Login</h1>

        <form>
          <input v-model="username" placeholder="Username" type="text"> <br>
          <input v-model="password" placeholder="Password" type="password"> <br>
          <button type="submit" v-on:click="signUserIn">Login</button>
        </form>

      <p>Not a member? <router-link to="/register">Register</router-link></p>
    </div>

  </div>
</template>

<script>

export default {

  props: ["user"],
  data() {
          return {
            secrets: [],
            username: "",
            password: ""
          }
        },
  methods: {
    signUserIn(){
      const client = require('../secrets-client')

      const username = this.username
      const password = this.password

      client.login(username, password, (errors, account) => {
        // errors = array with error codes (empty if everything went OK).
        // account = object with info about the account you signed into if everything went OK.
        if(errors.length == 0){
             
          this.user.isLoggedIn = true
          this.user.name = account.username
          this.user.id = account.id
          
        }else{
          console.log(errors);
        }
      })
    }  
  },
  mounted() { 

      const client = require('../secrets-client')

      client.getAllSecrets((errors, secrets) => {
        
        if(errors == 0){
          this.secrets = secrets.reverse()
        } 

      })
    
  }
}
</script>

<style scoped>

</style>