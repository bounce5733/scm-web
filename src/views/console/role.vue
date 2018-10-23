<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-button type="primary" @click="openAdd" size="small">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table :data="roles" highlight-current-row border style="width: 100%;">
      <el-table-column prop="name" label="角色名称" sortable></el-table-column>
      <el-table-column prop="descn" label="描述" sortable></el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="small" @click="openAssignMenus(scope.$index, scope.row)">分配权限</el-button>
            <el-button type="primary" size="small" @click="openEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger"  size="small" @click="remove(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑角色-->
    <el-dialog :title="formTitle" :close-on-click-modal="false" :visible.sync="formVisible">
      <el-form :model="role" ref="roleForm" :rules="roleRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="role.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="描述" prop="descn">
              <el-input v-model="role.descn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelForm">取消</el-button>
        <el-button type="primary" @click.native="save">确认</el-button>
      </div>
    </el-dialog>
    
    <!--分配菜单界面-->
    <el-dialog title="分配菜单" width="60%" :visible.sync="menuFormVisible" :close-on-click-modal="false">
      <div>
        <el-tree 
          :data="menus" 
          :props="menuTreeProps" 
          default-expand-all 
          show-checkbox node-key="name" 
          highlight-current ref="menuTree"
          :expand-on-click-node="false"
          @check="handleCheck">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <el-checkbox-group v-if="data.action" :disabled="data.actionkeys.length === 0" v-model="data.actionkeys" size="mini">
              <el-checkbox style="height:24px;padding-top:2px;" v-for="item in data.action" :key="item.key" :label="item.key" border>{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelMenuForm">取消</el-button>
        <el-button type="primary" @click.native="assignMenus">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadRole, addRole, editRole, removeRole, assignMenus } from '@/api/bas/role'
import { roleMenus } from '@/api/bas/role'
import { SAVE_SUCCESS, EDIT_SUCCESS, REMOVE_SUCCESS, SUCCESS_TIP_TITLE } from '@/utils/constant'
import { asyncRouterMap } from '@/router'
import _ from 'lodash/lang'

