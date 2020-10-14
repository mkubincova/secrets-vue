<template>
  <div class="header">
    <span>
      <router-link to="/">Secrets</router-link>
    </span>
    <span v-if="user.isLoggedIn">
      <router-link :to="'/account/' + user.id">My account</router-link>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: ["user"]
}
</script>

<style scoped>
  .header {
    background-color:#F77F0F;
    padding: 10px 10vh;
  }

  .header a {
    font-family: 'Merriweather', serif;
    text-decoration: none;
    color: white;
  }

  .header a:hover {
    color:#773B04;
  }

  span {
    display: inline-block;
    width: 50%;
    margin: 0px auto;
  }
</style>
