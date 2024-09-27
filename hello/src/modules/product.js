import axios from 'axios'
export default {
  namespaced: true,
  state: { products: [] },
  getters: { getproducts(state) { return state.products } },
  mutations: {
    products(state, products) { state.products = products },
    product(state, { index, product }) {
      state.products[index] = product
    },
    addProduct(state, product) {
      state.products.push(product)
    },
    deleteProduct(state, index) {
      state.products.splice(index, 1)
    }
  },
  actions: {
    initproduct({
      commit
    }) {
      axios
        .get("http://localhost:80/prefecture/get")
        .then((response) => {
          console.log('initprefecture呼び出し')
          commit('products', response.data)
        })
        .catch((respo) => {
          console.log(respo);
        });

    },
    postproduct({ commit }, { index, product }) {
      if (index > -1) {
        console.log('createprefecture呼び出し')
        axios
          .post("http://localhost:80/prefecture/create", product)
          .then(() => {
            console.log('postprefecture呼び出し')
            commit('product', { index, product })
          })
          .catch((respo) => {
            console.log(respo);
          });

      } else {
        console.log('createprefecture（新規）呼び出し')
        axios
          .post("http://localhost:80/prefecture/create", product)
          .then(() => {
            console.log('postprefecture呼び出し')
            commit('addProduct', product)
          })
          .catch((respo) => {
            console.log(respo);
          });
      }
    },
    deleteProduct({ commit }, { id, index }) {
      console.log('deleteProduct呼び出し')
      console.log(id)
      axios
        .post("http://localhost:80/prefecture/delete", { prefecture_code: id })
        .then(() => {
          console.log('/prefecture/delete呼び出し')
          commit('deleteProduct', index)
        })
        .catch((respo) => {
          console.log(respo);
        });
    }
  },
}