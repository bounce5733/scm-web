import Vue from 'vue'
import Router from 'vue-router'
const _import = file => () => import('@/views/' + file + '.vue')

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    name: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard_index',
      meta: { title: '仪表盘', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/component',
    component: Layout,
    redirect: '/component/table',
    name: 'component',
    meta: { title: '组件', icon: 'component' },
    children: [{
      path: '/component/table',
      component: _import('component/Layout'),
      name: 'component_table',
      meta: { title: '表格', icon: 'component', noCache: true },
      children: [{
        path: 'edit',
        component: _import('component/table/EditTable'),
        name: 'component_table_EditTable',
        meta: { title: '编辑表格', icon: 'component', noCache: true }
      }]
    }]
  },
  {
    path: '/console',
    component: Layout,
    redirect: '/console/user',
    name: 'console',
    meta: { title: '控制台', icon: 'component' },
    children: [{
      path: 'user',
      component: _import('console/user'),
      name: 'console_user',
      meta: { title: '用户', icon: 'component', noCache: true },
      action: [{
        name: '新增用户', key: 'addUser'
      }, {
        name: '编辑用户', key: 'editUser'
      }, {
        name: '删除用户', key: 'removeUser'
      }]
    }, {
      path: 'role',
      component: _import('console/role'),
      name: 'console_role',
      meta: { title: '角色', icon: 'component', noCache: true },
      action: [{
        name: '新增角色', key: 'addRole'
      }, {
        name: '编辑角色', key: 'editRole'
      }, {
        name: '删除角色', key: 'removeRole'
      }, {
        name: '分配权限', key: 'assignMenus'
      }, {
        name: '授权用户', key: 'assignUsers'
      }]
    }, {
      path: 'code',
      component: _import('console/code'),
      name: 'console_code',
      meta: { title: '字典', icon: 'component', noCache: true },
      action: [{
        name: '新增字典', key: 'addCode'
      }, {
        name: '删除字典', key: 'removeCode'
      }, {
        name: '新增字典项目', key: 'addItem'
      }, {
        name: '编辑字典项目', key: 'editItem'
      }, {
        name: '删除字典项目', key: 'removeItem'
      }]
    }, {
      path: 'optlog',
      component: _import('console/optlog'),
      name: 'console_optlog',
      meta: { title: '操作日志', icon: 'component', noCache: true }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

