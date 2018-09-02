<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form @submit.native.prevent :inline="true">
            <el-form-item>
              <el-button type="primary" :disabled="!actions.includes('addUser')" size="small" @click="openAdd">新增</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="users" @row-click="selUser" border style="width: 100%;">
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" size="small" :disabled="!actions.includes('editUser')" @click="openEdit(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" :disabled="!actions.includes('removeUser')" @click="remove(scope.row.id)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="160" sortable></el-table-column>
            <el-table-column prop="account" label="账号" sortable></el-table-column>
          </el-table>
      </el-col>
      <el-col :span="12">
        <el-container>
          <el-header style="text-align:left; font-size:12px; border-width: 1px; border-style:solid; color:#333; line-height:60px;">
            <span>{{curUserName}}权限</span>
          </el-header>
          <br>
          <el-main style="border-width: 1px; border-style:solid;">
            <el-tree class="menutree" :data="menus" :props="menuTreeProps" default-expand-all show-checkbox node-key="name" highlight-current ref="menuTree"></el-tree>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!--编辑用户-->
    <el-dialog :title="formTitle" :close-on-click-modal="false" :visible.sync="formVisible">
      <el-form :model="user" ref="userForm" :rules="userRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="user.account"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelForm">取消</el-button>
        <el-button type="primary" @click.native="save">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadUser, addUser, editUser, removeUser } from '@/api/console/user'
import { userMenus } from '@/api/console/role'
import { asyncRouterMap } from '@/router'
import _ from 'lodash/lang'
import { SUCCESS_TIP_TITLE, SAVE_SUCCESS, REMOVE_SUCCESS } from '@/utils/constant'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        return callback(new Error('账号不能为空'))
      }
      // 唯一性
      let isUnique = true
      if (this.formTitle === '新增') {
        this.users.forEach(user => {
          if (user.account.trim() === value.trim()) {
            isUnique = false
          }
        })
      } else { // 比较自己除外
        this.users.forEach(user => {
          if (value !== this.oldAccount) {
            if (this.oldAccount !== user.account && value === user.account) {
              isUnique = false
            }
          }
        })
      }
      if (!isUnique) {
        return callback(new Error('账号重复'))
      }
      callback()
    }

    return {
      actions: this.$store.state.permission.menus[this.$route.name],
      users: [],
      // ------用户编辑------
      user: {},
      formTitle: '',
      formVisible: false,
      oldAccount: '',
      userRules: {
        account: [
          { required: true, trigger: 'blur', validator: validateName },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, trigger: 'blur', message: '姓名不能为空' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ]
      },
      // ------权限树------
      menus: [],
      allMenus: asyncRouterMap,
      curUserName: '',
      menuTreeProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  methods: {
    load: function() {
      loadUser().then(res => {
        this.users = res.data
        this.curUserName = this.users[0].name
        userMenus(this.users[0].id).then(res => {
          const ids = []
          Object.keys(res.data).forEach(menuid => {
            ids.push(menuid)
          })
          const that = this
          this.menus = this.menuTreeOpt(ids, _.cloneDeep(this.allMenus))
          setTimeout(function() {
            that.$refs.menuTree.setCheckedKeys(ids)
          }, 100)
        })
      })
    },
    selUser: function(row, event, column) {
      this.selUserName = row.name
      this.curUserName = row.name
      userMenus(row.id).then(res => {
        const ids = []
        Object.keys(res.data).forEach(menuid => {
          ids.push(menuid)
        })
        const that = this
        this.menus = this.menuTreeOpt(ids, _.cloneDeep(this.allMenus))
        setTimeout(function() {
          that.$refs.menuTree.setCheckedKeys(ids)
        }, 100)
      })
    },
    // 过滤隐藏的菜单、给菜单添加title属性、过滤目录菜单id
    menuTreeOpt: function(ids, menus) {
      const accessedRouters = menus.filter(route => {
        if (route.meta && route.meta.title) {
          route.title = route.meta.title
        }
        if (route.hidden === undefined || !route.hidden) {
          if (route.children && route.children.length) {
            const index = ids.indexOf(route.name)
            if (index >= 0) {
              ids.splice(index, 1)
            }
            route.children = this.menuTreeOpt(ids, route.children)
          }
          return true
        }
        return false
      })
      return accessedRouters
    },
    openAdd: function() {
      this.user = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    openEdit: function(row) {
      this.user = Object.assign({}, row)
      this.oldAccount = this.user.account
      this.formTitle = '编辑'
      this.formVisible = true
    },
    save: function() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (this.formTitle === '新增') {
            addUser(this.user).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.userForm.resetFields()
              this.load()
              this.formVisible = false
            })
          } else {
            editUser(this.user).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.userForm.resetFields()
              this.load()
              this.formVisible = false
            })
          }
        }
      })
    },
    remove: function(id) {
      this.$confirm('删除用户会级联删除关联权限', '提示', { type: 'warning' }).then(() => {
        removeUser(id).then(res => {
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
      this.$refs.userForm.resetFields()
      this.formVisible = false
    }
  },
  mounted() {
    this.load()
  }
}
</script>

