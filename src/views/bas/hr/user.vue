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
    <el-dialog :title="formTitle" width="70%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="user" ref="form" :rules="userRules" label-width="80px">
        <p class="legend-title">基础信息</p>
        <el-row>
          <el-col :span="16">
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="user.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input type="password" v-model="user.pwd"></el-input>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.weak}">弱</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.middle}">中</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.strong}">强</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-input :disabled="!pwdValid" type="password" v-model="user.confirmPwd"></el-input>
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
                :show-all-levels="false"
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
        <el-form-item label="账号权限">
          <el-checkbox-group v-model="user.roles">
            <el-row v-for="items,index in roles" :key="index">
              <el-checkbox v-for="role in items" :key="role.id" :label="role.id" @change="roleChecked">{{role.name}}</el-checkbox>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="权限明细">
        </el-form-item>
        <el-row v-for="val,key in appActions" :key="key">
            <el-col :span="4">
              <div style="border-left: 1px solid #e7e9f1;border-bottom: 1px solid #e7e9f1;text-align:left;background-color:#eef1f9;font-size:14;font-weight:400;" :style="{lineHeight:modelHeight[key],height:modelHeight[key]}">
                <span>{{ key | modelKeyToName }}</span>
              </div>
            </el-col>
            <el-col :span="20">
              <div style="border-left: 1px solid #e7e9f1;border-bottom: 1px solid #e7e9f1;">
                <el-checkbox-group v-for="item,index in val" :key="index" v-model="roleCheckList[key]">
                  <el-row>
                    <el-col v-for="subitem,subindex in item" :key="subindex" :span="4">
                      <div style="padding-left:20px"><el-checkbox disabled :label="subitem.key">{{subitem.name}}</el-checkbox></div>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelForm">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryUserByPage, addUser } from '@/api/bas/user'
import { validateMobile, validatePassword, validateEmail, validateQQ } from '@/utils/validate'
import { loadRole, roleMenus } from '@/api/bas/role'
import { SUCCESS_TIP_TITLE, SAVE_SUCCESS } from '@/utils/constant'
import md5 from 'js-md5'

export default {

  data() {
    const checkPassword = (rule, value, callback) => {
      const flag = validatePassword(value)
      if (flag < 4) {
        this.pwdColor = {
          weak: '#fff',
          middle: '#fff',
          strong: '#fff'
        }
        this.pwdValid = false
      } else {
        this.pwdValid = true
      }
      switch (flag) {
        case 0:
          return callback(new Error('密码不能为空或空字符串'))
        case 1:
          return callback(new Error('密码长度必须6-20位'))
        case 2:
          return callback(new Error('密码只能包含大小写英文字符与数字'))
        case 3:
          return callback(new Error('密码至少数字或大小写字母两种类型'))
        case 4:
          this.pwdColor = {
            weak: 'green',
            middle: '#fff',
            strong: '#fff'
          }
          break
        case 5:
          this.pwdColor = {
            weak: 'green',
            middle: 'green',
            strong: '#fff'
          }
          break
        case 6:
          this.pwdColor = {
            weak: 'green',
            middle: 'green',
            strong: 'green'
          }
          break
      }
      callback()
    }
    const checkConfirmPassword = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        return callback(new Error('确认密码不能为空'))
      } else if (value.trim() !== this.user.pwd.trim()) {
        this.user.confirmPwd = ''
        return callback(new Error('确认密码错误，请重新输入'))
      }
      callback()
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
        pwd: [
          { required: true, validator: checkPassword, trigger: 'change' }
        ],
        confirmPwd: [
          { required: true, validator: checkConfirmPassword, trigger: 'blur' }
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
      depts: this.$store.state.code.appCascadeCode.dept === undefined ? [] : this.$store.state.code.appCascadeCode.dept,
      pwdColor: {
        weak: '#fff',
        middle: '#fff',
        strong: '#fff'
      },
      pwdValid: false,
      roles: [],
      roleCheckList: { code: [], console: [], bas: [], sys: [] },
      modelKeyName: {}, // 顶级模块名值对
      modelHeight: {} // 权限选择模块背景高度
    }
  },
  computed: {
    ...mapGetters([
      'sysMenuActions'
    ]),
    appActions() {
      // 按名称中分割线划分大类
      const actionMap = {}
      for (const key in this.sysMenuActions) {
        if (key.indexOf('_') > 0) {
          const newkey = key.substr(0, key.indexOf('_'))
          if (actionMap[newkey]) {
            actionMap[newkey] = actionMap[newkey].concat(this.sysMenuActions[key])
          } else {
            actionMap[newkey] = this.sysMenuActions[key]
          }
        }
      }
      // 按5个一行分类
      const result = {}
      for (const key in actionMap) {
        result[key] = []
        this.modelHeight[key] = actionMap[key].length * 5 + 'px'
        for (let i = 0; i <= actionMap[key].length / 5; i++) {
          result[key][i] = actionMap[key].slice(i * 5, i * 5 + 5)
        }
      }
      return result
    }
  },
  filters: {
    modelKeyToName: function(value) {
      switch (value) {
        case 'code':
          return '字典'
        case 'console':
          return '控制台'
        case 'bas':
          return '基础'
        case 'sys':
          return '系统'
        default:
          return ''
      }
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
      loadRole().then(res => {
        let rowcount = -1
        res.data.forEach((role, index) => {
          if (index % 4 === 0) {
            rowcount++
            this.roles[rowcount] = []
            this.roles[rowcount].push(role)
          } else {
            this.roles[rowcount].push(role)
          }
        })
        this.user = { roles: [] }
        this.pwdColor = {
          weak: '#fff',
          middle: '#fff',
          strong: '#fff'
        }
        this.pwdValid = false
        this.formTitle = '新增'
        this.formVisible = true
      })
    },
    save: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const roleids = this.user.roles
          delete this.user.confirmPwd
          delete this.user.roles
          this.user.deptid = this.user.deptid[0]
          this.user.pwd = md5(this.user.pwd)
          addUser(this.user, roleids).then(res => {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: SAVE_SUCCESS,
              type: 'success'
            })
            this.queryByPage()
            this.cancelForm()
          })
        }
      })
    },
    roleChecked: function() {
      this.user.roles.forEach(roleid => {
        this.roleCheckList = { code: [], console: [], bas: [], sys: [] }
        roleMenus(roleid).then(res => {
          res.data.forEach(item => {
            const key = item.menuKey.substr(0, item.menuKey.indexOf('_'))
            if (this.roleCheckList[key]) {
              this.roleCheckList[key].push(item.actionKey)
            }
          })
        })
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

