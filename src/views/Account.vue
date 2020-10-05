<template>
  <div class="account">
    <h1>My Account</h1>
    <p><strong>Username:</strong> {{user.name}} </p>
    <p><strong>Password:</strong> ****** </p> 

    <button v-on:click="logOut">Log out</button>
    <button><router-link to="/edit">Change password</router-link></button>
    
    <h2>My secrets</h2>
    <ul class="secrets">
        <li v-for="(data) in secrets" :key="data.id">
          <p> {{data.secret}} <span v-on:click="deleteSecret(data.id)">*delete*</span></p>
        </li>
    </ul>

    <button v-on:click="deleteAccount">Delete account</button>
  </div>
</template>

<script>
import { log } from 'util'
export default {
  props: ["user"],
  data() {
          return {
            secrets: [],
          }
  },
  methods: {
    deleteSecret(id){
      const client = require('../secrets-client')

      client.deleteSecretById(id, (errors) => {
        this.$router.push("/")
        if (errors.length == 0) {
          console.log("Item was deleted")
          
        }
      })
    },
    deleteAccount(){
      const client = require('../secrets-client')

      client.deleteAccountById(this.user.id, (errors) => {
        this.user.isLoggedIn = false
        this.$router.push("/")
      })
    },
    logOut(){
       const client = require('../secrets-client')

       client.logout(()=> {
         this.user.isLoggedIn = false
         
         this.$router.push("/")
       })
    }
  },
  mounted() { 
      const client = require('../secrets-client')
      
      client.getSecretsByAccountId(this.user.id, (errors, secrets) => {  
        if(errors.length == 0){
          this.secrets = secrets.reverse()
        }
      })

      

  }
}
</script>
