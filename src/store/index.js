import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import code from './modules/code'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    app,
    tagsView,
    code,
    permission
  },
  getters
})

export default store
