<template>
  <div class="header">
    <span><router-link to="/">Secrets</router-link></span>
    <span v-if="user.isLoggedIn"><router-link :to="'/account/' + user.id">My account</router-link></span>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: ["user"]
}
</script>


<style scoped>
  .header{
    background-color: #666;
    color: white;
  }
  span {
    display: inline-block;
    margin: 10px 200px;
  }
</style>
