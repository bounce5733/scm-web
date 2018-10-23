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
  { path: '/login', component: _import('sys/login'), hidden: true },
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
      meta: { title: '表格', noCache: true },
      children: [{
        path: 'edit',
        component: _import('component/table/EditTable'),
        name: 'component_table_EditTable',
        meta: { title: '编辑表格', noCache: true }
      }]
    }]
  },
  {
    path: '/bas',
    component: Layout,
    redirect: '/bas/company',
    name: 'bas',
    meta: { title: '基础信息', icon: 'component' },
    children: [{
      path: 'company',
      component: _import('bas/company'),
      name: 'bas_company',
      meta: { title: '公司信息', noCache: true }
    }, {
      path: 'hr',
      component: _import('bas/hr/index'),
      name: 'bas_hr',
      meta: { title: '部门与员工', noCache: true },
      action: [{
        name: '角色授权', key: 'authRole'
      }]
    }]
  },
  {
    path: '/code',
    component: Layout,
    redirect: '/code/warehouse',
    name: 'code',
    meta: { title: '辅助资料', icon: 'component' },
    children: [{
      path: 'warehouse',
      component: _import('code/warehouse'),
      name: 'code_warehouse',
      meta: { title: '仓库', noCache: true },
      action: [{
        name: '新增仓库', key: 'addWarehouse'
      }, {
        name: '编辑仓库', key: 'editWarehouse'
      }, {
        name: '删除仓库', key: 'removeWarehouse'
      }, {
        name: '置顶仓库', key: 'moveTopWarehouse'
      }, {
        name: '设置默认仓库', key: 'setDefaultWarehouse'
      }, {
        name: '启停仓库', key: 'enableWarehouse'
      }]
    }, {
      path: 'productCatalog',
      component: _import('code/productCatalog'),
      name: 'code_productCatalog',
      meta: { title: '商品分类', noCache: true },
      action: [{
        name: '新增商品分类', key: 'addProductCatalog'
      }, {
        name: '编辑商品分类', key: 'editProductCatalog'
      }, {
        name: '删除商品分类', key: 'removeProductCatalog'
      }, {
        name: '置顶商品分类', key: 'moveTopProductCatalog'
      }]
    }, {
      path: 'accountPeriod',
      component: _import('code/accountPeriod'),
      name: 'code_accountPeriod',
      meta: { title: '账期类型', noCache: true },
      action: [{
        name: '新增账期', key: 'addAccountPeriod'
      }, {
        name: '编辑账期', key: 'editAccountPeriod'
      }, {
        name: '删除账期', key: 'removeAccountPeriod'
      }, {
        name: '置顶账期', key: 'moveTopAccountPeriod'
      }]
    }, {
      path: 'unit',
      component: _import('code/unit'),
      name: 'code_unit',
      meta: { title: '计量单位', noCache: true },
      action: [{
        name: '新增计量单位', key: 'addUnit'
      }, {
        name: '删除计量单位', key: 'removeUnit'
      }, {
        name: '置顶计量单位', key: 'moveTopUnit'
      }]
    }, {
      path: 'customerGrade',
      component: _import('code/customerGrade'),
      name: 'code_customerGrade',
      meta: { title: '客户级别', noCache: true },
      action: [{
        name: '新增客户级别', key: 'addCustomerGrade'
      }, {
        name: '修改客户级别', key: 'editCustomerGrade'
      }, {
        name: '置顶客户级别', key: 'moveTopCustomerGrade'
      }, {
        name: '删除客户级别', key: 'removeCustomerGrade'
      }]
    }]
  },
  {
    path: '/console',
    component: Layout,
    redirect: '/console/user',
    name: 'console',
    meta: { title: '控制台', icon: 'setting' },
    children: [{
      path: 'role',
      component: _import('console/role'),
      name: 'console_role',
      meta: { title: '角色' }
    }, {
      path: 'code',
      component: _import('sys/code'),
      name: 'sys_code',
      meta: { title: '字典' }
    }]
  },
  {
    path: '/sys',
    component: Layout,
    name: 'sys',
    meta: { title: '系统', icon: 'setting' },
    children: [{
      path: 'optlog',
      component: _import('sys/optlog'),
      name: 'sys_optlog',
      meta: { title: '日志', noCache: true }
    }, {
      path: 'set',
      component: _import('sys/set'),
      name: 'sys_set',
      meta: { title: '设置', noCache: true }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

