import { asyncRouterMap, constantRouterMap } from '@/router'
import _ from 'lodash/lang'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (roles.indexOf(route.name) >= 0) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    menuids: [], // 当前用户权限菜单
    menus: {}
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MENUIDS: (state, menuids) => {
      state.menuids = menuids
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  actions: {
    generateRoutes({ commit }, menus) {
      const menuids = []
      for (const menuid in menus) {
        menuids.push(menuid)
      }
      return new Promise(resolve => {
        const tempRouter = _.cloneDeep(asyncRouterMap)
        const accessedRouters = filterAsyncRouter(tempRouter, menuids)
        commit('SET_MENUIDS', menuids)
        commit('SET_MENUS', menus)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
