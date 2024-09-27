import vue from 'vue'
import vuex from 'vuex'
import product from './modules/product'
import user from './modules/user'
import salarys from './modules/salarys'

vue.use(vuex)

const store = new vuex.Store({
  modules: {
    user: user,
    product: product,
    salarys: salarys,
  }
})
export default store