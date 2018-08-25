import { cacheMap, cachePathMap } from '@/api/console/code'

const codes = {
  state: {
    codes: [],
    codePathMap: []
  },
  mutations: {
    ADD_CODES(state, codes) {
      state.codes = codes
    },
    ADD_PATH_MAP(state, codePathMap) {
      state.codePathMap = codePathMap
    }
  },
  actions: {
    addCodes({ commit, state }) {
      cacheMap().then(res => {
        commit('ADD_CODES', res.data)
      })
    },
    addPathMap({ commit, state }) {
      cachePathMap().then(res => {
        commit('ADD_PATH_MAP', res.data)
      })
    }
  }
}

export default codes