export default {

  data() {
    const validateName = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        return callback(new Error('名称不能为空'))
      }
      // 唯一性
      let isUnique = true
      if (this.isNew) {
        this.roles.forEach(role => {
          if (role.name.trim() === value.trim()) {
            isUnique = false
          }
        })
      } else { // 比较自己除外
        this.roles.forEach(role => {
          if (value !== this.oldName) {
            if (this.oldName !== role.name && value === role.name) {
              isUnique = false
            }
          }
        })
      }
      if (!isUnique) {
        return callback(new Error('名称重复'))
      }
      callback()
    }
    return {
      roles: [],
      // ------编辑角色------
      formVisible: false,
      formTitle: '',
      isNew: true,
      oldName: '',
      role: {},
      roleRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName },
          { max: 64, message: '最大长度64个字符', trigger: 'blur' }
        ],
        descn: [
          { max: 255, message: '最大长度255个字符', trigger: 'blur' }
        ]
      },
      curRoleid: '', // 当前选择角色主键
      // ------授权菜单------
      menuTreeProps: {
        children: 'children',
        label: 'title'
      },
      menuFormVisible: false,
      menus: [],
      allMenus: asyncRouterMap
    }
  },
  methods: {
    load: function() {
      loadRole().then(res => {
        this.roles = res.data
      })
    },
    openAdd: function() {
      this.role = { appid: 0 }
      this.isNew = true
      this.formTitle = '新增'
      this.formVisible = true
    },
    openEdit: function(index, row) {
      this.role = Object.assign({}, row)
      this.oldName = this.role.name
      this.isNew = false
      this.formTitle = '编辑'
      this.formVisible = true
    },
    save: function() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          if (this.isNew) {
            addRole(this.role).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.roleForm.resetFields()
              this.load()
              this.formVisible = false
            })
          } else {
            editRole(this.role).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: EDIT_SUCCESS,
                type: 'success'
              })
              this.$refs.roleForm.resetFields()
              this.load()
              this.formVisible = false
            })
          }
        }
      })
    },
    remove: function(row) {
      this.$confirm('删除角色会级联删除关联权限', '提示', { type: 'warning' }).then(() => {
        removeRole(row.id).then(res => {
          this.$notify({
            title: SUCCESS_TIP_TITLE,
            message: REMOVE_SUCCESS,
            type: 'success'
          })
          this.load()
        })
      }).catch(() => {})
    },
    cancelForm: function() {
      this.$refs.roleForm.resetFields()
      this.formVisible = false
    },
    // ------分配菜单------
    openAssignMenus: function(index, row) {
      this.curRoleid = row.id
      const that = this
      roleMenus(this.curRoleid).then(res => {
        const menuKeys = []
        const actionMap = {} // 菜单功能对象，便于获取功能点
        res.data.forEach(menu => {
          const menuKey = menu.menuKey
          menuKeys.push(menuKey)
          if (actionMap[menuKey] === undefined) {
            actionMap[menuKey] = []
          }
          actionMap[menuKey].push(menu.actionKey)
        })
        this.menus = this.menuTreeOpt(menuKeys, actionMap, _.cloneDeep(this.allMenus))
        this.menuFormVisible = true
        setTimeout(function() {
          that.$refs.menuTree.setCheckedKeys(menuKeys)
        }, 100)
      })
    },
    // 过滤隐藏的菜单、给菜单添加title属性、过滤目录菜单id、设置菜单action数组
    menuTreeOpt: function(menuKeys, actionMap, menus) {
      const accessedRouters = menus.filter(route => {
        if (route.name && route.name.substr(0, 8) === 'console' || route.hidden) {
          return false
        }
        if (route.meta && route.meta.title) {
          route.title = route.meta.title
        }
        if (route.hidden === undefined) {
          if (route.children && route.children.length) {
            const index = menuKeys.indexOf(route.name)
            if (index >= 0) {
              menuKeys.splice(index, 1)
            }
            route.children = this.menuTreeOpt(menuKeys, actionMap, route.children)
          } else {
            if (route.action) {
              route.actionkeys = actionMap[route.name] === undefined ? [] : actionMap[route.name]
            }
          }
          return true
        }
        return false
      })
      return accessedRouters
    },
    assignMenus: function() {
      // 收集action
      const actionmap = {}
      const selNodes = this.$refs.menuTree.getCheckedNodes(false, true)

      selNodes.forEach(node => {
        if (node.actionkeys && node.actionkeys.length > 0) {
          actionmap[node.name] = node.actionkeys
        } else {
          actionmap[node.name] = []
        }
      })
      assignMenus(this.curRoleid, actionmap).then(res => {
        this.$notify({
          title: SUCCESS_TIP_TITLE,
          message: '分配成功',
          type: 'success'
        })
      })
      this.cancelMenuForm()
    },
    handleCheck: function(node, selStatus) {
      if (node.children && node.children.length > 0) { // 父结点
        if (selStatus.checkedKeys.includes(node.name)) {
          this.setNodeAction(node.children, true)
        } else {
          this.setNodeAction(node.children, false)
        }
      } else {
        if (node.action) {
          if (selStatus.checkedKeys.includes(node.name)) {
            const keys = []
            node.action.forEach(item => {
              keys.push(item.key)
            })
            node.actionkeys = keys
          } else {
            node.actionkeys = []
          }
        }
      }
    },
    setNodeAction: function(menus, flag) {
      menus.filter(menu => {
        if (menu.children && menu.children.length > 0) {
          this.setNodeAction(menu.children, flag)
        } else {
          if (menu.action) {
            if (flag) {
              const keys = []
              menu.action.forEach(item => {
                keys.push(item.key)
              })
              menu.actionkeys = keys
            } else {
              menu.actionkeys = []
            }
          }
        }
      })
    },
    cancelMenuForm: function() {
      this.menuFormVisible = false
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>