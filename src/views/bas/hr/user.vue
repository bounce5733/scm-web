<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="21">
        <el-form @submit.native.prevent :inline="true">
          <el-form-item>
            <el-button type="primary" @click="openAdd" size="small">新增账号</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="users" border style="width: 100%;">
      <el-table-column prop="account" label="账号" sortable></el-table-column>
      <el-table-column prop="name" label="姓名" sortable></el-table-column>
      <el-table-column prop="position" label="职位" sortable></el-table-column>
      <el-table-column prop="deptid" label="部门" sortable></el-table-column>
      <el-table-column prop="mobile" label="手机" sortable></el-table-column>
      <el-table-column prop="email" label="邮箱" sortable></el-table-column>
      <!--
      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" @command="handleAction" @visible-change="customerGrade = Object.assign({}, scope.row)">
            <i class="el-icon-more"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit"><i class="el-icon-edit"></i>&nbsp;修改</el-dropdown-item>
              <el-dropdown-item command="disable" divided><i class="el-icon-remove"></i>&nbsp;禁用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      -->
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="pageChange" :current-page="params.pageNum" :page-size="params.pageSize" :total="total" style="float:right;">
    </el-pagination>

    <!--编辑用户-->
    <el-dialog :title="formTitle" width="60%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="user" ref="form" :rules="userRules" label-width="80px">
        <p class="legend-title">基础信息</p>
        <el-row>
          <el-col :span="16">
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="user.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="user.password"></el-input>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #fff;">弱</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #fff;">中</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #fff;">强</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input type="password" v-model="user.confirmPassword"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="user.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="user.mobile"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="部门" prop="deptid">
              <el-cascader style="width:100%"
                expand-trigger="hover"
                :options="depts"
                clearable
                :props="selProps"
                v-model="user.deptid">
              </el-cascader>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="user.position"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="user.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model="user.qq"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <p class="legend-title">
          权限设置
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              注意，如果您勾选的角色中同时包含“禁止查看商品价格与订单金
              <br>额”和【订单修改、订/退单审核、财务审核、代下订/退单、订单商品
              <br>统计查看、商品管理、促销管理以及资金所有权限、报表所有权
              <br>限】，将造成权限冲突。
            </div>
            <span style="color: rgb(147, 166, 183);font-size: 0.9em;">
              &nbsp;&nbsp;&nbsp;&nbsp;权限与角色关联，选择该账号的角色可完成权限设置
              <i class="el-icon-question"></i>
            </span>
          </el-tooltip>
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelForm">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryUserByPage } from '@/api/bas/user'
import { validateMobile, validatePassword, validateEmail, validateQQ } from '@/utils/validate'

export default {

  data() {

    const checkPassword = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validatePassword(value)) {
          callback(new Error('密码必须6-20位，由英文字母或数字组成'))
        }
        callback()
      } else {
        return callback(new Error('密码不能为空'))
      }
    }
    const checkMobile = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validateMobile(value)) {
          return callback(new Error('手机号码格式不正确'))
        }
        callback()
      } else {
        return callback(new Error('手机号码不能为空'))
      }
    }
    const checkEmail = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (value.length > 45) {
          return callback(new Error('邮箱不能超过45个字符'))
        }
        if (!validateEmail(value)) {
          return callback(new Error('邮箱格式不正确'))
        }
      }
      callback()
    }
    const checkQQ = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validateQQ(value)) {
          return callback(new Error('QQ号码格式不正确'))
        }
      }
      callback()
    }

    return {
      selProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      total: 0,
      params: {
        order: 'desc',
        orderField: 'createdTime',
        pageNum: 1,
        pageSize: 10
      },
      users: [],
      // ------编辑------
      user: {},
      userRules: {
        account: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: checkPassword }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: checkMobile }
        ],
        deptid: [
          { required: true, message: '部门不能为空', trigger: 'blur' }
        ],
        position: [
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        email: [
          { trigger: 'blur', validator: checkEmail }
        ],
        qq: [
          { trigger: 'blur', validator: checkQQ }
        ]
      },
      formTitle: '',
      formVisible: false,
      depts: this.$store.state.code.appCascadeCode.dept === undefined ? [] : this.$store.state.code.appCascadeCode.dept
    }
  },
  methods: {
    queryByPage: function() {
      queryUserByPage(this.params).then(res => {
        this.users = res.data.list
        this.total = res.data.total
      })
    },
    pageChange: function(val) {
      this.params.pageNum = val
      this.queryByPage()
    },
    // ------编辑------
    openAdd: function() {
      this.user = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    save: function() {
      this.$refs.companyForm.validate(valid => {
        if (valid) {
          addUser(this.user).then(res => {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: SAVE_SUCCESS,
              type: 'success'
            })
          })
        }
      })
    },
    cancelForm: function() {
      this.$refs.form.resetFields()
      this.formVisible = false
    }
  },
  mounted() {
    this.queryByPage()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .legend-title {
    color: #03b8cc;
    font-weight: 500;
    margin-bottom: 30px;
  }
</style>

