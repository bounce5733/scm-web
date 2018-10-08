<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="22">
        <el-form @submit.native.prevent :inline="true">
          <el-form-item>
            <el-button type="primary" :disabled="!actions.includes('addUser')" size="small" @click="openAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="users" border style="width: 100%;">
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
import { SUCCESS_TIP_TITLE, SAVE_SUCCESS, REMOVE_SUCCESS } from '@/utils/constant'

export default {
  data() {
    const validateAccount = (rule, value, callback) => {
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
          { required: true, trigger: 'blur', validator: validateAccount },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, trigger: 'blur', message: '姓名不能为空' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    load: function() {
      loadUser().then(res => {
        this.users = res.data
      })
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

