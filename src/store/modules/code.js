import { loadAppCode, loadSysCode, loadSysPathCode, loadAppCascadeCode, loadAppCascadePathCode } from '@/api/console/code'

const codes = {
  state: {
    sysCode: [], // {type:[codes]}
    sysPathCode: [], // {id:{path:'',name:''}}
    appCode: [], // {appid:{type:{id,name}}}
    appCascadeCode: [], // {appid:{type:[BaseCascaderCode]}}
    appCascadePathCode: [] // {appid:{typename:{id:{path:'',name:''}}}
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
    ADD_APP_CASCADE_CODE(state, code) {
      state.appCascadeCode = code
    },
    ADD_APP_CASCADE_PATH_CODE(state, code) {
      state.appCascadePathCode = code
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
    loadAppCascadeCode({ commit }) {
      loadAppCascadeCode().then(res => {
        commit('ADD_APP_CASCADE_CODE', res.data)
      })
    },
    loadAppCascadePathCode({ commit }) {
      loadAppCascadePathCode().then(res => {
        commit('ADD_APP_CASCADE_PATH_CODE', res.data)
      })
    }
  }
}

export default codes
