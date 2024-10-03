import axios from 'axios'
export default {
  namespaced: true,
  state: { prices: [] },
  getters: { getprices(state) { return state.prices } },
  mutations: {
    prices(state, prices) { state.prices= prices },
    price(state, { index, price }) {
      state.price[index] = price
    },
    addprice(state, price) {
      state.prices.push(price)
    },
    deleteprice(state, index) {
      state.price.splice(index, 1)
    }
  },
  
  actions: {
    initprice({commit}) {
      axios
        .get("http://localhost:80/price/get")
        .then((response) => {
          console.log('initprice呼び出し')
          commit('prices', response.data)
        })
        .catch((respo) => {
          console.log(respo);
        });
    },
    postprice({ commit }, { index, price }) {
      if (index > -1) {
        console.log('creatsalary呼び出し')
        axios
          .post("http://localhost:80/price/update", price)
          .then(() => {
            console.log('postuser呼び出し')
            commit('price', { index, price })
          })
          .catch((respo) => {
            console.log(respo);
          });

      } else {
        console.log('createsalary（新規）呼び出し')
        axios
          .post("http://localhost:80/price/create", price)
          .then(() => {
            console.log('postsalary呼び出し')
            commit('addprice', price)
          })
          .catch((respo) => {
            console.log(respo);
          });
      }
    },
    deleteprice({ commit }, { id, index }) {
      console.log('deletesalary呼び出し')
      console.log(id)
      axios
        .post("http://localhost:80/price/delete", { id: id })
        .then(() => {
          console.log('/price/delete呼び出し')
          commit('deletesalary', index)
        })
        .catch((respo) => {
          console.log(respo);
        });
    },
    serchsalary({commit},{month,day,employee_number}) {
      axios
        .get("http://localhost:80/salary/serch?month="+ month +"&day="+day + "&employee_number="+ employee_number)
        .then((response) => {
          console.log('initsalary呼び出し')
          commit('salarys', response.data)
        })
        .catch((respo) => {
          console.log(respo);
        });

    }
  },
}