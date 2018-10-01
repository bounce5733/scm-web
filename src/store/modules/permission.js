import { asyncRouterMap, constantRouterMap } from '@/router'
import _ from 'lodash/lang'

const permission = {
  state: {
    allPermissionRouters: constantRouterMap, // 用户所有菜单路由集合
    asyncPermissionRouters: [], // 用户动态菜单路由集合
    asyncPermissionMenuKeys: [], // 用户菜单key集合
    menus: {} // 用户菜单map{menu_key,[action_key]}
  },
  mutations: {
    SET_ROUTERS: (state, allPermissionRouters) => {
      state.asyncPermissionRouters = allPermissionRouters
      state.allPermissionRouters = constantRouterMap.concat(allPermissionRouters)
    },
    SET_MENUIDS: (state, asyncPermissionMenuKeys) => {
      state.asyncPermissionMenuKeys = asyncPermissionMenuKeys
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  actions: {
    generateRoutes({ commit }, menus) {
      const asyncPermissionMenuKeys = []
      for (const menuid in menus) {
        asyncPermissionMenuKeys.push(menuid)
      }
      return new Promise(resolve => {
        const tempRouter = _.cloneDeep(asyncRouterMap)
        const asyncPermissionRouters = filterAsyncRouter(tempRouter, asyncPermissionMenuKeys)
        commit('SET_MENUIDS', asyncPermissionMenuKeys)
        commit('SET_MENUS', menus)
        commit('SET_ROUTERS', asyncPermissionRouters)
        resolve()
      })
    }
  }
}

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

export default permission
