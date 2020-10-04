<template>
  <div class="home">
    <h1>Welcome to our secrets collection!</h1>
    <button><router-link to="/submit">Add secret</router-link></button>

    <ul class="secrets">
        <li v-for="(data, index) in secrets" :key="index">
          <p> {{data.secret}} </p>
        </li>
    </ul>

  </div>
</template>

<script>

export default {

  props: ["user"],
  data() {
          return {
            secrets: []
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