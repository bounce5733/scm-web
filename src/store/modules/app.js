import { SIDEBAR_STATUS_KEY } from '@/utils/constant'

const app = {
  state: {
    sidebar: {
      opened: !+sessionStorage.getItem(SIDEBAR_STATUS_KEY)
    },
    // 系统日志
    syslog: '',
    websocket: null
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        sessionStorage.setItem(SIDEBAR_STATUS_KEY, 1)
      } else {
        sessionStorage.setItem(SIDEBAR_STATUS_KEY, 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    APPEND_LOG: (state, log) => {
      state.syslog += log
    },
    CLEAR_LOG: (state) => {
      state.syslog = ''
    },
    SET_WEBSOCKET: (state, websocket) => {
      state.websocket = websocket
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
