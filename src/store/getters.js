const getters = {
  sidebar: state => state.app.sidebar,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menuids: state => state.permission.menuids,
  username: state => state.user.name
}
export default getters
