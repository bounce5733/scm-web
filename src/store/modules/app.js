import { SIDEBAR_STATUS_KEY } from '@/utils/constant'

const app = {
  state: {
    sidebar: {
      opened: !+sessionStorage.getItem(SIDEBAR_STATUS_KEY)
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        sessionStorage.setItem(SIDEBAR_STATUS_KEY, 1)
      } else {
        sessionStorage.setItem(SIDEBAR_STATUS_KEY, 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
