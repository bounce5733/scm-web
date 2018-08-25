const getters = {
  sidebar: state => state.app.sidebar,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  avatar: state => state.user.avatar,
  menuids: state => state.permission.menuids
}
export default getters
