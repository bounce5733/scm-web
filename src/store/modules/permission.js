import { asyncRouterMap, constantRouterMap } from '@/router'
import _ from 'lodash/lang'

const permission = {
  state: {
    allPermissionRouters: constantRouterMap, // 用户所有菜单路由集合
    asyncPermissionRouters: [], // 用户动态菜单路由集合
    asyncPermissionMenuKeys: [], // 用户菜单key集合
    menus: {}, // 用户菜单map{menu_key,[action_key]}
    sysMenuActions: {} // 系统菜单map{menu_key,[action_key]}
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
    },
    SET_SYS_MENU_ACTIONS: (state, menus) => {
      state.sysMenuActions = menus
    }
  },
  actions: {
    generateRoutes({ commit }, menus) {
      const asyncPermissionMenuKeys = []
      for (const menuid in menus) {
        asyncPermissionMenuKeys.push(menuid)
      }
      return new Promise(resolve => {
        const asyncPermissionRouters = filterAsyncRouter(_.cloneDeep(asyncRouterMap), asyncPermissionMenuKeys)
        commit('SET_MENUIDS', asyncPermissionMenuKeys)
        commit('SET_MENUS', menus)
        commit('SET_ROUTERS', asyncPermissionRouters)
        // 生成系统菜单动作map
        const sysMenuActions = {}
        menuActions(sysMenuActions, _.cloneDeep(asyncRouterMap))
        commit('SET_SYS_MENU_ACTIONS', sysMenuActions)
        resolve()
      })
    }
  }
}

// 获取menu->action映射
function menuActions(sysMenuActions, menus) {
  menus.filter(route => {
    if (route.children && route.children.length) {
      menuActions(sysMenuActions, route.children)
    } else {
      if (route.meta && route.action && (route.hidden === undefined || !route.hidden)) {
        sysMenuActions[route.name] = route.action
      }
    }
  })
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
