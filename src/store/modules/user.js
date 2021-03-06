import { loginByAccount, cacheAction, logout } from '@/api/sys/login'
import { getUserInfo } from '@/api/bas/user'
import { TOKEN_KEY, TIP_DURATION_TIME } from '@/utils/constant'
import { asyncRouterMap } from '@/router'
import { Message } from 'element-ui'
import store from '@/store'
import md5 from 'js-md5'

const user = {
  state: {
    account: '',
    name: '',
    appid: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_APPID: (state, appid) => {
      state.appid = appid
    }
  },

  actions: {
    // 用户名登录
    loginByAccount({ commit }, userInfo) {
      const account = userInfo.account.trim()
      return new Promise((resolve, reject) => {
        loginByAccount(account.trim(), md5(userInfo.password.trim())).then(res => {
          if (res.status === 204) {
            Message({
              message: '用户名或密码错误',
              type: 'warning',
              duration: TIP_DURATION_TIME
            })
            reject()
          } else {
            const retdata = res.data
            if (retdata.needCacheAction) {
              const actions = {}
              menuTreeOpt(actions, asyncRouterMap)
              cacheAction(actions)
            }
            sessionStorage.setItem(TOKEN_KEY, retdata.sessionid)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          // 加载应用字典缓存
          store.dispatch('loadSysCode')
          store.dispatch('loadSysPathCode')
          store.dispatch('loadAppCode')
          store.dispatch('loadAppCascadeCode')
          store.dispatch('loadAppCascadePathCode')

          // 设置用户信息
          const userinfo = res.data
          const user = userinfo.user
          commit('SET_ACCOUNT', user.account)
          commit('SET_NAME', user.name)
          commit('SET_APPID', user.appid)
          resolve(userinfo.menus)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    logOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          sessionStorage.removeItem(TOKEN_KEY)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

function menuTreeOpt(actions, menus) {
  menus.filter(route => {
    if (route.children && route.children.length > 0) {
      menuTreeOpt(actions, route.children)
    } else {
      if (route.action) {
        route.action.forEach(item => {
          actions[item.key] = item.name
        })
      }
    }
  })
}

export default user
