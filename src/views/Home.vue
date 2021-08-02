<template>
  <div class="home">
    <div v-if="user.isLoggedIn">
      <h1>Welcome to our collection of secrets</h1>
      <button><router-link to="/submit">Add secret</router-link></button>

      <ul class="secrets">
          <li v-for="(data, index) in secrets" :key="index" >
            <p> {{data.secret}} </p>
          </li>
      </ul>
    </div>

    <div v-else>
      <h1>Login</h1>
        <form>
          <input v-model="username" placeholder="Username" type="text"> <br>
          <input v-model="password" placeholder="Password" type="password"> <br>
          <p>{{ info }}</p>
          <button type="submit" v-on:click="signUserIn">Login</button>
        </form>
        
      <p>Not a member? 
        <router-link to="/register">
          <u>REGISTER</u>
        </router-link>
      </p>
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
          this.info = "The username or password is incorrect, please try again."
        }
      })
    }
  },
  computed: {
    randomBkg: function () {
      const colors = ["red", "blue", "green"]
      const min = 0
      const max = 2
      const color = colors[Math.floor(Math.random() * (max - min + 1) + min)]
      return color
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
form p{
  color: red;
}
  .secrets {
    overflow: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .secrets li {
    width: 100%;
    margin-bottom: 9px;
    padding:0;
    color: white;
    list-style: none;
    border-radius: 5px;
    font-size: 1.5rem;
  }

  li:nth-child(odd){
    background-image: linear-gradient(to bottom right, #776483, #E99E75);
  }  
  li:nth-child(even){
   background-image: linear-gradient(to bottom right, #44426E, #BBAAB8);
  }  

  .secrets li p {
    padding: 20px 30px;
    margin: 0;
    font-size: 1em;
  }
  .home button {
    margin-bottom: 30px; 
  }

  
</style>