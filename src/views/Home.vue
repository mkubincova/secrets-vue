<template>
  <div class="home">
    <div v-if="user.isLoggedIn">
      <h1>Welcome to our secrets collection!</h1>
      <button><router-link to="/submit">Add secret!</router-link></button>

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
        <p>{{ info }}</p>

      <p>Not a member? <router-link to="/register">
        <u>Register </u><font-awesome-icon :icon="['fas', 'long-arrow-alt-right']"/>
      </router-link></p>
    </div>
  </div>
</template>

<script>
document.title = "Home"
  import { library } from '../../node_modules/@fortawesome/fontawesome-svg-core'
  import { faLongArrowAltRight } from '../../node_modules/@fortawesome/free-solid-svg-icons'
  library.add(faLongArrowAltRight)
  export default {
  title: 'Home',
  props: ["user"],
  data() {
          return {
            secrets: [],
            username: "",
            password: "",
            info: ""
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
          console.log(errors)
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

<style>
  .secrets {
    overflow: hidden;
    margin-right: 9px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .secrets li {
    max-width: calc( 50% - 9px );
    flex: 0 1 auto;
    margin-left: 9px;
    margin-bottom: 9px;
    padding:0;
    background: #DC622C;
    color: white;
    list-style: none;
    border-radius: 5px;
  }
  .secrets li p {
    padding: 20px 30px;
    margin: 0;
    font-size: 1em;
  }
  .home button {
    margin-bottom: 40px; 
  }
</style>