import axios from 'axios'
export default {
  namespaced: true,
  state: { users: [] },
  getters: { getusers(state) { return state.users } },
  mutations: {
    users(state, users) { state.users = users },
    user(state, { index, user }) {
      state.users[index] = user
    },
    addUser(state, user) {
      state.users.push(user)
    },
    deleteUser(state, index) {
      state.users.splice(index, 1)
    }
  },
  actions: {
    inituser({
      commit
    }) {
      axios
        .get("http://localhost:80/account/get1")
        .then((response) => {
          console.log('inituser呼び出し')
          commit('users', response.data)
        })
        .catch((respo) => {
          console.log(respo);
        });

    },
    postuser({ commit }, { index, user }) {
      if (index > -1) {
        console.log('createuser呼び出し')
        axios
          .post("http://localhost:80/account/update", user)
          .then(() => {
            console.log('postuser呼び出し')
            commit('user', { index, user })
          })
          .catch((respo) => {
            console.log(respo);
          });

      } else {
        console.log('createuser（新規）呼び出し')
        axios
          .post("http://localhost:80/account/create", user)
          .then(() => {
            console.log('postuser呼び出し')
            commit('addUser', user)
          })
          .catch((respo) => {
            console.log(respo);
          });
      }
    },
    deleteUser({ commit }, { id, index }) {
      console.log('deleteuser呼び出し')
      console.log(id)
      axios
        .post("http://localhost:80/salary/delete", { employee_number: id })
        .then(() => {
          console.log('/account/delete呼び出し')
          commit('deleteUser', index)
        })
        .catch((respo) => {
          console.log(respo);
        });
    }
  },
}