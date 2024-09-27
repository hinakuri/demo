import Vue from 'vue'
import App from './App'
import router from './router' //追加
import vuetify from './plugins/vuetify'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:80'

new Vue({
  router, //追加
  vuetify,
  //  store,
  render: h => h(App),
  components: {

  }
}).$mount('#app')