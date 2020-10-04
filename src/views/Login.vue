<template>
  <div class="login">
    <h1>Login</h1>

    <form>
      <input type="text" placeholder="Username"> <br>
      <input type="password" placeholder="Password"> <br>
      <button>Login</button>
    </form>

    <p>----- or -----</p>

    <button>Google</button>

    <p>Not a member? <router-link to="/register">Register</router-link></p>
  </div>
</template>


<script>


export default {

}
</script>
