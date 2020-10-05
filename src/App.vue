<template>
  <div id="app">
    <Header :user="user"/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/submit">Submit</router-link> |
      <router-link :to="'/account/' + user.id">Account</router-link> |
      <router-link to="/edit">Edit Account</router-link>
    </div>
    <router-view :user="user"/>
  </div>
</template>

<script >
import Header from '@/components/Header.vue'

export default {
  components: {
    Header
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
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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

button{
  margin: 10px;
}

  ul.secrets{
    list-style: none;
  }
  ul.secrets li{
    background-color: #999;
  }
</style>
