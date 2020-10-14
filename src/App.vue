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
@import url('https://fonts.googleapis.com/css2?family=Courgette&family=Roboto:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap');


body {
  margin: 0;
}
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.home, .register .account, .edit-account, .submit {
  padding: 0 3vw;
}
h1 {
  font-family: 'Courgette', cursive;
  margin: 0;
  padding: 25px 0 25px 0;
}
h2 {
  font-family: 'Courgette', cursive;
  font-weight: 400;
}

p, a {
  font-family: 'Roboto', sans-serif;
  text-decoration: none;
  color: inherit;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

input, textarea{
  margin-bottom: 20px;
}

button {
  margin: 10px;
  background-color: #CD524C;
  border: none;
  color: white;
  padding: 10px 25px;
  border-radius: 35px;
  font-size: 1em;
  font-weight: 600;
}
button:hover {
  color: #5F1E1B;
  cursor:pointer;
}
a:hover {
    cursor: pointer;
  }
</style>
