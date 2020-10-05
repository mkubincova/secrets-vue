import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: function () {
      return import('../views/Register.vue')
    }
  },
  {
    path: '/submit',
    name: 'Submit',
    component: function () {
      return import('../views/Submit.vue')
    }
  }, 
  {
    path: '/account/:id',
    name: 'Account',
    component: function () {
      return import('../views/Account.vue')
    }
  },
  {
    path: '/edit',
    name: 'EditAccount',
    component: function () {
      return import('../views/EditAccount.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
