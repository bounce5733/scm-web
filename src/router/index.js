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
      meta: { title: '仪表盘', icon: 'dashboard' }
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
      meta: { title: '表格' },
      children: [{
        path: 'edit',
        component: _import('component/table/EditTable'),
        name: 'component_table_EditTable',
        meta: { title: '编辑表格' }
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
      meta: { title: '公司信息' }
    }, {
      path: 'hr',
      component: _import('bas/hr/index'),
      name: 'bas_hr',
      meta: { title: '部门与员工' },
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
      meta: { title: '仓库' },
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
      meta: { title: '商品分类' },
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
      meta: { title: '账期类型' },
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
      meta: { title: '计量单位' },
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
      meta: { title: '客户级别' },
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
    redirect: '/console/code',
    name: 'console',
    meta: { title: '控制台', icon: 'setting' },
    children: [{
      path: 'role',
      component: _import('console/role'),
      name: 'console_role',
      meta: { title: '角色' }
    }, {
      path: 'code',
      component: _import('console/code'),
      name: 'console_code',
      meta: { title: '字典' }
    }, {
      path: 'syslog',
      component: _import('console/syslog'),
      name: 'console_syslog',
      meta: { title: '系统日志' }
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
      meta: { title: '操作日志' },
      action: [{
        name: '查询操作日志', key: 'queryOptlog'
      }]
    }, {
      path: 'set',
      component: _import('sys/set'),
      name: 'sys_set',
      meta: { title: '设置' }
    }]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: { title: '订单', icon: 'setting' },
    children: [{
      path: '/order/manage',
      component: _import('order/manage/index'),
      name: 'order_manager',
      meta: { title: '订单管理' },
      children: [{
        path: 'purchase',
        component: _import('order/manage/purchase/index'),
        name: 'order_manager_purchase',
        meta: { title: '订货单' },
        action: [{
          name: '新增订单', key: 'addPurchaseOrder'
        }, {
          name: '导出订单', key: 'exportPurchaseOrder'
        }, {
          name: '导入订单', key: 'importPurchaseOrder'
        }]
      }, {
        path: 'return',
        component: _import('order/manage/return/index'),
        name: 'order_manager_return',
        meta: { title: '退货单' }
      }]
    }]
  },
  {
    path: '/cus',
    component: Layout,
    name: 'cus',
    meta: { title: '客户', icon: 'setting' },
    children: [{
      path: '/cus/manage',
      component: _import('cus/index'),
      name: 'cus_manage',
      meta: { title: '客户管理' },
      children: [{
        path: 'customer',
        component: _import('cus/manage/customer'),
        name: 'cus_manage_customer',
        meta: { title: '客户列表' },
        action: [{
          name: '新增客户', key: 'addCustomer'
        }, {
          name: '导出客户', key: 'exportCustomer'
        }, {
          name: '导入客户', key: 'importCustomer'
        }]
      }]
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

