<template>
  <div id="app">
    <Header :user="user"/>    
    <router-view :user="user"/>
  </div>
</template>

<script >
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' 
import Header from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    Header, FontAwesomeIcon
  },
  data() {
        return {
            // ...
            user: {
                isLoggedIn: false,
                name: "",
                id: ""
            }
        }
  },
  mounted() {
    this.user.isLoggedIn = localStorage.getItem("isLoggedIn")
    this.user.name = localStorage.getItem('username');
    this.user.id = localStorage.getItem('userId')
  }
}
</script>>


<style>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@300;400;700&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');


body {
  margin: 0;
  padding: 0;
  color: white;
  background-color: #2B2129;
}
#app {
  font-family: 'Josefin Slab', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
}
.home, .register, .account, .edit-account, .submit {
  padding: 0 3vw;
}
h1 {
  font-family: 'Staatliches', cursive;
  color: #708A81;
  margin: 0;
  padding: 25px 0;
}
h2 {
  font-family: 'Staatliches', cursive;
}

a{
  color: #708A81;
}
p{
  font-size: 1.3rem;
  margin: 10px 0 20px 0;
}
button a{
  text-decoration: none;
  color:#E5D1B8;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
}

input, textarea{
  margin-bottom: 20px;
  background-color: #E5D1B8;
  border: 2px solid #2B2129;
  border-radius: 5px;
  font-family: 'Josefin Slab', serif;
  font-size: 1.3rem;
  padding: 5px;
}

input:focus, textarea:focus{
  outline: none !important;
  border: 2px solid #708A81;
}

button {
  margin: 10px;
  background-color: transparent;
  border: 2px solid #E5D1B8;
  color: #E5D1B8;
  text-transform: uppercase;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #E5D1B8;
  color: #2B2129;
}


</style>
