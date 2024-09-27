import axios from 'axios'
export default {
  namespaced: true,
  state: { salarys: [] },
  getters: { getsalarys(state) { return state.salarys } },
  mutations: {
    salarys(state, salarys) { state.salarys= salarys },
    salary(state, { index, salary }) {
      state.salary[index] = salary
    },
    addsalary(state, salary) {
      state.salarys.push(salary)
    },
    deletesalary(state, index) {
      state.salarys.splice(index, 1)
    }
  },
  
  actions: {
    initsalary({commit}) {
      axios
        .get("http://localhost:80/salary/get")
        .then((response) => {
          console.log('initsalary呼び出し')
          commit('salarys', response.data)
        })
        .catch((respo) => {
          console.log(respo);
        });
    },
    postsalary({ commit }, { index, salary }) {
      if (index > -1) {
        console.log('creatsalary呼び出し')
        axios
          .post("http://localhost:80/salary/update", salary)
          .then(() => {
            console.log('postusalary呼び出し')
            commit('salary', { index, salary })
          })
          .catch((respo) => {
            console.log(respo);
          });

      } else {
        console.log('createsalary（新規）呼び出し')
        axios
          .post("http://localhost:80/salary/create", salary)
          .then(() => {
            console.log('postsalary呼び出し')
            commit('addsalary', salary)
          })
          .catch((respo) => {
            console.log(respo);
          });
      }
    },
    deletesalary({ commit }, { id, index }) {
      console.log('deletesalary呼び出し')
      console.log(id)
      axios
        .post("http://localhost:80/salary/delete", { employee_number: id })
        .then(() => {
          console.log('/salary/delete呼び出し')
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