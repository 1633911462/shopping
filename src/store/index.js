import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    me: {},
    myDp: {}
  },
  mutations: {
    addMe (i, value) {
      i.me = value
    },
    addmyDp (i, value) {
      i.myDp = value
    }
  },
  actions: {
  },
  modules: {
  }
})
