import { loadAppCode, loadSysCode, loadSysPathCode, loadProductCatalogPathCode } from '@/api/sys/code'

const codes = {
  state: {
    sysCode: [],
    sysPathCode: [],
    appCode: [],
    productCatalogPathCode: []
  },
  mutations: {
    ADD_SYS_CODE(state, code) {
      state.sysCode = code
    },
    ADD_SYS_PATH_CODE(state, code) {
      state.sysPathCode = code
    },
    ADD_APP_CODE(state, code) {
      state.appCode = code
    },
    ADD_PRODUCT_CATALOG_PATH_CODE(state, code) {
      state.productCatalogPathCode = code
    }
  },
  actions: {
    loadSysCode({ commit }) {
      loadSysCode().then(res => {
        commit('ADD_SYS_CODE', res.data)
      })
    },
    loadSysPathCode({ commit }) {
      loadSysPathCode().then(res => {
        commit('ADD_SYS_PATH_CODE', res.data)
      })
    },
    loadAppCode({ commit }) {
      loadAppCode().then(res => {
        commit('ADD_APP_CODE', res.data)
      })
    },
    loadProductCatalogPathCode({ commit }) {
      loadProductCatalogPathCode().then(res => {
        commit('ADD_PRODUCT_CATALOG_PATH_CODE', res.data)
      })
    }
  }
}

export default codes
