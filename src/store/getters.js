const getters = {
  sidebar: state => state.app.sidebar,
  allPermissionRouters: state => state.permission.allPermissionRouters, // 用户所有菜单路由集合
  asyncPermissionRouters: state => state.permission.asyncPermissionRouters, // 用户动态菜单路由集合
  asyncPermissionMenuKeys: state => state.permission.asyncPermissionMenuKeys, // 用户菜单key集合
  sysCode: state => state.code.sysCode,
  sysPathCode: state => state.code.sysPathCode,
  appCode: state => state.code.appCode,
  username: state => state.code.name,
  appCascadeCode: state => state.code.appCascadeCode,
  appCascadePathCode: state => state.code.appCascadePathCode
}
export default getters
