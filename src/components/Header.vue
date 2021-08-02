<template>
  <div class="header">
    <span>
      <router-link to="/">— Secrets —</router-link>
    </span>
    <span class="right" v-if="user.isLoggedIn">
      <router-link :to="'/account/' + user.id"><img id=menu-icon src="../assets/account.svg" alt="my-account-icon"></router-link>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: ["user"]
};

</script>

<style scoped>
#menu-icon{
  height: 25px;
}
  .header {
    background-color:#E5D1B8;
    padding: 10px;
    margin-bottom: 30px;
  }

  .header a {
    font-family: 'Staatliches', cursive;
    text-decoration: none;
    color: #2B2129;
    font-size: 1.3rem;
  }

  span {
    display: inline-block;
    margin: 0px auto;
  }

  .right{
    position: absolute;
    top: 10px;
    right: 10px;
    text-align: right;
    width: max-content;
  }
</style>
