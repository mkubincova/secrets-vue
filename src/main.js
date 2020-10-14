import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '../node_modules/@fortawesome/fontawesome-svg-core'
import { faSpinner } from '../node_modules/@fortawesome/free-solid-svg-icons'
import { faUserSecret } from '../node_modules/@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 
library.add(faUserSecret)
library.add(faSpinner)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')