import vue from 'vue'
import vuex from 'vuex'
import product from './modules/product'
import user from './modules/user'
import salarys from './modules/salarys'
import price from './modules/price'

vue.use(vuex)

const store = new vuex.Store({
  modules: {
    user: user,
    product: product,
    salarys: salarys,
    price: price,
  }
})
export default store